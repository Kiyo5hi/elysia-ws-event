import { Elysia, type MaybePromise } from "elysia";
import { Type } from "@sinclair/typebox";

import { handlers, requestSchemas, responseSchemas } from "./handlers";
import { envs } from "./envs";
import {
	ConnectionClosedError,
	EventNotFoundError,
	ServerError,
	ServerErrorSchema,
	UserIdMismatchError,
} from "./errors";
import {
	ReservedUserId,
	type Connection,
	type RequestBase,
	type ResponseBase,
	type UserId,
} from "./types";
import { loggerMiddleware } from "./setup";
import { getLogger } from "./loggers";

const connectionMap = new Map<UserId, Connection>();

function getConnection(userId: UserId, error: false): Connection | undefined;
function getConnection(userId: UserId, error: true): Connection;
function getConnection(userId: UserId, error = false): Connection | undefined {
	const conn = connectionMap.get(userId);
	if (!conn && error) {
		throw new ConnectionClosedError(userId);
	}
	return conn;
}

const serverLogger = getLogger("server");
const connectionLogger = getLogger("connection");
const requestLogger = getLogger("request");

async function processResponse(
	request: RequestBase<string, Record<string, unknown>>,
	responsePromise: MaybePromise<ResponseBase<string, Record<string, unknown>>>,
) {
	// TODO: handle ReservedUserId

	try {
		const response = await responsePromise;
		const to = response.to;
		const toConn = getConnection(to, true);
		toConn.send(response);
	} catch (e) {
		const fromConn = getConnection(request.from, false);

		if (e instanceof ServerError) {
			requestLogger.error(`${e.name}: ${e.message}`);
			fromConn?.send({
				requestId: request.requestId,
				to: request.from,
				event: "error",
				data: {
					name: e.name,
					message: e.message,
					details: e.details,
				},
			});
		} else {
			requestLogger.error(`UnknownError: ${e}`);
			fromConn?.send({
				requestId: request.requestId,
				to: request.from,
				event: "error",
				data: {
					name: "UnknownError",
					message: "an unknown error occurred",
					details: {},
				},
			});
		}
	}
}

const app = new Elysia().use(loggerMiddleware).ws("/", {
	body: Type.Union(requestSchemas),
	response: Type.Union([...responseSchemas, ServerErrorSchema]),
	query: Type.Object({
		userId: Type.String(),
	}),
	open: async (ws) => {
		if (ws.data.query.userId in ReservedUserId) {
			ws.send({
				requestId: "0",
				to: ReservedUserId.UNKNOWN,
				event: "error",
				data: {
					name: "ReservedUserIdError",
					message: `userId is reserved: ${ws.data.query.userId}`,
					details: {
						userId: ws.data.query.userId,
					},
				},
			});
			ws.close();
			return;
		}

		if (connectionMap.has(ws.data.query.userId)) {
			ws.send({
				requestId: "0",
				to: ReservedUserId.UNKNOWN,
				event: "error",
				data: {
					name: "UserConflictError",
					message: `user already connected: ${ws.data.query.userId}`,
					details: {
						userId: ws.data.query.userId,
					},
				},
			});
			ws.close();
			return;
		}

		connectionLogger.info(`connection opened: ${ws.data.query.userId}`);
		connectionMap.set(ws.data.query.userId, ws as Connection);
	},
	close: async (ws) => {
		connectionLogger.info(`connection closed: ${ws.data.query.userId}`);
		connectionMap.delete(ws.data.query.userId);
	},
	message: async (ws, msg) => {
		if (ws.data.query.userId !== msg.from) {
			throw new UserIdMismatchError(ws.data.query.userId, msg.from);
		}

		const handler = handlers[msg.event];
		if (!handler) {
			throw new EventNotFoundError(msg.event);
		}

		const responses = await handler.handler(msg);
		for (const response of responses) {
			processResponse(
				msg as RequestBase<string, Record<string, unknown>>,
				response as MaybePromise<ResponseBase<string, Record<string, unknown>>>,
			);
		}
	},
});

app.listen(envs.PORT, () => {
	console.clear();
	serverLogger.info(`server running at http://localhost:${envs.PORT}`);
});

export type AppType = typeof app;
