import { api } from "@/utils/axios";

export const organizationCreateRequest = async (
    organizationName: string, 
    organizationIdentifier: string, 
    organizationDescription: string, 
    organizationImage: string
    ) => {

    const formData = new FormData();
    formData.append('organization_name', organizationName);
    formData.append('organization_identifier', organizationIdentifier);
    formData.append('organization_description', organizationDescription);

    const blob = await fetch(organizationImage).then(read => read.blob());
    formData.append('organization_picture', blob, 'org_picture');
    
    const response = await api.post('/organizations', formData);

    const { message } = response.data;
    console.log(message);
    return { message };
};

export const organizationEditRequest = async (
    organizationId: number,
    organizationName: string, 
    organizationIdentifier: string, 
    organizationDescription: string, 
    organizationImage?: File,
    ) => {
    
    const formData = new FormData();
    formData.append('organization_name', organizationName);
    formData.append('organization_identifier', organizationIdentifier);
    formData.append('organization_description', organizationDescription);
    formData.append('_method', 'PUT'); // apparently laravel doesn't appreciate put and formdata being combined o.o

    if (organizationImage) {
        formData.append('organization_picture', organizationImage);
    }

    const response = await api.post(`/organizations/${organizationId}`, formData);
    return response.data;
};

export const organizationsGetRequest = async () => {
    const response = await api.get('/organizations');
    return response.data;
};

export const getSpecificOrganizationRequest = async (organizationId: number) => {
    const response = await api.get(`/organizations/${organizationId}`);
    return response.data;
};