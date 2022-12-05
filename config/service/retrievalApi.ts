import { axiosClient } from "../apiClient";

export const retrievalApi = {
    endpointTest: async (keyword: string) => {
        try {
            const res = await axiosClient.get(`/search/${keyword}`);
            return res;
        } catch (error: any) {
            return Promise.reject(error);
        }
    },
    search: async (data: any) => {
        try {
            const res = await axiosClient.post("/search_query", data);
            return res;
        } catch (error: any) {
            return Promise.reject(error);
        }
    },
    getDocs: async (data: any) => {
        try {
            const res = await axiosClient.post("/get_docs", data);
            return res;
        } catch (error: any) {
            return Promise.reject(error);
        }
    }
}