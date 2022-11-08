import { WsMessageType } from "./ws";

export interface ClientOption {
  port: number;
  host?: string;
  heartRate?: number;
  heartName?: Omit<WsMessageType, "message">;
}

export function injectClientCode({
  port,
  host = "localhost",
  heartRate = 1500,
  heartName = "heartbeat",
}: ClientOption) {
  return `<script>;
  (function () {
        const { protocol, host, pathname } = location;
        const url = (protocol === "http:" ? "ws://" : "wss://") + "${host}:"+${port}

        function connect() {
          const socket = new WebSocket(url);
          socket.addEventListener("message", function (event) {
            const data = JSON.parse(event.data);
            if (data.type === "fileChange") {
              const fileUrl = data.message.replace(".html", "");
              const url = pathname.replace("/", "").replace(".html", "");
              const path = url === "" ? "index" : url;
              if (fileUrl === path) {
                location.reload();
              }
            }
          });

          socket.addEventListener("open", function (event) {heart(${heartRate})});
          const send = (type, message) => {socket.send(JSON.stringify({type,message}))};
          const heart = (time = 3000) => {setInterval(() => {send("${heartName}", "${heartName}");}, time);};
        }
        connect()
     })();</script>
    `;
}
