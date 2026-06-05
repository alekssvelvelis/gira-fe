import { useState } from 'react';

import { TASKS, TASK_TYPE_CLASSES } from '@/constants/dummy-data';
import { useNavigate } from 'react-router-dom';
export const Dashboard = () => {
    const navigate = useNavigate();
    const [userTasks, setUserTasks] = useState({});
    const tasks = Object.values(TASKS).filter(t => t.user_id === 'usr-006');
    return(
        <div className='min-w-full flex flex-col min-h-screen'>
            <div className='min-w-full h-[10%] p-2 bg-primary justify-between flex flex-wrap' id='dashboard-header'>
                <h1 className='text-3xl md:text-xl sm:text-sm font-light'>Dashboard</h1>
                <h1 className='text-3xl md:text-xl sm:text-sm font-light'>Welcome back, user!</h1>
            </div>
            <div className='min-w-full min-h-full p-2 bg-secondary flex md:flex-col flex-wrap'>
                <div className='md:w-full flex flex-col overflow-x-scroll'>
                    <h1>Your upcoming tasks</h1>
                    <table className="min-w-full text-lg border">
                        <thead className="bg-accent border-b border-primary">
                            <tr>
                                <th scope="col" className="w-1/5 px-3 py-2 text-left font-medium">Task ID</th>
                                <th scope="col" className="w-1/5 px-3 py-2 text-left font-medium">Status</th>
                                <th scope="col" className="w-1/5 px-3 py-2 flex text-center font-medium">Priority</th>
                                <th scope="col" className="w-1/5 px-3 py-2 text-left font-medium">Type</th>
                                <th scope="col" className="w-1/5 px-3 py-2 text-left font-medium">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-accent'>
                            {tasks.map(task => (
                                <tr key={task.task_id} className='hover:bg-accent transition-colors last:border-b-0 hover:cursor-pointer' onClick={() => navigate(`${task.project_id}/${task.task_id}`)}>
                                    <td>{task.task_id}</td>
                                    <td>{task.status}</td>
                                    <td>{task.priority}</td>
                                    <td>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TASK_TYPE_CLASSES[task.task_type]}`}>
                                            {task.task_type}
                                        </span>
                                    </td>
                                    <td>{new Date(task.due_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};