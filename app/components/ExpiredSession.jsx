"use client";

import { Box, Button, Center, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const ExpiredSession = () => {
    const router = useRouter();
    return (
        <Center h="100vh" bg="gray.50" marginTop="-60px">
            <VStack spacing={6} align="center" p={4}>
                <Box w={{ base: "90%", md: "full" }} textAlign="center">
                    <Image
                        src="https://cdn-icons-png.flaticon.com/512/4539/4539472.png"
                        alt="Session Expired"
                        maxWidth={{ base: "300px", md: "500px" }}
                        mx="auto"
                    />
                    <Heading as="h3" size={{ base: "md", md: "lg" }} mb={2}>
                        Oops, Your Session Has Expired
                    </Heading>

                    <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} mb={4}>
                        Looks like you took too long. Please log in again to continue your thrilling adventure.
                    </Text>
                    <Button
                        size="md"
                        width="full"
                        rounded="sm"
                        color="white"
                        bgColor="gray.900"
                        _hover={{ bgColor: "gray.700", color: "white" }}
                        mt={4}
                        onClick={() => router.push("/login")}
                    >
                        Log In Again
                    </Button>
                </Box>
            </VStack>
        </Center>
    );
};
export default ExpiredSession;