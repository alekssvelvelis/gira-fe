import { useState } from 'react';
import type { Task } from '@/constants/dummy-data';

import { DataTable } from '@/components/output/DataTable';
import type { ColumnDef } from '@/components/output/DataTable';

import { TASKS, TASK_TYPE_CLASSES } from '@/constants/dummy-data';
import { useNavigate } from 'react-router-dom';
export const Dashboard = () => {
    const navigate = useNavigate();
    const [userTasks, setUserTasks] = useState({});
    const tasks = Object.values(TASKS).filter(t => t.user_id === 'usr-006');

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
                key: 'due_date',
                header: 'Due Date',
                render: (task) => new Date(task.due_date).toLocaleDateString(),
            },
        ];

    return (
        <div className='min-w-full min-h-full p-2 bg-darkened-surface flex md:flex-col flex-wrap'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
                <div className='flex flex-wrap justify-between'>
                    <h1 className='text-xl md:text-3xl font-light'>Your Dashboard</h1>
                    <h1 className='text-xl md:text-3xl font-light'>Welcome back, user!</h1>
                </div>
                    <DataTable
                        data={tasks}
                        columns={taskColumns}
                        getRowKey={(task) => task.task_id}
                        onRowClick={(task) => navigate(`/task/${task.project_id}/${task.task_id}`)}
                    />
            </div>
        </div>
    );
};