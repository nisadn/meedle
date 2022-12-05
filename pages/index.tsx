import { Flex, Text } from '@chakra-ui/react';
import { IoMdSearch } from 'react-icons/io';
import { useRouter } from 'next/router';

export default function Home() {

  const router = useRouter();

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && event.target.value && event.target.value !== '') {
        const keyword = event.target.value;
        router.push(`/search/${keyword}`);
    }
}

  return (
    <div className='py-20 px-4 md:px-14' data-testid='content'>
      <Flex w='screen' direction='column' textAlign='center' gap='6' p='14' align='center'>
            <Flex align='center' direction='column' w='full' justify='center' gap={[4,6,6]}>
                <Text as='span'
                    bgGradient='linear(to-r, green.300, blue.500)'
                    bgClip='text'
                    fontSize={['4xl','5xl','7xl']}
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
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-3">
                <IoMdSearch />
            </span>
            <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-full py-2 pl-9 pr-3 shadow-md focus:outline-none focus:border-sky-500 mt-3 focus:ring-sky-500 focus:ring-1 sm:text-sm" 
                placeholder={`Type anything here`} type="text" name="search" 
                onKeyDown={handleKeyDown} 
                />
            </Flex>
        </Flex>
    </div>
  )
}
