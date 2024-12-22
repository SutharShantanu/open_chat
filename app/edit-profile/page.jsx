"use client";

import {
  Input,
  Button,
  Text,
  Card,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Flex,
  Avatar,
  Stack,
  Box,
  IconButton,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { IoMdCloseCircle } from "react-icons/io";
import { MdEmail, MdPerson, MdLock } from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import defaultProfile from "@/public/Image/defaultProfile.svg"
import ProfileImageModal from "../components/Modals/ProfileImage";
import { useSession } from "next-auth/react";


const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const profileSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(15, "First name can't be longer than 15 characters")
    .transform(capitalizeFirstLetter),
  last_name: z
    .string()
    .max(15, "Last name can't be longer than 15 characters")
    .transform(capitalizeFirstLetter),
  username: z
    .string()
    .min(6, "Username must be at least 6 characters long")
    .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)/, "Username must include at least one symbol and one number"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/(?=.*[0-9])(?=.*[a-zA-Z])/, "Password must contain at least one letter and one number")
    .optional(),
  occupation: z
    .string()
    .max(50, "Occupation can't be longer than 50 characters")
    .optional()
    .transform(capitalizeFirstLetter),
  location: z
    .string()
    .max(50, "Location can't be longer than 50 characters")
    .optional()
    .transform(capitalizeFirstLetter),
  age: z
    .number()
    .min(18, "Age must be 18 or older")
    .max(60, "Age must be 60 or younger")
    .optional(),
});

export default function Profile () {
  const [avatar, setAvatar] = useState(userData.avatar || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { data: session, } = useSession();
  const user = session?.user
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Form submitted", data);
      setIsLoading(false);
    }, 5000)
  };

  const removeImage = () => {
    setAvatar("");
    setSelectedFile(null);
  };

  const getProfile = async (email) => {
    try {
      const response = await axios.get(`/api/users/profile?email=${email}`);
      console.log("User Profile:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
      throw new Error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    getProfile()
  }, [session])

  return (
    <Box width="full">
      <Card
        bgImage="url('https://images.unsplash.com/photo-1602536052359-ef94c21c5948?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        bgSize="cover"
        bgPosition="center"
        p={8}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
          gap={4}
          p={2}
          bgColor="white"
          opacity={0.9}
          borderRadius="sm"
        >
          <FormControl isInvalid={!!errors.avatar} width="fit-content">
            <Box position="relative" textAlign="center">
              <Avatar
                width="350px"
                height="auto"
                name={`${userData.firstName} ${userData.lastName}`}
                src={selectedFile || avatar}
                boxShadow="sm"
              />
              <Button
                rounded="sm"
                shadow="sm"
                size="sm"
                border="none"
                py={1}
                px={2}
                bgColor="gray.900"
                color="white"
                _hover={{
                  bgColor: "gray.700",
                }}
                onClick={onOpen}
                display="flex"
                position="absolute"
                alignItems="center"
                justifyContent="center"
                bottom="12"
                right="8">
                Edit Picture
              </Button>
            </Box>
            <FormErrorMessage>
              {errors.avatar && errors.avatar.message}
            </FormErrorMessage>
          </FormControl>

          <Box textAlign={{ base: "center", md: "left" }}>
            <Text fontSize="5xl" fontWeight="medium">
              {`${userData.firstName} ${userData.lastName}`}
            </Text>
            <Text
              fontSize="2xl"
              placeholder="Email">
              {userData.email}
            </Text>
          </Box>
        </Flex>
      </Card>
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={{ base: 0, md: 2 }}>
          Profile Settings
        </Text>
        <Flex
          gap={8}
          px={6}
          py={8}
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
        >
          <Box width={{ base: "100%", md: "50%" }}>
            <Card borderRadius="sm" p={6}>
              <Stack spacing={4}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack direction={{ base: "column", md: "row" }} gap={4}>
                    <FormControl isInvalid={!!errors.first_name} flex="1">
                      <FormLabel
                        htmlFor="first_name"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdPerson color="gray.500" /> First Name
                      </FormLabel>
                      <Input
                        id="first_name"
                        placeholder="Enter your first name"
                        borderColor="gray.300"
                        rounded="sm"
                        _focusVisible={{ outline: "none" }}
                        {...register("first_name")}
                      />
                      <FormErrorMessage>
                        {errors.first_name && errors.first_name.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.last_name} flex="1">
                      <FormLabel
                        htmlFor="last_name"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdPerson color="gray.500" /> Last Name
                      </FormLabel>
                      <Input
                        id="last_name"
                        placeholder="Enter your last name"
                        borderColor="gray.300"
                        rounded="sm"
                        _focusVisible={{ outline: "none" }}
                        {...register("last_name")}
                      />
                      <FormErrorMessage>
                        {errors.last_name && errors.last_name.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Stack direction={{ base: "column", md: "row" }} gap={4} mt={4}>
                    <FormControl isInvalid={!!errors.username} flex="1">
                      <FormLabel
                        htmlFor="username"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdPerson color="gray.500" /> Username
                      </FormLabel>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        borderColor="gray.300"
                        rounded="sm"
                        _focusVisible={{ outline: "none" }}
                        {...register("username")}
                      />
                      <FormErrorMessage>
                        {errors.username && errors.username.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email} flex="1">
                      <FormLabel
                        htmlFor="email"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdEmail color="gray.500" /> Email
                      </FormLabel>
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        borderColor="gray.300"
                        rounded="sm"
                        _focusVisible={{ outline: "none" }}
                        {...register("email")}
                      />
                      <FormErrorMessage>
                        {errors.email && errors.email.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Stack direction={{ base: "column", md: "row" }} gap={4} mt={4}>
                    <FormControl isInvalid={!!errors.password} flex="1">
                      <FormLabel
                        htmlFor="password"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdLock color="gray.500" /> Password
                      </FormLabel>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        borderColor="gray.300"
                        rounded="sm"
                        _focusVisible={{ outline: "none" }}
                        {...register("password")}
                      />
                      <FormErrorMessage>
                        {errors.password && errors.password.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Stack direction={{ base: "column", md: "row" }} gap={4} mt={4}>
                    <FormControl isInvalid={!!errors.occupation} flex="1">
                      <FormLabel
                        htmlFor="occupation"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdPerson color="gray.500" /> Occupation
                      </FormLabel>
                      <Input
                        id="occupation"
                        placeholder="Enter your occupation"
                        borderColor="gray.300"
                        rounded="sm"
                        _focusVisible={{ outline: "none" }}
                        {...register("occupation")}
                      />
                      <FormErrorMessage>
                        {errors.occupation && errors.occupation.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.location} flex="1">
                      <FormLabel
                        htmlFor="location"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdPerson color="gray.500" /> Location
                      </FormLabel>
                      <Input
                        id="location"
                        placeholder="Enter your location"
                        borderColor="gray.300"
                        rounded="sm"
                        _focusVisible={{ outline: "none" }}
                        {...register("location")}
                      />
                      <FormErrorMessage>
                        {errors.location && errors.location.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Stack direction={{ base: "column", md: "row" }} gap={4} mt={4}>
                    <FormControl isInvalid={!!errors.age} flex="1">
                      <FormLabel
                        htmlFor="age"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdPerson color="gray.500" /> Age
                      </FormLabel>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        borderColor="gray.300"
                        rounded="sm"
                        _focusVisible={{ outline: "none" }}
                        {...register("age")}
                      />
                      <FormErrorMessage>
                        {errors.age && errors.age.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Button
                    mt={6}
                    width="full"
                    colorScheme="teal"
                    isLoading={isLoading}
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </form>
              </Stack>
            </Card>
          </Box>
        </Flex>
      </Box>
      <ProfileImageModal
        isOpen={isOpen}
        onClose={onClose}
        onSelect={setAvatar}
      />
    </Box>
  );
}
