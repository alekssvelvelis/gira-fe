import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/input/FormField';

interface registerErrors {
    registerEmailError: string,
    registerNicknameError: string,
    registerPasswordError: string,
    registerConfirmPasswordError: string,
};

export const RegisterView = () => {

    const [email, setEmail] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [errors, setErrors] = useState<registerErrors>({
        registerEmailError: '',
        registerNicknameError: '',
        registerPasswordError: '',
        registerConfirmPasswordError: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: registerErrors = {
            registerEmailError: '',
            registerNicknameError: '',
            registerPasswordError: '',
            registerConfirmPasswordError: '',
        };

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email) {
            newErrors.registerEmailError = 'Email is required';
        } else if (!emailPattern.test(email)) {
            newErrors.registerEmailError = 'Please enter a valid email';
        }

        if (!nickname) {
            newErrors.registerNicknameError = 'Nickname is required';
        } else if (nickname.length < 5 || nickname.length > 16) {
            newErrors.registerNicknameError = 'Nickname length must be in interval [5...16]';
        }

        if (!password) {
            newErrors.registerPasswordError = 'Password is required';
        } else if (password.length < 8) {
            newErrors.registerPasswordError = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.registerConfirmPasswordError = 'Confirmed password is required';
        } else if (confirmPassword.length < 8) {
            newErrors.registerConfirmPasswordError = 'Confirmed password must be at least 8 characters';
        } else if (confirmPassword !== password) {
            newErrors.registerConfirmPasswordError = 'Confirmed password and password must match';
        }


        setErrors(newErrors);

        if (newErrors.registerEmailError || newErrors.registerPasswordError || newErrors.registerConfirmPasswordError) return;

        try {
            await register(email, nickname, password, confirmPassword);
            navigate('/dashboard');
        } catch (error: any) {
            if (error.response?.status === 422) {
                const laravelErrors = error.response.data.errors;
                console.log(laravelErrors);
                setErrors({
                    registerEmailError: laravelErrors.email?.[0] ?? '',
                    registerNicknameError: laravelErrors.nickname?.[0] ?? '',
                    registerPasswordError: laravelErrors.password?.[0] ?? '',
                    registerConfirmPasswordError: laravelErrors.password_confirmation?.[0] ?? '',
                });
            }
        };
    }

    return (
        <div className='min-w-screen min-h-screen flex flex-col items-center justify-center'>
            <h1 className='text-3xl font-bold mb-6 text-center'>Register your account</h1>
            <div id='register-card' className='w-[315px] bg-darkened-surface border rounded border-gray-300 flex flex-col justify-center p-8'>
                <form id='register-form' className='flex flex-col w-full gap-4' onSubmit={(handleSubmit)}>
                    <div id='register-form-email' className='flex flex-col'>
                        <FormField
                            name='register-email-input'
                            label='Email'
                            value={email}
                            onChange={setEmail}
                            config={{ type: 'email' }}
                            placeholder='Enter user email...'
                            error={errors.registerEmailError}
                        />
                    </div>
                    <div id='register-form-nickname' className='flex flex-col'>
                        <FormField
                            name='register-nickname-input'
                            label='Nickname'
                            value={nickname}
                            onChange={setNickname}
                            config={{ type: 'text' }}
                            placeholder='Enter user nickname...'
                            error={errors.registerNicknameError}
                        />
                    </div>
                    <div id='register-form-password' className='flex flex-col'>
                        <FormField
                            name='register-password-input'
                            label='Password'
                            value={password}
                            onChange={setPassword}
                            config={{ type: 'password' }}
                            placeholder='Enter new password...'
                            error={errors.registerPasswordError}
                        />
                    </div>
                    <div id='register-form-confirm-password' className='flex flex-col'>
                        <FormField
                            name='register-confirm-password-input'
                            label='Confirm Password'
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            config={{ type: 'password' }}
                            placeholder='Enter confirmed password...'
                            error={errors.registerConfirmPasswordError}
                        />
                    </div>
                    <button type="submit" id='register-form-submit' name='register-form-submit' className='px-4 py-2 bg-primary text-white rounded transform-all duration-300 hover:opacity-90 hover:cursor-pointer'>Log in</button>
                    <a className='text-center hover:cursor-pointer transform-all duration-300 hover:scale-110' href={'/login'}>Already have an account?</a>
                    <div className="relative flex items-center my-4">
                        <hr className="w-full border-gray-300" />
                        <span className="absolute uppercase left-1/2 -translate-x-1/2 px-2 z-1 bg-darkened-surface text-sm text-gray-300 whitespace-nowrap">
                            or continue with
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}