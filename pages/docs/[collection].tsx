import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { retrievalApi } from "../../config/service/retrievalApi";
import { BsFillCaretLeftFill } from "react-icons/bs";
import { Error, Loading, NotFound } from "../../components/State";

type Docs = {
    title: string;
    content: string;
}

const Detail = () => {
    const router = useRouter();
    const {
        collection,
        id
    } = router.query;
    const [docs, setDocs] = useState<Docs>({
        title: "",
        content: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);

    const fetchDocs = async (docsCollection: string, docsId: string) => {
        setIsLoading(true);
        let key = `${docsCollection}\\${docsId}`;
        let data = {
            "docs_id": [key],
        }
        retrievalApi.getDocs(data).then((res) => {
            let docsData = res.data;
            if (docsData[key]) {
                setDocs({
                    title: key,
                    content: docsData[key]
                });
                setIsNotFound(false);
            } else {
                setIsNotFound(true);
            }
            setIsError(false);
        }).catch(() => {
            setDocs({
                title: "",
                content: "",
            });
            setIsError(true);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (typeof(collection) === "string" && typeof(id) === "string") {
            fetchDocs(collection, id);
        } else {
            setIsError(true);
        }
    }, [collection, id]);

    return ( 
        <div 
        className='px-8 py-4 mb-16' data-testid='content'
        >
            <Flex gap={6} direction='column'>
                <Flex>
                    <Text as='span'
                        bgGradient='linear(to-r, green.300, blue.500)'
                        bgClip='text'
                        fontSize={['4xl']}
                        fontWeight='bold'
                        w='fit-content'
                        align='center'
                        cursor="pointer"
                        onClick={() => router.push("/")}
                        height="fit-content"
                    > Meedle
                    </Text>
                </Flex>
                <Flex direction="column" w="full" gap={6}>
                    {isLoading ? <Loading /> : 
                        isError ? 
                            <Error />
                        : isNotFound ? 
                            <NotFound text="docs" />
                        : <>
                            <Flex align="center" gap={6}>
                                <Button 
                                    leftIcon={<BsFillCaretLeftFill />}
                                    size="sm"
                                    onClick={() => router.back()}
                                >Back</Button>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="blue.500"
                                >{docs.title}</Text>
                            </Flex>
                            <Text>{docs.content}</Text>
                        </>
                    }
                </Flex>
            </Flex>
        </div>
    );
};

export default Detail;