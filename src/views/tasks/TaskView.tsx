import { TASKS, TASK_TYPE_CLASSES } from '@/constants/dummy-data';
import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FiEdit2 } from 'react-icons/fi';
import { formatDateDayMonthYear } from '@/utils/dateUtils';

export const TaskView = () => {
    const navigate = useNavigate();
    const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
    const task = Object.values(TASKS).find(t => t.task_id === taskId);

    if (!task) return (
        <div className='min-h-full flex items-center justify-center'>
        <h1 className='text-3xl'>Task not found.</h1>
        </div>
    );

    const badgeClass = TASK_TYPE_CLASSES[task.task_type];

    return (
        <div className='relative min-h-full bg-darkened-surface p-4 md:p-6'>
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
                        <p className='text-lg  mb-0.5'>Project {projectId}</p>
                        <p className='text-xl font-medium font-mono'>{task.task_id}</p>
                    </div>
                </div>
                <span className={`text-lg font-medium px-2.5 py-1 rounded-full ring-1 ring-inset ${badgeClass}`}>
                    {task.task_type}
                </span>
            </div>
        <div>
            <div className='flex items-start md:items-center justify-between md:flex-row flex-col-reverse'>
                <p className='text-lg  mb-0.5'>Task Description:</p>
                <div className='flex flex-row items-center md:my-0 my-4'>
                    <p>Assigned To: </p>
                    <img 
                    className='rounded-full w-6 h-6 mx-2'
                    src='https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'
                    /> 
                    <p>{task.user_id}</p>
                </div>
            </div>
            <p className='text-xl leading-relaxed mb-6'>
                {task.task_description}
            </p>
        </div>
        <div className='flex flex-wrap justify-between gap-2'>
            <div className='w-full md:w-1/4 rounded border border-border px-3 py-2 bg-accent'>
                <p className='text-xl font-medium uppercase tracking-wide  mb-1'>Status: <span className='text-xl font-light capitalize tracking-wide'>{task.status}</span>
                </p>
            </div>
            <div className='w-full md:w-1/4 rounded border border-border px-3 py-2 bg-accent'>
                <p className='text-xl font-medium uppercase tracking-wide  mb-1'>Priority:  <span className='text-xl font-light capitalize tracking-wide'>{task.priority}</span>
                </p>
            </div>
            <div className='w-full md:w-1/4 rounded border border-border px-3 py-2 bg-accent'>
                <p className='text-xl font-medium uppercase tracking-wide  mb-1'>Due Date:  <span className='text-xl font-light capitalize tracking-wide'>{formatDateDayMonthYear(task.due_date)}</span>
                </p>
            </div>
        </div>

            <button
                onClick={() => navigate(`/task/${task.project_id}/${task.task_id}/edit`)}
                className='absolute bottom-5 right-5 flex items-center gap-1.5 bg-accent p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-primary'
            >
                <FiEdit2 className='h-6 w-6' />
                Edit task
            </button>

        </div>
    );
};