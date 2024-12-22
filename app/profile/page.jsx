"use client";

import {
  Text,
  Card,
  Flex,
  Avatar,
  Box,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/app/components/Loader";
import axios from "axios";

export default function Profile () {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;

  const getProfile = async (prop) => {
    console.log(prop)
    const encodedEmail = encodeURIComponent(user.email);
    try {
const response = await axios.get(`/api/users/profile/${encodedEmail}`);

      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      getProfile(user.email);
    }
  }, [user]);

  if (isLoading) {
    return <Loader />;
  }

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
          <Box position="relative" textAlign="center">
            <Avatar
              width="350px"
              height="auto"
              name={`${userData.firstName} ${userData.lastName}`}
              src={userData.avatar} // Use avatar from fetched data
              boxShadow="sm"
            />
          </Box>

          <Box textAlign={{ base: "center", md: "left" }}>
            <Text fontSize="5xl" fontWeight="medium">
              {`${userData.firstName} ${userData.lastName}`}
            </Text>
            <Text fontSize="2xl">{userData.email}</Text>
          </Box>
        </Flex>
      </Card>

      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={{ base: 0, md: 2 }}>
          Profile Information
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
              <Text fontSize="xl" fontWeight="medium">First Name:</Text>
              <Text>{userData.firstName}</Text>
              <Text fontSize="xl" fontWeight="medium" mt={4}>Last Name:</Text>
              <Text>{userData.lastName}</Text>
              <Text fontSize="xl" fontWeight="medium" mt={4}>Username:</Text>
              <Text>{userData.username}</Text>
              <Text fontSize="xl" fontWeight="medium" mt={4}>Email:</Text>
              <Text>{userData.email}</Text>
              <Text fontSize="xl" fontWeight="medium" mt={4}>Occupation:</Text>
              <Text>{userData.occupation}</Text>
              <Text fontSize="xl" fontWeight="medium" mt={4}>Location:</Text>
              <Text>{userData.location}</Text>
              <Text fontSize="xl" fontWeight="medium" mt={4}>Age:</Text>
              <Text>{userData.age}</Text>
            </Card>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
