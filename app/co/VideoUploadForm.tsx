"use client";

import { videoSchema } from "@/schemas/videoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import FileUpload from "../../components/FileUplod";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";


export default function VideoUploadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const router = useRouter();
    
    const form = useForm<z.infer<typeof videoSchema>>({
      resolver: zodResolver(videoSchema),
      defaultValues: {
        title: "",
        description: "",
        videoUrl: "",
      }
    })

    const onSubmit = async (data: z.infer<typeof videoSchema>) => {
      setIsSubmitting(true);
      try {
        await apiClient.createVideo(data);
        form.reset();
        toast.success("Video Publish Successfully"); 
        router.push('/');
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
          let errorMsg = axiosError.response?.data.message;
          toast.error(errorMsg ?? "Something went wrong");
      } finally{
        setIsSubmitting(false);
      }
    };

  return (
    <div className="flex justify-center items-center h-[725px] md:h-[620px] px-4">
      <div className="max-w-md space-y-8 bg-base-200 border-base-300 shrink-0 shadow-2xl rounded-box w-sm border p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Upload Reels Pro</h1>
        </div>
                
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset className="fieldset mx-auto">

                <label className="label text-[16px] font-semibold">Title</label>
                <input type="text" className="input rounded" placeholder="Title" {...form.register("title")}  />
                {form.formState.errors.title && ( <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>)}

                <label className="label text-[16px] font-semibold">Description</label>
                <textarea  className="textarea rounded" placeholder="Description" {...form.register("description")} />
                {form.formState.errors.description && ( <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>)}

                <label className="label text-[16px] font-semibold">Upload Video</label>
                <FileUpload
                  fileType="video"
                  onSuccess={(res) => form.setValue("videoUrl", res.url)}
                  onProgress={setUploadProgress}
                />
                {form.formState.errors.videoUrl && ( <p className="text-red-500 text-sm">{form.formState.errors.videoUrl.message}</p>)}
                
                <button className="btn mt-4 w-xs" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin" />)  : ('Publish Video') }
                </button>
            </fieldset>
        </form>
     </div>
    </div>
  );
}