"use client";

import { useSession } from "next-auth/react";
import { Box, Flex, Text, Input, IconButton, Avatar, VStack, HStack, Spacer } from "@chakra-ui/react";
import { AiOutlineSend } from "react-icons/ai";
import ExpiredSession from "@/app/components/ExpiredSession";
import Sidebar from "@/app/components/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const messages = [
    { sender: "You", text: "Hello!", time: "10:00 AM" },
    { sender: "John", text: "Hi! How are you?", time: "10:02 AM" },
  ];

  if (!user) {
    return <ExpiredSession />;
  }

  return (
    <Flex h="100vh" bg="gray.100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Chat Area */}
      <Flex flex="1" direction="column">
        {/* Header */}
        <Flex align="center" p="4" bg="white" shadow="md">
          <Text fontSize="lg" fontWeight="bold">
            Chat with John
          </Text>
          <Spacer />
          <Avatar name="John" />
        </Flex>

        {/* Chat Messages */}
        <Flex flex="1" direction="column" p="4" overflowY="auto">
          <VStack align="stretch" spacing="3">
            {messages.map((msg, idx) => (
              <Flex
                key={idx}
                justify={msg.sender === "You" ? "flex-end" : "flex-start"}
              >
                <Box
                  bg={msg.sender === "You" ? "blue.500" : "gray.300"}
                  color={msg.sender === "You" ? "white" : "black"}
                  p="3"
                  borderRadius="md"
                  maxW="70%"
                >
                  <Text>{msg.text}</Text>
                  <Text fontSize="xs" textAlign="right">
                    {msg.time}
                  </Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        </Flex>

        {/* Message Input */}
        <Flex p="4" bg="white" shadow="md">
          <Input placeholder="Type your message..." />
          <IconButton
            icon={<AiOutlineSend />}
            aria-label="Send message"
            ml="2"
            colorScheme="blue"
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
