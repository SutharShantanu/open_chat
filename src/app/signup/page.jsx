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
  FormHelperText,
  useToast,
} from "@chakra-ui/react";

const SignupSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(15, "Maximum length is 15 characters"),
  lastName: z.string().min(1, "Last name is required").max(15, "Maximum length is 15 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
});

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const handleTogglePassword = () => setShowPassword(!showPassword);

  // Handle form submission
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/signup", formData);
      if (response.status === 201) {
        toast.success("Signup successful! Redirecting to login...");
        router.push("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh" p={4} bg="gray.100">
      <Flex direction="column" bg="white" p={8} rounded="md" shadow="md" maxWidth="md" width="100%">
        <Text fontSize="2xl" mb={4} textAlign="center">Sign Up</Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First Name */}
          <FormControl mb={4} isInvalid={errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your first name"
              rounded="none"
              {...register("firstName")}
              _focusVisible={{ outline: "none" }}
            />
            {errors.firstName && <Text color="red.500" fontSize="sm">{errors.firstName.message}</Text>}
          </FormControl>

          {/* Last Name */}
          <FormControl mb={4} isInvalid={errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your last name"
              rounded="none"
              {...register("lastName")}
              _focusVisible={{ outline: "none" }}
            />
            {errors.lastName && <Text color="red.500" fontSize="sm">{errors.lastName.message}</Text>}
          </FormControl>

          {/* Email */}
          <FormControl mb={4} isInvalid={errors.email}>
            <FormLabel>Email address</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <MdOutlineAlternateEmail />
              </InputLeftElement>
              <Input
                type="email"
                placeholder="Email address"
                rounded="none"
                {...register("email")}
                _focusVisible={{ outline: "none" }}
              />
            </InputGroup>
            {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
          </FormControl>

          {/* Password */}
          <FormControl mb={4} isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                rounded="none"
                {...register("password")}
                _focusVisible={{ outline: "none" }}
              />
              <InputRightElement>
                <IconButton
                  h="1.75rem"
                  size="sm"
                  rounded="none"
                  onClick={handleTogglePassword}
                  icon={showPassword ? <VscEyeClosed /> : <VscEye />}
                  bgColor="black"
                  _hover={{ bgColor: "gray.600" }}
                  color="white"
                />
              </InputRightElement>
            </InputGroup>
            {errors.password && <Text color="red.500" fontSize="sm">{errors.password.message}</Text>}
          </FormControl>

          <Button
            type="submit"
            size="sm"
            width="full"
            mt={4}
            rounded="none"
            bgColor="black"
            color="white"
            _hover={{ bgColor: "gray.800" }}
            isLoading={loading}
            spinner={<Spinner color="white" size="xs" />}
          >
            Sign Up
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export default SignupPage;
