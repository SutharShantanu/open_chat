"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import {
    GeistProvider,
    CssBaseline,
    Input,
    Button,
    Modal,
    Text,
    Page,
    Card,
} from "@geist-ui/core";

let socket;

export default function Home() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [rooms, setRooms] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // Default to false
    const [selectedRoom, setSelectedRoom] = useState(""); // Track selected room
    const router = useRouter();

    useEffect(() => {
        socket = io();
        socket.on("availableRooms", (rooms) => {
            setRooms(rooms);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Handle room join when modal is confirmed
    const handleJoin = () => {
        if (username.trim() && selectedRoom.trim()) {
            router.push(`/chat/${selectedRoom}?username=${username}`);
        }
    };

    // Display modal and set the selected room
    const handleJoinRoom = (roomName) => {
        setSelectedRoom(roomName);
        setModalVisible(true); // Show modal only when a room is selected
    };

    return (
        <GeistProvider>
            <CssBaseline />
            <Page className="bg-gray-900 min-h-screen flex flex-col justify-center items-center">
                {/* Modal for entering username */}
                <Modal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    width="400px">
                    <Modal.Title>Enter Your Username</Modal.Title>
                    <Modal.Content>
                        <Input
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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

                {/* Main UI */}
                <Text h2 className="text-white">
                    Join a Chat Room
                </Text>
                <div className="w-full lg:w-1/3 p-4 bg-gray-800 rounded-lg mb-6">
                    <Input
                        placeholder="Create or enter room name"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        className="mb-4"
                    />
                    <Button
                        type="secondary"
                        onClick={() => handleJoinRoom(room)}
                        className="w-full">
                        Create / Join Room
                    </Button>
                </div>

                {/* Available Rooms List */}
                <Text h3 className="text-white">
                    Available Rooms
                </Text>
                <div className="grid gap-4 mt-4">
                    {rooms.length > 0 ? (
                        rooms.map((roomName, index) => (
                            <Card
                                key={index}
                                className="bg-gray-700 p-4 text-white cursor-pointer"
                                onClick={() => handleJoinRoom(roomName)}>
                                {roomName}
                            </Card>
                        ))
                    ) : (
                        <Text h4 className="text-white">
                            No rooms available. Create a new room!
                        </Text>
                    )}
                </div>
            </Page>
        </GeistProvider>
    );
}
