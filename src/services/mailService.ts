import { api } from "@/utils/axios";

export const sendMailRequest = async (organizationId: number, email: string) => {
    const response = await api.post(`/organizations/${organizationId}/invite`, {
        'email': email
    });
    return response.data;
}

export const acceptInvite = async (token: string) => {
    const response = await api.post(`/invitations/${token}/accept`);
    console.log(response);
    return response;
}

