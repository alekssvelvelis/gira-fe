import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { useState } from 'react';
import { FormField } from '@/components/input/FormField';
import { projectCreateRequest } from '@/services/projectService';
interface ProjectCreateErrors {
    ProjectNameError: string;
    ProjectDescriptionError: string;
}

export const ProjectCreateView = () => {
    const navigate = useNavigate();
    const { orgId } = useParams<{ orgId: string }>();

    const [projectName, setProjectName] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');

    const [errors, setErrors] = useState<ProjectCreateErrors>({
        ProjectNameError: '',
        ProjectDescriptionError: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: ProjectCreateErrors = {
            ProjectNameError: '',
            ProjectDescriptionError: '',
        };

        if (!projectName.trim()) {
            newErrors.ProjectNameError = 'Project name is required.';
        }

        if (!projectDescription.trim()) {
            newErrors.ProjectDescriptionError = 'Project description is required.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some(e => e !== '')) return;
        try {
            await projectCreateRequest(projectName, projectDescription, Number(orgId));
            navigate(-1);
        } catch (error: any) {
            if (error.response?.status === 422) {
                const laravelErrors = error.response.data.errors;
                console.log(laravelErrors);
                setErrors({
                    ProjectNameError: laravelErrors.project_name?.[0] ?? '',
                    ProjectDescriptionError: laravelErrors.organization_identifier?.[0] ?? '',
                });
            }
        }
        console.log('Project created successfully');
    };

    return (
        <div className='relative min-h-full max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>

            <div className='flex items-center justify-between pb-3 border-b border-border mb-5'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center justify-center'
                        aria-label='Go back'
                    >
                        <GoArrowLeft className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </button>
                    <div>
                        <p className='text-lg mb-0.5'>Creating new project</p>
                        <p className='text-xl font-medium'>{orgId}</p>
                    </div>
                </div>
            </div>

            <form
                id='project-create-form'
                className='flex flex-col w-full gap-6'
                onSubmit={handleSubmit}
            >
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <FormField
                        name='project-create-name'
                        label='Project name'
                        value={projectName}
                        onChange={setProjectName}
                        config={{ type: 'text' }}
                        placeholder='Enter project name...'
                        error={errors.ProjectNameError}
                    />
                </div>

                <div>
                    <FormField
                        name='project-description'
                        label='Project description'
                        value={projectDescription}
                        onChange={setProjectDescription}
                        config={{ type: 'textarea', rows: 5 }}
                        placeholder='Enter project description...'
                        error={errors.ProjectDescriptionError}
                    />
                </div>

                <button
                    type='submit'
                    id='project-create-form-submit'
                    className='flex justify-center text-center gap-1.5 bg-green-500 p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-green-600'
                >
                    Create project
                </button>
            </form>
        </div>
    );
};
