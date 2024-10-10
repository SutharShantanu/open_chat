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
} from "@chakra-ui/react";

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
            setErrors(err.errors.reduce((acc, error) => ({ ...acc, [error.path[0]]: error.message }), {}));
            return false;
        }
    };

    const handleAdd = () => {
        if (!validateInputs()) return;

        setIsLoading(true);
        setTimeout(() => {
            try {
                toast({
                    title: "User logged in successfully",
                    status: "success",
                    duration: 2000,
                    position: "top",
                    isClosable: true,
                });

                setUserEmail("");
                setPassword("");
                onClose();
            } catch (error) {
                toast({
                    title: "Failed to login",
                    description: "Something went wrong",
                    status: "error",
                    duration: 2000,
                    position: "top",
                    isClosable: true,
                });
            }
            setIsLoading(false);
        }, 2000);
    };

    return (
        <Flex align="center" justify="center" height="100vh" p={4} bg="gray.100">
            <Flex direction="column" bg="white" p={8} rounded="md" shadow="md" maxWidth="md" width="100%">
                <Text fontSize="2xl" mb={4} textAlign="center">Login</Text>

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
                                onBlur={() => handleBlur("email")}
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
                                onBlur={() => handleBlur("password")}
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

                    <Flex justifyContent="flex-end" mt={2}>
                        <Button
                            variant="link"
                            colorScheme="blue"
                            fontSize="sm"
                            onClick={() => toast({ title: "Forgot Password clicked", duration: 2000 })}
                        >
                            Forgot Password?
                        </Button>
                    </Flex>

                    <Button
                        size="sm"
                        color="black"
                        bgColor="white"
                        rounded="none"
                        border="1px solid black"
                        _hover={{ bgColor: "black", color: "white", }}
                        onClick={handleAdd}
                        isLoading={isLoading}
                        loadingText="Logging In"
                        isDisabled={userEmail.trim() === "" || password.trim() === ""}
                        spinner={<Spinner color="white" size="xs" />}
                    >
                        Login
                    </Button>
            </Flex>
        </Flex>
    );
};

export default Login;
