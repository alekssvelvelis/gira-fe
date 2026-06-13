import { useState, useEffect } from 'react';
import type { Organization } from "@/constants/dummy-data";
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle } from "react-icons/fi";
import { organizationsGetRequest } from "@/services/organizationService";
import { BACKEND_URL } from '@/utils/axios';
export const OrganizationsView = () => {
    const navigate = useNavigate();
    const [userOrganizations, setUserOrganizations] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                setIsLoading(true);
                const data = await organizationsGetRequest();
                setUserOrganizations(data);
            } catch (error) {
                console.error("Failed to fetch user organiaztions:", error);
            } finally {
                setIsLoading(false);
            }
            const data = await organizationsGetRequest();
            setUserOrganizations(data);
        };

        fetchOrganizations();
    },[]);

    if (isLoading) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl text-white'>Loading...</h1>
            </div>
        );
    }

    return (
        <div className='relative min-h-full flex flex-col max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
                <h1 className='text-3xl font-light'>Your organizations</h1>

                <div className='flex flex-wrap gap-6'>
                    {userOrganizations?.map((org: Organization, orgIndex: number) =>
                            <div
                                key={`${org.id}`}
                                onClick={() => navigate(`/organization/${org.id}`)}
                                className='flex-1 min-w-80 max-w-sm bg-surface border border-accent rounded-lg overflow-hidden hover:border-primary transition-all hover:cursor-pointer'
                            >
                                <div className='h-48 overflow-hidden object-cover bg-darkened-surface'>
                                    <img
                                        src={`${BACKEND_URL}/storage/${org.organization_picture}`}
                                        alt={org.organization_name}
                                        className='w-full h-full object-cover'
                                    />
                                </div>

                                <div className='p-4 flex flex-col gap-3'>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='text-2xl font-semibold'>{org.organization_name}</h2>
                                        <span className='text-sm bg-primary text-secondary px-3 py-1 rounded-full font-medium'>
                                            {org.organization_identifier}
                                        </span>
                                    </div>

                                    <p className='text-sm line-clamp-2'>
                                        {org.organization_description}
                                    </p>

                                    <div className='pt-2 border-t'>
                                        <p className='text-xs text-accent'>
                                            Organization ID: <span className='font-mono text-sidebar-text'>{org.id}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                    )}
                </div>

                {userOrganizations.length === 0 && (
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