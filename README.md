# elysia-ws-event

This project is meant to be a template repository for event-driven Elysia websocket server.

To start, just:

```bash
bun dev
```

The server is capable to send out multiple responses to the same request if needed, it also supports a mix of sync and async responses to the same client.

You can read `isHealthy/handlers.ts` to learn how to create an event handler, and read `handlers.ts` in the top-level directory to learn how to register an event handler.
