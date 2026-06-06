import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FiEdit2 } from 'react-icons/fi';
import { FiPlusCircle } from 'react-icons/fi';
import { PROJECTS, TASKS, TASK_TYPE_CLASSES } from '@/constants/dummy-data';
import { DataTable } from '@/components/output/DataTable';

import type { ColumnDef } from '@/components/output/DataTable';
import type { Task } from '@/constants/dummy-data';

export const SingleProjectView = () => {
    const navigate = useNavigate();
    const { orgId, projId } = useParams<{ orgId: string; projId: string }>();
    
    const project = Object.values(PROJECTS).find(p => p.project_id === projId);
    
    if (!project) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl'>Project not found.</h1>
            </div>
        );
    }
    const tasks = Object.values(TASKS).filter(t => t.project_id === projId);
    const taskColumns: ColumnDef<Task>[] = [
        {
            key: 'task_id',
            header: 'Task ID',
            render: (task) => task.task_id,
        },
        {
            key: 'status',
            header: 'Status',
            render: (task) => task.status,
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
                    {task.user_id}
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
                        onClick={() => navigate(-1)}
                        className='flex items-center justify-center'
                        aria-label='Go back'
                    >
                        <GoArrowLeft className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </button>
                    <div>
                        <p className='text-lg mb-0.5'>Currently viewing:</p>
                        <p className='text-xl font-medium'>{project.name}</p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='text-sm bg-primary text-secondary px-4 py-2 rounded-lg font-medium'>
                        {project.org_id}
                    </span>
                </div>
            </div>

            <div className='flex flex-col gap-6 mb-8'>
                <div>
                    <p className='text-sm text-accent mb-2'>Project Name</p>
                    <p className='text-2xl font-semibold'>{project.name} [ {project.project_id} ]</p>
                </div>

                <div>
                    <p className='text-sm text-accent mb-2'>Description</p>
                    <p className='text-lg leading-relaxed'>{project.description}</p>
                </div>

                <div className='pt-4 border-t'></div>
                <div className='overflow-hidden overflow-x-scroll'>
                    <DataTable
                        data={tasks}
                        columns={taskColumns}
                        getRowKey={(task) => task.task_id}
                        onRowClick={(task) => navigate(`/organization/${orgId}/project/${projId}/tasks/${task.task_id}`)}
                    />
                </div>
            </div>

            <div className='flex w-full flex-wrap gap-3 pb-4 justify-end'>
                <button
                    onClick={() => navigate(`/organization/${orgId}/project/${project.project_id}/edit`)}
                    className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                >
                    <FiEdit2 className='h-5 w-5' />
                    Edit Project
                </button>
                <button
                    onClick={() => navigate(`/organization/${orgId}/project/${project.project_id}/tasks/create`)}
                    className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                >
                    <FiPlusCircle className='h-5 w-5' />
                    New Task
                </button>
            </div>
            
        </div>
    );
}
