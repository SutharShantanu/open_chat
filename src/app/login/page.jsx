"use client";

import React, { useState } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { z } from "zod";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  InputGroup,
  InputRightElement,
  Text,
  Flex,
  IconButton,
  InputLeftElement,
  useToast,
  Spinner,
  Box,
} from "@chakra-ui/react";
import AuthButtons from "@/app/components/AuthButtons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const validateInputs = () => {
    try {
      loginSchema.parse({ email: userEmail, password });
      setErrors({});
      return true;
    } catch (err) {
      setErrors(
        err.errors.reduce(
          (acc, error) => ({ ...acc, [error.path[0]]: error.message }),
          {}
        )
      );
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      toast({
        title: "Failed to login",
        description: "Please check your email and password.",
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: userEmail,
        password,
      });

      if (response.ok) {
        toast({
          title: "Login successful",
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Failed to login",
          description: "Invalid email or password.",
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(`Login error occurred: ${error}`);
      toast({
        title: "An error occurred",
        description: "Unable to login. Please try again later.",
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
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
        maxWidth="lg"
        width="100%"
      >
        <Text fontSize="2xl" mb={4} textAlign="center">
          Login
        </Text>
        <AuthButtons />
        <Box display="flex" alignItems="center" my={4}>
          <Box flex="1" height="1px" bg="gray.300" />
          <Text mx={3} userSelect="none" color="gray.500">
            OR
          </Text>
          <Box flex="1" height="1px" bg="gray.300" />
        </Box>

        <FormControl isInvalid={touched.email && errors.email}>
          <FormLabel>Email address</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" color="gray">
              <MdOutlineAlternateEmail />
            </InputLeftElement>
            <Input
              type="email"
              rounded="sm"
              _focusVisible={{ outline: "none" }}
              placeholder="Email address"
              value={userEmail}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, email: true })}
            />
          </InputGroup>
          {touched.email && errors.email && (
            <Text color="red.500" fontSize="sm" textAlign="right">
              {errors.email}
            </Text>
          )}
          {!errors.email && (
            <FormHelperText fontSize="xs" alignItems="end" textAlign="right">
              We will never share your email.
            </FormHelperText>
          )}
        </FormControl>

        <FormControl isInvalid={touched.password && errors.password}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              rounded="sm"
              _focusVisible={{ outline: "none" }}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => setTouched({ ...touched, password: true })}
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
          {touched.password && errors.password && (
            <Text color="red.500" fontSize="sm" textAlign="right">
              {errors.password}
            </Text>
          )}
        </FormControl>
        <Flex justify="space-between" mt={2}>
          <Box />
          <Text
            fontSize="sm"
            color="blue.500"
            as="a"
            href="/forgot-password"
            _hover={{ textDecoration: "underline" }}
          >
            Forgot Password?
          </Text>
        </Flex>
        <Button
          type="submit"
          size="md"
          width="full"
          rounded="sm"
          color="white"
          bgColor="gray.900"
          _hover={{ bgColor: "gray.700", color: "white" }}
          onClick={handleLogin}
          loadingText="Logging In"
          isLoading={isLoading}
          spinner={<Spinner color="white" size="xs" />}
          mt={4}
        >
          Login
        </Button>
      </Flex>
    </Flex>
  );
};

export default Login;