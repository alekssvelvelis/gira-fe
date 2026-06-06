import { ORGANIZATIONS, USERS } from "@/constants/dummy-data";
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle } from "react-icons/fi";

const REPEAT = 3;

export const OrganizationsView = () => {
    const navigate = useNavigate();

    const currentUser = USERS['usr-001'];
    const organizations = Object.values(ORGANIZATIONS).filter(org => org.org_id === currentUser.org_id);

    return (
        <div className='relative min-h-full flex flex-col max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
                <h1 className='text-3xl font-light'>Your organizations</h1>

                <div className='flex flex-wrap gap-6'>
                    {organizations.flatMap((org, orgIndex) =>
                        Array.from({ length: REPEAT }, (_, i) => (
                            <div
                                key={`${org.org_id}-${i}`}
                                onClick={() => navigate(`/organization/${org.org_id}`)}
                                className='flex-1 min-w-80 max-w-sm bg-surface border border-accent rounded-lg overflow-hidden hover:border-primary transition-all hover:cursor-pointer'
                            >
                                <div className='h-48 overflow-hidden bg-darkened-surface'>
                                    <img
                                        src={org.picture}
                                        alt={org.org_name}
                                        className='w-full h-full object-cover'
                                    />
                                </div>

                                <div className='p-4 flex flex-col gap-3'>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-2xl font-semibold'>{org.org_name}</h2>
                                        <span className='text-sm bg-primary text-secondary px-3 py-1 rounded-full font-medium'>
                                            {org.org_identifier}
                                        </span>
                                    </div>

                                    <p className='text-sm line-clamp-2'>
                                        {org.org_description}
                                    </p>

                                    <div className='pt-2 border-t'>
                                        <p className='text-xs text-accent'>
                                            Organization ID: <span className='font-mono text-sidebar-text'>{org.org_id}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {organizations.length === 0 && (
                    <div className='text-center py-12'>
                        <p className='text-accent text-lg'>No organizations found for this user.</p>
                    </div>
                )}
            </div>

            <div className='sticky bottom-4 self-end mt-8'>
                <button
                    onClick={() => navigate(`/organization/create`)}
                    className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                >
                    <FiPlusCircle className='h-5 w-5' />
                    Create Organization
                </button>
            </div>
        </div>
    );
}