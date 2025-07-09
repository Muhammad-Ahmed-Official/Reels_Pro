// 'use client'
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import toast from "react-hot-toast";
// import Link from "next/link";
// import { Loader2 } from "lucide-react";
// import { signInSchema } from "@/schemas/signInSchema";
// import { signIn } from "next-auth/react";

// export default function Register() {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const router = useRouter();

//     const form = useForm<z.infer<typeof signInSchema>>({
//         resolver: zodResolver(signInSchema),
//         defaultValues: {
//             identifier: "",
//             password: "",
//         }
//     });


//     const onSubmit = async (data: z.infer<typeof signInSchema>) => {
//       const result = await signIn('credentials', {
//         redirect: false,
//         identifier: data.identifier,
//         password: data.password
//       })
//       form.reset();
//       if(result?.error) return toast.error(result.error);
//       if(result?.url) router.push('/');
      
//     }

//   return (
//     <div className="flex justify-center items-center h-[725px] md:h-[620px] px-4">
//       <div className="max-w-md space-y-8 bg-base-200 border-base-300 shrink-0 shadow-2xl rounded-box w-sm border p-4">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold">Join Reels Pro</h1>
//           <p className="mb-4">Login to continue watching Reels</p>
//         </div>
//         <div className="flex gap-x-5 justify-center items-baseline-last mb-0">
//             <button onClick={() => signIn("google")} className="rounded shadow-xl px-4 py-[6.5px] bg-white cursor-pointer">
//                 <img src="https://img.icons8.com/?size=25&id=17949&format=png&color=000000" alt="" />
//             </button>
//             <button onClick={() => signIn("github")} className="rounded shadow-xl px-4 py-1 bg-white cursor-pointer">
//                 <img src="https://img.icons8.com/?size=30&id=4Z2nCrz5iPY2&format=png&color=000000" alt="" />
//             </button>
//         </div>
//         <div className="flex items-center gap-4 text-gray-500 my-3">
//             <hr className="flex-grow border-t border-gray-300" />
//             <span className="text-sm">or</span>
//             <hr className="flex-grow border-t border-gray-300" />
//         </div>

//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <fieldset className="fieldset mx-auto">

//                 <label className="label">Email</label>
//                 <input type="email" className="input" placeholder="Email" {...form.register("identifier")} />
//                 {form.formState.errors.identifier && ( <p className="text-red-500 text-sm">{form.formState.errors.identifier.message}</p>)}

//                 <label className="label">Password</label>
//                 <input type="password" className="input" placeholder="Password" {...form.register("password")}/>
//                 {form.formState.errors.password && ( <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>)}

//                 <button className="btn btn-neutral mt-4 w-xs" type="submit"  disabled={isSubmitting}> 
//                     {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin text-white" />)  : ('Register') }
//                 </button>
//             </fieldset>
//         </form>
//        <div className="text-center my-0">
//           <p>
//             Don't have an account?{' '}
//             <Link href="/register" className="text-blue-600  hover:text-blue-800">
//               Register
//             </Link>
//           </p>
//         </div>
//        </div>
//     </div>
//   )
// }



"use client"
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { signInSchema } from '@/schemas/signInSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()

  const {register, reset, handleSubmit, formState:{ isSubmitting, errors } } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    await asyncHandlerFront(
      async() => {
        const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })
      reset();
      if(result?.error) return toast.error(result.error);
      if(result?.url) router.push('/');
      },
      (error: any) => {
        toast.error("Failed to login", error)
      }
    )
  }

    return (
      <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16 xl:px-24">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            {/* <CircleDot className="w-8 h-8 text-[#16C47F]" /> */}
            <span className="text-xl font-semibold">
              <span className="text-primary-400">Reels</span>_
              <span className="text-primary-400">Pro</span>
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-primary-400 mb-8">Log in</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input type="email" placeholder="Email" {...register("identifier")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
              />
              {errors.identifier && ( <p className="text-red-500 text-sm">{errors.identifier.message}</p>)}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password" {...register("password")}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                {...errors.password && ( <p className="text-red-500 text-sm">{errors.password.message}</p>)}
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
                {isSubmitting ? (
                  <Loader2 className="size-7 animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
              <p className="text-sm">
                <Link href="/forgot">Forgot password?</Link>
              </p>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span className="text-primary-500 hover:text-primary-600 font-medium">
              <Link href="/register">Sign up</Link>
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
            <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
            <p className="text-lg text-primary-100">
              Unlock the power of effective outreach with our cutting-edge
              platform, and experience a surge in responses and engagement rates
              like never before.
            </p>
          </div>
        </div>
      </div>
    </div>
    )
}

export default LoginPage