"use client";

import {
  Input,
  Button,
  Text,
  Card,
  Container,
  Stack,
  FormLabel,
  Image,
  InputGroup,
  InputRightElement,
  FormControl,
  FormErrorMessage,
  Flex,
  VStack,
  Box,
} from "@chakra-ui/react";
import {
  MdEmail,
  MdPerson,
  MdLock,
  MdCake,
  MdMale,
  MdFemale,
  MdDelete,
} from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// Validation schema using Zod
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z
    .number()
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be less than 120"),
  gender: z.string().min(1, "Gender is required"),
});

export default function Profile() {
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150"); // Placeholder avatar
  const [selectedFile, setSelectedFile] = useState(null);

  const session = {
    user: {
      email: "",
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      avatarUrl: avatar,
    },
  };

  const userData = session?.user || {
    email: "example@example.com",
    firstName: "John",
    lastName: "Doe",
    age: 25,
    gender: "Male",
    avatarUrl: avatar,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const onSubmit = (data) => {
    // Handle form submission (e.g., save changes)
    console.log("Form submitted", data);
    // Add logic to handle avatar upload if needed
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setAvatar(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setAvatar("https://via.placeholder.com/150"); // Reset to placeholder
    setSelectedFile(null);
  };

  return (
    <Box width="full" mt={8}>
      <Card
        bgImage="url('https://images.unsplash.com/photo-1602536052359-ef94c21c5948?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        bgSize="cover"
        bgPosition="center"
        p={8}
      >
        <Flex alignItems="center" gap={4}>
          <Image
            src={selectedFile || avatar}
            alt="Profile Image"
            rounded="full"
            borderRadius="full"
            boxSize="150px"
            mb={4}
            objectFit="cover"
          />
          <FormControl>
            <FormLabel htmlFor="avatar">
              <MdPerson /> Profile Image
            </FormLabel>
            <Input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
              borderColor="gray.300"
            />
          </FormControl>
          <Text fontSize="lg" fontWeight="medium">
            {`${userData.firstName} ${userData.lastName}`}
          </Text>
          <Box>
            <MdEmail /> Email
            <Text placeholder="Email" borderColor="gray.300" bg="gray.50">
              {userData.email}
            </Text>
          </Box>
        </Flex>
      </Card>
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Profile Settings
        </Text>
        <Flex
          width="full"
          justifyContent="space-between"
          paddingX={6}
          paddingY={8}
        >
          <VStack width="100vw">
            <Card borderRadius="md" p={6}>
              <Stack spacing={4} align="center">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    width="full"
                    gap={4}
                  >
                    <FormControl isInvalid={!!errors.firstName} flex="1">
                      <FormLabel htmlFor="firstName">
                        <MdPerson /> First Name
                      </FormLabel>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        borderColor="gray.300"
                        {...register("firstName")}
                      />
                      <FormErrorMessage>
                        {errors.firstName && errors.firstName.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName} flex="1">
                      <FormLabel htmlFor="lastName">
                        <MdPerson /> Last Name
                      </FormLabel>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        borderColor="gray.300"
                        {...register("lastName")}
                      />
                      <FormErrorMessage>
                        {errors.lastName && errors.lastName.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.age} flex="1">
                      <FormLabel htmlFor="age">
                        <MdCake /> Age
                      </FormLabel>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        borderColor="gray.300"
                        {...register("age")}
                      />
                      <FormErrorMessage>
                        {errors.age && errors.age.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.gender} flex="1">
                      <FormLabel htmlFor="gender">
                        {userData.gender === "Male" ? <MdMale /> : <MdFemale />}{" "}
                        Gender
                      </FormLabel>
                      <Input
                        id="gender"
                        placeholder="Enter your gender"
                        borderColor="gray.300"
                        {...register("gender")}
                      />
                      <FormErrorMessage>
                        {errors.gender && errors.gender.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>

                  {/* Image Upload Section */}

                  <Button
                    colorScheme="red"
                    className="w-full mt-2"
                    onClick={removeImage}
                    leftIcon={<MdDelete />}
                    isDisabled={!selectedFile}
                  >
                    Remove Image
                  </Button>

                  <Button
                    colorScheme="teal"
                    className="w-full"
                    borderRadius="md"
                    mt={4}
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </form>
              </Stack>
            </Card>
            <VStack>
              <Card
                shadow="lg"
                borderRadius="md"
                className="p-6 w-full md:w-1/2 lg:w-1/3 mt-8"
              >
                <Stack spacing={4}>
                  <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    Change Password
                  </Text>
                  <FormControl>
                    <FormLabel htmlFor="newPassword">
                      <MdLock /> New Password
                    </FormLabel>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      borderColor="gray.300"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="confirmPassword">
                      <MdLock /> Confirm Password
                    </FormLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      borderColor="gray.300"
                    />
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    className="w-full"
                    borderRadius="md"
                  >
                    Update Password
                  </Button>
                </Stack>
              </Card>
            </VStack>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}
