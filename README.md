# elysia-ws-event

This project is meant to be a template repository for event-driven Elysia websocket server.

To start, just:

```bash
bun dev
```

The server is capable to send out multiple responses to the same request if needed, it also supports a mix of sync and async responses to the same client.

An example of an event can be referred in `isHealthy/handlers`. To register a handler, refer to `handlers.ts` in the root directory.
