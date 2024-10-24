"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Text,
  Flex,
  PinInput,
  PinInputField,
  HStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const otpSchema = z
  .string()
  .length(4, { message: "OTP must be exactly 4 digits." });

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const email = useSelector((state) => state.user.userInfo.email);
  const [error, setError] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");

    const result = otpSchema.safeParse(otp);

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/users/verify", {
        email: email,
        otp: otp,
      });

      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "User Verified",
          description: "Redirecting to dashboard",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/dashboard");
      } else {
        setError(data.error || "Something went wrong.");
        toast({
          title: "Error",
          description: data.error || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred while verifying the OTP.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResendTimer(30);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Resending OTP");
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <Box
        w="100%"
        maxW="md"
        bg="white"
        p={6}
        boxShadow="md"
        borderRadius="none"
      >
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="2xl" textAlign="center">
              Enter 4-Digit OTP
            </FormLabel>
            <HStack justify="center" mt={4}>
              <PinInput
                otp
                size="md"
                onComplete={(value) => setOtp(value)}
                isDisabled={isSubmitting}
              >
                <PinInputField
                  _focusVisible={{ outline: "none" }}
                  rounded="none"
                />
                <PinInputField
                  _focusVisible={{ outline: "none" }}
                  rounded="none"
                />
                <PinInputField
                  _focusVisible={{ outline: "none" }}
                  rounded="none"
                />
                <PinInputField
                  _focusVisible={{ outline: "none" }}
                  rounded="none"
                />
              </PinInput>
            </HStack>
            {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          </FormControl>

          <Button
            type="submit"
            size="md"
            width="75%"
            mt={4}
            mx="auto"
            rounded="none"
            bgColor="black"
            color="white"
            _hover={{ bgColor: "gray.800" }}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={otp.length !== 4}
            spinner={<Spinner color="white" size="xs" />}
          >
            Verify OTP
          </Button>

          <Button
            variant="link"
            onClick={handleResendOtp}
            isDisabled={resendTimer > 0} // Disable button when timer is active
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default VerifyEmail;
