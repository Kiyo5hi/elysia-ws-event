import type { EventHandler, HandlerEntry } from "../types";
import { IsHealthyRequestData, IsHealthyResponseData } from "./types";

const isHeathyHandler: EventHandler<
	"isHealthy",
	IsHealthyRequestData,
	IsHealthyResponseData
> = (request) => {
	return [
		{
			requestId: request.requestId,
			to: request.from,
			event: request.event,
			data: {},
		},
	];
};

export const isHealthy: HandlerEntry<
	"isHealthy",
	typeof IsHealthyRequestData,
	typeof IsHealthyResponseData
> = {
	eventName: "isHealthy",
	requestData: IsHealthyRequestData,
	responseData: IsHealthyResponseData,
	handler: isHeathyHandler,
};
