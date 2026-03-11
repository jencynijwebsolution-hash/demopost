import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";
import Logger from "./logger";

type UserRole = "Admin" | "User";

interface JoinPayLoad {
    id: string | number;
    role: UserRole;
}

export let io: SocketIOServer;

const clients: Record<string, Set<string>> = {};

export const initsocket = (server: Server) => {
    try {
        io = new SocketIOServer(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PATCH"],
            },
        });

        io.on("connection", (socket: Socket) => {
            Logger.warn(`New socket connected: ${socket.id}`);

            socket.on("join", async ({ id, role }: JoinPayLoad) => {
                const key = `${role}-${id}`;

                if (!clients[key]) {
                    clients[key] = new Set();
                }

                clients[key].add(socket.id);

                socket.join(key);

                if (role === "Admin") {
                    socket.join("main_admin");
                       console.log("Admin joined main_admin room");
                }

                Logger.http(`User ${key} connected. Sockets: ${[...clients[key]]}`);

                io.to(key).emit("new-message", {
                    title: "Socket Connected",
                    message: `user with key ${key} connected`
                });
            })

            socket.on("disconnect", () => {
                for (const [key, socketSet] of Object.entries(clients)) {
                    if (socketSet.has(socket.id)) {
                        socketSet.delete(socket.id);

                        if (socketSet.size === 0) {
                            delete clients[key];
                        }

                        Logger.info(`User ${key} disconnected. Remaining sockets: ${[...socketSet]}`);
                        break;
                    }
                }
            });
        });
        return io;
    } catch (error: any) {
        Logger.warn(`Socket connection error: ${error?.message || error}`);
    }
};

export const getIo = (): SocketIOServer => {
    if (!io) {
        throw new Error("Socket connection is not available currently.");

    }
    return io;
};