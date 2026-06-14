import { useState, useEffect } from 'react';
import { TASK_TYPE_CLASSES } from '@/constants/dummy-data';
import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FiEdit2, FiXCircle } from 'react-icons/fi';
import { ConfirmModal } from '@/components/input/ConfirmDelete';
import { formatDateDayMonthYear } from '@/utils/dateUtils';
import { specificTaskGetRequest, deleteSpecificTask } from '@/services/taskService';
import { BACKEND_URL } from '@/utils/axios';
import type { Task } from '@/constants/dummy-data';
export const TaskView = () => {
    const navigate = useNavigate();
    const { orgId, projId, taskId } = useParams<{ orgId: string; projId: string; taskId: string }>();

    const [singleTask, setSingleTask] = useState<Task>();
    const [isLoading, setIsLoading] = useState(true);
    const [isOwner, setIsOwner] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchSingleTask = async (organizationId: number, projectId: number, taskId: number) => {
            try {
                setIsLoading(true);   
                const response = await specificTaskGetRequest(organizationId,  projectId, taskId);
                setSingleTask(response.task);
                setIsOwner(response.is_owner);
            } catch (error) {
                console.error("Failed to fetch single project:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (orgId && projId && taskId){
            fetchSingleTask(Number(orgId), Number(projId), Number(taskId));
        }
    },[orgId, projId, taskId]);
    
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

    const badgeClass = TASK_TYPE_CLASSES[singleTask.task_type];

    return (
        <div className='relative min-h-full bg-darkened-surface p-4 md:p-6'>
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
                        <p className='text-lg  mb-0.5'>Project: {singleTask.project?.project_name}</p>
                        <p className='text-xl font-medium font-mono'>Project ID:{singleTask.project_id}</p>
                    </div>
                </div>
                <span className={`text-lg font-medium px-2.5 py-1 rounded-full ring-1 ring-inset ${badgeClass}`}>
                    {singleTask.task_type}
                </span>
            </div>
        <div>
            <div className='flex items-start md:items-center justify-between md:flex-row flex-col-reverse'>
                <p className='text-lg  mb-0.5'>Task Description:</p>
                <div className='flex flex-row items-center md:my-0 my-4'>
                    <p>Assigned To: </p>
                    <img 
                    className='rounded-full w-6 h-6 mx-2'
                    src={`${BACKEND_URL}/storage/${singleTask.assignee?.profile_picture}` || `https://www.shutterstock.com/image-vector/man-silhouette-icon-question-mark-260nw-192704537.jpg`}
                    /> 
                    <p>{singleTask.assignee?.nickname}</p>
                </div>
            </div>
            <p className='text-xl leading-relaxed mb-6'>
                {singleTask.task_description}
            </p>
        </div>
        <div className='flex flex-wrap justify-between gap-2'>
            <div className='w-full md:w-1/4 rounded border border-border px-3 py-2 bg-accent'>
                <p className='text-xl font-medium uppercase tracking-wide  mb-1'>Status: <span className='text-xl font-light capitalize tracking-wide'>{singleTask.task_status}</span>
                </p>
            </div>
            <div className='w-full md:w-1/4 rounded border border-border px-3 py-2 bg-accent'>
                <p className='text-xl font-medium uppercase tracking-wide  mb-1'>Priority:  <span className='text-xl font-light capitalize tracking-wide'>{singleTask.priority}</span>
                </p>
            </div>
            <div className='w-full md:w-1/4 rounded border border-border px-3 py-2 bg-accent'>
                <p className='text-xl font-medium uppercase tracking-wide  mb-1'>Due Date:  <span className='text-xl font-light capitalize tracking-wide'>{formatDateDayMonthYear(singleTask.due_date)}</span>
                </p>
            </div>
        </div>
            {isOwner &&
            <>
                <button
                    onClick={() => navigate(`/organization/${orgId}/project/${projId}/tasks/${singleTask.id}/edit`)}
                    className='absolute bottom-5 right-5 flex items-center gap-1.5 bg-accent p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-primary'
                >
                    <FiEdit2 className='h-6 w-6' />
                    Edit task
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='absolute bottom-5 right-40 flex items-center gap-1.5 bg-accent p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-primary'
                >
                    <FiXCircle className='h-6 w-6' />
                    Delete task
                </button>
                {isModalOpen && 
                    <ConfirmModal
                    isOpen={isModalOpen}
                    title="Delete task?"
                    description={`Task with ID: "${singleTask.id}" will be permanently removed.`}
                    onConfirm={() => {
                        deleteSpecificTask(Number(orgId), Number(projId), Number(taskId));
                        navigate(`/organization/${orgId}/project/${projId}`);
                    }}
                    onClose={() => setIsModalOpen(false)}
                    />
                }
            </>
            }

        </div>
    );
};