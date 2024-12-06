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
} from "@chakra-ui/react";
import * as z from "zod";

// Zod schema for OTP validation
const otpSchema = z
  .string()
  .length(4, { message: "OTP must be exactly 4 digits." });

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Timer for resend button
  const [error, setError] = useState(""); // State to hold validation error

  // Handle OTP verification
  const handleSubmit = async () => {
    // Clear previous error
    setError("");

    // Validate OTP using Zod schema
    const result = otpSchema.safeParse(otp);

    if (!result.success) {
      // If validation fails, display the error message
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    // Simulate an API call to verify OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Verifying OTP: ${otp}`);
    setIsSubmitting(false);
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setResendTimer(30); // Reset the timer
    // Simulate an API call to resend OTP
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
                onComplete={(value) => setOtp(value)} // Set OTP after all fields are filled
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
            {/* Display error */}
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
