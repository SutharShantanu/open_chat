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
  RadioGroup,
  Radio,
  HStack,
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
import { useSession } from "next-auth/react";
import { VscEdit } from "react-icons/vsc";
import ProfileImageModal from "../components/Modals/ProfileImage";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z
    .number()
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be less than 120"),
  gender: z.string().min(1, "Gender is required"),
});

const userData = {
  firstName: "John",
  lastName: "Doe",
  age: 25,
  gender: "Male",
  email: "john.doe@example.com",
  avatar:
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1728986004~exp=1728989604~hmac=4c5bb8c8d9793d04026cc7a1fda5a540f05c3688152f10938296a3eef812fe02&w=740",
};

export default function Profile() {
  const [avatar, setAvatar] = useState(userData.avatar || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const onSubmit = (data) => {
    // setIsLoading={true}
    console.log("Form submitted", data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setAvatar(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setAvatar("");
    setSelectedFile(null);
  };

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
          borderRadius="md"
        >
          <Box position="relative" textAlign="center">
            <Avatar
              size="2xl"
              name={`${userData.firstName} ${userData.lastName}`}
              src={avatar}
            />
            <IconButton
              right="1"
              bottom="1"
              position="absolute"
              isRound
              p={1}
              aria-label="edit profile"
              icon={<VscEdit />}
              onClick={onOpen}
            />
          </Box>
          <FormControl>
            <FormLabel
              htmlFor="avatar"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <MdPerson style={{ opacity: 0.6 }} /> Profile Image
            </FormLabel>
            <Input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
              borderColor="gray.300"
              rounded="none"
              _focusVisible={{ outline: "none" }}
            />
          </FormControl>
          <Box textAlign={{ base: "center", md: "left" }}>
            <Text fontSize="lg" fontWeight="medium">
              {`${userData.firstName} ${userData.lastName}`}
            </Text>
            <Box mt={2}>
              <Text display="flex" alignItems="center" gap={2}>
                <MdEmail style={{ opacity: 0.6 }} /> Email
              </Text>
              <Text
                placeholder="Email"
                borderColor="gray.300"
                bg="gray.50"
                p={1}
                borderRadius="md"
              >
                {userData.email}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Card>
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={{ base: 0, md: 6 }}>
          Profile Settings
        </Text>

        <Flex
          gap={8}
          px={6}
          py={8}
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
        >
          <Box flex="3" width={{ base: "100%", md: "50%" }}>
            <Card borderRadius="md" p={6}>
              <Stack spacing={4}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack direction={{ base: "column", md: "row" }} gap={4}>
                    <FormControl isInvalid={!!errors.firstName} flex="1">
                      <FormLabel
                        htmlFor="firstName"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdPerson color="gray.500" /> First Name
                      </FormLabel>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        borderColor="gray.300"
                        rounded="none"
                        _focusVisible={{ outline: "none" }}
                        {...register("firstName")}
                      />
                      <FormErrorMessage>
                        {errors.firstName && errors.firstName.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName} flex="1">
                      <FormLabel
                        htmlFor="lastName"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdPerson color="gray.500" /> Last Name
                      </FormLabel>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        borderColor="gray.300"
                        rounded="none"
                        _focusVisible={{ outline: "none" }}
                        {...register("lastName")}
                      />
                      <FormErrorMessage>
                        {errors.lastName && errors.lastName.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.age} flex="1">
                      <FormLabel
                        htmlFor="age"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="normal"
                        color="gray.600"
                      >
                        <MdCake color="gray.500" /> Age
                      </FormLabel>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        borderColor="gray.300"
                        rounded="none"
                        _focusVisible={{ outline: "none" }}
                        {...register("age")}
                      />
                      <FormErrorMessage>
                        {errors.age && errors.age.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.gender} flex="1">
                      <FormLabel htmlFor="gender">Gender</FormLabel>
                      <RadioGroup id="gender" {...register("gender")}>
                        <HStack spacing={4}>
                          <Radio
                            value="Male"
                            display="flex"
                            alignItems="center"
                          >
                            <MdMale
                              style={{ marginRight: "8px", fontSize: "1.5rem" }}
                            />
                            Male
                          </Radio>
                          <Radio
                            value="Female"
                            display="flex"
                            alignItems="center"
                          >
                            <MdFemale
                              style={{ marginRight: "8px", fontSize: "1.5rem" }}
                            />
                            Female
                          </Radio>
                        </HStack>
                      </RadioGroup>
                      <FormErrorMessage>
                        {errors.gender && errors.gender.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>

                  <Button
                    size="md"
                    color="white"
                    bgColor="red.300"
                    rounded="none"
                    border="1px solid red.300"
                    _hover={{ bgColor: "red.500", color: "white" }}
                    isLoading={isLoading}
                    loadingText="Removing"
                    spinner={<Spinner color="white" size="xs" />}
                    mt={4}
                    onClick={removeImage}
                    leftIcon={<MdDelete />}
                    isDisabled={!selectedFile}
                  >
                    Remove Image
                  </Button>

                  <Button
                    size="md"
                    color="white"
                    bgColor="black"
                    rounded="none"
                    border="1px solid black"
                    _hover={{ bgColor: "black", color: "white" }}
                    isLoading={isLoading}
                    loadingText="Saving"
                    spinner={<Spinner color="white" size="xs" />}
                    mt={4}
                    type="submit"
                    width="full"
                  >
                    Save Changes
                  </Button>
                </form>
              </Stack>
            </Card>
          </Box>

          <Box flex="2" width={{ base: "100%", md: "50%" }}>
            <Card borderRadius="md" p={6} shadow="lg">
              <Stack spacing={4}>
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                  Change Password
                </Text>
                <Flex direction="column" gap={4}>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password">
                      <MdLock style={{ opacity: 0.6 }} /> New Password
                    </FormLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your new password"
                      borderColor="gray.300"
                      rounded="none"
                      _focusVisible={{ outline: "none" }}
                    />
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    mt={4}
                    width="full"
                    borderRadius="md"
                  >
                    Change Password
                  </Button>
                </Flex>
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
