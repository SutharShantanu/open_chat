"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Stack, Text, useToast } from '@chakra-ui/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Loader from '@/app/components/Loader';
import Unauthenticated from '@/app/components/Unauthenticated';

const ProfileSettings = () => {
    const { data: session, status } = useSession();
    console.log(session);
    const [googleConnected, setGoogleConnected] = useState(false);
    const [githubConnected, setGithubConnected] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (status === 'authenticated') {
            setGoogleConnected(session?.user?.google ? true : false);
            setGithubConnected(session?.user?.github ? true : false);
        }
    }, [status, session]);

    const handleRevokeGoogle = () => {
        toast({
            title: 'Google connection revoked.',
            description: 'You have successfully disconnected your Google account.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    const handleRevokeGithub = () => {
        toast({
            title: 'GitHub connection revoked.',
            description: 'You have successfully disconnected your GitHub account.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    if (status === 'loading') {
        return <Loader />;
    }

    if (status === 'unauthenticated') {
        return <Unauthenticated />;
    }

    return (
        <Box p={6} maxWidth="600px" mx="auto" bg="paragraph" borderRadius="lg">
            <Text fontSize="2xl" color="white" mb={4}>
                Profile Settings
            </Text>

            {/* Google Auth */}
            <Stack direction="row" align="center" spacing={4} mb={6}>
                <Checkbox isChecked={googleConnected} readOnly colorScheme="green" />
                <Text color="white">Google Connected</Text>
                {googleConnected && (
                    <Button
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<FaGoogle />}
                        onClick={handleRevokeGoogle}
                        borderColor="danger"
                        color="danger"
                        _hover={{
                            bg: 'danger',
                            color: 'white',
                        }}
                        _active={{
                            bg: 'danger',
                            color: 'white',
                        }}
                        _focus={{
                            borderColor: 'danger',
                            boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.5)',
                        }}
                    >
                        Revoke Connection
                    </Button>
                )}
            </Stack>

            {/* GitHub Auth */}
            <Stack direction="row" align="center" spacing={4} mb={6}>
                <Checkbox isChecked={githubConnected} readOnly colorScheme="green" />
                <Text color="white">GitHub Connected</Text>
                {githubConnected && (
                    <Button
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<FaGithub />}
                        onClick={handleRevokeGithub}
                        borderColor="danger"
                        color="danger"
                        _hover={{
                            bg: 'danger',
                            color: 'white',
                        }}
                        _active={{
                            bg: 'danger',
                            color: 'white',
                        }}
                        _focus={{
                            borderColor: 'danger',
                            boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.5)',
                        }}
                    >
                        Revoke Connection
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default ProfileSettings;
