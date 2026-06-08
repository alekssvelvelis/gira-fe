import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FormField } from '@/components/input/FormField';

interface LoginErrors {
    loginEmailError: string,
    loginPasswordError: string,
};

export const LoginView = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [errors, setErrors] = useState<LoginErrors>({
        loginEmailError: '',
        loginPasswordError: ''
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: LoginErrors = {
            loginEmailError: '',
            loginPasswordError: ''
        };

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email) {
            newErrors.loginEmailError = 'Email is required';
        } else if (!emailPattern.test(email)) {
            newErrors.loginEmailError = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.loginPasswordError = 'Password is required';
        } else if (password.length < 8) {
            newErrors.loginPasswordError = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);

        if (newErrors.loginEmailError || newErrors.loginPasswordError) return;
        try {  
            console.log(1);
            await login(email, password);
            navigate('/dashboard');
        } catch (error: any) {
            console.log(2);
            if (error.response?.status >= 400) {
                const laravelErrors = error.response.data;
                console.log(laravelErrors);
                setErrors({
                    loginEmailError: laravelErrors.message ?? '',
                    loginPasswordError: laravelErrors.message ?? '',
                });
            }
            
        }
    }

    return (
        <div className='min-w-screen min-h-screen flex flex-col items-center justify-center'>

            <h1 className='text-3xl font-bold mb-6 text-center'>Sign in to your account</h1>
            <div id='login-card' className='w-[315px] bg-darkened-surface border rounded border-gray-300 flex flex-col justify-center p-8'>
                <form id='login-form' className='flex flex-col w-full gap-4' onSubmit={(handleSubmit)}>
                    <div id='login-form-email' className='flex flex-col'>
                        <FormField
                            name='user-edit-email'
                            label='User email'
                            value={email}
                            onChange={setEmail}
                            config={{ type: 'email' }}
                            placeholder='Enter user email...'
                            error={errors.loginEmailError}
                        />
                    </div>
                    <div id='login-form-password' className='flex flex-col'>
                        <FormField
                            name='login-password-input'
                            label='Password'
                            value={password}
                            onChange={setPassword}
                            config={{ type: 'password' }}
                            placeholder='Enter new password...'
                            error={errors.loginPasswordError}
                        />
                    </div>
                    <button type="submit" id='login-form-submit' name='login-form-submit' className='px-4 py-2 bg-primary text-white rounded transform-all duration-300 hover:opacity-90 hover:cursor-pointer'>Log in</button>
                    <a className='text-center hover:cursor-pointer transform-all duration-300 hover:scale-110' href={'/register'}>Don't have an account?</a>
                    <div className="relative flex items-center my-4">
                        <hr className="w-full border-gray-300" />
                        <span className="absolute uppercase left-1/2 -translate-x-1/2 px-2 bg-darkened-surface text-sm text-gray-300 whitespace-nowrap">
                            or continue with
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}