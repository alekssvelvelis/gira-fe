import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { register } from '@/services/authService';

interface registerErrors {
    registerEmailError: string,
    registerPasswordError: string,
    registerConfirmPasswordError: string,
};

export const RegisterView = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [errors, setErrors] = useState<registerErrors>({
        registerEmailError: '',
        registerPasswordError: '',
        registerConfirmPasswordError: ''
    });

    const { saveUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: registerErrors = {
            registerEmailError: '',
            registerPasswordError: '',
            registerConfirmPasswordError: '',
        };

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email) {
            newErrors.registerEmailError = 'Email is required';
        } else if (!emailPattern.test(email)) {
            newErrors.registerEmailError = 'Please enter a valid email';
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
    }

    return (
        <div className='min-w-screen min-h-screen flex flex-col items-center justify-center'>
            <h1 className='text-3xl font-bold mb-6 text-center'>Sign in to your account</h1>
            <div id='register-card' className='w-[315px] bg-darkened-surface border rounded border-gray-300 flex flex-col justify-center p-8'>
                <form id='register-form' className='flex flex-col w-full gap-4' onSubmit={(handleSubmit)}>
                    <div id='register-form-email' className='flex flex-col'>
                        <label htmlFor='register-email-input' className='mb-2'>Email</label>
                        <input 
                            type='email' 
                            id='register-email-input' 
                            name='register-email-input' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`px-3 py-2 border rounded ${errors.registerEmailError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className={`text-sm mt-1 ${
                            errors.registerEmailError ? 'text-red-500 visible' : 'invisible'
                        }`}>
                            {errors.registerEmailError || 'placeholder'}
                        </p>
                    </div>
                    <div id='register-form-password' className='flex flex-col'>
                        <label htmlFor='register-password-input' className='mb-2'>Password</label>
                        <input 
                            type='password' 
                            id='register-password-input' 
                            name='register-password-input' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`px-3 py-2 border rounded ${errors.registerPasswordError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className={`text-sm mt-1 ${
                            errors.registerPasswordError ? 'text-red-500 visible' : 'invisible'
                        }`}>
                            {errors.registerPasswordError || 'placeholder'}
                        </p>
                    </div>
                    <div id='register-form-confirm-password' className='flex flex-col'>
                        <label htmlFor='register-confirm-password-input' className='mb-2'>Confirm Password</label>
                        <input 
                            type='password' 
                            id='register-confirm-password-input' 
                            name='register-confirm-password-input' 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`px-3 py-2 border rounded ${errors.registerConfirmPasswordError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className={`text-sm mt-1 ${
                            errors.registerConfirmPasswordError ? 'text-red-500 visible' : 'invisible'
                        }`}>
                            {errors.registerConfirmPasswordError || 'placeholder'}
                        </p>
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