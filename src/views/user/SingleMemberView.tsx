import { USERS } from "@/constants/dummy-data";
import type { User } from '@/constants/dummy-data';

import { FiEdit2 } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";

export const SingleMemberView = () => {
    const navigate = useNavigate();
    return(
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
                                <p className='text-xl font-medium'>{singleMember[0].nickname}</p>
                            </div>
                        </div>
        
                        <div className='flex items-center'>
                            <span className='text-xl font-medium'>
                                Member since: 23/06/2005
                            </span>
                        </div>
                    </div>
        
                    <div className='flex flex-1 flex-col md:flex-row gap-8 mb-8'>
                        
                        <div className='flex-shrink-0'>
                            <img
                                src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s'}
                                alt={`${singleMember[0]} profile picture`}
                                className='w-80 h-64 object-cover rounded-lg border border-accent'
                            />
                        </div>
        
                        <div className='flex flex-col gap-6 flex-1'>
        
                            <div>
                                <p className='text-sm text-accent mb-2'>Description</p>
                                {/* <p className='text-lg leading-relaxed'>{orgRepresented[0].org_description}</p> */}
                            </div>
        
                            <div className='grid grid-cols-3 gap-4 pt-4 border-t'>
                                <div>
                                    <p className='text-xs text-accent mb-1'>Organization ID</p>
                                    {/* <p className='font-mono text-sm'>{orgRepresented[0].org_id}</p> */}
                                </div>
                                <div>
                                    <p className='text-xs text-accent mb-1'>Organization Code</p>
                                    {/* <p className='font-mono text-sm'>{orgRepresented[0].org_identifier}</p> */}
                                </div>
                                <div>
                                    <p className='text-xs text-accent mb-1'>Role</p>
                                    <p className='font-mono text-sm'>Role name</p>
                                </div>
                                <div>
                                    <p className='text-xs text-accent mb-1'>Organization ID</p>
                                    {/* <p className='font-mono text-sm'>{orgRepresented[0].org_id}</p> */}
                                </div>
                                <div>
                                    <p className='text-xs text-accent mb-1'>Organization Code</p>
                                    {/* <p className='font-mono text-sm'>{orgRepresented[0].org_identifier}</p> */}
                                </div>
                                <div>
                                    <p className='text-xs text-accent mb-1'>Role</p>
                                    <p className='font-mono text-sm'>Role name</p>
                                </div>
                            </div>
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