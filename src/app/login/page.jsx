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
    email: z.string().email("Invalid email address").nonempty("Email is required"),
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
        if (!validateInputs()) return;

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
                    description: "Check email and password.",
                    status: "error",
                    duration: 2000,
                    position: "top",
                    isClosable: true,
                });
            }
            setIsLoading(false);

        } catch (error) {
            console.log(`login error occured ${error}`)
        }
    };

    return (
        <Flex align="center" justify="center" height="100vh" p={4} bg="gray.100">
            <Flex
                direction="column"
                bg="white"
                p={8}
                rounded="none"
                maxWidth="lg"
                width="100%"
            >
                <Text fontSize="2xl" mb={4} textAlign="center">
                    Login
                </Text>
                <AuthButtons />
                <Box display="flex" alignItems="center" my={4}>
                    <Box flex="1" height="1px" bg="gray.300" />
                    <Text mx={3} userSelect="none" color="gray.500">OR</Text>
                    <Box flex="1" height="1px" bg="gray.300" />
                </Box>

                <FormControl isInvalid={touched.email && errors.email}>
                    <FormLabel>Email address</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <MdOutlineAlternateEmail />
                        </InputLeftElement>
                        <Input
                            type="email"
                            rounded="none"
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
                            rounded="none"
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
                                rounded="none"
                                onClick={handleTogglePassword}
                                icon={showPassword ? <VscEyeClosed /> : <VscEye />}
                                bgColor="black"
                                _hover={{ bgColor: "gray.600" }}
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

                <Button
                    size="md"
                    color="black"
                    bgColor="white"
                    rounded="none"
                    border="1px solid black"
                    _hover={{ bgColor: "black", color: "white" }}
                    onClick={handleLogin}
                    isLoading={isLoading}
                    loadingText="Logging In"
                    isDisabled={userEmail.trim() === "" || password.trim() === ""}
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