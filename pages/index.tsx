import { Flex, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import { IoMdSearch } from 'react-icons/io';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {

  const router = useRouter();

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && event.target.value && event.target.value !== '') {
        const keyword = event.target.value;
        router.push(`/search/${keyword}`);
    }
}

  return (
    <div className='py-20 px-2 md:px-14' data-testid='content'>
      <Head>
          <title>Welcome to Meedle!</title>
          <meta name="description" content="Welcome to Meedle! - Your medical search engine." />
      </Head>
      <Flex w='screen' direction='column' textAlign='center' gap='6' py='14' px={['8','14','8']} align='center'>
            <Flex align='center' direction='column' w='full' justify='center' gap={[4,6,6]}>
                <Text as='span'
                    bgGradient='linear(to-r, green.300, blue.500)'
                    bgClip='text'
                    fontSize={['6xl','6xl','7xl']}
                    fontWeight='bold'
                    w='fit-content'
                    align='center'
                > Meedle
                </Text>
                <Text
                  fontSize={'xl'}
                  mt={'-8'}
                  letterSpacing={2}
                >
                  Medical Search Engine
                </Text>
            </Flex>

            <Flex className="relative block w-full md:w-1/2">
              <Flex w='full'>
                    <InputGroup>
                        <Input placeholder='Type anything here' borderRadius="full" shadow="base" onKeyDown={handleKeyDown} />
                        <InputLeftElement children={<IoMdSearch color='blue' />} />
                    </InputGroup>
                </Flex>
            </Flex>
        </Flex>
    </div>
  )
}
