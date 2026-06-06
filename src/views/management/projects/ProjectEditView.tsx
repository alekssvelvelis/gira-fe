import { PROJECTS } from '@/constants/dummy-data';
import { useNavigate, useParams } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FiEdit2 } from 'react-icons/fi';
import { useState } from 'react';
import { FormField } from '@/components/input/FormField';

interface ProjectEditErrors {
    ProjectNameError: string;
    ProjectDescriptionError: string;
}

export const ProjectEditView = () => {
    const navigate = useNavigate();
    const { orgId, projId } = useParams<{ orgId: string; projId: string }>();
    const project = Object.values(PROJECTS).find(p => p.project_id === projId);

    if (!project) return (
        <div className='min-h-full flex items-center justify-center'>
            <h1 className='text-3xl'>Project not found.</h1>
        </div>
    );

    const [projectName, setProjectName] = useState<string>(project.name);
    const [projectDescription, setProjectDescription] = useState<string>(project.description);

    const [errors, setErrors] = useState<ProjectEditErrors>({
        ProjectNameError: '',
        ProjectDescriptionError: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: ProjectEditErrors = {
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

        console.log('Project updated successfully');
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
                        <p className='text-lg mb-0.5'>Editing project</p>
                        <p className='text-xl font-medium font-mono'>{project.project_id}</p>
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
                        value={projectName}
                        onChange={setProjectName}
                        config={{ type: 'text' }}
                        placeholder='Enter project name...'
                        error={errors.ProjectNameError}
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium mb-2'>Project description</label>
                    <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder='Enter project description...'
                        className='w-full px-3 py-2 border border-border rounded-lg bg-surface text-sidebar-text focus:outline-none focus:ring-2 focus:ring-accent'
                        rows={6}
                    />
                    {errors.ProjectDescriptionError && (
                        <p className='text-red-500 text-sm mt-1'>{errors.ProjectDescriptionError}</p>
                    )}
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
