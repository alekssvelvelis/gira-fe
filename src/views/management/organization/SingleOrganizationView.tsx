import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FiEdit2, FiUserPlus, FiUsers, FiPlusCircle, FiXCircle } from 'react-icons/fi';

import { deleteSpecificOrganization, getSpecificOrganizationRequest } from '@/services/organizationService';
import { projectsGetRequest } from '@/services/projectService'; 

import type { Organization, Project } from '@/constants/dummy-data';
import type { ColumnDef } from '@/components/output/DataTable';

import { DataTable } from '@/components/output/DataTable';
import { BACKEND_URL } from '@/utils/axios';

import { useAuth } from '@/hooks/useAuth';

import { InviteMember } from '@/components/input/InviteMember';
import { ConfirmModal } from '@/components/input/ConfirmDelete';

export const SingleOrganizationView = () => {
    const navigate = useNavigate();
    const { orgId } = useParams<{ orgId: string }>();
    const { user } = useAuth();
    
    const [organizationData, setOrganizationData] = useState<Organization>();
    const [projectData, setProjectData] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isInvitingShown, setInvitingShown] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    useEffect(() => {
        const fetchSingleOrganization = async (organizationId: number) => {
            try {
                setIsLoading(true);
                const data = await getSpecificOrganizationRequest(organizationId);
                setOrganizationData(data);
            } catch (error) {
                console.error("Failed to fetch organization:", error);
            } finally {
                setIsLoading(false);
            }
        }

        const fetchSingleOrganizationProjects = async (organizationId: number) => {
            try {
                setIsLoading(true);
                const data = await projectsGetRequest(organizationId);
                setProjectData(data);
            } catch (error) {
                console.error("Failed to fetch organization projects:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (orgId) {
            fetchSingleOrganization(Number(orgId));
            fetchSingleOrganizationProjects(Number(orgId));
            
        }
    }, [orgId]);

    if (isLoading) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl text-white'>Loading...</h1>
            </div>
        );
    }
    
    if (!organizationData) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl'>Organization not found.</h1>
            </div>
        );
    }

    console.log(projectData);
    
    const projectColumns: ColumnDef<Project>[] = [
        {
            key: 'id',
            header: 'Project ID',
            render: (project) => project.id,
        },
        {
            key: 'project_name',
            header: 'Name',
            render: (project) => project.project_name,
        },
        {
            key: 'project_description',
            header: 'Description',
            render: (project) => project.project_description,
        },
    ];

    return (
        <div className='relative min-h-full flex flex-col max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>
            {isInvitingShown && (
                <InviteMember
                    organizationId={orgId}
                    onClose={() => setInvitingShown(false)}
                />
            )}
            <div className='flex items-center justify-between pb-3 border-b border-border mb-8'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate(`/organizations`)}
                        className='flex items-center justify-center'
                        aria-label='Go back'
                    >
                        <GoArrowLeft className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </button>
                    <div>
                        <p className='text-lg mb-0.5'>Currently viewing:</p>
                        <p className='text-xl font-medium'>{organizationData.organization_name}</p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='text-sm bg-primary text-secondary px-4 py-2 rounded-lg font-medium'>
                        {organizationData.organization_identifier}
                    </span>
                </div>
            </div>

            <div className='flex flex-1 flex-col md:flex-row gap-8 mb-8'>
                
                <div className='flex-shrink-0'>
                    <img
                        src={`${BACKEND_URL}/storage/${organizationData.organization_picture}`}
                        alt={organizationData.organization_name}
                        className='w-80 h-64 object-cover rounded-lg border border-accent'
                    />
                </div>

                <div className='flex flex-col gap-6 flex-1'>
                    <div>
                        <p className='text-sm text-accent mb-2'>Created by</p>
                        <p className='text-2xl font-semibold'>{organizationData.owner?.name || organizationData.owner?.email}</p>
                        <p className='text-xs text-accent mt-1 font-mono'>{organizationData.owner?.id}</p>
                    </div>

                    <div>
                        <p className='text-sm text-accent mb-2'>Description</p>
                        <p className='text-lg leading-relaxed'>{organizationData.organization_description}</p>
                    </div>

                    <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
                        <div>
                            <p className='text-xs text-accent mb-1'>Organization ID</p>
                            <p className='font-mono text-sm'>{organizationData.id}</p>
                        </div>
                        <div>
                            <p className='text-xs text-accent mb-1'>Organization Code</p>
                            <p className='font-mono text-sm'>{organizationData.organization_identifier}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mb-8'>
                <div className='flex justify-between'>
                    <h2 className='text-2xl font-semibold mb-4'>Projects</h2>
                    {user?.id === organizationData.owner?.id &&
                        <button
                            onClick={() => navigate(`/organization/${organizationData.id}/projects/create`)}
                            className='flex items-center gap-2 bg-accent px-2 mb-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                        >
                            <FiPlusCircle className='h-5 w-5' />
                            Create Project
                        </button>
                    }
                </div>
                <DataTable
                    data={projectData}
                    columns={projectColumns}
                    getRowKey={(project) => project.id}
                    onRowClick={(project) => navigate(`/organization/${orgId}/project/${project.id}`)}
                />
            </div>

            {user?.id === organizationData.owner?.id && (
                <div className='flex w-full flex-wrap  gap-3 pb-4 justify-end'>
                    <button
                        onClick={() => setInvitingShown(true)}
                        className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                    >
                        <FiUserPlus className='h-5 w-5' />
                        Invite Members
                    </button>
                    <button
                        onClick={() => navigate(`/organization/${organizationData.id}/members`)}
                        className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                    >
                        <FiUsers className='h-5 w-5' />
                        View Members
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                    >
                        <FiXCircle className='h-5 w-5' />
                        Delete Organization
                    </button>
                    <button
                        onClick={() => navigate(`/organization/${organizationData.id}/edit`)}
                        className='flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary hover:cursor-pointer'
                    >
                        <FiEdit2 className='h-5 w-5' />
                        Edit Organization
                    </button>
                    {isModalOpen && 
                    <>
                        <ConfirmModal
                            isOpen={isModalOpen}
                            title="Delete organization?"
                            description={`Organization ${organizationData.organization_name} with ID: "${organizationData.id}" will be permanently removed.`}
                            onConfirm={() => {
                                deleteSpecificOrganization(Number(orgId));
                                navigate(`/organizations`);
                            }}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </>
                    }
                </div>
            )}
        </div>
    );
}
