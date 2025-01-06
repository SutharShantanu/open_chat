"use client";

import { Button, HStack, Icon } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function AuthButtons() {
  return (
    <HStack spacing={4} width="100%" justify="center">
      <Button
        leftIcon={<FaGithub />}
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        width="full"
        bgColor="tw-black"
        color="tw-white"
        variant="solid"
        padding={4}
        rounded="sm"
        _hover={{ bgColor: "tw-white", color: "tw-black" }}
      >
        Continue with GitHub
      </Button>
      <Button
        leftIcon={<FaGoogle />}
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        width="full"
        bgColor="danger"
        color="tw-white"
        variant="solid"
        padding={4}
        rounded="sm"
        _hover={{ bgColor: "tw-white", color: "danger" }}
      >
        Continue with Google
      </Button>
    </HStack>
  );
}