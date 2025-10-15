import { User } from "@/types/slices/randomType"
import { API } from "./configs/axiosConfigs"
import { ApiResponse } from "@/types/common/api"

export const UserAPI = {
    get: async (results?: number): Promise<ApiResponse<User[]>> => {
        const { data } = await API.get('/', { params: { results } })
        return data
    }
}