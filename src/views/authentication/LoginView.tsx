import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { login } from '@/services/authService';

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

    const { saveUser } = useAuth();
    const navigate = useNavigate();

    const handleTestLogin = () => {
        const testToken = `test-token-${Date.now()}`;
        saveUser(testToken);
        navigate('/dashboard');
    };

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
        // try {
        //     const response = await login(email, password);
        //     if (response.data.token) {
        //         saveUser(response.data.token);
        //         navigate('/dashboard');
        //     }
        // } catch (error: any) {
        //     const errorData = error.response?.data;
        //     setErrors({
        //         loginEmailError: errorData?.email || '',
        //         loginPasswordError: errorData?.password || ''
        //     });
        // }
    }

    return (
        <div className='min-w-screen min-h-screen flex flex-col items-center justify-center'>

            <button onClick={handleTestLogin} className='text-sm text-gray-400 mt-2'>
                Test Login (no backend)
            </button>

            <h1 className='text-3xl font-bold mb-6 text-center'>Sign in to your account</h1>
            <div id='login-card' className='w-[315px] bg-darkened-surface border rounded border-gray-300 flex flex-col justify-center p-8'>
                <form id='login-form' className='flex flex-col w-full gap-4' onSubmit={(handleSubmit)}>
                    <div id='login-form-email' className='flex flex-col'>
                        <label htmlFor='login-email-input' className='mb-2'>Email</label>
                        <input 
                            type='email' 
                            id='login-email-input' 
                            name='login-email-input' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`px-3 py-2 border rounded ${errors.loginEmailError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className={`text-sm mt-1 ${
                            errors.loginEmailError ? 'text-red-500 visible' : 'invisible'
                        }`}>
                            {errors.loginEmailError || 'placeholder'}
                        </p>
                    </div>
                    <div id='login-form-password' className='flex flex-col'>
                        <label htmlFor='login-password-input' className='mb-2'>Password</label>
                        <input 
                            type='password' 
                            id='login-password-input' 
                            name='login-password-input' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`px-3 py-2 border rounded ${errors.loginPasswordError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <p className={`text-sm mt-1 ${
                            errors.loginPasswordError ? 'text-red-500 visible' : 'invisible'
                        }`}>
                            {errors.loginPasswordError || 'placeholder'}
                        </p>
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