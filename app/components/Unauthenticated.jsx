import { Center, VStack, Text, Button } from "@chakra-ui/react";
import Link from "next/link";

const Unauthenticated = () => {
  return (
    <Center h="100vh">
      <VStack spacing="4" p="6" bg="gray.100" borderRadius="md" shadow="md">
        <Text fontSize="lg" fontWeight="bold" color="red.500">
          Protected Route
        </Text>
        <Text>You need to sign up or log in to access this page.</Text>
        <Link href="/auth/signup" passHref>
          <Button colorScheme="blue">Sign Up</Button>
        </Link>
      </VStack>
    </Center>
  );
};

export default Unauthenticated;
