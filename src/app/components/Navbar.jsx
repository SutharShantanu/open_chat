"use client";

import { Button, Text, Avatar, Badge, HStack, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Box, Flex } from "@chakra-ui/react";
import { CircleUser } from "lucide";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Navbar = () => {
    const { username, isConnected } = useSelector((state) => state.chat);
    const router = useRouter();

    return (
        <Flex width="full" alignItems="center" justifyContent="space-between" p="2" shadow="base" >
            <Text className="">Chat App</Text>
            <Box className="flex items-center gap-4">
                <HStack>
                    <Avatar
                        src={username?.profilePicture || ""}
                        name='New User'
                    />
                    <Text>John Doe</Text>
                </HStack>
                {username && <Menu>
                    <MenuButton as={Button} leftIcon={<CircleUser size={18} strokeWidth={1.75} absoluteStrokeWidth />}>
                        <Avatar
                            src={username?.profilePicture || ""}
                            name='New User'
                        />
                        <Badge colorScheme='green'>Success</Badge>
                    </MenuButton>
                    <MenuList>
                        <MenuGroup title='Profile'>
                            <MenuItem>
                                <HStack>
                                    <Avatar name='New User' src='' />
                                    <Badge colorScheme='green'>Success</Badge>
                                    <Text>John Doe</Text>
                                </HStack>
                            </MenuItem>
                        </MenuGroup>
                        <MenuDivider />
                        <MenuGroup title='Help'>
                            <MenuItem>Docs</MenuItem>
                            <MenuItem>FAQ</MenuItem>
                            <MenuItem>
                                <Button onClick={() => { }}>Logout</Button>
                            </MenuItem>
                        </MenuGroup>
                    </MenuList>
                </Menu>}
            </Box>
        </Flex>
    );
}

export default Navbar;