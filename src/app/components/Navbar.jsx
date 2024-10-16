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
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LoginUser from "./Modals/ProfileImage";
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

  return (
    <Flex
      width="full"
      position="fixed"
      zIndex="999"
      alignItems="center"
      justifyContent="space-between"
      p="4"
      columnGap="4"
      shadow="base"
      bg="black"
    >
      <Text
        fontSize={{ base: "md", md: "lg", lg: "xl" }}
        fontWeight="bold"
        color="white"
        whiteSpace="nowrap"
        width="fit-content"
      >
        Chat App
      </Text>

      <HStack
        spacing="8"
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        width="full"
        justifyContent="space-between"
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
      </HStack>

      {/* Aligning the IconButton to the right */}
      <Flex flex="1" justify="flex-end">
        <IconButton
          aria-label="Menu"
          rounded="full"
          size="sm"
          width="fit-content"
          icon={<VscDebugPause size="20px" />}
          display={{ base: "flex", md: "none" }}
          onClick={onDrawerOpen}
          bgColor="white"
          transform="rotate(90deg)"
        />

        <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton
              rounded="full"
              bgColor="black"
              color="white"
              size="sm"
            />
            <DrawerHeader>Menu</DrawerHeader>
            <Divider />
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
      </Flex>

      <LoginUser isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Navbar;
