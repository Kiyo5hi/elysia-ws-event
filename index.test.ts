import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { treaty } from "@elysiajs/eden";

import type { AppType } from ".";

test("isHealthy", async () => {
	const client = treaty<AppType>("http://localhost:3000");
	const conn = client.index.subscribe({ query: { userId: "Alice" } });

	await new Promise<void>((resolve) => {
		conn.addEventListener("open", resolve, { once: true });
	});

	const uuid = randomUUID();

	conn.send({
		requestId: uuid,
		event: "isHealthy",
		from: "Alice",
		data: {},
	});

	conn.addEventListener(
		"message",
		({ data }) => {
			expect(data.requestId).toBe(uuid);
			expect(data.event).toBe("isHealthy");
		},
		{ once: true },
	);
});
