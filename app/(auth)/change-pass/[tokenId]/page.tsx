'use client'

import { apiClient } from '@/lib/api-client';
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';
import { Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface PasswordFormData {
    oldPassword: string;
    newPassword: string;
}


export default function page() {
    const [showPassword, setShowPassword] = useState(false);
    const { data: session } = useSession();
    const params = useParams<{tokenId:string}>()
    const router = useRouter();
    // console.log(params.tokenId);
    
    // useEffect(() => {
        // if(session?.user._id !== params.tokenId) {
        //     router.replace("/signin");
        //     toast.error("You are Unauthorized, Plz Signin first");
        // }
    // }, [])

    const { register, reset, handleSubmit, formState:{isSubmitting, errors} } = useForm<PasswordFormData>({
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        }
    })

    const onSubmit = async (data: PasswordFormData) => {
        await asyncHandlerFront(
            async() => {
                await apiClient.updatePass(data.oldPassword, data.newPassword);
                toast.success("Password updated successfully");
            }, 
            (error) => {
                toast.error(error.message || "Error found");
            }
        )
    }

  return (
   <div className='flex justify-center items-center min-h-screen '>
            <main id="content" role="main" className="w-full max-w-md p-6">
                <div className="bg-white     shadow-lg mt-7 rounded-xl">
                    <div className="p-4 sm:p-7">
                            <div className="flex flex-col items-center justify-center mb-4 text-2xl font-bold">
                            <div className="flex items-center gap-2 mb-8">
                                {/* <CircleDot className="w-8 h-8 text-[#16C47F]" /> */}
                                <span className="text-xl font-semibold">
                                <span className="text-primary-400">Reels</span>_
                                <span className="text-primary-400">Pro</span>
                                </span>
                            </div>
                            </div>
                        <div className="">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label  htmlFor="new_password" />
                                        <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            {...register("oldPassword")}
                                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                                        />
                                         {errors.oldPassword && ( <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>)}
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
                                        <p className="hidden mt-2 text-xs text-red-600" id="new-password-error">
                                            Please include a password that complies with the rules to ensure security
                                        </p>
                                    </div>
                                    <div>
                                        <label htmlFor="confirm_new_password" />
                                        <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            {...register("newPassword")}
                                            placeholder="Password"
                                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                                            {...errors.newPassword && ( <p className="text-red-500 text-sm">{errors.newPassword.message}</p>)}
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
                                        <p className="hidden mt-2 text-xs text-red-600" id="confirm-new-password-error">
                                            Please include a password that complies with the rules to ensure security
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center cursor-pointer justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition-all bg-primary-500 hover:bg-primary-600 border border-transparent rounded-md  focus:outline-none focus:ring-2">
                                        Change my password
                                        {isSubmitting && <div className="w-7 h-7 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
  )
}
