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
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  IconButton,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LoginUser from "./Modals/LoginUser";
import { VscDebugPause } from "react-icons/vsc";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const { username, isConnected } = useSelector((state) => state.chat);
  const router = useRouter();

  // just fixing branch issue

  return (
    <Flex
      width="full"
      position="fixed"
      zIndex="999"
      alignItems="center"
      justifyContent="space-between"
      p="4"
      shadow="base"
      bg="black"
    >
      <Text
        fontSize={{ base: "md", md: "lg", lg: "xl" }}
        fontWeight="bold"
        color="white"
      >
        Chat App
      </Text>

      <HStack
        spacing="8"
        display={{ base: "none", md: "flex" }}
        alignItems="center"
      >
        <Link
          href="/signup"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          Signup
        </Link>
        <Link
          href="/login"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          Login
        </Link>
        {/* <Button colorScheme="teal" rounded="none" onClick={onOpen}>
          Open Modal
        </Button> */}
      </HStack>

      <IconButton
        aria-label="Menu"
        rounded="full"
        icon={<VscDebugPause />}
        display={{ base: "flex", md: "none" }} // Show on mobile
        onClick={onDrawerOpen}
        bgColor="white"
        transform="rotate(90deg)" // Use Chakra's transform property for rotation
      />

      <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              <Link href="/signup" onClick={onDrawerClose}>
                Signup
              </Link>
              <Link href="/login" onClick={onDrawerClose}>
                Login
              </Link>
              <Button
                colorScheme="teal"
                rounded="none"
                width="full"
                onClick={() => {
                  onOpen();
                  onDrawerClose();
                }}
              >
                Open Modal
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Spacer />

      <LoginUser isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Navbar;
