"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { Input, Button, Modal, Text, Container, Card } from "@chakra-ui/react";
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
            <Container className="bg-zinc-100 flex flex-col justify-center items-center">
                <p className="text-black mb-4">
                    Status: {isConnected ? "Connected" : "Disconnected"}
                </p>
                <p className="text-black mb-6">
                    {transport && `Transport: ${transport}`}
                </p>

                <Modal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    width="400px">
                    <Modal.Title>Enter Your Username</Modal.Title>
                    <Modal.Content>
                        <Input
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                dispatch(setUsername(e.target.value))
                            } // Set username in Redux
                        />
                    </Modal.Content>
                    <Modal.Action onClick={() => setModalVisible(false)}>
                        Cancel
                    </Modal.Action>
                    <Modal.Action
                        onClick={handleJoin}
                        disabled={!username.trim()}>
                        Confirm
                    </Modal.Action>
                </Modal>

                <Text h2 className="text-black">
                    Join a Chat Room
                </Text>
                <div className="w-full lg:w-1/3 p-4 bg-gray-800 rounded-lg mb-6">
                    <Input
                        placeholder="Create or enter room name"
                        value={room}
                        onChange={(e) => dispatch(setRoom(e.target.value))}
                        className="mb-4"
                    />
                    <Button
                        type="secondary"
                        onClick={() => handleJoinRoom(room)}
                        className="w-full">
                        Create / Join Room
                    </Button>
                </div>

                <Text h3 className="text-black">
                    Available Rooms
                </Text>
                <div className="grid gap-4 mt-4">
                    {rooms.length > 0 ? (
                        rooms.map((roomName, index) => (
                            <Card
                                key={index}
                                className="bg-gray-700 p-4 text-black cursor-pointer"
                                onClick={() => handleJoinRoom(roomName)}>
                                {roomName}
                            </Card>
                        ))
                    ) : (
                        <Text h4 className="text-black">
                            No rooms available. Create a new room!
                        </Text>
                    )}
                </div>
            </Container>
        </Fragment>
    );
}
