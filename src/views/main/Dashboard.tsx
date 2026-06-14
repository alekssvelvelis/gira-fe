import { useState, useEffect } from 'react';
import type { Task } from '@/constants/dummy-data';

import { DataTable } from '@/components/output/DataTable';
import type { ColumnDef } from '@/components/output/DataTable';

import { TASK_TYPE_CLASSES } from '@/constants/dummy-data';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '@/utils/axios';
import { useAuth } from '@/hooks/useAuth';
import { userTasksGetRequest } from '@/services/taskService';
import { formatYearMonth } from '@/utils/dateUtils';
export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userTasks, setUserTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [closestDueTasks, setClosestDueTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchUserTasks = async (userId: number) => {
            try {
                setIsLoading(true);
                const response = await userTasksGetRequest(userId);
                setUserTasks(response.tasks);

                 const sorted = [...response.tasks]
                .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                .slice(0, 3);
                setClosestDueTasks(sorted);

            } catch (error) { 
                console.error('Something went wrong with fetching user specific tasks', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserTasks(Number(user?.id));
    },[user]);

    console.log(userTasks);
    console.log(closestDueTasks);

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
                    src={`${BACKEND_URL}/storage/${task.assignee?.profile_picture}` || `https://www.shutterstock.com/image-vector/man-silhouette-icon-question-mark-260nw-192704537.jpg`}
                    />
                    {task.assignee?.nickname}
                </div>
            ),
        },
        {
            key: 'due_date',
            header: 'Due Date',
            render: (task) => new Date(task.due_date).toLocaleDateString(),
        },
    ];

    if (isLoading) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl text-white'>Loading...</h1>
            </div>
        );
    }

    const grouped: Record<string, Task[]> = {};
    userTasks.forEach(task => {
        const key = task.due_date.slice(0, 7);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(task);
    });

    const sortedMonths = Object.keys(grouped).sort();
    sortedMonths.forEach(month => {
        grouped[month].sort((a, b) => a.due_date.localeCompare(b.due_date));
    });

    return (
        <div className='min-w-full min-h-full p-2 bg-darkened-surface flex md:flex-col flex-wrap'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
                <div className='flex flex-wrap justify-between'>
                    <h1 className='text-xl md:text-3xl font-light'>Your Dashboard</h1>
                    <h1 className='text-xl md:text-3xl font-light'>{user ? `Welcome, ${user.nickname}` : 'Welcome!'}</h1>
                </div>
                <div>
                    <h1 className='text-3xl font-light'>Your closest due tasks</h1>
                    <DataTable
                        data={closestDueTasks}
                        columns={taskColumns}
                        getRowKey={(task) => task.id}
                        onRowClick={(task) => navigate(`/organization/${task.project?.organization_id}/project/${task.project?.id}/tasks/${task.id}`)}
                    />
                </div>
                <div>
                    <h1 className='text-3xl font-light'>Your calendar</h1>
                    {sortedMonths.map(month => (
                        <div key={month}>
                            <h2 className='text-xl font-semibold mb-2'>{formatYearMonth(month)}</h2>
                            <DataTable
                                data={grouped[month]}
                                columns={taskColumns}
                                getRowKey={(task) => task.id}
                                onRowClick={(task) => navigate(`/organization/${task.project?.organization_id}/project/${task.project?.id}/tasks/${task.id}`)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};