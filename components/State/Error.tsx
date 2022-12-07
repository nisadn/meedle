import { Flex, Icon, Text } from "@chakra-ui/react";
import { IoWarningOutline } from 'react-icons/io5';

const Error = () => {
    return (
        <Flex align="center" gap={4}>
            <Icon as={IoWarningOutline} boxSize={6} p={1} bg="red.100" color="red.500" borderRadius="sm" />
            <Text>Something went wrong</Text>
        </Flex>
    );
}

export default Error;