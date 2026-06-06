import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TASKS, USERS, PROJECTS, STATUS_OPTIONS, PRIORITIES} from "@/constants/dummy-data";
import { GoArrowLeft } from "react-icons/go";
import { FormField } from '@/components/input/FormField';

interface TaskCreateErrors {
    DescriptionError: string,
    AssignedUserError: string,
    DueDateError: string,
    PriorityError: string,
    StatusTypeError: string,
};

export const TaskCreateView = () => {
    const navigate = useNavigate();
    const { orgId, projId } = useParams();

    const [taskDescription, setTaskDescription] = useState<string>('');
    const [assignedUser, setAssignedUser] = useState<string>('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState<number>(1);
    const [statusType, setStatusType] = useState<string>('');

    const orgUsers = Object.values(USERS).filter(user => user.org_id === orgId);

    const [errors, setErrors] = useState<TaskCreateErrors>({
            DescriptionError: '',
            AssignedUserError: '',
            DueDateError: '',
            PriorityError: '',
            StatusTypeError: '',
    });

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: TaskCreateErrors = {
            DescriptionError: '',
            AssignedUserError: '',
            DueDateError: '',
            PriorityError: '',
            StatusTypeError: '',
        };

        if (!taskDescription || taskDescription.trim() == '') {
            newErrors.DescriptionError = 'Task description is required';
        }

        if (!assignedUser) {
            newErrors.AssignedUserError = 'Assigned user is required';
        }

        if (!dueDate) {
            newErrors.DueDateError = 'Due date is required';
        } else if (dueDate < new Date()){
            newErrors.DueDateError = 'Due date cannot be in the past';
        }

        if (!priority) {
            newErrors.PriorityError = 'Task priority cannot be null';
        } else if (priority < 1 || priority > 5){
            newErrors.PriorityError = 'Task priority is not in interval [1...5]'
        }

        if (!statusType) {
            newErrors.StatusTypeError = 'Task status is required'
        }

        setErrors(newErrors);
        if (newErrors.DescriptionError || 
            newErrors.AssignedUserError ||
            newErrors.DueDateError ||
            newErrors.PriorityError ||
            newErrors.StatusTypeError
        ) return;
        console.log('got to end');
    }
    
    return (
        <div className='relative min-h-full max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>
            <div className='flex items-center justify-between pb-3 border-b border-border mb-5'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate(-1)}
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
                            config={{ type: 'select', options: orgUsers.map(u => ({
                                label: u.nickname ? `${u.nickname} (${u.email})` : u.email,
                                value: u.user_id
                            })) }}
                            placeholder="Select a user…"
                            error={errors.AssignedUserError}
                        />

                        <FormField 
                            name="task-due-date-input"
                            label="Due Date"
                            value={dueDate}
                            onChange={setDueDate}
                            config={{type: 'date'}}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <FormField
                            name="task-priority-input"
                            label="Priority"
                            value={priority}
                            onChange={setPriority}
                            config={{ type: 'select', options: PRIORITIES.map(p => ({
                                label: p.label,
                                value: p.value
                            })) }}
                            placeholder="Select a user…"
                            error={errors.PriorityError}
                            specialStyling={true}
                        />

                        <FormField 
                            name='task-status-type-input'
                            label='Status Type'
                            value={statusType}
                            onChange={setStatusType}
                            config={{ type: 'select', options: STATUS_OPTIONS.map(status => ({
                                label: status.label,
                                value: status.value
                            })) }}
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