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
  useDisclosure,
  Spinner,
  Icon,
  Select,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { FaUser, FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { SiMaildotru } from "react-icons/si";
import { MdEditSquare, MdMale, MdFemale, MdEdit } from "react-icons/md";
import { FaTransgenderAlt } from "react-icons/fa";
import { BsCalendarDateFill } from "react-icons/bs";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import ExpiredSession from "@/app/components/ExpiredSession";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import ProfileImageModal from "../../components/Modals/ProfileImage";
import { useSession } from "next-auth/react";
import axios from "axios";

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
  gender: z.enum(["Male", "Female", "Trans"]).optional(),
});

const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/(?=.*[0-9])(?=.*[a-zA-Z])/, "Password must contain at least one letter and one number"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/(?=.*[0-9])(?=.*[a-zA-Z])/, "Password must contain at least one letter and one number"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ProfileInputField = ({ id, label, icon, register, error, placeholder, type = "text" }) => (
  <FormControl isInvalid={!!error} alignItems="baseline" gap={2} mb={2} whiteSpace="nowrap">
    <FormLabel
      htmlFor={id}
      display="flex"
      alignItems="center"
      gap={2}
      fontSize="xl"
      fontWeight="medium"
      color="heading"
    >
      <Icon as={icon} boxSize={4} color="paragraph" mr={2} />
      {label}
    </FormLabel>
    <Input
      id={id}
      placeholder={placeholder}
      rounded="sm"
      color="paragraph"
      outline="none"
      _focusVisible={{ outline: "none" }}
      type={type}
      {...register(id)}
    />
    <FormErrorMessage>{error && error.message}</FormErrorMessage>
  </FormControl>
);

const ProfileSelectField = ({ id, label, icon, register, error, options }) => (
  <FormControl isInvalid={!!error} alignItems="baseline" gap={2} mb={2} whiteSpace="nowrap">
    <FormLabel
      htmlFor={id}
      display="flex"
      alignItems="center"
      gap={2}
      fontSize="xl"
      fontWeight="medium"
      color="heading"
    >
      <Icon as={icon} boxSize={4} color="paragraph" mr={2} />
      {label}
    </FormLabel>
    <Select
      id={id}
      rounded="sm"
      color="paragraph"
      _focusVisible={{ outline: "none" }}
      {...register(id)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
    <FormErrorMessage>{error && error.message}</FormErrorMessage>
  </FormControl>
);

export default function EditProfile () {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = session?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    age: user?.age || "",
    profilePicture: user?.profilePicture,
    joinedDate: user?.joinedDate || Date.now(),
    isVerified: user?.isVerified || false,
    verificationToken: user?.verificationToken || "",
    chatHistory: user?.chatHistory || [],
    occupation: user?.occupation || "",
    location: user?.location || "",
    gender: user?.gender || "",
  });

  useEffect(() => {
    if (user) {
      setUserData((prevData) => ({
        ...prevData,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        age: user.age || "",
        profilePicture: user.profilePicture,
        joinedDate: user.joinedDate || Date.now(),
        isVerified: user.isVerified || false,
        verificationToken: user.verificationToken || "",
        chatHistory: user.chatHistory || [],
        occupation: user.occupation || "",
        location: user.location || "",
        gender: user.gender || "",
      }));
    }
  }, [user]);

  const [avatar, setAvatar] = useState(userData.profilePicture);

  const handleImageSave = async (userId, croppedFile) => {
    const formData = new FormData();
    formData.append("profilePicture", croppedFile);

    try {
      const response = await axios.put(`/api/users/edit-profile/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatar(response.data.profilePicture);
      onClose();
    } catch (error) {
      console.error("Error updating profile picture:", error.response?.data || error.message);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmitProfile = async (data) => {
    setIsLoading(true);
    try {
      if (!userId) {
        console.error("User ID not found in session.");
        return;
      }

      const payload = { ...data, id: userId };
      const response = await axios.post(`/api/users/edit-profile`, payload);

      if (response.status === 200) {
        setUserData(response.data.user);
        alert("Profile updated successfully");
      } else {
        console.error("Failed to update profile:", response.data?.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setIsLoading(true);
    try {
      await axios.put(`/api/users/change-password`, data);
      alert("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.email) {
        try {
          const response = await axios.get(`/api/users/profile/${user?.email}`);
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error.message);
        }
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <Box width="full" margin="auto" sx={{ height: "calc(100vh - 60px)" }}>
      <Card
        bgImage="url('https://images.unsplash.com/photo-1602536052359-ef94c21c5948?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        bgSize="cover"
        bgPosition="center"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          justify={{ base: "center", md: "flex-start" }}
          gap={4}
          p={6}
          bgColor="tw-white"
          opacity={0.9}
          borderRadius="md"
        >
          <FormControl width="fit-content">
            <Box position="relative" textAlign="center" >
              <Avatar
                width="150px"
                height="auto"
                name={`${userData.firstName} ${userData.lastName}`}
                src={avatar}
                boxShadow="lg"
                mb={4}
              />
              <IconButton
                size="sm"
                rounded="full"
                onClick={onOpen}
                icon={<MdEdit />}
                bgColor="tw-black"
                color="tw-white"
                border="1px solid transparent"
                _hover={{ bgColor: "tw-white", color: "tw-black", borderColor: "tw-black" }}
                display="flex"
                position="absolute"
                alignItems="center"
                justifyContent="center"
                bottom="0"
                right="0"
              />
            </Box>
          </FormControl>

          <Box textAlign={{ base: "center", md: "left" }}>
            <Text fontSize="5xl" fontWeight="medium" color="heading">
              {`${userData.firstName} ${userData.lastName}`}
            </Text>
            <Text fontSize="2xl" color="paragraph">
              {userData.email}
            </Text>
          </Box>
        </Flex>
      </Card>
      <Flex
        p={8}
        width="full"
        direction={{ base: "column", md: "row" }}
        gap={8}
      >
        <Box flex="1" p={6} bgColor="tw-white" borderRadius="lg" boxShadow="lg">
          <Text fontSize="2xl" fontWeight="bold" mb={6} color="heading">
            Profile Settings
          </Text>
          <form onSubmit={handleSubmit(onSubmitProfile)}>
            <Stack spacing={4}>
              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <ProfileInputField
                  id="firstName"
                  label="First Name"
                  icon={FaUser}
                  register={register}
                  error={errors.firstName}
                  placeholder="Enter your first name"
                />
                <ProfileInputField
                  id="lastName"
                  label="Last Name"
                  icon={FaUser}
                  register={register}
                  error={errors.lastName}
                  placeholder="Enter your last name"
                />
              </Flex>
              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <ProfileInputField
                  id="username"
                  label="Username"
                  icon={FaUser}
                  register={register}
                  error={errors.username}
                  placeholder="Enter your username"
                />
                <ProfileInputField
                  id="email"
                  label="Email"
                  icon={SiMaildotru}
                  register={register}
                  error={errors.email}
                  placeholder="Enter your email"
                />
              </Flex>
              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <ProfileInputField
                  id="occupation"
                  label="Occupation"
                  icon={FaBriefcase}
                  register={register}
                  error={errors.occupation}
                  placeholder="Enter your occupation"
                />
                <ProfileInputField
                  id="location"
                  label="Location"
                  icon={FaLocationArrow}
                  register={register}
                  error={errors.location}
                  placeholder="Enter your location"
                />
              </Flex>
              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <ProfileInputField
                  id="age"
                  label="Age"
                  icon={BsCalendarDateFill}
                  register={register}
                  error={errors.age}
                  placeholder="Enter your age"
                  type="number"
                />
                <ProfileSelectField
                  id="gender"
                  label="Gender"
                  icon={FaTransgenderAlt}
                  register={register}
                  error={errors.gender}
                  options={["Male", "Female", "Trans"]}
                />
              </Flex>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Updating..."
              >
                Update Profile
              </Button>
            </Stack>
          </form>
        </Box>
        <Box flex="1" p={6} bgColor="tw-white" borderRadius="lg" boxShadow="lg">
          <Heading fontSize="2xl" fontWeight="bold" mb={6} color="heading">
            Change Password
          </Heading>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <Stack spacing={4}>
              <ProfileInputField
                id="newPassword"
                label="New Password"
                icon={FaUser}
                register={registerPassword}
                error={passwordErrors.newPassword}
                placeholder="Enter your new password"
                type="password"
              />
              <ProfileInputField
                id="confirmPassword"
                label="Confirm Password"
                icon={FaUser}
                register={registerPassword}
                error={passwordErrors.confirmPassword}
                placeholder="Confirm your new password"
                type="password"
              />
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Updating..."
              >
                Change Password
              </Button>
            </Stack>
          </form>
        </Box>
      </Flex>
      <ProfileImageModal
        isOpen={isOpen}
        onClose={onClose}
        currentImage={avatar}
        onImageSave={handleImageSave}
      />
    </Box>
  );
}
