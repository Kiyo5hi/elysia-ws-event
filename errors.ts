import { Type } from "@sinclair/typebox";

import { eventNames } from "./handlers";
import { ResponseBase, type UserId } from "./types";

export const ServerErrorSchema = ResponseBase(
	"error",
	Type.Object({
		name: Type.String(),
		message: Type.String(),
		details: Type.Unknown(),
	}),
);

export class ServerError extends Error {
	details: Record<string, unknown> = {};

	constructor(message: string) {
		super(message);
		this.name = "ServerError";
	}
}

export class EnvNotFoundError extends ServerError {
	constructor(key: string) {
		super(`missing environment variable: ${key}`);
		this.name = "EnvNotFoundError";
	}
}

export class EventNotFoundError extends ServerError {
	constructor(eventName: string) {
		super(`event not found: ${eventName}`);
		this.name = "EventNotFoundError";
		this.details = {
			acceptedEvents: eventNames,
			got: eventName,
		};
	}
}

export class ConnectionClosedError extends ServerError {
	constructor(userId: UserId) {
		super(`connection closed for user: ${userId}`);
		this.name = "ConnectionClosedError";
	}
}

export class UserIdMismatchError extends ServerError {
	constructor(userId: UserId, from: UserId) {
		super(`userId mismatch: ${userId} !== ${from}`);
		this.name = "UserIdMismatchError";
	}
}
