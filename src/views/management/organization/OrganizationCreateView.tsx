import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { FormField } from '@/components/input/FormField';

interface OrganizationCreateErrors {
    OrgNameError: string;
    OrgIdentifierError: string;
    OrgDescriptionError: string;
    OrgPictureError: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const SingleOrganizationCreateView = () => {
    const navigate = useNavigate();

    const [orgPicture, setOrgPicture] = useState<string | null>(null);
    const [orgName, setOrgName] = useState<string>('');
    const [orgIdentifier, setOrgIdentifier] = useState<string>('');
    const [orgDescription, setOrgDescription] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setOrgPicture(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const [errors, setErrors] = useState<OrganizationCreateErrors>({
        OrgNameError: '',
        OrgIdentifierError: '',
        OrgDescriptionError: '',
        OrgPictureError: '',
    });

    const validateImageType = (value: string | null): string => {
        if (!value) return ''; // image is optional
        const mimeMatch = value.match(/^data:([\w/]+);base64,/);
        if (!mimeMatch) return 'Invalid image format.';
        const mime = mimeMatch[1];
        if (!ALLOWED_IMAGE_TYPES.includes(mime)) {
            return 'Only JPG, JPEG, or PNG images are allowed.';
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: OrganizationCreateErrors = {
            OrgNameError: '',
            OrgIdentifierError: '',
            OrgDescriptionError: '',
            OrgPictureError: validateImageType(orgPicture),
        };

        if (!orgName.trim()) {
            newErrors.OrgNameError = 'Organization name is required.';
        }

        if (!orgIdentifier.trim()) {
            newErrors.OrgIdentifierError = 'Organization identifier is required.';
        }
        if (orgIdentifier.length > 5) {
            newErrors.OrgIdentifierError = 'Organization identifier must be 5 characters or less.';
        }
        if (!/^[a-zA-Z0-9]+$/.test(orgIdentifier)) {
            newErrors.OrgIdentifierError = 'Organization identifier can only contain letters and numbers.';
        }

        if (!orgDescription.trim()) {
            newErrors.OrgDescriptionError = 'Organization description is required.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some(e => e !== '')) return;

        console.log('Organization created successfully');
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
                        <p className='text-lg mb-0.5'>Create an Organization:</p>
                        <p className='text-xl font-medium'>You can use any name</p>
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
                        accept='image/jpeg, image/jpg, image/png'
                        className='hidden'
                        onChange={handleImageChange}
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className='relative w-48 h-32 rounded-lg border border-dashed border-accent overflow-hidden group hover:cursor-pointer hover:border-primary transition-colors'
                    >
                        <img
                            src={orgPicture ?? 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/3840px-Question_Mark.svg.png'}
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
                        value={orgName}
                        onChange={setOrgName}
                        config={{ type: 'text' }}
                        placeholder='Enter organization name...'
                        error={errors.OrgNameError}
                    />
                    <FormField
                        name='org-edit-identifier'
                        label='Organization identifier (max 5 letters/numbers)'
                        value={orgIdentifier}
                        onChange={setOrgIdentifier}
                        config={{ type: 'text' }}
                        placeholder='e.g., CORPX'
                        error={errors.OrgIdentifierError}
                    />

                    <div className='lg:col-span-2'>
                        <FormField
                            name='org-edit-description'
                            label='Organization description'
                            value={orgDescription}
                            onChange={setOrgDescription}
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
                    Create organization
                </button>
            </form>
        </div>
    );
};
