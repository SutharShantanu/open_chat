import React, { useState, useEffect } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { z } from "zod";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Divider,
    Spinner,
    useColorModeValue,
    useToast,
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
} from "@chakra-ui/react";

const loginSchema = z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .nonempty("Password is required"),
});

const LoginUser = ({ isOpen, onClose }) => {
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    const toast = useToast();

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };
    useEffect(()=>{
// work is pending here - error isn't displaying as soon you start typing
    },[touched])

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
        <Modal
            isCentered
            size={{ base: "xs", md: "sm" }}
            height="40vh"
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior="inside"
            motionPreset="slideInBottom"
        >
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent rounded="none">
                <ModalHeader>Login</ModalHeader>
                <ModalCloseButton size="sm" color="white" bgColor="black" rounded="full" border="1px solid black" shadow="sm" _hover={{ bgColor: "white", color: "black" }} />
                <Divider />
                <ModalBody>
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
                </ModalBody>
                <Divider />
                <ModalFooter display="flex" justifyContent="flex-end">
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
                        mr={3}
                    >
                        Login
                    </Button>
                    <Button
                        size="sm"
                        bgColor="black"
                        color="white"
                        rounded="none"
                        border="1px solid transparent"
                        onClick={onClose}
                        shadow="sm"
                        _hover={{ bgColor: "white", color: "black", borderColor: "black" }}
                        isDisabled={isLoading}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LoginUser;
