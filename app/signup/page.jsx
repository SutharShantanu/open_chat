"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import z from "zod";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Spinner,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/app/store/slices/userSlice";

const SignupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(15, "First name can't be longer than 15 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(15, "Last name can't be longer than 15 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /(?=.*[0-9])(?=.*[a-zA-Z])/,
      "Password must contain at least one letter and one number"
    ),
});

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
  });

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const onSubmit = async (formData) => {
    setIsLoading(true);

    const processedData = {
      ...formData,
      email: formData.email.toLowerCase(),
      firstName: formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1),
      lastName: formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1),
    };

    try {
      const response = await axios.post("/api/users/signup", processedData);
      if (response.status === 201 || response.ok) {
        dispatch(
          setUserInfo({
            firstName: processedData.firstName,
            lastName: processedData.lastName,
            email: processedData.email,
          })
        );
        toast({
          title: "User Account Created",
          description: "Redirecting to verify...",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push(`/verify?email=${encodeURIComponent(processedData.email)}`);

      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong.";

      if (errorMessage.includes("not verified")) {
        toast({
          title: "Account Not Verified",
          description: "Redirecting to login page to verify your account.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        router.push("/login");
      } else {
        toast({
          title: "Signup failed!",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      p={4}
      bg="white"
      sx={{ height: "calc(100vh - 60px)" }}
    >
      <Flex
        direction="column"
        bg="white"
        p={8}
        rounded="sm"
        maxWidth="md"
        width="100%"
        minHeight="614px"
      >
        <Text fontSize="2xl" mb={4} textAlign="center">
          Sign Up
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4} isInvalid={errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your first name"
              rounded="sm"
              {...register("firstName")}
              _focusVisible={{ outline: "none" }}
            />
            {errors.firstName && (
              <Text color="red.500" fontSize="sm">
                {errors.firstName.message}
              </Text>
            )}
          </FormControl>
          <FormControl mb={4} isInvalid={errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your last name"
              rounded="sm"
              {...register("lastName")}
              _focusVisible={{ outline: "none" }}
            />
            {errors.lastName && (
              <Text color="red.500" fontSize="sm">
                {errors.lastName.message}
              </Text>
            )}
          </FormControl>
          <FormControl mb={4} isInvalid={errors.email}>
            <FormLabel>Email address</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray">
                <MdOutlineAlternateEmail />
              </InputLeftElement>
              <Input
                type="email"
                placeholder="Email address"
                rounded="sm"
                {...register("email")}
                _focusVisible={{ outline: "none" }}
              />
            </InputGroup>
            {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email.message}
              </Text>
            )}
          </FormControl>
          <FormControl mb={4} isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                rounded="sm"
                {...register("password")}
                _focusVisible={{ outline: "none" }}
              />
              <InputRightElement>
                <IconButton
                  h="1.75rem"
                  size="sm"
                  rounded="sm"
                  onClick={handleTogglePassword}
                  icon={showPassword ? <VscEyeClosed /> : <VscEye />}
                  bgColor="gray.900"
                  _hover={{ bgColor: "gray.700" }}
                  color="white"
                />
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <Text color="red.500" fontSize="sm">
                {errors.password.message}
              </Text>
            )}
          </FormControl>
          <Button
            type="submit"
            size="md"
            width="full"
            rounded="sm"
            color="white"
            bgColor="gray.900"
            mt={4}
            _hover={
              isValid && !isLoading && { bgColor: "gray.700", color: "white" }
            }
            isLoading={isLoading}
            spinner={<Spinner color="white" size="xs" />}
            isDisabled={!isValid || isLoading}
          >
            {isLoading ? "Signing Up" : "Sign Up"}
          </Button>
          <Text fontSize="xs" mt={2} align={"end"}>
            Already have an account? &nbsp;
            <Text
              fontSize="sm"
              color="blue.500"
              as="a"
              href="/login"
              _hover={{ textDecoration: "underline" }}
            >
              Login
            </Text>
          </Text>
        </form>
      </Flex>
    </Flex>
  );
};

export default SignupPage;
