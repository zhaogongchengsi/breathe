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
        const socket = new WebSocket('ws://${host}:${port}');  
        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
        });

        socket.addEventListener('close', function (event) {
            console.log('Message from server ', event.data);
        });

        socket.addEventListener('error', function (event) {
            console.log('Message from server ', event.data);
        });

        socket.addEventListener('open', function (event) {
            console.log('Message from server ', event.data);
            heart()
        });

        function send  () => {
        }

        const heart = (time) => {
            setInterval(() => {
                ws.send({
                    type: "heartbeat",
                    messate: "heartName"
                })
            }, time);
        };

    }
  )();</script>
    `;
}
