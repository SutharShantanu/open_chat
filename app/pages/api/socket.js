// pages/api/socket.js
import { Server } from "socket.io";

const users = [];
const rooms = [];

export default function SocketHandler(req, res) {
    if (res.socket.server.io) {
        res.end();
        return;
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
        socket.on("joinRoom", ({ username, room }) => {
            const user = { id: socket.id, username, room };
            users.push(user);
            socket.join(room);

            if (!rooms.includes(room)) {
                rooms.push(room);
            }

            io.emit("availableRooms", rooms);

            io.to(room).emit("roomUsers", {
                room,
                users: users.filter((u) => u.room === room),
            });

            socket.broadcast.to(room).emit("receiveMessage", {
                user: "System",
                text: `${username} has joined the chat.`,
            });
        });

        socket.on("sendMessage", ({ text, user, room }) => {
            io.to(room).emit("receiveMessage", { user, text });
        });

        socket.on("disconnect", () => {
            const index = users.findIndex((u) => u.id === socket.id);
            if (index !== -1) {
                const [disconnectedUser] = users.splice(index, 1);

                io.to(disconnectedUser.room).emit("roomUsers", {
                    room: disconnectedUser.room,
                    users: users.filter(
                        (u) => u.room === disconnectedUser.room
                    ),
                });

                io.to(disconnectedUser.room).emit("receiveMessage", {
                    user: "System",
                    text: `${disconnectedUser.username} has left the chat.`,
                });

                if (
                    users.filter((u) => u.room === disconnectedUser.room)
                        .length === 0
                ) {
                    rooms.splice(rooms.indexOf(disconnectedUser.room), 1);
                    io.emit("availableRooms", rooms);
                }
            }
        });
    });

    res.end();
}
