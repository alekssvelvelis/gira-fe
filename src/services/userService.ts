import { api } from "@/utils/axios";

export const getSpecificUser = async (userId: number) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
}

export const getSpecificUserOrganizations = async () => {
    const response = await api.get(`/userOrganizations`);
    return response.data;
}