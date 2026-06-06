import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FiEdit2, FiUserPlus } from 'react-icons/fi';
import { ORGANIZATIONS, USERS } from '@/constants/dummy-data';

export const SingleOrganizationView = () => {
    const navigate = useNavigate();
    const { orgId } = useParams<{ orgId: string }>();
    
    const organization = Object.values(ORGANIZATIONS).find(org => org.org_id === orgId);
    const currentUser = USERS['usr-001'];
    const owner = USERS[organization?.owner_id || ''];
    
    if (!organization) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl'>Organization not found.</h1>
            </div>
        );
    }

    const isOwner = currentUser.user_id === organization.owner_id;

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
                        <p className='text-xl font-medium'>{organization.org_name}</p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='text-sm bg-primary text-secondary px-4 py-2 rounded-lg font-medium'>
                        {organization.org_identifier}
                    </span>
                </div>
            </div>

            <div className='flex flex-1 flex-col md:flex-row gap-8 mb-8'>
                
                <div className='flex-shrink-0'>
                    <img
                        src={organization.picture}
                        alt={organization.org_name}
                        className='w-80 h-64 object-cover rounded-lg border border-accent'
                    />
                </div>

                <div className='flex flex-col gap-6 flex-1'>
                    <div>
                        <p className='text-sm text-accent mb-2'>Created by</p>
                        <p className='text-2xl font-semibold'>{owner?.nickname || owner?.email}</p>
                        <p className='text-xs text-accent mt-1 font-mono'>{owner?.user_id}</p>
                    </div>

                    <div>
                        <p className='text-sm text-accent mb-2'>Description</p>
                        <p className='text-lg leading-relaxed'>{organization.org_description}</p>
                    </div>

                    <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
                        <div>
                            <p className='text-xs text-accent mb-1'>Organization ID</p>
                            <p className='font-mono text-sm'>{organization.org_id}</p>
                        </div>
                        <div>
                            <p className='text-xs text-accent mb-1'>Organization Code</p>
                            <p className='font-mono text-sm'>{organization.org_identifier}</p>
                        </div>
                    </div>
                </div>
            </div>

            {isOwner && (
                <div className='flex w-full flex-wrap  gap-3 pb-4 justify-end'>
                    <button
                        onClick={() => navigate(`/organization/${organization.org_id}/invite`)}
                        className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                    >
                        <FiUserPlus className='h-5 w-5' />
                        Invite Members
                    </button>
                    <button
                        onClick={() => navigate(`/organization/${organization.org_id}/edit`)}
                        className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                    >
                        <FiEdit2 className='h-5 w-5' />
                        Edit Organization
                    </button>
                </div>
            )}
        </div>
    );
}
