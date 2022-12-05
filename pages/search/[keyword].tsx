import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { useRouter } from 'next/router';
import { retrievalApi } from '../../config/service/retrievalApi';

type Docs = {
    title: string;
    content: string;
}

const Search = () => {
  const router = useRouter();
  const keyword = router.query.keyword;
  const page = router.query.page ?? 1;
  const [docsId, setDocsId] = useState<Array<string>>();
  const [currentDocsId, setCurrentDocsId] = useState<Array<string>>();
  const [currentDocs, setCurrentDocs] = useState<Array<Docs>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [retrieved, setRetrieved] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && event.target.value && event.target.value !== '') {
        const keyw = event.target.value;
        router.replace(`/search/${keyw}`);
        setCurrentPage(1);
    }
  }

  const handleChangePage = (pg: number) => {
    router.replace(`/search/${keyword}?page=${pg}`);
    setCurrentPage(pg);
    setCurrentDocsId(docsId?.slice((pg-1)*10, pg*10));
  }

  const fetchData = async () => {
    let data = {
        "query": keyword,
    }
    retrievalApi.search(data).then((res) => {
        let docs = res.data.docs_id 
        setDocsId(docs);
        setCurrentDocsId(docs.slice((currentPage-1)*10, currentPage*10))
        let len_res = res.data.retrieved;
        setRetrieved(len_res);
        setTotalPages(Math.ceil(len_res/10));
    }).catch(() => {
        setDocsId([]);
        setCurrentDocsId([]);
        setCurrentDocs([]);
        setCurrentPage(1);
        setRetrieved(0);
        setTotalPages(0);
    });
  }

  const fetchDocs = async () => {
    let data = {
        "docs_id": currentDocsId
    }
    retrievalApi.getDocs(data).then((res) => {
        let docsData = res.data;
        let docs: Docs[] = [];
        currentDocsId?.map((doc: string) => {
            docs.push({
                title: doc,
                content: docsData[doc],
            })
        })
        setCurrentDocs(docs);
    }).catch(() => {
        setDocsId([]);
        setCurrentDocsId([]);
        setCurrentDocs([]);
        setCurrentPage(1);
        setRetrieved(0);
        setTotalPages(0);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    const start = new Date();
    fetchData();
    const end = new Date();
    const seconds = (end.getTime() - start.getTime()) / 1000
    setTotalSeconds(seconds);
    setIsLoading(false);
  }, [keyword]);

  useEffect(() => {
    setIsLoading(true);
    fetchDocs();
    setIsLoading(false);
  }, [currentDocsId]);

  return (
    <div 
        className='px-8 py-4 mb-16' data-testid='content'
    >
        <Flex gap={6}>
            <Flex>
                <Text as='span'
                    bgGradient='linear(to-r, green.300, blue.500)'
                    bgClip='text'
                    fontSize={['4xl']}
                    fontWeight='bold'
                    w='fit-content'
                    align='center'
                    mt={2}
                    cursor="pointer"
                    onClick={() => router.push("/")}
                    height="fit-content"
                > Meedle
                </Text>
            </Flex>
            <Flex direction="column" w="full" mt={3} gap={6}>
                <Flex w="full" >
                    <Flex className="relative block w-full md:w-1/2">
                        <span className="sr-only">Search</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 mt-2">
                            <IoMdSearch />
                        </span>
                        <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-full py-2 pl-4 pr-3 shadow-md focus:outline-none focus:border-sky-500 mt-2 focus:ring-sky-500 focus:ring-1 sm:text-sm" 
                            placeholder={`Type anything here`} type="text" name="search" defaultValue={keyword}
                            onKeyDown={handleKeyDown} 
                            />
                    </Flex>
                </Flex>
                {isLoading ? <Flex>Loading...</Flex> : 
                    <Flex direction="column" w="full" gap={6}>
                        <Text
                            color="gray.500"
                            fontSize="sm"
                        >Retrieved {retrieved} results ({totalSeconds} seconds)</Text>
                        {currentDocs && currentDocs?.length > 0 ? currentDocs?.map((docs, idx) => (
                            <Flex key={idx} direction="column">
                                <Text
                                    fontSize="xl"
                                    color="blue.500"
                                    mb={2}
                                >{docs.title}</Text>
                                <Text>{docs.content}</Text>
                            </Flex>
                        )) : <Flex align="center" gap={4}>
                                    <Icon as={IoMdSearch} boxSize={6} bg="blue.100" color="blue.500" borderRadius="sm" />
                                <Text>No results found</Text>
                            </Flex>
                        }
                        <Flex gap={2} mt={6} justify='center' align="center">
                            {currentPage !== 1 && <Box
                                cursor="pointer"
                                _hover={{
                                    color: "green.500",
                                    textDecoration: "underline",
                                    transition: ".3s ease-in-out",
                                }}
                                onClick={() => handleChangePage(currentPage-1)}
                                fontSize="sm"
                                mr={4}
                            >
                                Previous
                            </Box>}
                            {totalPages > 1 && Array(totalPages).fill(undefined).map((_, i) => (
                                <Box 
                                    key={i} 
                                    bg={i+1 === currentPage ? 'green.200' : 'none'}
                                    color="green.600"
                                    borderRadius="sm"
                                    _hover={i+1 !== currentPage ? {
                                        bg: "green.500",
                                        color: "green.100",
                                        transition: ".3s ease-in-out"
                                    } : {}}
                                    w={6}
                                    h={6}
                                    textAlign="center"
                                    cursor={i+1 !== currentPage ? "pointer" : "default"}
                                    onClick={() => i+1 !== currentPage && handleChangePage(i+1)}
                                >{i+1}</Box>
                            ))}
                            {currentPage !== totalPages && totalPages !== 0 && <Box
                                cursor="pointer"
                                _hover={{
                                    color: "green.500",
                                    textDecoration: "underline",
                                    transition: ".3s ease-in-out",
                                }}
                                onClick={() => handleChangePage(currentPage+1)}
                                fontSize="sm"
                                ml={4}
                            >
                                Next
                            </Box>}
                        </Flex>
                    </Flex>
                }
            </Flex>
        </Flex>
    </div>
  )
}

export default Search;