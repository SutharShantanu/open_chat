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
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setUsername,
//   setRoom,
//   setIsConnected,
//   setTransport,
//   setSelectedRoom,
// } from "@/app/store/slices/chatSlice";

let socket;

export default function Home() {
  // const dispatch = useDispatch();
  // const { username, room, isConnected, transport, selectedRoom, rooms } =
    // useSelector((state) => state.chat);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   socket = io();

  //   socket.on("connect", () => {
  //     dispatch(setIsConnected(true));
  //     dispatch(setTransport(socket.io.engine.transport.name));
  //   });

  //   socket.on("disconnect", () => {
  //     dispatch(setIsConnected(false));
  //   });

  //   socket.io.on("transport", (transport) => {
  //     dispatch(setTransport(transport));
  //   });

  //   socket.on("availableRooms", (rooms) => {
  //     dispatch(setRoom(rooms));
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [dispatch]);

  const handleJoin = () => {
    if (username.trim() && selectedRoom.trim()) {
      router.push(`/chat/${selectedRoom}?username=${username}`);
    }
  };

  const handleJoinRoom = (roomName) => {
    // dispatch(setSelectedRoom(roomName));
    setModalVisible(true);
  };

  return (
    <Fragment>
      <Text>
        This is homepage
      </Text>
    </Fragment>
  );
}
