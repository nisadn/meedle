import { Flex, Icon, Text } from "@chakra-ui/react";
import { IoMdSearch } from 'react-icons/io';

const NotFound = ({text}: {text: string}) => {
    return (
        <Flex align="center" gap={4}>
            <Icon as={IoMdSearch} boxSize={6} p={1} bg="blue.100" color="blue.500" borderRadius="sm" />
            <Text>No {text} found</Text>
        </Flex>
    );
}

export default NotFound;