import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PRIORITIES, TASK_TYPES} from "@/constants/dummy-data";
import { GoArrowLeft } from "react-icons/go";
import { FormField } from '@/components/input/FormField';
import { getOrganizationMembers } from '@/services/organizationService';
import { taskCreateRequest } from '@/services/taskService';
import type { User } from '@/constants/dummy-data';
interface TaskCreateErrors {
    DescriptionError: string,
    AssignedUserError: string,
    DueDateError: string,
    PriorityError: string,
    TaskTypeError: string,
};

export const TaskCreateView = () => {
    const navigate = useNavigate();
    const { orgId, projId } = useParams();

    const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchOrganizationMembers = async (organizationId: number) => {
            const response = await getOrganizationMembers(organizationId);
            setOrganizationUsers(response);
            console.log(response);
        }

        fetchOrganizationMembers(Number(orgId));
    },[orgId])

    const [taskDescription, setTaskDescription] = useState<string>('');
    const [assignedUser, setAssignedUser] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [priority, setPriority] = useState<string>('');
    const [taskType, setTaskType] = useState<string>('');

    const [errors, setErrors] = useState<TaskCreateErrors>({
            DescriptionError: '',
            AssignedUserError: '',
            DueDateError: '',
            PriorityError: '',
            TaskTypeError: '',
    });

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: TaskCreateErrors = {
            DescriptionError: '',
            AssignedUserError: '',
            DueDateError: '',
            PriorityError: '',
            TaskTypeError: '',
        };

        if (!taskDescription || taskDescription.trim() == '') {
            newErrors.DescriptionError = 'Task description is required';
        }

        if (!assignedUser) {
            newErrors.AssignedUserError = 'Assigned user is required';
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selected = new Date(dueDate);

        if (!dueDate) {
            newErrors.DueDateError = 'Due date is required';
        } else if (selected < today){
            newErrors.DueDateError = 'Due date cannot be in the past';
        }

        if (!priority) {
            newErrors.PriorityError = 'Task priority cannot be null';
        } else if (Number(priority) < 1 || Number(priority) > 5){
            newErrors.PriorityError = 'Task priority is not in interval [1...5]'
        }

        if (!taskType) {
            newErrors.TaskTypeError = 'Task status is required'
        }

        setErrors(newErrors);
        if (Object.values(newErrors).some(e => e !== '')) return;

        try {
            await taskCreateRequest(Number(orgId), Number(projId), taskDescription, Number(assignedUser), new Date(dueDate), Number(priority), taskType);
            navigate(`/organization/${orgId}/project/${projId}`);
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
                });
            }
        }
        console.log('Task created successfully');
    }
    
    return (
        <div className='relative min-h-full max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>
            <div className='flex items-center justify-between pb-3 border-b border-border mb-5'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate(`/organization/${orgId}/project/${projId}`)}
                        className='flex items-center justify-center'
                        aria-label='Go back'
                    >
                        <GoArrowLeft className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </button>
                    <div>
                        <p className='text-lg  mb-0.5'>Creating Task:</p>
                        <p className='text-xl font-medium font-mono'>Project {projId}</p>
                    </div>
                </div>
            </div>
                <form id='task-edit-form' className='flex flex-col w-full gap-4' onSubmit={(handleSubmit)}>
                    <div id='task-edit-description' className='flex flex-col'>
                        <FormField
                            name='task-edit-description-input'
                            label='Task Description:'
                            value={taskDescription}
                            onChange={setTaskDescription}
                            config={{type: 'textarea', rows: 4}}
                            placeholder='Enter task description...'
                            error={errors.DescriptionError}
                        />

                        <FormField
                            name="assignedUser"
                            label="Assigned User"
                            value={assignedUser}
                            onChange={setAssignedUser}
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
                            value={dueDate}
                            onChange={setDueDate}
                            error={errors.DueDateError}
                            config={{type: 'date'}}
                        />
                        
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <FormField
                            name="task-priority-input"
                            label="Priority"
                            value={priority}
                            onChange={setPriority}
                            config={{ type: 'select', options: PRIORITIES.map(prio => ({
                                label: prio.label,
                                value: prio.value
                            })) }}
                            placeholder="Select a priority…"
                            error={errors.PriorityError}
                            specialStyling={true}
                        />

                        <FormField 
                            name='task-status-type-input'
                            label='Type'
                            value={taskType}
                            onChange={setTaskType}
                            config={{ type: 'select', options: TASK_TYPES.map(status => ({
                                label: status.label,
                                value: status.value
                            })) }}
                            placeholder="Select a task type..."
                            error={errors.TaskTypeError}
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