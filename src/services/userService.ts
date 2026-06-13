import { api } from "@/utils/axios";

export const userEditRequest = async (
    userId: number,
    userEmail: string,
    userNickname: string,
    currentPassword: string,
    newPassword?: string,
    newConfirmedPassword?: string,
    profilePicture?: File,
) => {
    const formData = new FormData();
    formData.append('email', userEmail);
    formData.append('nickname', userNickname);
    formData.append('password', currentPassword)
    
    if (newPassword && newConfirmedPassword) {
        formData.append('new_password', newPassword);
        formData.append('new_confirmed_password', newConfirmedPassword);
    }
    if (profilePicture) {
        formData.append('profile_picture', profilePicture)
    }

    formData.append('_method', 'PUT');

    const response = await api.post(`/users/${userId}/edit`, formData);

    const { message } = response.data;
    console.log(message);
    return { message };
};

export const getSelf = async (userId: number) => {
    const response = await api.get(`/users/${userId}/self`);
    return response.data;
}

export const getSpecificUser = async (userId: number) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
}

export const getSpecificUserOrganizations = async () => {
    const response = await api.get(`/userOrganizations`);
    return response.data;
}