import { useState, useEffect } from 'react';

import type{ Organization, User } from '@/constants/dummy-data';

import { FiEdit2, FiXCircle } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { getSpecificUser, getSpecificUserOrganizations, getSelf, deleteSpecificUser } from '@/services/userService';
import { BACKEND_URL } from '@/utils/axios';
import { formatDateDayMonthYear } from '@/utils/dateUtils';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmModal } from '@/components/input/ConfirmDelete';

export const SingleMemberView = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{userId: string}>()
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState<User>();
    const [userOrganizations, setUserOrganizations] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async(userId: number) => {
            try {
                setIsLoading(true);
                let response;
                if (Number(userId) === user?.id){
                    response = await getSelf(userId);
                } else {
                    response = await getSpecificUser(userId);
                }
                setUserData(response);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        const fetchUserOrganizations = async(userId: number) => {
            try {
                const response = await getSpecificUserOrganizations(userId);
                setUserOrganizations(response);
            } catch (error) {
                console.error("Failed to fetch user organiaztions:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchUser(Number(userId));
        fetchUserOrganizations(Number(userId));
    },[userId])
    
    if (isLoading) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl text-white'>Loading...</h1>
            </div>
        );
    }
    console.log(userData);
    console.log(userOrganizations);
    return(
        <div className='relative min-h-full flex flex-col max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>
        
                    <div className='flex items-center justify-between pb-3 border-b border-border mb-8'>
                        <div className='flex items-center gap-3'>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className='flex items-center justify-center'
                                aria-label='Go back'
                            >
                                <GoArrowLeft className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                            </button>
                            <div>
                                <p className='text-lg mb-0.5'>Currently viewing:</p>
                                <p className='text-xl font-medium'>{userData?.nickname}</p>
                            </div>
                        </div>
        
                        <div className='flex items-center'>
                            <span className='text-xl font-medium'>
                                Member since: {formatDateDayMonthYear(userData?.created_at ?? '')}
                            </span>
                        </div>
                    </div>
        
                    <div className='flex flex-1 flex-col md:flex-row gap-8 mb-8'>
                        
                        <div className='flex-shrink-0'>
                            <img
                                src={`${BACKEND_URL}/storage/${userData?.profile_picture}`}
                                alt={`${userData?.nickname} profile picture`}
                                className='w-80 h-64 object-cover rounded-lg border border-accent'
                            />
                            <h1 className='text-center'>{userData?.nickname} profile picture</h1>
                        </div>
        
                        <div className='flex flex-col gap-6 flex-1'>
                            <h1 className='text-2xl'>User is in Organizations:</h1>
                            {userOrganizations.map(org => (
                            <>
                                <div>
                                    <p className='text-sm text-accent mb-2'>Description</p>
                                    <p className='text-lg leading-relaxed'>{org.organization_description}</p>
                                </div>
            
                                <div className='grid grid-cols-3 gap-4 pt-4 border-t border-b'>
                                    <div>
                                        <p className='text-xs text-accent mb-1'>Organization ID</p>
                                        <p className='font-mono text-sm'>{org.id}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-accent mb-1'>Identifier</p>
                                        <p className='font-mono text-sm'>{org.organization_identifier}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-accent mb-1'>Role</p>
                                        <p className='font-mono text-sm capitalize'>{org.pivot?.role}</p>
                                    </div>

                                </div>
                            </>
                            ))}
                        </div>
                    </div>

                    <div className='flex w-full flex-wrap gap-3 pb-4 justify-end'>
                    {Number(userId) === user?.id &&
                    <>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='flex items-center gap-1.5 bg-accent p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-primary'
                        >
                            <FiXCircle className='h-6 w-6' />
                            Delete User
                        </button>
                        <button
                            onClick={() => navigate(`/member/${userData?.id}/edit`)}
                            className='flex items-center gap-1.5 bg-accent p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-primary'
                        >
                            <FiEdit2 className='h-6 w-6' />
                            Edit User
                        </button>
                        {isModalOpen && 
                            <ConfirmModal
                                isOpen={isModalOpen}
                                title="Delete user?"
                                description={`User ${userData?.nickname} with ID ${userData?.id} will be permanently removed.`}
                                onConfirm={() => {
                                    deleteSpecificUser(Number(user.id));
                                    logout();
                                    navigate(`/`);
                                }}
                                onClose={() => setIsModalOpen(false)}
                            />
                        }
                    </> 
                    }
                    </div>
                </div>
    );
}