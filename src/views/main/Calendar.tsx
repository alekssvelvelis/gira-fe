import { TASKS, TASK_TYPE_CLASSES } from '@/constants/dummy-data';
import type { Task } from '@/constants/dummy-data';
import { formatYearMonth } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';
export const Calendar = () => {

    // Filter tasks for the user
    const tasks = Object.values(TASKS).filter(t => t.user_id === 'usr-006');

    // Group tasks by "YYYY-MM" month key
    const grouped: Record<string, Task[]> = {};
    tasks.forEach(task => {
        const key = task.due_date.slice(0, 7);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(task);
    });

    // Sort months, and sort tasks within each month by due date
    const sortedMonths = Object.keys(grouped).sort();
    sortedMonths.forEach(month => {
        grouped[month].sort((a, b) => a.due_date.localeCompare(b.due_date));
    });

    const navigate = useNavigate();
    return (
        <div className='min-w-full min-h-full p-2 bg-secondary flex md:flex-col flex-wrap'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
                <h1>Your calendar</h1>

                {sortedMonths.map(month => (
                    <div key={month}>
                        <h2 className='text-xl font-semibold mb-2'>{formatYearMonth(month)}</h2>
                        <table className='min-w-full text-lg border'>
                            <thead className='bg-accent border-b border-primary'>
                                <tr>
                                    <th scope='col' className='w-1/5 px-3 py-2 text-left font-medium'>Task ID</th>
                                    <th scope='col' className='w-1/5 px-3 py-2 text-left font-medium'>Status</th>
                                    <th scope='col' className='w-1/5 px-3 py-2 text-left font-medium'>Priority</th>
                                    <th scope='col' className='w-1/5 px-3 py-2 text-left font-medium'>Type</th>
                                    <th scope='col' className='w-1/5 px-3 py-2 text-left font-medium'>Due Date</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-accent'>
                                {grouped[month].map(task => (
                                    <tr 
                                        key={task.task_id} 
                                        className='hover:bg-accent transition-colors last:border-b-0 hover:cursor-pointer'
                                        onClick={() => {navigate(`/task/${task.project_id}/${task.task_id}`);console.log(task)}}
                                    >
                                        <td className='px-3.5 py-2.5'>{task.task_id}</td>
                                        <td className='px-3.5 py-2.5'>{task.status}</td>
                                        <td className='px-3.5 py-2.5'>{task.priority}</td>
                                        <td className='px-3.5 py-2.5'>
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TASK_TYPE_CLASSES[task.task_type]}`}>
                                                {task.task_type}
                                            </span>
                                        </td>
                                        <td className='px-3.5 py-2.5'>{new Date(task.due_date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};