import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TASK_TYPES, PRIORITIES, STATUS_OPTIONS} from "@/constants/dummy-data";
import { GoArrowLeft } from "react-icons/go";
import { FormField } from '@/components/input/FormField';
import { specificTaskGetRequest, } from '@/services/taskService';
import { getOrganizationMembers } from '@/services/organizationService';
import { toYYYYMMDD } from '@/utils/dateUtils';
import type { Task, User } from '@/constants/dummy-data';
import { taskEditRequest } from '@/services/taskService';

interface TaskEditErrors {
    DescriptionError: string,
    AssignedUserError: string,
    DueDateError: string,
    PriorityError: string,
    TaskTypeError: string,
    TaskStatusError: string,
};

export const TaskEditView = () => {
    const navigate = useNavigate();
    const { orgId, projId, taskId } = useParams<{ orgId: string, projId: string; taskId: string }>();


    const [singleTask, setSingleTask] = useState<Task>();
    const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<TaskEditErrors>({
        DescriptionError: '',
        AssignedUserError: '',
        DueDateError: '',
        PriorityError: '',
        TaskTypeError: '',
        TaskStatusError: '',
    });
    useEffect(() => {
        const fetchSingleTask = async (organizationId: number, projectId: number, taskId: number) => {
            try {
                setIsLoading(true);   
                const response = await specificTaskGetRequest(organizationId,  projectId, taskId);
                setSingleTask(response.task);
            } catch (error) {
                console.error("Failed to fetch single project:", error);
            } finally {
                setIsLoading(false);
            }
        }

        const fetchOrganizationMembers = async (organizationId: number) => {
            const response = await getOrganizationMembers(organizationId);
            setOrganizationUsers(response);
        }

        if (orgId && projId && taskId){
            fetchSingleTask(Number(orgId), Number(projId), Number(taskId));
            fetchOrganizationMembers(Number(orgId));
        }
    },[orgId, projId, taskId]);

    const handleFieldChange = (key: keyof Task) => (value: string) => {
        setSingleTask((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [key]: value
            };
        });
    };

    if (isLoading) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl text-white'>Loading...</h1>
            </div>
        );
    }
    
    if (!singleTask) return (
        <div className='min-h-full flex items-center justify-center'>
            <h1 className='text-3xl'>Task not found.</h1>
        </div>
    );

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: TaskEditErrors = {
            DescriptionError: '',
            AssignedUserError: '',
            DueDateError: '',
            PriorityError: '',
            TaskTypeError: '',
            TaskStatusError: '',
        };

        if (!singleTask.task_description || singleTask.task_description.trim() == '') {
            newErrors.DescriptionError = 'Task description is required';
        }

        if (!singleTask.assignee_id) {
            newErrors.AssignedUserError = 'Assigned user is required';
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selected = new Date(singleTask.due_date);

        if (!singleTask.due_date) {
            newErrors.DueDateError = 'Due date is required';
        } else if (selected < today){
            newErrors.DueDateError = 'Due date cannot be in the past';
        }

        if (!singleTask.priority) {
            newErrors.PriorityError = 'Task priority cannot be null';
        } else if (Number(singleTask.priority) < 1 || Number(singleTask.priority) > 5){
            newErrors.PriorityError = 'Task priority is not in interval [1...5]'
        }

        if (!singleTask.task_type) {
            newErrors.TaskTypeError = 'Task type is required'
        }

        if (!singleTask.task_status) {
            newErrors.TaskStatusError = 'Task status is required'
        }

        setErrors(newErrors);
        if (Object.values(newErrors).some(e => e !== '')) return;

        try {
            await taskEditRequest(
                Number(orgId), 
                Number(projId), 
                Number(taskId), 
                singleTask.task_description, 
                Number(singleTask.assignee_id), 
                new Date(singleTask.due_date), 
                Number(singleTask.priority), 
                singleTask.task_type,
                singleTask.task_status
            );

            navigate(`/organization/${orgId}/project/${projId}/tasks/${taskId}`);
        } catch (error: any) {
            if (error.response?.status === 422) {
                const laravelErrors = error.response.data.errors;
                console.log(laravelErrors);
                setErrors({
                    DescriptionError: laravelErrors.task_description?.[0] ?? '',
                    AssignedUserError: laravelErrors.assignee_id?.[0] ?? '',
                    DueDateError: laravelErrors.due_date?.[0] ?? '',
                    PriorityError: laravelErrors.priority?.[0] ?? '',
                    TaskTypeError: laravelErrors.task_type?.[0] ?? '',
                    TaskStatusError: laravelErrors.task_status?.[0] ?? '',
                });
            }
        }
        console.log('Task edited successfully');
    }
    return (
        <div className='relative min-h-full max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>
            <div className='flex items-center justify-between pb-3 border-b border-border mb-5'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate(`/organization/${orgId}/project/${projId}/tasks/${taskId}`)}
                        className='flex items-center justify-center'
                        aria-label='Go back'
                    >
                        <GoArrowLeft className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </button>
                    <div>
                        <p className='text-lg  mb-0.5'>Currently Editing:</p>
                        <p className='text-xl font-medium font-mono'>{singleTask.id}</p>
                    </div>
                </div>
            </div>
                <form id='task-edit-form' className='flex flex-col w-full gap-4' onSubmit={(handleSubmit)}>
                    <div id='task-edit-description' className='flex flex-col'>
                        <FormField
                            name='task-edit-description-input'
                            label='Task Description:'
                            value={singleTask.task_description}
                            onChange={handleFieldChange('task_description')}
                            config={{type: 'textarea', rows: 4}}
                            placeholder='Enter task description...'
                            error={errors.DescriptionError}
                        />

                        <FormField
                            name="assignedUser"
                            label="Assigned User"
                            value={singleTask.assignee_id}
                            onChange={handleFieldChange('assignee_id')}
                            config={{ type: 'select', options: organizationUsers.map(u => ({
                                label: u.nickname ? u.nickname : u.email,
                                value: u.id
                            })) }}
                            placeholder="Select a user…"
                            error={errors.AssignedUserError}
                        />

                        <FormField 
                            name="task-due-date-input"
                            label="Due Date"
                            value={toYYYYMMDD(singleTask.due_date)}
                            onChange={handleFieldChange('due_date')}
                            error={errors.DueDateError}
                            config={{type: 'date'}}
                        />
                        
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <FormField
                            name="task-priority-input"
                            label="Priority"
                            value={String(singleTask.priority)}
                            onChange={handleFieldChange('priority')}
                            config={{ type: 'select', options: PRIORITIES.map(prio => ({
                                label: prio.label,
                                value: prio.value
                            })) }}
                            placeholder="Select a priority…"
                            error={errors.PriorityError}
                            specialStyling={true}
                        />

                        <FormField 
                            name='task-task-type-input'
                            label='Type'
                            value={singleTask.task_type}
                            onChange={handleFieldChange('task_type')}
                            config={{ type: 'select', options: TASK_TYPES.map(status => ({
                                label: status.label,
                                value: status.value
                            })) }}
                            placeholder="Select a task type..."
                            error={errors.TaskTypeError}
                            specialStyling={true}
                        />

                        <FormField 
                            name='task-status-type-input'
                            label='Status'
                            value={singleTask.task_status}
                            onChange={handleFieldChange('task_status')}
                            config={{ type: 'select', options: STATUS_OPTIONS.map(status => ({
                                label: status.label,
                                value: status.value
                            })) }}
                            placeholder="Select a task type..."
                            error={errors.TaskStatusError}
                            specialStyling={true}
                        />
                    </div>
                        <button
                            type='submit' id='edit-task-form-submit'
                            className='flex justify-center text-center gap-1.5 bg-green-500 p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-green-600'
                        >
                            Save task
                        </button>
                </form>

        </div>
    );
}