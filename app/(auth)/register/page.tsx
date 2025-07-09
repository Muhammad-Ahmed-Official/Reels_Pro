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
import React, { useEffect, useRef, useState } from 'react'
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signUpSchema } from '@/schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/utils/ApiResponse';
import FileUpload from '@/components/FileUplod';

const RegisterPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const[userName, setUsername] = useState('');
    const[userNameMessage, setUserNameMessage] = useState('');
    const[isCheckingUsername, setIsCheckingUsername] = useState(false);
    const debounced = useDebounceCallback(setUsername, 300);

    useEffect(() => {
        const checkUserNameUnique = async () => {
        if (userName) {
            setIsCheckingUsername(true);
            setUserNameMessage('');
            try {
                const response = await axios.get(`/api/check-uni-uName?userName=${userName}`);
                    setUserNameMessage(response.data.message);
                } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                    setUserNameMessage(axiosError.response?.data?.message ?? "Error checking userName");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }

        checkUserNameUnique();
    }, [userName])


    const { handleSubmit, reset, register, formState:{isSubmitting, errors}, setValue, watch } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            profilePic: "",
        }
    })
    

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        await asyncHandlerFront(
            async() => {
                await apiClient.register(data);
                toast.success('Otp send to email');
                router.push(`/verify/${userName}`);
                reset()
            }, 
            (error) => {
                toast.error(error.message)
            }
        )
    };


    return (
        <div className='min-h-screen flex'>
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16 xl:px-24">
                <div className="w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <span className="text-xl font-semibold">
                        <span className="text-primary-400">Reels</span>_
                        <span className="text-primary-400">Pro</span>
                        </span>
                    </div>
                    <h1 className="text-2xl font-semibold text-primary-400 mb-8">Register</h1>
                    
                    <FileUpload fileType='image' onSuccess={(res) => setValue("profilePic", res.url)} />
                    { watch("profilePic") &&
                    (
                        <img
                            src={watch("profilePic")}
                            alt="Preview"
                            className="cursor-pointer mb-2 inline-block size-15 rounded-full ring-2 ring-white"
                        />
                    ) }

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <input type="text" placeholder="Username" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                                {...register("userName", {
                                    onChange: (e) => { debounced(e.target.value) }
                                })}
                            />
                            { isCheckingUsername && <Loader2 className="animate-spin mt-1" /> }
                            <p className={`text-sm mt-1 ${userNameMessage === 'userName is available' ? 'text-green-500' : 'text-red-500'}`}>{userNameMessage}</p>
                            {errors.userName && ( <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>)}
                        </div>
                        <div>
                            <input type="email" placeholder="Email" {...register("email")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                            />
                            {errors.email && ( <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>)}
                        </div>

                        <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password" {...register("password")}
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                            {...errors.password && ( <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>)}
                        />
                        <button type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            { showPassword ? ( <EyeOff className="w-5 h-5 cursor-pointer" /> ) : 
                            ( <Eye className="w-5 h-5 cursor-pointer" /> )}
                        </button>
                        </div>

                        <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg cursor-pointer transition">
                            { isSubmitting ? ( <Loader2 className="size-7 animate-spin" />) : ("Login") }
                        </button>
                        <p className="text-sm"> <Link href="/forgot">Forgot password?</Link> </p>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600"> Already have an account?{' '}
                    <span className="text-primary-500 hover:text-primary-600 font-medium"><Link href="/login"> Log in</Link> </span> 
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