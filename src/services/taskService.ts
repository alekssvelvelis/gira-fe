import { api } from "@/utils/axios";

export const taskCreateRequest = async (
    organizationId: number,
    projectId: number,
    taskDescription: string,
    assignedUser: number,
    dueDate: Date,
    priority: number,
    type: string,
) => {
    const response = await api.post(`/organizations/${organizationId}/projects/${projectId}/tasks`, {
        'task_description': taskDescription,
        'assignee_id': assignedUser,
        'task_type': type,
        'due_date': dueDate,
        'priority': priority
    });

    const { message } = response.data;
    console.log(message);
    return { message };
};

export const taskEditRequest = async (
    organizationId: number,
    projectId: number,
    taskId: number,
    taskDescription: string,
    assignedUser: number,
    dueDate: Date,
    priority: number,
    type: string,
    status: string,
) => {
    const response = await api.post(`/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}`, {
        _method: 'PUT',
        'task_description': taskDescription,
        'assignee_id': assignedUser,
        'due_date': dueDate,
        'priority': priority,
        'task_type': type,
        'task_status': status,
    });

    const { message } = response.data;
    console.log(message);
    return { message };
};

export const tasksGetRequest = async (organizationId: number, projectId: number) => {
    const response = await api.get(`/organizations/${organizationId}/projects/${projectId}/tasks`);
    return response.data;
};

export const userTasksGetRequest = async (userId: number) => {
    const response = await api.get(`/users/${userId}/tasks`);
    console.log(response);
    return response.data;
}

export const specificTaskGetRequest = async (organizationId: number, projectId: number, taskId: number) => {
    const response = await api.get(`/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}`);
    console.log(response);
    return response.data;
};

export const deleteSpecificTask = async(organizationId: number, projectId: number, taskId: number) => {
    const response = await api.delete(`/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}`);
    console.log(response);
}