'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from "react-hot-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function Register() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        }
    });


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })
      form.reset();
      if(result?.error) return toast.error(result.error);
      if(result?.url) router.push('/');
      
    }

  return (
    <div className="flex justify-center items-center h-[725px] md:h-[620px] px-4">
      <div className="max-w-md space-y-8 bg-base-200 border-base-300 shrink-0 shadow-2xl rounded-box w-sm border p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Join Reels Pro</h1>
          <p className="mb-4">Login to continue watching Reels</p>
        </div>
        <div className="flex gap-x-5 justify-center items-baseline-last mb-0">
            <button onClick={() => signIn("google")} className="rounded shadow-xl px-4 py-[6.5px] bg-white cursor-pointer">
                <img src="https://img.icons8.com/?size=25&id=17949&format=png&color=000000" alt="" />
            </button>
            <button onClick={() => signIn("github")} className="rounded shadow-xl px-4 py-1 bg-white cursor-pointer">
                <img src="https://img.icons8.com/?size=30&id=4Z2nCrz5iPY2&format=png&color=000000" alt="" />
            </button>
        </div>
        <div className="flex items-center gap-4 text-gray-500 my-3">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-sm">or</span>
            <hr className="flex-grow border-t border-gray-300" />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset className="fieldset mx-auto">

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" {...form.register("identifier")} />
                {form.formState.errors.identifier && ( <p className="text-red-500 text-sm">{form.formState.errors.identifier.message}</p>)}

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
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600  hover:text-blue-800">
              Register
            </Link>
          </p>
        </div>
       </div>
    </div>
  )
}
