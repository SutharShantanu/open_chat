import { Flex, Spinner, Text, Box } from '@chakra-ui/react';
import React from 'react';

const Loader = () => {
    return (
        <Flex
            justify="center"
            align="center"
            direction="column"
            textAlign="center"
            sx={{ height: "calc(100vh - 60px)" }}
            >
            <Box mb={4}>
                <Spinner size="xl" color="gray.900" />
            </Box>
            <Text fontSize="4xl" color="gray.900" className='!animate-pulse' >
                Hang on, genius... it's coming.
            </Text>
        </Flex>
    );
};

export default Loader;
