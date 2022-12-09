import { Box, Button, Flex, IconButton, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { retrievalApi } from '../../config/service/retrievalApi';
import Head from 'next/head';
import { Loading, NotFound } from '../../components/State';

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
  const [currentPage, setCurrentPage] = useState<number>(typeof(page) === "string" ? parseInt(page) : 1);
  const [retrieved, setRetrieved] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());

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

  const goToDetailDocs = (title: string) => {
    let split = title.split("\\");
    router.push(`/docs/${split[0]}?id=${split[1]}`);
  }

  const fetchData = async () => {
    let data = {
        "query": keyword,
    }
    setStart(new Date());
    retrievalApi.search(data).then((res) => {
        let docs = res.data.docs_id 
        if (docs) {
            setDocsId(docs);
            setCurrentDocsId(docs.slice((currentPage-1)*10, currentPage*10))
            let len_res = res.data.retrieved;
            setRetrieved(len_res);
            setTotalPages(Math.ceil(len_res/10));
        } else {
            setDocsId([]);
            setCurrentDocsId([]);
            setRetrieved(0);
            setTotalPages(0);
        }
    }).catch(() => {
        setDocsId([]);
        setCurrentDocsId([]);
        setRetrieved(0);
        setTotalPages(0);
    });
  }

  const fetchDocs = async () => {
    let data = {
        "docs_id": currentDocsId,
        "truncate": true,
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
        setCurrentDocs([]);
    }).finally(() => {
        setEnd(new Date());
        setIsLoading(false);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [keyword]);

  useEffect(() => {
    setIsLoading(true);
    setStart(new Date());
    fetchDocs();
  }, [currentDocsId]);

  useEffect(() => {
    setTotalSeconds((end.getTime() - start.getTime()) / 1000)
}, [end]);

  return (
    <div 
        className='px-8 py-4 mb-16' data-testid='content'
    >
        <Head>
            <title>Search result for {keyword}</title>
            <meta name="description" content={`${keyword}`} />
        </Head>
        <Flex gap={[0,6,6]} direction={['column', 'row', 'row']}>
            <Flex justify="center">
                <Text as='span'
                    bgGradient='linear(to-r, green.300, blue.500)'
                    bgClip='text'
                    fontSize={['4xl']}
                    fontWeight='bold'
                    w='fit-content'
                    align='center'
                    mt={1}
                    cursor="pointer"
                    onClick={() => router.push("/")}
                    height="fit-content"
                > Meedle
                </Text>
            </Flex>
            <Flex direction="column" w={["full","full","60%"]} mt={3} gap={6}>
                <Flex w={['full','full','90%']}>
                    <InputGroup>
                        <Input placeholder='Type anything here' defaultValue={keyword} shadow="base" borderRadius="full" onKeyDown={handleKeyDown} />
                        <InputRightElement children={<IoMdSearch color='blue' />} />
                    </InputGroup>
                </Flex>
                {isLoading ? <Loading /> : 
                    <Flex direction="column" w="full" gap={6}>
                        <Text
                            color="gray.500"
                            fontSize="sm"
                        >About {retrieved} results ({totalSeconds} seconds)</Text>
                        {currentDocs && currentDocs?.length > 0 ? currentDocs?.map((docs, idx) => (
                            <Flex key={idx} direction="column">
                                <Text
                                    fontSize="xl"
                                    color="blue.500"
                                    mb={2}
                                    onClick={() => goToDetailDocs(docs.title)}
                                    cursor="pointer"
                                    _hover={{
                                        textDecoration: "underline",
                                    }}
                                >{docs.title}</Text>
                                <Text>{docs.content}</Text>
                            </Flex>
                        )) : <NotFound text='results' />
                        }
                        <Flex>
                            {currentPage !== 1 && 
                                <IconButton
                                    variant='outline'
                                    colorScheme='green'
                                    aria-label='Previous'
                                    mr={2}
                                    size="sm"
                                    icon={<BsFillCaretLeftFill />}
                                    onClick={() => handleChangePage(currentPage-1)}
                                />
                            }
                        <Box gap={2} textAlign="center">
                            {totalPages > 1 && Array(totalPages).fill(undefined).map((_, i) => (
                                <Button
                                    key={i} 
                                    bg={i+1 === currentPage ? 'green.200' : 'none'}
                                    mr='2' mb='2'
                                    color="green.600"
                                    borderRadius="sm"
                                    _hover={i+1 !== currentPage ? {
                                        bg: "green.500",
                                        color: "green.100",
                                        transition: ".3s ease-in-out"
                                    } : {}}
                                    size="sm"
                                    rounded="md"
                                    textAlign="center"
                                    cursor={i+1 !== currentPage ? "pointer" : "default"}
                                    onClick={() => i+1 !== currentPage && handleChangePage(i+1)}
                                >{i+1}</Button>
                            ))}
                        </Box>
                            {currentPage !== totalPages && totalPages !== 0 && 
                                <IconButton
                                    variant='outline'
                                    colorScheme='green'
                                    aria-label='Next'
                                    mr={2}
                                    size="sm"
                                    icon={<BsFillCaretRightFill />}
                                    onClick={() => handleChangePage(currentPage+1)}
                                />
                            }
                        </Flex>
                    </Flex>
                }
            </Flex>
        </Flex>
    </div>
  )
}

export default Search;