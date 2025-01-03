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
  Highlight,
} from "@chakra-ui/react";
import * as z from "zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const otpSchema = z
  .string()
  .length(4, { message: "OTP must be exactly 4 digits." });

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const toast = useToast();
  const router = useRouter();
  const [resendTimer, setResendTimer] = useState(30);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const paramEmail = searchParams.get("email");
    if (paramEmail) {
      setEmail(decodeURIComponent(paramEmail));
    }
  }, [searchParams]);

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

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "User Verified",
          description: "Redirecting to dashboard",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err)
      const errorMessage = err.response?.data?.error || "An error occurred while verifying the OTP.";
      setError(errorMessage);
      toast({
        title: "Verification failed!",
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
    try {
      const response = await axios.post("/api/users/resendOtp", { email: email });

      if (response.status === 200) {
        toast({
          title: "OTP Resent",
          description: "Check your email for the new OTP.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Something went wrong while resending OTP.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred while resending the OTP.";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
      >
        <VStack spacing={4} align="stretch">
          <Text fontSize={{ base: "xl", md: "2xl" }} textAlign="center" color="gray.900">
            Please Check Your Email
          </Text>
          <FormControl>
            <FormLabel
              fontSize="xs"
              textAlign="center"
              color="gray.600"
              fontWeight={400}
              lineHeight={1.2}
              marginX="auto"
            >
              We've sent a 4-digit OTP to{" "}
              <Highlight query={email} styles={{ bg: "gray.800", color: "white", fontFamily: "Raleway", px: 2, py: 1, rounded: "md", fontSize: "sm", letterSpacing: "wider" }}>
                {email}
              </Highlight>
            </FormLabel>
            <HStack maxWidth="85%" justify="center" marginX="auto" justifyContent="space-around" mt={4}>
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
            {error && <Text color="red.500">{error}</Text>}{" "}
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
          <Text fontSize="sm" textAlign="center" color="gray.600">
            Didn't receive an email? &nbsp;
            <Button size="sm" variant="link" onClick={handleResendOtp} isDisabled={resendTimer > 0} color="gray.900">
              {resendTimer > 0 ? `try again in ${resendTimer}s` : "Resend"}
            </Button>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default VerifyEmail;
