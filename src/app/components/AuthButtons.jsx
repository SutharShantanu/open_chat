"use client";

import { Button, HStack, Icon } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function AuthButtons() {
  return (
    <HStack spacing={4} width="100%" justify="center">
      <Button
        leftIcon={<FaGithub/>}
        onClick={() => signIn("github", { callbackUrl: "/" })}
        width="full"
        colorScheme="blackAlpha"
        variant="solid"
        padding={4}
        rounded="none"
        border="1px solid gray.300"
      >
        Continue with GitHub
      </Button>
      <Button
        leftIcon={<FaGoogle />}
        onClick={() => signIn("google", { callbackUrl: "/" })}
        width="full"
        colorScheme="red"
        variant="solid"
        padding={4}
        rounded="none"
        border="1px solid red"
      >
        Continue with Google
      </Button>
    </HStack>
  );
}