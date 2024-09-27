// pages/chat/[room].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { GeistProvider, CssBaseline, Text, Page, Card } from "@geist-ui/core";
import ChatBox from "../../components/ChatBox";
import ChatInput from "../../components/ChatInput";
import UserList from "../../components/UserList";

let socket;

export default function RoomChat() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const { room } = router.query;
  const username = router.query.username;

  useEffect(() => {
    if (!room || !username) return;

    socket = io();

    socket.emit("joinRoom", { username, room });

    socket.on("roomUsers", ({ room, users }) => {
      setUsers(users);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [room, username]);

  const sendMessage = (message) => {
    socket.emit("sendMessage", { text: message, user: username, room });
    setMessages((prevMessages) => [...prevMessages, { user: "You", text: message }]);
  };

  return (
    <GeistProvider>
      <CssBaseline />
      <Page className="bg-gray-900 min-h-screen">
        <Text h2 className="text-center text-white">{`Room: ${room}`}</Text>
        <div className="flex justify-center gap-4">
          <Card className="w-1/4 bg-gray-800 p-4">
            <UserList users={users} />
          </Card>
          <Card className="w-full lg:w-2/3 bg-gray-800 p-4">
            <ChatBox messages={messages} />
            <ChatInput sendMessage={sendMessage} />
          </Card>
        </div>
      </Page>
    </GeistProvider>
  );
}
