"use client";

import React from "react";
import {
    Button,
    Text,
    HStack,
    Box,
    Flex,
    useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LoginUser from "./Modals/LoginUser";

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure(); // Control the modal state
    const { username, isConnected } = useSelector((state) => state.chat); // Redux state (optional)
    const router = useRouter();

    return (
        <Flex width="full" alignItems="center" justifyContent="space-between" p="2" shadow="base">
            <Text>Chat App</Text>
            <Box className="flex items-center gap-4">
                <HStack>
                    {/* Trigger button stays in Navbar */}
                    <Button colorScheme="blackAlpha" rounded="none" onClick={onOpen}>
                        Login
                    </Button>
                </HStack>
            </Box>

            {/* Pass the isOpen and onClose to the separate LoginUser component */}
            <LoginUser isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default Navbar;
