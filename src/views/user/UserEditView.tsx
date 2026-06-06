import { useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { FormField } from '@/components/input/FormField';
import { USERS } from "@/constants/dummy-data";

interface ProfileEditErrors {
    ProfileImageError: string;
    NicknameError: string;
    EmailError: string;
    NewPasswordError: string;
    ConfirmedNewPasswordError: string;
    CurrentPasswordError: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const UserEditView = () => {

    const { userId } = useParams();
    const navigate = useNavigate();

    const specifiedUser = Object.values(USERS).filter(u => u.user_id === userId);

    const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
    const [userNickname, setUserNickname] = useState<string>(specifiedUser[0].nickname);
    const [userEmail, setUserEmail] = useState<string>(specifiedUser[0].email);
    const [userNewPassword, setUserNewPassword] = useState<string>('');
    const [userConfirmedNewPassword, setUserConfirmedNewPassword] = useState<string>('');
    const [userCurrentPassword, setUserCurrentPassword] = useState<string>('');

        const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUserProfilePicture(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const [errors, setErrors] = useState<ProfileEditErrors>({
        ProfileImageError: '',
        NicknameError: '',
        EmailError: '',
        NewPasswordError: '',
        ConfirmedNewPasswordError: '',
        CurrentPasswordError: '',
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

        const isChangingPassword = !!userNewPassword?.trim() || !!userConfirmedNewPassword?.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        const newErrors: ProfileEditErrors = {
            ProfileImageError: validateImageType(userProfilePicture),
            NicknameError: '',
            EmailError: '',
            NewPasswordError: '',
            ConfirmedNewPasswordError: '',
            CurrentPasswordError: '',
        };

        if (!userNickname.trim()) {
            newErrors.NicknameError = 'Nickname is required.';
        }

        if (!userEmail.trim()) {
            newErrors.EmailError = 'Email is required.';
        } else if (!emailPattern.test(userEmail.trim())) {
            newErrors.EmailError = 'Please enter a valid email.';
        }

        if (isChangingPassword && !userNewPassword?.trim()) {
            newErrors.NewPasswordError = 'New password is required.';
        } else if (isChangingPassword && userNewPassword && userNewPassword.length < 8) {
            newErrors.NewPasswordError = 'New password must be at least 8 characters.';
        }

        if (isChangingPassword) {
            if (!userConfirmedNewPassword?.trim()) {
                newErrors.ConfirmedNewPasswordError = 'Please confirm your new password.';
            } else if (userConfirmedNewPassword.length < 8) {
                newErrors.ConfirmedNewPasswordError = 'Confirmed password must be at least 8 characters.';
            } else if (userConfirmedNewPassword !== userNewPassword) {
                newErrors.ConfirmedNewPasswordError = 'Passwords do not match.';
            }
        }

        if (!userCurrentPassword?.trim()) {
            newErrors.CurrentPasswordError = 'Current password is required.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some(e => e !== '')) return;
        
    };

    return (
        <div className='relative min-h-full max-h-full overflow-y-scroll bg-darkened-surface p-4 md:p-6'>

            {/* ── Header ────────────────────────────────────────────────── */}
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
                        <p className='text-xl font-medium font-mono'>{specifiedUser[0].user_id}</p>
                    </div>
                </div>
            </div>

            <form
                id='task-edit-form'
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
                        className='relative w-24 h-24 rounded-full border overflow-hidden group hover:cursor-pointer'
                    >
                        <img
                            src={userProfilePicture ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s'}
                            className='w-full h-full object-cover'
                            alt='Profile picture'
                        />
                        {/* Hover overlay */}
                        <div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                            <span className='text-white text-xs text-center'>Change photo</span>
                        </div>
                    </div>

                    {/* Validation error */}
                    {errors.ProfileImageError && (
                        <p className='text-red-500 text-sm mt-1'>{errors.ProfileImageError}</p>
                    )}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <FormField
                        name='user-edit-nickname'
                        label='User nickname'
                        value={userNickname}
                        onChange={setUserNickname}
                        config={{ type: 'text' }}
                        placeholder='Enter user nickname...'
                        error={errors.NicknameError}
                    />
                    <FormField
                        name='user-edit-email'
                        label='User email'
                        value={userEmail}
                        onChange={setUserEmail}
                        config={{ type: 'email' }}
                        placeholder='Enter user email...'
                        error={errors.EmailError}
                    />
                    <FormField
                        name='user-edit-new-password'
                        label='New password'
                        value={userNewPassword}
                        onChange={setUserNewPassword}
                        config={{ type: 'password' }}
                        placeholder='Enter new password...'
                        error={errors.NewPasswordError}
                    />
                    <FormField
                        name='user-edit-confirmed-new-password'
                        label='Confirm new password'
                        value={userConfirmedNewPassword}
                        onChange={setUserConfirmedNewPassword}
                        config={{ type: 'password' }}
                        placeholder='Confirm new password...'
                        error={errors.ConfirmedNewPasswordError}
                    />

                    {/* Current password spans full width so it stands apart visually */}
                    <div className='lg:col-span-2'>
                        <FormField
                            name='user-edit-current-password'
                            label='Current password (required to save changes)'
                            value={userCurrentPassword}
                            onChange={setUserCurrentPassword}
                            config={{ type: 'password' }}
                            placeholder='Enter current password...'
                            error={errors.CurrentPasswordError}
                        />
                    </div>
                </div>
                    <button
                        type='submit' id='edit-task-form-submit'
                        className='flex justify-center text-center gap-1.5 bg-green-500 p-2 rounded-lg items-center duration-300 transition-all hover:cursor-pointer hover:bg-green-600'
                    >
                        Save changes
                    </button>

            </form>
        </div>
    );
};
