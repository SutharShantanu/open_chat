"use client";

import React from "react";
import { BiSolidUser, BiSolidErrorAlt } from "react-icons/bi";
import { TbSettingsFilled } from "react-icons/tb";
import { IoMdNotifications } from "react-icons/io";
import { BsPatchQuestionFill } from "react-icons/bs";
import { MdBugReport } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";

import {
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
      paddingX={4}
      paddingY={2}
      shadow="base"
      bg="background"
    >
      <Link href="/" _hover={{ textDecoration: "none" }}>
        <Text
          fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
          fontWeight="bold"
          color="heading"
          letterSpacing="wider"
          whiteSpace="nowrap"
          fontFamily="fantasy"        >
          Chat App
        </Text>
      </Link>
      <HStack
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        gap="4"
        ml="auto"
      >
        {!user && (
          <>
            <Link
              href="/signup"
              color="primary"
              _hover={{ textDecoration: "underline", color: "primaryHover" }}
            >
              Signup
            </Link>
            <Link
              onClick={() => signOut({ callbackUrl: '/login' })}
              color="primary"
              _hover={{ textDecoration: "underline", color: "primaryHover" }}
            >
              Login
            </Link>
          </>
        )}
        {user && (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={
                <Avatar size="sm" name={user?.name} src={user?.image}>
                  <AvatarBadge boxSize="1.25em" bg="secondary" />
                </Avatar>
              }
              rounded="full"
            />
            <MenuList backgroundColor="tw-white" p={2} rounded="sm">
              <MenuGroup
                title="Profile"
                textColor="paragraph"
                fontSize="xs"
                marginY="2px"
              >
                <MenuItem
                  as="a"
                  href="/settings/profile"
                  icon={<BiSolidUser />}
                  fontSize="sm"
                  rounded="sm"
                  bgColor={router.pathname === "/settings/profile" ? "primary" : "tw-white"}
                  _hover={{ bgColor: "tw-black", color: "tw-white" }}
                >
                  My Account
                </MenuItem>
                <MenuItem
                  as="a"
                  href="/settings/account"
                  icon={<TbSettingsFilled />}
                  fontSize="sm"
                  rounded="sm"
                  bgColor={router.pathname === "/settings/account" ? "primary" : "tw-white"}
                  _hover={{ bgColor: "tw-black", color: "tw-white" }}
                >
                  Profile Settings
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup
                title="Chat"
                textColor="paragraph"
                fontSize="xs"
                marginY="2px"
              >
                <MenuItem
                  as="a"
                  href="/chats"
                  icon={<HiMiniChatBubbleLeftRight />}
                  fontSize="sm"
                  rounded="sm"
                  bgColor={router.pathname === "/chats" ? "primary" : "tw-white"}
                  _hover={{ bgColor: "tw-black", color: "tw-white" }}
                >
                  Manage Chats
                </MenuItem>
                <MenuItem
                  as="a"
                  href="/chats/blocked"
                  icon={<BiSolidErrorAlt />}
                  fontSize="sm"
                  rounded="sm"
                  bgColor={router.pathname === "/chats/blocked" ? "primary" : "tw-white"}
                  _hover={{ bgColor: "tw-black", color: "tw-white" }}
                >
                  Blocked Users
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup
                title="Notifications"
                textColor="paragraph"
                fontSize="xs"
                marginY="2px"
              >
                <MenuItem
                  as="a"
                  href="/notifications/push"
                  icon={<IoMdNotifications />}
                  fontSize="sm"
                  rounded="sm"
                  bgColor={router.pathname === "/notifications/push" ? "primary" : "tw-white"}
                  _hover={{ bgColor: "tw-black", color: "tw-white" }}
                >
                  Manage Notifications
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup
                title="Help"
                textColor="paragraph"
                fontSize="xs"
                marginY="2px"
              >
                <MenuItem
                  as="a"
                  href="/docs"
                  icon={<BsPatchQuestionFill />}
                  fontSize="sm"
                  rounded="sm"
                  bgColor={router.pathname === "/docs" ? "primary" : "tw-white"}
                  _hover={{ bgColor: "tw-black", color: "tw-white" }}
                >
                  FAQ's
                </MenuItem>
                <MenuItem
                  as="a"
                  href="/help/report"
                  icon={<MdBugReport />}
                  fontSize="sm"
                  rounded="sm"
                  bgColor={router.pathname === "/help/report" ? "primary" : "tw-white"}
                  _hover={{ bgColor: "tw-black", color: "tw-white" }}
                >
                  Report a Problem
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuItem
                as="a"
                onClick={() => signOut({ callbackUrl: '/login' })}
                icon={<PiSignOutBold />}
                fontSize="sm"
                color="danger"
                rounded="sm"
                bgColor="tw-white"
                _hover={{ bgColor: "danger", color: "tw-white", cursor: "pointer" }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
      <IconButton
        aria-label="Menu"
        rounded="full"
        size="sm"
        display={{ base: "flex", md: "none" }}
        onClick={onDrawerOpen}
        bgColor="tw-white"
        transform="rotate(90deg)"
        _hover={{ bgColor: "tw-black", color: "tw-white" }}
      />
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            rounded="full"
            bgColor="heading"
            color="tw-white"
            size="sm"
            _hover={{ bgColor: "tw-black", color: "tw-white" }}
          />
          <DrawerHeader>Menu</DrawerHeader>
          <Divider />
          <DrawerBody>
            <VStack spacing={4} align="start">
              {!user && (
                <>
                  <Link href="/signup" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    Signup
                  </Link>
                  <Link href="/login" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    Login
                  </Link>
                </>
              )}
              {user && (
                <VStack spacing={4} align="start" width="full">
                  <Text fontWeight="bold" fontSize="md" color="paragraph">
                    Profile
                  </Text>
                  <Divider />
                  <Link href="/profile" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    My Account
                  </Link>
                  <Link href="/profile/settings" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    Profile Settings
                  </Link>

                  <Text fontWeight="bold" fontSize="md" color="paragraph" mt={4}>
                    Chat
                  </Text>
                  <Divider />
                  <Link href="/chats" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    Manage Chats
                  </Link>
                  <Link href="/chats/blocked" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    Blocked Users
                  </Link>

                  <Text fontWeight="bold" fontSize="md" color="paragraph" mt={4}>
                    Notifications
                  </Text>
                  <Divider />
                  <Link href="/notifications/push" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    Manage Notifications
                  </Link>

                  <Text fontWeight="bold" fontSize="md" color="paragraph" mt={4}>
                    Help
                  </Text>
                  <Divider />
                  <Link href="/docs" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    FAQ's
                  </Link>
                  <Link href="/help/report" onClick={onDrawerClose} _hover={{ color: "primaryHover" }}>
                    Report a Problem
                  </Link>

                  <Divider />
                  <Link
                    onClick={() => {
                      signOut({ callbackUrl: '/login' });
                      onDrawerClose();
                    }}
                    color="danger"
                    _hover={{ color: "primaryHover" }}
                  >
                    Logout
                  </Link>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <LoginUser isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Navbar;
