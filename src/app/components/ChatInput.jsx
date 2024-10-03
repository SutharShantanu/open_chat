// // components/ChatInput.jsx
// import { Input, Button, Spacer } from "@chakra-ui/react";
// import { useState } from "react";

// export default function ChatInput({ sendMessage }) {
//   const [input, setInput] = useState("");

//   const handleSend = () => {
//     if (input.trim()) {
//       sendMessage(input);
//       setInput("");
//     }
//   };

//   return (
//     <div className="flex mt-4">
//       <Input
//         placeholder="Type a message..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         width="80%"
//         className="mr-2"
//       />
//       <Button type="secondary" onClick={handleSend}>
//         Send
//       </Button>
//       <Spacer h={2} />
//     </div>
//   );
// }
