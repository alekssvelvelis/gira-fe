import { api } from "@/utils/axios";

export const projectCreateRequest = async (
    projectName: string,
    projectDescription: string,
    organizationId: number,
) => {
    const response = await api.post(`/organizations/${organizationId}/projects`, {
        'project_name': projectName,
        'project_description': projectDescription,
        'organization_id': organizationId
    });

    const { message } = response.data;
    console.log(message);
    return { message };
};

export const projectEditRequest = async (
    projectName: string,
    projectDescription: string,
    organizationId: number,
    projectId: number,
) => {
    const response = await api.post(`/organizations/${organizationId}/projects/${projectId}`, {
        _method: 'PUT',
        'project_name': projectName,
        'project_description': projectDescription,
    });

    const { message } = response.data;
    console.log(message);
    return { message };
};

export const projectsGetRequest = async (organizationId: number) => {
    const response = await api.get(`/organizations/${organizationId}/projects`);
    return response.data;
};

export const getSpecificProjectRequest = async (organizationId: number, projectId: number) => {
    const response = await api.get(`/organizations/${organizationId}/projects/${projectId}`);
    return response.data;
};