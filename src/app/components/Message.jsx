// components/Message.jsx
import { Text } from "@geist-ui/core";

export default function Message({ user, text }) {
  return (
    <div className="p-2">
      <Text className="text-white">
        <strong>{user}:</strong> {text}
      </Text>
    </div>
  );
}