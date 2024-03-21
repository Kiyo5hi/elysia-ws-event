import { Elysia } from "elysia";
import { getLogger } from "./loggers";

const logger = getLogger("server");

export const loggerMiddleware = new Elysia({
	name: "request-logger",
})
	.onBeforeHandle(({ request }) => {
		logger.info(`<- ${request.method} ${request.url}`);
	})
	.onAfterHandle(({ request, set }) => {
		logger.info(`-> [${set.status}] ${request.method} ${request.url}`);
	});
