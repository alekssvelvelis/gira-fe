import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { acceptInvite } from '@/services/mailService';
import { useAuth } from '@/hooks/useAuth';

export const AcceptInvitation = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'expired' | 'error'>('loading');
    const [message, setMessage] = useState();
    const { token } = useParams<{token: string}>();
    const navigate = useNavigate();
    const { user } = useAuth();
    useEffect(() => {
        if (!token) return;

        if (!user) {
            localStorage.setItem('redirect_after_login', `/invitations/${token}`);
            navigate(`/login?redirect=/invitations/${token}`);
            return;
        }


        const fetchInvitationAccept = async (token: string) => {
            try {
                const response = await acceptInvite(token);
                setStatus('success');
                setMessage(response.data?.message);
            } catch (err: any) {
                if (err.response?.status === 410) {
                    setStatus('expired');
                } else {
                    setStatus('error');
                }
            }
        };

        fetchInvitationAccept(token);
    },[token])
    return (
        <div className='min-w-screen min-h-screen flex justify-center flex-col items-center'>
            {status === 'loading' &&
                <p className='text-3xl'>Accepting invitation...</p>
            }
            {status === 'success' &&
            <>
                <p className='text-3xl'>{message}</p>
                <a 
                className='text-2xl font-light my-4 bg-darkened-surface p-2 rounded-lg hover:scale-105 transition-all duration-300'
                href='/dashboard'
                >
                    To Dashboard
                </a>
            </>
            }
            {status === 'expired' &&
                <p className='text-3xl'>This invitation has expired or already been used.</p>
            }
        </div>
    );
}