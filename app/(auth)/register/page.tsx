'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from '@/schemas/signUpSchema';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";
import Link from "next/link";
import { Loader, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function Register() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
        }
    });


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            await apiClient.register(data);
            toast.success('Registered successfully!');
            form.reset();
            router.push('/login');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMsg = axiosError.response?.data.message;
            toast.error(errorMsg ?? "Something went wrong");
        } finally{
            setIsSubmitting(false);
        }
    }

  return (
    <div className="flex justify-center items-center h-[725px] md:h-[620px] px-4">
      <div className="max-w-md space-y-8 bg-base-200 border-base-300 shrink-0 shadow-2xl rounded-box w-sm border p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back to Reels Pro</h1>
          <p className="mb-4">Register to continue watching Reels</p>
        </div>
        <div className="flex gap-x-5 justify-center items-baseline-last mb-0">
            <div className="rounded shadow-xl px-4 py-[6.5px] bg-white cursor-pointer">
                <img src="https://img.icons8.com/?size=25&id=17949&format=png&color=000000" alt="" />
            </div>
            <div className="rounded shadow-xl px-4 py-1 bg-white cursor-pointer">
                <img src="https://img.icons8.com/?size=30&id=4Z2nCrz5iPY2&format=png&color=000000" alt="" />
            </div>
        </div>
        <div className="flex items-center gap-4 text-gray-500 my-3">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-sm">or</span>
            <hr className="flex-grow border-t border-gray-300" />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset className="fieldset mx-auto">

                <label className="label">Username</label>
                <input type="text" className="input outline-none" placeholder="Username" {...form.register("userName")} />
                {form.formState.errors.userName && ( <p className="text-red-500 text-sm">{form.formState.errors.userName.message}</p>)}

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" {...form.register("email")} />
                {form.formState.errors.email && ( <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>)}

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" {...form.register("password")}/>
                {form.formState.errors.password && ( <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>)}

                <button className="btn btn-neutral mt-4 w-xs" type="submit"  disabled={isSubmitting}> 
                    {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin text-white" />)  : ('Register') }
                </button>
            </fieldset>
        </form>
       <div className="text-center my-0">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600  hover:text-blue-800">
              Login
            </Link>
          </p>
        </div>
       </div>
    </div>
  )
}
