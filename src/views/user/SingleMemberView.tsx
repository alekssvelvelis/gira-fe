import { ORGANIZATIONS, USERS } from "@/constants/dummy-data";
import type { User } from '@/constants/dummy-data';

import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const singleMember = Object.values(USERS).filter(u => u.user_id === 'usr-001');
const orgRepresented = Object.values(ORGANIZATIONS).filter(o => o.org_id === singleMember[0].org_id);
export const SingleMemberView = () => {
    const navigate = useNavigate();
    return(
        <div className='min-w-full min-h-full p-2 bg-darkened-surface flex md:flex-col flex-wrap'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll relative'>
                <div className='flex flex-col md:flex-row justify-between'>
                    <h1 className='text-3xl font-light'>{singleMember[0].nickname}</h1>
                    <h1 className='text-2xl font-light'>Member since: ISO timestamp</h1>
                </div>
                <div className='flex flex-col md:flex-row justify-between'>
                    <img 
                    src='https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'
                    className='cover fit-content w-24 h-24 rounded-full border'
                    />
                    <p className='text-3xl'>Organization: {orgRepresented[0].org_name}</p>
                </div>
            </div>
            <button
                onClick={() => navigate(`/member/${singleMember[0].user_id}/edit`)}
                className='absolute bottom-5 right-5 flex items-center gap-1.5 bg-accent p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-primary'
            >
                <FiEdit2 className='h-6 w-6' />
                Edit User
            </button>
        </div>
    );
}