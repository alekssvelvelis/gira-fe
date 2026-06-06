
import type { User } from '@/constants/dummy-data';
import type { ColumnDef } from '@/components/output/DataTable';

import { DataTable } from "@/components/output/DataTable";
import { USERS } from "@/constants/dummy-data";

import { useNavigate } from 'react-router-dom';
export const MemberView = () => {

    const navigate = useNavigate();
    const members = Object.values(USERS).filter(u => u.org_id === 'org-001');


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
        <div className='min-w-full min-h-full p-2 bg-darkened-surface flex md:flex-col flex-wrap'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
                <h1 className='text-3xl font-light'>Your organizations members</h1>
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