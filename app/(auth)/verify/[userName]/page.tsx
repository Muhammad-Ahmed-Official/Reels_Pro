'use client'

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function verifyAccount() {
    const router = useRouter();
    const params = useParams<{userName: string}>()
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsSubmitting(true);
             const response = await axios.post('/api/verify-code', {
                userName: params.userName,
                code: data.code
            })
            toast.success(response.data.message);
            router.replace('/login');      
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMsg = axiosError.response?.data.message;
            toast.error(errorMsg ?? "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className='w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
            <h1 className='text-2xl font-extrabold tracking-tight lg:text-4xl mb-2'>Verify Your Account</h1>
            <p className=''>
                Verification Code sent to your email
            </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <fieldset className="fieldset mx-auto">
                
                <label className="label text-[15px]">Verify Code</label>
                <input type="text" className="input outline-none" placeholder="******" {...form.register("code")} />
                {form.formState.errors.code && ( <p className="text-red-500 text-sm">{form.formState.errors.code.message}</p>)}
                    
                    <button className="btn btn-neutral mt-4 w-xs" type="submit"  disabled={isSubmitting}> 
                    {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin text-white" />)  : ('Verify Code') }
                </button>
            </fieldset>
            </form>
        </div>
    </div>
  )
}
