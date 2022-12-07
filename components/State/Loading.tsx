import { Flex, Spinner } from "@chakra-ui/react";

const Loading = () => {
    return (
        <Flex direction="column" align='center' gap={4} mt='10'>
            <Flex>
                <Spinner
                    thickness='6px'
                    speed='0.65s'
                    color='blue.600'
                    size='xl'
                />
            </Flex>
            <Flex>
                Loading...
            </Flex>
        </Flex>
    );
}

export default Loading;