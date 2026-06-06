
import type { User } from '@/constants/dummy-data';
import type { ColumnDef } from '@/components/output/DataTable';

import { DataTable } from "@/components/output/DataTable";
import { USERS } from "@/constants/dummy-data";

import { useNavigate } from 'react-router-dom';

import { GoArrowLeft } from 'react-icons/go';
import { useParams } from 'react-router-dom';
export const MemberView = () => {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const members = Object.values(USERS).filter(u => u.org_id === orgId);


    const userColumns: ColumnDef<User>[] = [
            {
                key: 'user_id',
                header: 'User ID',
                render: (user) => user.user_id,
            },
            {
                key: 'email',
                header: 'Email',
                render: (user) => user.email,
            },
            {
                key: 'nickname',
                header: 'Nickname',
                render: (user) => user.nickname,
            },
        ];

    return(
        <div className='min-w-full min-h-full p-2 bg-darkened-surface flex md:flex-col flex-wrap p-4 md:p-6'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
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
                                <p className='text-xl font-medium'>{orgId}</p>
                            </div>
                        </div>
        
                        <div className='flex items-center'>
                            <span className='text-xl font-medium'>
                                Created on: 23/06/2005
                            </span>
                        </div>
                    </div>
                <div>
                    <DataTable
                        data={members}
                        columns={userColumns}
                        getRowKey={(user) => user.user_id}
                        onRowClick={(user) => navigate(`/member/${user.user_id}`)}
                    />
                </div>
            </div>
        </div>
    );
}