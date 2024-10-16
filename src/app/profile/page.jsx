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
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const onSubmit = (data) => {
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
        <Flex alignItems="center" gap={4}>
          {/* <Image
            src={selectedFile || avatar}
            alt="Profile Image"
            rounded="full"
            borderRadius="full"
            boxSize="150px"
            mb={4}
            objectFit="cover"
          /> */}
          <Box position="relative">
            <Avatar
              size="2xl"
              name={`${userData.firstName} ${userData.lastName}`}
              src={avatar}
            />
            <IconButton
              right="0"
              bottom="1"
              position="absolute"
              isRound={true}
              aria-label="edit profile"
              icon={<VscEdit />}
              onClick={openModal}
            />
          </Box>
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

        <Flex gap={8} px={6} py={8}>
          <Box flex="3">
            <Card borderRadius="md" p={6}>
              <Stack spacing={4}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack direction={{ base: "column", md: "row" }} gap={4}>
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

                  <Button
                    colorScheme="red"
                    mt={4}
                    onClick={removeImage}
                    leftIcon={<MdDelete />}
                    isDisabled={!selectedFile}
                  >
                    Remove Image
                  </Button>

                  <Button
                    colorScheme="teal"
                    mt={4}
                    type="submit"
                    width="full"
                    borderRadius="md"
                  >
                    Save Changes
                  </Button>
                </form>
              </Stack>
            </Card>
          </Box>

          {/* Password section - 40% width */}
          <Box flex="2">
            <Card borderRadius="md" p={6} shadow="lg">
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
                  width="full"
                  borderRadius="md"
                  mt={4}
                >
                  Update Password
                </Button>
              </Stack>
            </Card>
          </Box>
        </Flex>
      </Box>
      <ProfileImageModal isOpen={isOpen} closeModal={closeModal} />
    </Box>
  );
}
