"use client";

import React from "react";
import { BiSolidUser , BiSolidErrorAlt } from "react-icons/bi";
import { TbSettingsFilled } from "react-icons/tb";
import { IoMdNotifications } from "react-icons/io";
import { BsPatchQuestionFill } from "react-icons/bs";
import { MdBugReport } from "react-icons/md";
import { PiSignOutBold  } from "react-icons/pi";

import {
  Button,
  Text,
  HStack,
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
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  AvatarBadge,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import LoginUser from "./Modals/ProfileImage";
import { VscDebugPause } from "react-icons/vsc";
import { signOut, useSession } from "next-auth/react";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

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
          href="/profile"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          Profile
        </Link>
        <Link
          onClick={() => signOut()}
          color="white"
          as="button"
          _hover={{ textDecoration: "underline" }}
        >
          logout
        </Link>
        <Link
          href="/login"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          Login
        </Link>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={
              <Avatar size="sm" name={user?.name} src={user?.image}>
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
            }
            rounded="full"
          />
          <MenuList backgroundColor="white" p={2} rounded="sm">
            <MenuGroup title="Profile" textColor="gray.500" fontSize="xs" marginY="2px">
              <MenuItem as="a" href="/profile" icon={<BiSolidUser />} fontSize="sm" rounded="sm">
                My Account
              </MenuItem>
              <MenuItem as="a" href="/profile/settings" icon={<TbSettingsFilled />} fontSize="sm" rounded="sm">
                Profile Settings
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Chat" textColor="gray.500" fontSize="xs" marginY="2px">
              <MenuItem as="a" href="/chats" icon={<HiMiniChatBubbleLeftRight />} fontSize="sm" rounded="sm">
                Manage Chats
              </MenuItem>
              <MenuItem as="a" href="/chats/blocked" icon={<BiSolidErrorAlt />} fontSize="sm" rounded="sm">
                Blocked Users
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Notifications" textColor="gray.500" fontSize="xs" marginY="2px">
              <MenuItem as="a" href="/notifications/push" icon={<IoMdNotifications />} fontSize="sm" rounded="sm">
                Manage Notifications
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Help" textColor="gray.500" fontSize="xs" marginY="2px">
              <MenuItem as="a" href="/docs" icon={<BsPatchQuestionFill />} fontSize="sm" rounded="sm">
                FAQ's
              </MenuItem>
              <MenuItem as="a" href="/help/report" icon={<MdBugReport />} fontSize="sm" rounded="sm">
                Report a Problem
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem as="a" href="/logout" icon={<PiSignOutBold  />} fontSize="sm" color="red.500" rounded="sm">
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
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
