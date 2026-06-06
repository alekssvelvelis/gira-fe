import { ORGANIZATIONS, USERS } from "@/constants/dummy-data";
import { useNavigate } from 'react-router-dom';

export const OrganizationsView = () => {
    const navigate = useNavigate();
    
    const currentUser = USERS['usr-001'];
    const organizations = Object.values(ORGANIZATIONS).filter(org => org.org_id === currentUser.org_id);  

    if (!organizations) {
        return (
            <div className='min-h-full flex items-center justify-center'>
                <h1 className='text-3xl'>You don't belong to any organizations yet.</h1>
            </div>
        );
    }

    return (
        <div className='min-w-full min-h-full p-2 bg-darkened-surface flex md:flex-col flex-wrap'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
                <h1 className='text-3xl font-light'>Your organizations</h1>
                
                <div className='flex flex-wrap gap-6'>
                    {organizations.map((org) => (
                        <div
                            key={org.org_id}
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

                                <div className='pt-2 border-t border-accent'>
                                    <p className='text-xs'>
                                        Organization ID: <span className='font-mono'>{org.org_id}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {organizations.length === 0 && (
                    <div className='text-center py-12'>
                        <p className='text-accent text-lg'>No organizations found for this user.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
