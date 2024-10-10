"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import {
  Input,
  Button,
  Modal,
  Text,
  Container,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Grid,
  GridItem,
  Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsername,
  setRoom,
  setIsConnected,
  setTransport,
  setSelectedRoom,
} from "@/app/store/chatSlice";

let socket;

export default function Home() {
  const dispatch = useDispatch();
  const { username, room, isConnected, transport, selectedRoom, rooms } =
    useSelector((state) => state.chat);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    socket = io();

    socket.on("connect", () => {
      dispatch(setIsConnected(true));
      dispatch(setTransport(socket.io.engine.transport.name));
    });

    socket.on("disconnect", () => {
      dispatch(setIsConnected(false));
    });

    socket.io.on("transport", (transport) => {
      dispatch(setTransport(transport));
    });

    socket.on("availableRooms", (rooms) => {
      dispatch(setRoom(rooms));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const handleJoin = () => {
    if (username.trim() && selectedRoom.trim()) {
      router.push(`/chat/${selectedRoom}?username=${username}`);
    }
  };

  const handleJoinRoom = (roomName) => {
    dispatch(setSelectedRoom(roomName));
    setModalVisible(true);
  };

  return (
    <Fragment>
      <Container
        bg="gray.100"
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        px={{ base: 4, md: 8 }}
      >
        <Text color="black" mb={4}>
          Status: {isConnected ? "Connected" : "Disconnected"}
        </Text>
        <Text color="black" mb={6}>
          {transport && `Transport: ${transport}`}
        </Text>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <ModalOverlay />
          <ModalContent
            width={{ base: "90%", md: "400px", lg: "500px", xl: "600px" }}
          >
            <ModalHeader>Enter Your Username</ModalHeader>
            <ModalBody>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => dispatch(setUsername(e.target.value))}
              />
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleJoin}
                disabled={!username.trim()}
              >
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Text
          as="h2"
          color="black"
          fontSize={{ base: "lg", md: "2xl", lg: "3xl", xl: "4xl" }}
          fontWeight="bold"
          mb={4}
        >
          Join a Chat Room
        </Text>

        <Box
          w={{ base: "full", md: "50%", lg: "33%" }}
          bg="gray.800"
          p={4}
          borderRadius="md"
          mb={6}
        >
          <Input
            placeholder="Create or enter room name"
            value={room}
            onChange={(e) => dispatch(setRoom(e.target.value))}
            mb={4}
            _placeholder={{ color: "gray.400" }}
            color="white"
          />
          <Button
            type="secondary"
            onClick={() => handleJoinRoom(room)}
            width="full"
            colorScheme="teal"
          >
            Create / Join Room
          </Button>
        </Box>

        <Text
          as="h3"
          color="black"
          fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
          mb={4}
        >
          Available Rooms
        </Text>

        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap={4}
          w="full"
          maxW="container.xl"
          px={{ base: 4, md: 0 }}
        >
          {rooms.length > 0 ? (
            rooms.map((roomName, index) => (
              <GridItem
                key={index}
                bg="gray.700"
                p={4}
                w={{ base: "full", lg: "90%", xl: "80%" }}
                color="white"
                borderRadius="md"
                cursor="pointer"
                textAlign="center"
                _hover={{ bg: "gray.600" }}
                onClick={() => handleJoinRoom(roomName)}
              >
                {roomName}
              </GridItem>
            ))
          ) : (
            <Text as="h4" color="black" fontSize={{ base: "md", md: "lg" }}>
              No rooms available. Create a new room!
            </Text>
          )}
        </Grid>
      </Container>
    </Fragment>
  );
}
