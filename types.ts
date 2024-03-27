import { Type, type TObject, type Static } from "@sinclair/typebox";
import type { ElysiaWS } from "elysia/ws";

export type StringLiteral<T> = T extends string
	? string extends T
		? never
		: T
	: never;

export type UserId = string;
export const UserId = Type.String();

export type RequestId = string;
export const RequestId = Type.String();

export type EventName<T> = StringLiteral<T>;
export const EventName = <T extends string>(name: T) => Type.Literal(name);

export type RequestBase<E extends string, D extends Record<string, unknown>> = {
	requestId: RequestId;
	from: UserId;
	event: StringLiteral<E>;
	data: D;
};
export const RequestBase = <E extends string, D extends TObject>(
	name: E,
	data: D,
) =>
	Type.Object({
		requestId: RequestId,
		from: UserId,
		event: EventName(name),
		data,
	});

export type ResponseBase<
	E extends string,
	D extends Record<string, unknown>,
> = {
	requestId: RequestId;
	to: UserId;
	event: StringLiteral<E>;
	data: D;
};
export const ResponseBase = <E extends string, D extends TObject>(
	name: E,
	data: D,
) =>
	Type.Object({
		requestId: RequestId,
		to: UserId,
		event: EventName(name),
		data,
	});

type MaybePromise<T> = T | Promise<T>;

export type EventHandler<
	E extends string,
	RequestData extends Record<string, unknown>,
	ResponseData extends Record<string, unknown>,
> = (
	request: RequestBase<StringLiteral<E>, RequestData>,
) => MaybePromise<MaybePromise<ResponseBase<StringLiteral<E>, ResponseData>>[]>;

export type HandlerEntry<
	E extends string,
	RequestData extends TObject,
	ResponseData extends TObject,
> = {
	eventName: StringLiteral<E>;
	requestData: RequestData;
	responseData: ResponseData;
	handler: EventHandler<E, Static<RequestData>, Static<ResponseData>>;
};

// biome-ignore lint/suspicious/noExplicitAny: Elysia has complex types
export type Connection = ElysiaWS<any>;

export enum ReservedUserId {
	ALL = "all",
	GROUP = "group",
	SYSTEM = "system",
	UNKNOWN = "unknown",
}
