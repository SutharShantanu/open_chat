import { useState } from "react";
import { Box, Input, VStack, Text, IconButton, Divider, HStack, Avatar, Flex, Badge, Menu, MenuButton, MenuList, MenuItem, AvatarBadge, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { AiOutlineCheck, AiOutlineClockCircle } from "react-icons/ai";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const currentUser = "User1"; // Example current user name
  const pinnedChats = [
    { name: "Chat 1", avatar: "https://via.placeholder.com/40", lastMessage: "Hey, what's up?", time: "10:00 AM", read: true, online: true },
    { name: "Chat 2", avatar: "https://via.placeholder.com/40", lastMessage: "Are you free today?", time: "9:45 AM", read: false, online: false },
    { name: "Chat 3", avatar: "https://via.placeholder.com/40", lastMessage: "Let's meet tomorrow", time: "9:30 AM", read: true, online: true }
  ]; // Example pinned chats with message details and online status
  const chats = [
    {
      name: "Group Chat 1",
      avatar: "https://via.placeholder.com/40",
      messages: [
        { sender: "User1", text: "Meeting at 3 PM", time: "8:00 AM", read: false },
        { sender: "User2", text: "See you there!", time: "8:10 AM", read: true },
      ],
      online: true
    },
    {
      name: "Group Chat 2",
      avatar: "https://via.placeholder.com/40",
      messages: [
        { sender: "User3", text: "Let's do it!", time: "7:00 AM", read: true },
        { sender: "User1", text: "Got it!", time: "7:05 AM", read: false },
      ],
      online: false
    },
    {
      name: "Individual Chat 1",
      avatar: "https://via.placeholder.com/40",
      messages: [
        { sender: "User1", text: "Can you help me?", time: "6:30 AM", read: false },
        { sender: "User2", text: "Sure, what do you need?", time: "6:40 AM", read: true },
      ],
      online: true
    },
    {
      name: "Individual Chat 2",
      avatar: "https://via.placeholder.com/40",
      messages: [
        { sender: "User1", text: "Okay, noted", time: "6:00 AM", read: true },
        { sender: "User3", text: "Thanks!", time: "6:10 AM", read: false },
      ],
      online: false
    }
  ]; // Example chats with online status and message details

  return (
    <Box
      w="80"
      h="100vh"
      bg="white"
      color="gray.900"
      display="flex"
      flexDirection="column"
      borderRight="1px"
      borderColor="gray.300"
      marginTop="13px"
    >
      <HStack px={4} py={2} overflow="hidden">
        <Input
          rounded="none"
          placeholder="Search your chat"
          value={search}
          px="0"
          onChange={(e) => setSearch(e.target.value)}
          bg="transparent"
          color="gray.900"
          border="none"

          _focusVisible={{ outline: "none" }}
        />
      </HStack>
      <Divider />
      <HStack px={4} py={2} justify="space-between">
        <Text color="gray.600" fontSize="lg" fontWeight="semibold">
          New Chat
        </Text>
        <IconButton
          aria-label="New Chat"
          icon={<FaRegEdit />}
          variant="ghost"
          rounded="full"
          bgColor="green.500"
          textColor="white"
          _hover={{
            bgColor: "green.600",
            textColor: "white",
          }}
          _active={{
            bgColor: "green.700",
          }}
        />
      </HStack>

      <Divider />
      <Box px={4} py={2} overflowY="auto" maxHeight="calc(100vh - 200px)">
        <Text fontWeight="semibold" color="gray.600">Pinned Chats</Text>
        <VStack align="flex-start" gap={2} mt={2}>
          {pinnedChats.map((chat, index) => (
            <Flex key={index} align="center" w="full" overflow="hidden">
              <Avatar name={chat.name} src={chat.avatar} size="sm" >
                <AvatarBadge
                  bg={chat.online ? "green" : "red"}
                  boxSize="12px"
                >
                </AvatarBadge>
              </Avatar>
              <Box ml={3} flex="1">
                <Text fontWeight="bold" color={chat.read ? "gray.900" : "blue.400"} className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {chat.name}
                </Text>
                <Text fontSize="sm" color="gray.600" className="whitespace-nowrap overflow-hidden text-ellipsis">{chat.lastMessage}</Text>
                <Text fontSize="xs" color="gray.500">{chat.time}</Text>
              </Box>
              {chat.read ? (
                <AiOutlineCheck color="green.500" />
              ) : (
                <AiOutlineClockCircle color="yellow.500" />
              )}

              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<PiDotsThreeOutlineFill />}
                  variant="ghost"
                  size="sm"
                  ml={2}
                />
                <MenuList>
                  <MenuItem>Mute</MenuItem>
                  <MenuItem>Archive</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ))}
        </VStack>
      </Box>

      <Divider color="gray.300" />

      {/* Chat List */}
      <Box flex="1" overflowY="auto">
        <Box px={4} py={2} borderBottom="1px" borderColor="gray.300">
          <Text fontWeight="semibold" color="gray.600">Chats</Text>
        </Box>
        <VStack align="flex-start" gap={2} px={4} py={2} width="full">
          {chats.map((chat, index) => (
            <Box key={index} width="full">
              <Flex align="center" w="full" bg="gray.50" p={2} borderRadius="md" _hover={{ bg: "blue.200" }} overflow="hidden">
                <Avatar name={chat.name} src={chat.avatar} size="sm" >
                  <AvatarBadge
                    bg={chat.online ? "green" : "red"}
                    boxSize="12px"
                  >
                  </AvatarBadge>
                </Avatar>
                <Box ml={3} flex="1">
                  <Text fontWeight="bold" color={chat.messages[chat.messages.length - 1].read ? "gray.900" : "blue.400"} className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {chat.name}
                  </Text>
                  <VStack align="flex-start" gap={1}>
                    {chat.messages.map((message, idx) => (
                      <HStack key={idx} w="full">
                        <Text fontSize="sm" color="gray.600" fontWeight={message.sender === currentUser ? "bold" : "normal"}>
                          {message.sender === currentUser ? "Me" : message.sender}:
                        </Text>
                        <Text fontSize="sm" color="gray.600" className="whitespace-nowrap overflow-hidden text-ellipsis">{message.text}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
                {chat.messages[chat.messages.length - 1].read ? (
                  <AiOutlineCheck color="green.500" />
                ) : (
                  <AiOutlineClockCircle color="yellow.500" />
                )}
                {/* Online Status Badge */}

                {/* Three Dots Menu */}
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<PiDotsThreeOutlineFill />}
                    variant="ghost"
                    size="sm"
                    ml={2}
                  />
                  <MenuList>
                    <MenuItem>Mute</MenuItem>
                    <MenuItem>Archive</MenuItem>
                    <MenuItem>Delete</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar;
