import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TASKS, USERS, PROJECTS, STATUS_OPTIONS, PRIORITIES} from "@/constants/dummy-data";
import { GoArrowLeft } from "react-icons/go";
import { FiEdit2 } from "react-icons/fi";

interface TaskEditErrors {
    DescriptionError: string,
    AssignedUserError: string,
    DueDateError: string,
    PriorityError: string,
    StatusTypeError: string,
};

export const TaskEditView = () => {
    const navigate = useNavigate();
    const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
    const task = Object.values(TASKS).find(t => t.task_id === taskId);

    if (!task) return (
        <div className='min-h-full flex items-center justify-center'>
        <h1 className='text-3xl'>Task not found.</h1>
        </div>
    );

    const project = PROJECTS[task.project_id];
    const orgUsers = Object.values(USERS).filter(user => user.org_id === project?.org_id);

    const [taskDescription, setTaskDescription] = useState<string>(task.task_description);
    const [assignedUser, setAssignedUser] = useState<string>(task.user_id);
    const [dueDate, setDueDate] = useState<Date>(task.due_date);
    const [priority, setPriority] = useState<number>(task.priority);
    const [statusType, setStatusType] = useState<string>(task.status);

    const selectedStatus = STATUS_OPTIONS.find(s => s.value === statusType);

    const [errors, setErrors] = useState<TaskEditErrors>({
            DescriptionError: '',
            AssignedUserError: '',
            DueDateError: '',
            PriorityError: '',
            StatusTypeError: '',
        });

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: TaskEditErrors = {
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

    const errorMsg = (msg?: string) => (
        <p className={`text-sm mt-1 ${msg ? "text-red-500 visible" : "invisible"}`}>
        {msg || "placeholder"}
        </p>
    );
    
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
                        <p className='text-lg  mb-0.5'>Currently Editing:</p>
                        <p className='text-xl font-medium font-mono'>{task.task_id}</p>
                    </div>
                </div>
            </div>
                <form id='task-edit-form' className='flex flex-col w-full gap-4' onSubmit={(handleSubmit)}>
                    <div id='task-edit-description' className='flex flex-col'>
                        <label htmlFor='task-edit-description-input' className='mb-2'>Task Description:</label>
                        <textarea 
                            id='task-edit-description-input' 
                            name='task-edit-description-input' 
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className={`px-3 py-2 border rounded bg-surface ${errors.DescriptionError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errorMsg(errors.DescriptionError)}

                        <div className="flex flex-col">
                            <label htmlFor="task-assigned-user-input" className="mb-2 font-medium text-sm">
                            Assigned User
                            </label>
                            <select
                            id="task-assigned-user-input"
                            name="task-assigned-user-input"
                            value={assignedUser}
                            onChange={(e) => setAssignedUser(e.target.value)}
                            className={`px-3 py-2 border rounded bg-surface ${errors.AssignedUserError ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="" disabled>Select a user…</option>
                                {orgUsers.map((user) => (
                                    <option key={user.user_id} value={user.user_id}>
                                        {user.nickname ? `${user.nickname} (${user.email})` : user.email}
                                    </option>
                                ))}
                            </select>
                            {errorMsg(errors.AssignedUserError)}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="task-due-date-input" className="mb-2 font-medium text-sm">
                            Due Date
                            </label>
                            <input
                                type="date"
                                id="task-due-date-input"
                                name="task-due-date-input"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`px-3 py-2 border rounded bg-surface ${errors.DueDateError ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {dueDate && (
                            <p className="text-xs text-gray-400 mt-1">
                            </p>
                            )}
                            {errorMsg(errors.DueDateError)}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col flex-1">
                        <label htmlFor="task-priority-input" className="mb-2 font-medium text-sm">
                            Priority
                        </label>
                        <select
                            id="task-priority-input"
                            name="task-priority-input"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className={`px-3 py-2 border rounded bg-surface ${errors.PriorityError ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="" disabled>Select priority…</option>
                            {PRIORITIES.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                        {errorMsg(errors.PriorityError)}
                        </div>
                
                        <div className="flex flex-col flex-1">
                        <label htmlFor="task-status-type-input" className="mb-2 font-medium text-sm">
                            Status Type
                        </label>
                        <select
                            id="task-status-type-input"
                            name="task-status-type-input"
                            value={statusType}
                            onChange={(e) => setStatusType(e.target.value)}
                            className={`px-3 py-2 border rounded bg-surface w-full ${errors.StatusTypeError ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="" disabled>Select status…</option>
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>

                        {/* {selectedStatus && (
                            <div className="flex items-center gap-1.5 mt-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${selectedStatus.dot}`} />
                            <span className={`text-xs font-medium ${selectedStatus.color}`}>
                                {selectedStatus.label}
                            </span>
                            </div>
                        )} */}
                        {!selectedStatus && errorMsg(errors.StatusTypeError)}
                        </div>
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