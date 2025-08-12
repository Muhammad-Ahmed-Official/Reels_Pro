import { apiClient } from "@/lib/api-client";
import { passwordSchema } from "@/schemas/updPasswordSchema";
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type PasswordProps = {
  updatePassword: boolean;
  setUpdatePassword: (value: boolean) => void;
};


function PasswordModel({ updatePassword, setUpdatePassword }: PasswordProps) {

    const {register, reset, handleSubmit, formState: { isSubmitting, errors}} = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
          oldPassword: "",
          newPassword: ""
        }
    })

    const onsubmit = async (data:z.infer<typeof passwordSchema>) => {
        await asyncHandlerFront(
            async () => {
                await apiClient.updatePass(data as any);
                toast.success("Password updated successfully")
                reset();
                setUpdatePassword(false);
            },
            (error:any) => {
                toast.error("Failed to login", error)
            }
        )
    }

  const [closing, setClosing] = useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setUpdatePassword(false);
      reset();
    }, 300);
  };

  useEffect(() => {
    document.body.style.overflow = updatePassword ? "hidden" : "auto";
    return () => {
        document.body.style.overflow = "auto";
    };
    }, [updatePassword]);


    if (!updatePassword && !closing) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0 ${closing ? "animate-fadeOut" : "animate-fadeIn"}`}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}> </div>

      <div
        className={`relative z-10 w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg p-6 space-y-4
          ${closing ? "animate-modalClose" : "animate-modalOpen"}`}>
        <h4 className="text-lg font-semibold text-gray-800">Update Password</h4>
        <form onSubmit={handleSubmit(onsubmit)}>
            <div>
            <label className="block text-sm font-medium text-gray-700 my-2"> Current Password </label>
            <input type="password" placeholder="Enter current password"
                {...register("oldPassword")}
                className="w-full px-3 py-2 border border-white/50 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 text-sm outline-none"/>
            </div>
            {errors.oldPassword && ( <p className="mt-1 text-sm text-red-600">{errors.oldPassword.message}</p>)}

            <div>
            <label className="block text-sm font-medium text-gray-700 my-2"> New Password </label>
            <input type="password" placeholder="Enter new password"
                {...register("newPassword")}
                className="w-full px-3 py-2 border border-white/50 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 text-sm outline-none"/>
            </div>
            {errors.newPassword && ( <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>)}


            <div className="flex justify-end gap-2 pt-2">
            <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-all cursor-pointer">
                Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer">
            {isSubmitting ? <div className="flex justify-center gap-3"><Loader2 className="w-6 h-6 animate-spin" />Password updating...</div> : "Update Password"}
            </button>
            </div>
        </form>   
      </div>
    </div>
  );
}

export default PasswordModel;
