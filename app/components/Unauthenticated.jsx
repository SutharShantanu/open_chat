"use client";

import { useRouter } from "next/navigation";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

const Unauthenticated = () => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "calc(100vh - 60px)" }}
      bg="tw-white"
      p={6}
    >
      <VStack spacing={4} align="center">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/891/891399.png"
          alt="Protected Route"
          maxWidth={{ base: "300px", md: "500px" }}
          mx="auto"
        />
        <Heading as="h1" size="xl" color="danger" fontFamily="heading">
          Protected Route
        </Heading>
        <Text fontSize="lg" color="paragraph" textAlign="center">
          Oh, look at you trying to access this page! Too bad, it’s protected. You’ll need to sign up or log in first.
        </Text>
        <Button
          onClick={() => router.push("/signup")}
          px={6}
          py={3}
          color="tw-white"
          bgColor="tw-black"
          border="2px solid transparent"
          rounded="sm"
          _hover={{ bgColor: "tw-white", color: "tw-black", borderColor: "tw-black" }}
        >
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
};

export default Unauthenticated;
