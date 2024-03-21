import { isHealthy } from "./isHealthy/handlers";
import { RequestBase, ResponseBase } from "./types";

export const handlers = {
	isHealthy,
};

export const eventNames = Object.values(handlers).map(
	(handler) => handler.eventName,
);

export const requestSchemas = Object.values(handlers).map((handler) =>
	RequestBase(handler.eventName, handler.requestData),
);

export const responseSchemas = Object.values(handlers).map((handler) =>
	ResponseBase(handler.eventName, handler.responseData),
);
