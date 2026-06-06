import type { Project } from '@/constants/dummy-data';
import type { ColumnDef } from '@/components/output/DataTable';

import { DataTable } from "@/components/output/DataTable";
import { PROJECTS } from "@/constants/dummy-data";

import { useNavigate, useParams } from 'react-router-dom';
export const ProjectsView = () => {

    const navigate = useNavigate();
    const { orgId } = useParams<{ orgId: string }>();
    const projects = Object.values(PROJECTS).filter(p => p.org_id === orgId);


    const projectColumns: ColumnDef<Project>[] = [
            {
                key: 'project_id',
                header: 'Project ID',
                render: (project) => project.project_id,
            },
            {
                key: 'name',
                header: 'Name',
                render: (project) => project.name,
            },
            {
                key: 'description',
                header: 'Description',
                render: (project) => project.description,
            },
        ];

    return(
        <div className='min-w-full min-h-full p-2 bg-darkened-surface flex md:flex-col flex-wrap'>
            <div className='md:w-full flex flex-col gap-6 overflow-x-scroll'>
                <h1 className='text-3xl font-light'>Organization projects</h1>
                <div>
                    <DataTable
                        data={projects}
                        columns={projectColumns}
                        getRowKey={(project) => project.project_id}
                        onRowClick={(project) => navigate(`/organization/${orgId}/project/${project.project_id}`)}
                    />
                </div>
            </div>
        </div>
    );
}
