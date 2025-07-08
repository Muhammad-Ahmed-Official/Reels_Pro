// 'use client'

// import { zodResolver } from "@hookform/resolvers/zod"
// import { signUpSchema } from '@/schemas/signUpSchema';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import axios, { AxiosError } from "axios";
// import { ApiResponse } from "@/types/ApiResponse";
// import toast from "react-hot-toast";
// import Link from "next/link";
// import { Loader, Loader2 } from "lucide-react";
// import { apiClient } from "@/lib/api-client";
// import { useDebounceCallback } from "usehooks-ts";

// export default function Register() {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const[userName, setUsername] = useState('');
//     const[userNameMessage, setUserNameMessage] = useState('');
//     const[isCheckingUsername, setIsCheckingUsername] = useState(false);
//     const debounced = useDebounceCallback(setUsername, 300);
//     const router = useRouter();

//     const form = useForm<z.infer<typeof signUpSchema>>({
//         resolver: zodResolver(signUpSchema),
//         defaultValues: {
//             userName: '',
//             email: '',
//             password: '',
//         }
//     });


//     useEffect(() => {
//         const checkUserNameUnique = async () => {
//         if (userName) {
//             setIsCheckingUsername(true);
//             setUserNameMessage('');
//             try {
//                 const response = await axios.get(`/api/check-uni-uName?userName=${userName}`);
//                     setUserNameMessage(response.data.message);
//                     console.log(response)
//                 } catch (error) {
//                 const axiosError = error as AxiosError<ApiResponse>;
//                     setUserNameMessage(axiosError.response?.data?.message ?? "Error checking userName");
//                 } finally {
//                     setIsCheckingUsername(false);
//                 }
//             }
//         }

//         checkUserNameUnique();
//     }, [userName])


//     const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
//         setIsSubmitting(true);
//         try {
//             await apiClient.register(data);
//             toast.success('Otp send to email');
//             form.reset();
//             router.push(`/verify/${userName}`);
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>;
//             let errorMsg = axiosError.response?.data.message;
//             toast.error(errorMsg ?? "Something went wrong");
//         } finally{
//             setIsSubmitting(false);
//         }
//     }

//   return (
//     <div className="flex justify-center items-center h-[725px] md:h-[620px] px-4">
//       <div className="max-w-md space-y-8 bg-base-200 border-base-300 shrink-0 shadow-2xl rounded-box w-sm border p-4">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold">Welcome Back to Reels Pro</h1>
//           <p className="mb-4">Register to continue watching Reels</p>
//         </div>
//         {/* <div className="flex gap-x-5 justify-center items-baseline-last mb-0">
//             <div className="rounded shadow-xl px-4 py-[6.5px] bg-white cursor-pointer">
//                 <img src="https://img.icons8.com/?size=25&id=17949&format=png&color=000000" alt="" />
//             </div>
//             <div className="rounded shadow-xl px-4 py-1 bg-white cursor-pointer">
//                 <img src="https://img.icons8.com/?size=30&id=4Z2nCrz5iPY2&format=png&color=000000" alt="" />
//             </div>
//         </div> */}
//         {/* <div className="flex items-center gap-4 text-gray-500 my-3">
//             <hr className="flex-grow border-t border-gray-300" />
//             <span className="text-sm">or</span>
//             <hr className="flex-grow border-t border-gray-300" />
//         </div> */}

//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <fieldset className="fieldset mx-auto">

//                 <label className="label">Username</label>
//                 <input type="text" className="input outline-none" placeholder="Username" {...form.register("userName", {
//                     onChange: (e) => {
//                         debounced(e.target.value)
//                     }
//                 })} />
//                 { isCheckingUsername && <Loader2 className="animate-spin" /> }
//                 <p className={`text-sm ${userNameMessage === 'userName is available' ? 'text-green-500' : 'text-red-500'}`}>{userNameMessage}</p>
//                 {form.formState.errors.userName && ( <p className="text-red-500 text-sm">{form.formState.errors.userName.message}</p>)}

//                 <label className="label">Email</label>
//                 <input type="email" className="input" placeholder="Email" {...form.register("email")} />
//                 {form.formState.errors.email && ( <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>)}

//                 <label className="label">Password</label>
//                 <input type="password" className="input" placeholder="Password" {...form.register("password")}/>
//                 {form.formState.errors.password && ( <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>)}

//                 <button className="btn btn-neutral mt-4 w-xs" type="submit"  disabled={isSubmitting}> 
//                     {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin" />)  : ('Register') }
//                 </button>
//             </fieldset>
//         </form>
//        <div className="text-center my-0">
//           <p>
//             Already have an account?{' '}
//             <Link href="/login" className="">
//               Login
//             </Link>
//           </p>
//         </div>
//        </div>
//     </div>
//   )
// }





"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        await asyncHandlerFront(
            async () => {
                const res = await apiClient.register({ email: formData.email, password: formData.password, userName: formData.username });

                // toast.success(res.message);
                // router.push(`/verify-otp/${res.data.id}`);
            }, (error:any) => {
                toast.error(error.message);
            }
        );

        setIsLoading(false);
    };

    return (
        // <div>
        //     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        //         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        //             <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        //                 Create an account
        //             </h2>
        //         </div>

        //         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        //             <form onSubmit={handleSubmit} className="space-y-6">
        //                 <div>
        //                     <label htmlFor="username" className='block text-sm/6 font-medium text-gray-900'>
        //                         Username
        //                     </label>
        //                     <div className="mt-2">
        //                         <input
        //                             type="text"
        //                             name="username"
        //                             required
        //                             className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6 ${errors.username ? 'border-red-500' : ''
        //                                 }`}
        //                             value={formData.username}
        //                             onChange={handleChange}
        //                         />
        //                         {errors.username && (
        //                             <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        //                         )}
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
        //                         Email address
        //                     </label>
        //                     <div className="mt-2">
        //                         <input
        //                             id="email"
        //                             name="email"
        //                             type="email"
        //                             required
        //                             autoComplete="email"
        //                             className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6 ${errors.email ? 'border-red-500' : ''
        //                                 }`}
        //                             value={formData.email}
        //                             onChange={handleChange}
        //                         />
        //                         {errors.email && (
        //                             <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        //                         )}
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <div className="flex items-center justify-between">
        //                         <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
        //                             Password
        //                         </label>
        //                     </div>
        //                     <div className="mt-2">
        //                         <input
        //                             id="password"
        //                             name="password"
        //                             type="password"
        //                             required
        //                             className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6 ${errors.password ? 'border-red-500' : ''
        //                                 }`}
        //                             value={formData.password}
        //                             onChange={handleChange}
        //                         />
        //                         {errors.password && (
        //                             <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        //                         )}
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <div className="flex items-center justify-between">
        //                         <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
        //                             Confirm Password
        //                         </label>
        //                     </div>
        //                     <div className="mt-2">
        //                         <input
        //                             id="confirmPassword"
        //                             name="confirmPassword"
        //                             type="password"
        //                             required
        //                             className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6 ${errors.confirmPassword ? 'border-red-500' : ''
        //                                 }`}
        //                             value={formData.confirmPassword}
        //                             onChange={handleChange}
        //                         />
        //                         {errors.confirmPassword && (
        //                             <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        //                         )}
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <button
        //                         type="submit"
        //                         disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
        //                         className={`flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-70 disabled:cursor-not-allowed ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        //                     >
        //                         {isLoading ? (
        //                             <span className="flex items-center">
        //                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        //                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        //                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        //                                 </svg>
        //                                 Processing...
        //                             </span>
        //                         ) : 'Register'}
        //                     </button>
        //                 </div>
        //             </form>

        //             <p className="mt-10 text-center text-sm/6 text-gray-500">
        //                 Already have an account?{' '}
        //                 <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500">
        //                     Login
        //                 </Link>
        //             </p>
        //         </div>
        //     </div>
        // </div>
        <div className='min-h-screen flex'>
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16 xl:px-24">
                <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    {/* <CircleDot className="w-8 h-8 text-[#16C47F]" /> */}
                    <span className="text-xl font-semibold">
                    <span className="text-primary-400">Reels</span>_
                    <span className="text-primary-400">Pro</span>
                    </span>
                </div>

                <h1 className="text-2xl font-semibold text-primary-400 mb-8">Register</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            // value={Email}
                            // onChange={(e) => setEmail(e.target.value)}
                            placeholder="Username"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            // value={Email}
                            // onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>

                    <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        // value={Password}
                        // onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showPassword ? (
                        <EyeOff className="w-5 h-5 cursor-pointer" />
                        ) : (
                        <Eye className="w-5 h-5 cursor-pointer" />
                        )}
                    </button>
                    </div>

                    <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg cursor-pointer transition"
                    >
                        {/* {signinMutation?.isPending ? (
                        <BiLoaderCircle className="size-7 animate-spin" />
                        ) : (
                        "Login"
                        )} */}
                        Join now
                    </button>
                    <p className="text-sm">
                        <Link href="/forgot">Forgot password?</Link>
                    </p>
                    </div>
                </form>

               <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                <span className="text-primary-500 hover:text-primary-600 font-medium"><Link href="/login"> Log in</Link>
                </span> 
                </p>
                </div>
            </div>

            {/* Right side - Welcome Message */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-800">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80')] opacity-20 mix-blend-overlay"></div>
                </div>
                <div className="relative w-full flex items-center justify-center p-16">
                <div className="text-primary-100 max-w-md">
                    <h2 className="text-4xl font-bold mb-6">10,000+ clients are getting more replies!</h2>
                    <p className="text-lg text-primary-100">
                    Unlock the power of effective outreach with our cutting-edge platform, 
                    and experience a surge in responses and engagement rates like never before.
                    </p>
                </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage