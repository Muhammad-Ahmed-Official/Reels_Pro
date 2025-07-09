// 'use client'

// import { verifySchema } from "@/schemas/verifySchema";
// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { AxiosError } from "axios";
// import { Loader2 } from "lucide-react";
// import { useParams, useRouter } from "next/navigation"
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { z } from "zod";

// export default function verifyAccount() {
//     const router = useRouter();
//     const params = useParams<{userName: string}>()
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const form = useForm<z.infer<typeof verifySchema>>({
//         resolver: zodResolver(verifySchema)
//     })

//     const onSubmit = async (data: z.infer<typeof verifySchema>) => {
//         try {
//             setIsSubmitting(true);
//              const response = await axios.post('/api/verify-code', {
//                 userName: params.userName,
//                 code: data.code
//             })
//             toast.success(response.data.message);
//             router.replace('/login');      
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>;
//             let errorMsg = axiosError.response?.data.message;
//             toast.error(errorMsg ?? "Something went wrong");
//         } finally {
//             setIsSubmitting(false);
//         }
//     }


//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className='w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md'>
//             <div className='text-center'>
//             <h1 className='text-2xl font-extrabold tracking-tight lg:text-4xl mb-2'>Verify Your Account</h1>
//             <p className=''>
//                 Verification Code sent to your email
//             </p>
//             </div>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 <fieldset className="fieldset mx-auto">
                
//                 <label className="label text-[15px]">Verify Code</label>
//                 <input type="text" className="input outline-none" placeholder="******" {...form.register("code")} />
//                 {form.formState.errors.code && ( <p className="text-red-500 text-sm">{form.formState.errors.code.message}</p>)}
                    
//                     <button className="btn btn-neutral mt-4 w-xs" type="submit"  disabled={isSubmitting}> 
//                     {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin text-white" />)  : ('Verify Code') }
//                 </button>
//             </fieldset>
//             </form>
//         </div>
//     </div>
//   )
// }









"use client"
import { apiClient } from '@/lib/api-client';
import { verifySchema } from '@/schemas/verifySchema';
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import OTPInput from 'react-otp-input';
import { z } from 'zod';

const Input = ({ ...props }) => {
    return (
        <input
            type="text"
            {...props}
            className="w-16! ml-6 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
    )
}

const VerifyOtpPage = () => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const params = useParams<{userName:string}>()
    
    const { control, register, handleSubmit, formState:{ isSubmitting, errors } } = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        await asyncHandlerFront(
            async() => {
            const response = await apiClient.verifyCd(params.userName, data.code)
            toast.success("User register successfully");
            router.replace('/login');  
            },
            (error) => {
                console.log(error)
                toast.error(error.message || "Failed")
            }
        )
    }


    const handleResendOtp = async () => {
        setIsSending(true);
        await asyncHandlerFront(
            async () => {
                // const res = await apiClient.resendOTP(session?.user.userName as string);
                toast.success("otp resend successfully");
            },
            (error) => {
                toast.error(error.message);
            }
        );
        setIsSending(false);
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="max-w-xl mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
                    <p className="text-[15px] text-slate-500">
                        Enter the 4-digit verification code that was sent to your phone number.
                    </p>
                    <p className='text-[15px] text-slate-500'>
                        Code will expire in 1 hour
                    </p>
                </header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-center gap-3">
                        <Controller
                            name="code"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <OTPInput
                                value={field.value}
                                onChange={field.onChange}
                                numInputs={6}
                                renderInput={(props) => <Input {...props} />}
                                />
                            )}
                            />
                    </div>
                    <div className="max-w-[260px] mx-auto mt-4">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-primary-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary-950/10 hover:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-300 transition-colors duration-150 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                            // disabled={otp.length < 6}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying Account...
                                </span>
                            ) : 'Verify Account'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-slate-500 mt-4">
                    Didn&apos;t receive code?{" "}
                    <button onClick={handleResendOtp} className={`font-medium text-primary-500 hover:text-primary-600 cursor-pointer ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {isSending ? "Sending..." : "Resend"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VerifyOtpPage;