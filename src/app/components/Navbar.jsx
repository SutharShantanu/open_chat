"use client";

import React from "react";
import {
    Button,
    Text,
    HStack,
    Box,
    Flex,
    useDisclosure,
    Link,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LoginUser from "./Modals/LoginUser";

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { username, isConnected } = useSelector((state) => state.chat);
    const router = useRouter();

    return (
        <Flex width="full" position="fixed" zIndex="999" alignItems="center" justifyContent="space-between" p="2" shadow="base">
            <Text>Chat App</Text>
            <Link href="/signup">Signup</Link>
            <Link href="/login">Login</Link>
            <Box className="flex items-center gap-4">
                <HStack>
                    <Button colorScheme="blackAlpha" rounded="none" onClick={onOpen}>
                        Modal Trigger
                    </Button>
                </HStack>
            </Box>

            <LoginUser isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default Navbar;
