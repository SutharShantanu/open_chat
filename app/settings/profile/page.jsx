"use client";

import {
  Text,
  Card,
  Flex,
  Avatar,
  Box,
  Icon,
  Grid,
  IconButton,
} from "@chakra-ui/react";
import { FaUser, FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { SiMaildotru } from "react-icons/si";
import { MdEditSquare, MdMale, MdFemale } from "react-icons/md";
import { FaTransgenderAlt } from "react-icons/fa";
import { BsCalendarDateFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import ExpiredSession from "@/app/components/ExpiredSession";

export default function Profile () {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const getProfile = async (email) => {
    try {
      const response = await axios.get(`/api/users/profile/${email}`);
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
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <ExpiredSession />;
  }
  return (
    <Box width="full" margin="auto" sx={{ height: "calc(100vh - 60px)" }}>
      <Card
        bgImage="url('https://images.unsplash.com/photo-1602536052359-ef94c21c5948?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        bgSize="cover"
        bgPosition="center"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        mb={8}
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
          <Box position="relative" textAlign="center">
            <Avatar
              width="150px"
              height="auto"
              name={`${userData?.firstName || ''} ${userData?.lastName || ''}`}
              src={userData?.profilePicture || ''}
              boxShadow="lg"
              mb={4}
            />
          </Box>

          <Box textAlign={{ base: "center", md: "left" }}>
            <Text fontSize="3xl" fontWeight="bold" color="heading">
              {`${userData?.firstName || ''} ${userData?.lastName || ''}`}
            </Text>
            <Text fontSize="lg" color="paragraph">
              {userData?.email || ''}
            </Text>
          </Box>
        </Flex>
      </Card>
      <Box p={6}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="heading">
            Profile Information
          </Text>
          <IconButton
            aria-label="Edit Profile"
            rounded="full"
            size="sm"
            onClick={() => router.push('/edit-profile')}
            icon={<MdEditSquare />}
            bgColor="tw-white"
            _hover={{ bgColor: "tw-black", color: "tw-white" }}
          />
        </Flex>
        <Grid templateColumns={{ sm: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={6} bgColor="tw-white" p={6} borderRadius="md" boxShadow="sm">
          <ProfileDetail icon={FaUser} label="First Name" value={userData?.firstName} />
          <ProfileDetail icon={FaUser} label="Last Name" value={userData?.lastName} />
          <ProfileDetail icon={SiMaildotru} label="Username" value={userData?.username} />
          <ProfileDetail icon={FaBriefcase} label="Occupation" value={userData?.occupation} />
          <ProfileDetail icon={FaLocationArrow} label="Location" value={userData?.location} />
          <ProfileDetail icon={userData?.Gender === 'Male' ? MdMale : userData?.Gender === 'Female' ? MdFemale : FaTransgenderAlt} label="Gender" value={userData?.Gender} />
          <ProfileDetail icon={BsCalendarDateFill} label="Age" value={userData?.Age} />
          <ProfileDetail
            icon={FaCalendarAlt}
            label="Joined Date"
            value={userData?.joinedDate
              ? new Date(userData?.joinedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
              : 'N/A'}
          />
        </Grid>
      </Box>
    </Box>
  );
}

const ProfileDetail = ({ icon, label, value }) => {
  return (
    <Flex alignItems="baseline" gap={2} mb={2} whiteSpace="nowrap">
      <Icon as={icon} boxSize={4} color="paragraph" mr={2} />
      <Text fontSize="xl" fontWeight="medium" color="heading">{label}:</Text>
      <Text ml={2} color="paragraph">{value || 'N/A'}</Text>
    </Flex>
  );
};
