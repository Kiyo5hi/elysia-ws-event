import pino from "pino";

const root = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
});

export function getLogger(name: string) {
	return root.child({ name });
}
