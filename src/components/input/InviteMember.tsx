import { useState } from 'react';
import { sendMailRequest } from '@/services/mailService';
import { FormField } from './FormField';

interface InviteErrors {
    inviteEmailError: string,
};

export const InviteMember = ({ organizationId, onClose }: { 
    organizationId: string;
    onClose: () => void;
}) => {
    const [receiverEmail, setReceiverEmail] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<InviteErrors>({
            inviteEmailError: '',
    });

        const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage('');
        const newErrors: InviteErrors = {
            inviteEmailError: '',
        };

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!receiverEmail) {
            newErrors.inviteEmailError = 'Email is required';
        } else if (!emailPattern.test(receiverEmail)) {
            newErrors.inviteEmailError = 'Please enter a valid email';
        }

        setErrors(newErrors);

        if (newErrors.inviteEmailError) return;
        try { 
            setIsLoading(true);
            const response = await sendMailRequest(Number(organizationId), receiverEmail);
            setSuccessMessage(response.message);
        } catch (error: any) {
            if (error.response?.status >= 400) {
                const laravelErrors = error.response.data;
                setErrors({
                    inviteEmailError: laravelErrors.message ?? '',
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-10 transition-opacity flex justify-center items-center duration-300">
            <div 
                id='invite-card' 
                className='w-[315px] bg-darkened-surface border rounded border-gray-300 flex flex-col justify-center p-8'
                onClick={(e) => e.stopPropagation()} 
            >
                <form id='invite-form' className='flex flex-col w-full gap-4' onSubmit={(handleSubmit)}>
                    <div id='invite-form-email' className='flex flex-col'>
                        <FormField
                            name='user-invite-email'
                            label='User email'
                            value={receiverEmail}
                            onChange={setReceiverEmail}
                            config={{ type: 'email' }}
                            placeholder='Enter user email...'
                            error={errors.inviteEmailError}
                        />
                    </div>
                    <button type="submit" id='login-form-submit' name='login-form-submit' className='px-4 py-2 bg-primary text-white rounded transform-all duration-300 hover:opacity-90 hover:cursor-pointer'>Send Invite</button>
                </form>
                <p className='text-green-400 font-light text-xl'>{successMessage}</p>
                {isLoading && <p>Inviting... please wait.</p>}
            </div>
        </div>
    );
}