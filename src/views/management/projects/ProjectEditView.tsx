import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FiEdit2 } from 'react-icons/fi';
import { FormField } from '@/components/input/FormField';
import { getSpecificProjectRequest, projectEditRequest } from '@/services/projectService';

import type { Project } from '@/constants/dummy-data';

interface ProjectEditErrors {
    ProjectNameError: string;
    ProjectDescriptionError: string;
}

export const ProjectEditView = () => {
    const navigate = useNavigate();
    const { orgId, projId } = useParams<{ orgId: string; projId: string }>();

    const [singleProjectData, setSingleProjectData] = useState<Project>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<ProjectEditErrors>({
        ProjectNameError: '',
        ProjectDescriptionError: '',
    });

    useEffect(() => {
        const fetchSingleProject = async (organizationId: number, projectId: number) => {
            try {
                setIsLoading(true);   
                const response = await getSpecificProjectRequest(organizationId, projectId);
                setSingleProjectData(response.project);
            } catch (error) {
                console.error("Failed to fetch single project:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if(orgId && projId){
            fetchSingleProject(Number(orgId), Number(projId));
        }
    },[orgId, projId]);

    const handleFieldChange = (key: keyof Project) => (value: string) => {
        setSingleProjectData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [key]: value
            };
        });
    };
    console.log(singleProjectData);
    if (isLoading) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl text-white'>Loading...</h1>
            </div>
        );
    }
    
    if (!singleProjectData) return (
        <div className='min-h-full flex items-center justify-center'>
            <h1 className='text-3xl'>Project not found.</h1>
        </div>
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: ProjectEditErrors = {
            ProjectNameError: '',
            ProjectDescriptionError: '',
        };

        if (!singleProjectData.project_name.trim()) {
            newErrors.ProjectNameError = 'Project name is required.';
        }

        if (!singleProjectData.project_description.trim()) {
            newErrors.ProjectDescriptionError = 'Project description is required.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some(e => e !== '')) return;
        try {
            await projectEditRequest(
                singleProjectData.project_name,
                singleProjectData.project_description,
                Number(orgId),
                Number(projId)
            );
            navigate(`/organization/${orgId}/project/${projId}`);
        } catch (error: any) {
            if (error.response?.status === 422) {
                const laravelErrors = error.response.data.errors;
                console.log(laravelErrors);
                setErrors({
                    ProjectNameError: laravelErrors.project_name?.[0] ?? '',
                    ProjectDescriptionError: laravelErrors.project_description?.[0] ?? '',
                });
            }
        }
        console.log('Project updated successfully');
    };

    return (
        <div className='relative min-h-full max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>

            <div className='flex items-center justify-between pb-3 border-b border-border mb-5'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate(`/organization/${orgId}/project/${projId}`)}
                        className='flex items-center justify-center'
                        aria-label='Go back'
                    >
                        <GoArrowLeft className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </button>
                    <div>
                        <p className='text-lg mb-0.5'>Editing project: {singleProjectData?.project_name}</p>
                        <p className='text-xl font-medium font-mono'>Project ID: {singleProjectData?.id}</p>
                    </div>
                </div>
            </div>

            <form
                id='project-edit-form'
                className='flex flex-col w-full gap-6'
                onSubmit={handleSubmit}
            >
                <div className='grid grid-cols-1 gap-4'>
                    <FormField
                        name='project-edit-name'
                        label='Project name'
                        value={singleProjectData?.project_name || ''}
                        onChange={handleFieldChange('project_name')}
                        config={{ type: 'text' }}
                        placeholder='Enter project name...'
                        error={errors.ProjectNameError}
                    />
                </div>

                <div>
                    <FormField
                        name='project-edit-description'
                        label='Project description'
                        value={singleProjectData?.project_description || ''}
                        onChange={handleFieldChange('project_description')}
                        config={{ type: 'textarea', rows: 5 }}
                        placeholder='Enter organization description...'
                        error={errors.ProjectDescriptionError}
                    />
                </div>

                <button
                    type='submit'
                    id='project-edit-form-submit'
                    className='flex justify-center text-center gap-1.5 bg-green-500 p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-green-600'
                >
                    <FiEdit2 className='h-5 w-5' />
                    Save changes
                </button>
            </form>
        </div>
    );
};
