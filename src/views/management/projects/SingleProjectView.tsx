import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FiEdit2 } from 'react-icons/fi';
import { FiPlusCircle } from 'react-icons/fi';

import { TASK_TYPE_CLASSES } from '@/constants/dummy-data';

import type { Project } from '@/constants/dummy-data';
import { DataTable } from '@/components/output/DataTable';

import type { ColumnDef } from '@/components/output/DataTable';
import type { Task } from '@/constants/dummy-data';
import { getSpecificProjectRequest } from '@/services/projectService';
import { tasksGetRequest } from '@/services/taskService';
export const SingleProjectView = () => {
    const navigate = useNavigate();
    const { orgId, projId } = useParams<{ orgId: string; projId: string }>();
    
    const [singleProjectData, setSingleProjectData] = useState<Project>();
    const [singleProjectTasks, setSingleProjectTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchSingleProject = async (organizationId: number, projectId: number) => {
            try {
                setIsLoading(true);   
                const response = await getSpecificProjectRequest(organizationId, projectId);
                setSingleProjectData(response);
            } catch (error) {
                console.error("Failed to fetch single project:", error);
            } finally {
                setIsLoading(false);
            }
        }

        const fetchProjectTasks = async (organizationId: number, projectId: number) => {
            try {
                setIsLoading(true);   
                const response = await tasksGetRequest(organizationId, projectId);
                setSingleProjectTasks(response);
            } catch (error) {
                console.error("Failed to fetch single project tasks:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if(orgId && projId){
            fetchSingleProject(Number(orgId), Number(projId));
            fetchProjectTasks(Number(orgId), Number(projId));
        }
    },[orgId, projId]);
    
    if (isLoading) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl text-white'>Loading...</h1>
            </div>
        );
    }

    if (!singleProjectData) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl'>Project not found.</h1>
            </div>
        );
    }
    const taskColumns: ColumnDef<Task>[] = [
        {
            key: 'task_id',
            header: 'Task ID',
            render: (task) => task.id,
        },
        {
            key: 'status',
            header: 'Status',
            render: (task) => task.task_status,
        },
        {
            key: 'priority',
            header: 'Priority',
            render: (task) => task.priority,
        },
        {
            key: 'task_type',
            header: 'Type',
            render: (task) => (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TASK_TYPE_CLASSES[task.task_type]}`}>
                    {task.task_type}
                </span>
            ),
        },
        {
            key: 'task_assignee',
            header: 'Assigned to',
            render: (task) => (
                <div className={`flex items-center gap-2`}>
                    <img 
                    className='w-4 h-4 object-fit rounded-full'
                    src='https://www.shutterstock.com/image-vector/man-silhouette-icon-question-mark-260nw-192704537.jpg'
                    />
                    {task.assignee_id}
                </div>
            ),
        },
        {
            key: 'due_date',
            header: 'Due Date',
            render: (task) => new Date(task.due_date).toLocaleDateString(),
        },
    ];

    return (
        <div className='relative min-h-full flex flex-col max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>

            <div className='flex items-center justify-between pb-3 border-b border-border mb-8'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate(`/organization/${orgId}`)}
                        className='flex items-center justify-center'
                        aria-label='Go back'
                    >
                        <GoArrowLeft className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </button>
                    <div>
                        <p className='text-lg mb-0.5'>Currently viewing:</p>
                        <p className='text-xl font-medium'>{singleProjectData?.project_name}</p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='text-sm bg-primary text-secondary px-4 py-2 rounded-lg font-medium'>
                        {singleProjectData?.organization_id}
                    </span>
                </div>
            </div>

            <div className='flex flex-col gap-6 mb-8'>
                <div>
                    <p className='text-sm text-accent mb-2'>Project Name</p>
                    <p className='text-2xl font-semibold'>{singleProjectData?.project_name} [ {singleProjectData?.id} ]</p>
                </div>

                <div>
                    <p className='text-sm text-accent mb-2'>Description</p>
                    <p className='text-lg leading-relaxed'>{singleProjectData?.project_description}</p>
                </div>

                <div className='pt-4 border-t'></div>
                <div className='overflow-hidden overflow-x-scroll'>
                    <DataTable
                        data={singleProjectTasks}
                        columns={taskColumns}
                        getRowKey={(task) => task.id}
                        onRowClick={(task) => navigate(`/organization/${orgId}/project/${projId}/tasks/${task.id}`)}
                    />
                </div>
            </div>

            <div className='flex w-full flex-wrap gap-3 pb-4 justify-end'>

                <button
                    onClick={() => navigate(`/organization/${orgId}/project/${singleProjectData?.id}/edit`)}
                    className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                >
                    <FiEdit2 className='h-5 w-5' />
                    Edit Project
                </button>
                <button
                    onClick={() => navigate(`/organization/${orgId}/project/${singleProjectData?.id}/tasks/create`)}
                    className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                >
                    <FiPlusCircle className='h-5 w-5' />
                    New Task
                </button>
            </div>
            
        </div>
    );
}
