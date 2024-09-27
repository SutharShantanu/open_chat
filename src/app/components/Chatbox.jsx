// components/ChatBox.jsx
import { Text, Divider } from "@geist-ui/core";
import Message from "./Message";

export default function ChatBox({ messages }) {
  return (
    <div className="h-96 overflow-y-scroll p-4 bg-gray-700 rounded-md">
      {messages.length ? (
        messages.map((msg, index) => (
          <div key={index}>
            <Message user={msg.user} text={msg.text} />
            <Divider />
          </div>
        ))
      ) : (
        <Text className="text-center text-white">No messages yet.</Text>
      )}
    </div>
  );
}
