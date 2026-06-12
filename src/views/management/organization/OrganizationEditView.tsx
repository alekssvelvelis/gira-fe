import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { FormField } from '@/components/input/FormField';
import { useAuth } from '@/hooks/useAuth';

import { getSpecificOrganizationRequest, organizationEditRequest } from '@/services/organizationService';

import type { Organization } from '@/constants/dummy-data';

import { BACKEND_URL } from '@/utils/axios';

interface OrganizationEditErrors {
    OrgNameError: string;
    OrgIdentifierError: string;
    OrgDescriptionError: string;
    OrgPictureError: string;
}

export const SingleOrganizationEditView = () => {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const fileInputRef = useRef<HTMLInputElement>(null);
        
    const [organizationData, setOrganizationData] = useState<Organization>();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<OrganizationEditErrors>({
        OrgNameError: '',
        OrgIdentifierError: '',
        OrgDescriptionError: '',
        OrgPictureError: '',
    });

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

        if (orgId) {
            fetchSingleOrganization(Number(orgId));
        }
    }, [orgId]);

    if (isLoading) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl text-white'>Loading...</h1>
            </div>
        );
    }

    if (!organizationData || user?.id != organizationData.owner_id) {
        return (
            <div className='min-h-full flex items-center justify-center bg-darkened-surface'>
                <h1 className='text-3xl'>Organization not found.</h1>
            </div>
        );
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(organizationData);
        const newErrors: OrganizationEditErrors = {
            OrgNameError: '',
            OrgIdentifierError: '',
            OrgDescriptionError: '',
            OrgPictureError: '',
        };

        if (!organizationData.organization_name.trim()) {
            newErrors.OrgNameError = 'Organization name is required.';
        }

        if (!organizationData.organization_identifier.trim()) {
            newErrors.OrgIdentifierError = 'Organization identifier is required.';
        }
        if (organizationData.organization_identifier.length > 5) {
            newErrors.OrgIdentifierError = 'Organization identifier must be 5 characters or less.';
        }
        if (!/^[a-zA-Z0-9]+$/.test(organizationData.organization_identifier)) {
            newErrors.OrgIdentifierError = 'Organization identifier can only contain letters and numbers.';
        }

        if (!organizationData.organization_description.trim()) {
            newErrors.OrgDescriptionError = 'Organization description is required.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some(e => e !== '')) return;

        try {
            await organizationEditRequest(
                Number(orgId), 
                organizationData.organization_name, 
                organizationData.organization_identifier,
                organizationData.organization_description,
                selectedFile? selectedFile : undefined
            );
            navigate(`/organization/${orgId}`);
        } catch (error: any) {
            if (error.response?.status === 422) {
                const laravelErrors = error.response.data.errors;
                console.log(laravelErrors);
                setErrors({
                    OrgNameError: laravelErrors.organization_name?.[0] ?? '',
                    OrgIdentifierError: laravelErrors.organization_identifier?.[0] ?? '',
                    OrgDescriptionError: laravelErrors.organization_description?.[0] ?? '',
                    OrgPictureError: laravelErrors.organization_picture?.[0] ?? '',
                });
            }
        }
    };

    const handleFieldChange = (key: keyof Organization) => (value: string) => {
        setOrganizationData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [key]: value
            };
        });
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
                        <p className='text-lg mb-0.5'>Currently Editing:</p>
                        <p className='text-xl font-medium'>{organizationData.organization_name}</p>
                    </div>
                </div>
            </div>

            <form
                id='org-edit-form'
                className='flex flex-col w-full gap-6'
                onSubmit={handleSubmit}
            >
                <div>
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/jpeg, image/jpg, image/png, image/webp'
                        className='hidden'
                        onChange={handleImageChange}
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className='relative w-48 h-32 rounded-lg border border-dashed border-accent overflow-hidden group hover:cursor-pointer hover:border-primary transition-colors'
                    >
                        <img
                            src={previewUrl ?? `${BACKEND_URL}/storage/${organizationData.organization_picture}`}
                            className='w-full h-full object-cover'
                            alt='Organization logo'
                        />
                        <div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                            <span className='text-white text-sm text-center'>Change logo</span>
                        </div>
                    </div>

                    {errors.OrgPictureError && (
                        <p className='text-red-500 text-sm mt-1'>{errors.OrgPictureError}</p>
                    )}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <FormField
                        name='org-edit-name'
                        label='Organization name'
                        value={organizationData?.organization_name ||  ''}
                        onChange={handleFieldChange('organization_name')}
                        config={{ type: 'text' }}
                        placeholder='Enter organization name...'
                        error={errors.OrgNameError}
                    />
                    <FormField
                        name='org-edit-identifier'
                        label='Organization identifier (max 5 letters/numbers)'
                        value={organizationData?.organization_identifier || ''}
                        onChange={handleFieldChange('organization_identifier')}
                        config={{ type: 'text' }}
                        placeholder='e.g., NXPAY'
                        error={errors.OrgIdentifierError}
                    />

                    <div className='lg:col-span-2'>
                        <FormField
                            name='org-edit-description'
                            label='Organization description'
                            value={organizationData?.organization_description || ''}
                            onChange={handleFieldChange('organization_description')}
                            config={{ type: 'textarea', rows: 5 }}
                            placeholder='Enter organization description...'
                            error={errors.OrgDescriptionError}
                        />
                    </div>
                </div>

                <button
                    type='submit'
                    id='org-edit-form-submit'
                    className='flex justify-center text-center gap-1.5 bg-green-500 p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-green-600'
                >
                    Save changes
                </button>
            </form>
        </div>
    );
};
