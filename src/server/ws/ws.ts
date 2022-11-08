import WebSocket, { WebSocketServer } from "ws";

export type WsMessageType = "heartbeat" | "message" | "fileChange";

export interface WsMessage {
  type: WsMessageType;
  message: string | Record<string, any>;
}

export interface WsEventHandlers {
  onHeartbeat?: (send: (msg: WsMessage) => void) => void;
  onMessage?: (message: WsMessage) => WsMessage | undefined;
}

export function createWsServer(
  port: number,
  host: string,
  events?: WsEventHandlers
) {
  let isOpen = false;
  const wss = new WebSocketServer({
    port,
    host,
  });

  wss.on("connection", function connection(ws, client) {
    ws.on("message", function message(data) {
      const message = JSON.parse(data.toString());

      const send = (msg: WsMessage) => {
        ws.send(JSON.stringify(msg));
      };

      if (message.type === "heartbeat") {
        if (events) {
          events.onHeartbeat && events.onHeartbeat(send);
        }
        send({
          type: "heartbeat",
          message: "pong",
        });
        return;
      }

      if (events && events.onMessage) {
        const msg = events.onMessage(message);
        if (msg) {
          send(msg);
        }
      }
    });
  });

  wss.on("open", function open() {
    isOpen = true;
  });

  return wss;
}

export function wsoptions() {
  return {
    perMessageDeflate: {
      zlibDeflateOptions: {
        chunkSize: 1024,
        memLevel: 7,
        level: 3,
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024,
      },
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024, // Size (in bytes) below which messages
    },
  };
}
