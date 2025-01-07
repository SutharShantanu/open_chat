"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

const ServerError = () => {
    const router = useRouter();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ height: "calc(100vh - 60px)" }}
            bg="background"
            p={4}
        >
            <Heading as="h1" size="2xl" color="danger" fontFamily="heading" mb={4}>
                500 - Server Error
            </Heading>
            <Text fontSize="2xl" color="paragraph" mt={4}>
                Yikes! Something went terribly wrong on our end.
            </Text>
            <Text fontSize="lg" color="paragraph" mt={4}>
                Our team of highly trained hamsters is working hard to fix this.
                In the meantime, try refreshing the page or come back later.
                We promise we didn’t break it on purpose... probably.
            </Text>
            <Button
                onClick={() => router.push('/')}
                mt={6}
                px={4}
                py={2}
                color="tw-white"
                bgColor="tw-black"
                rounded="sm"
                border="2px solid transparent"
                _hover={{ bgColor: "tw-white", color: "tw-black", borderColor: "tw-black" }}
            >
                Go to Homepage
            </Button>
        </Box>
    );
};

export default ServerError;
