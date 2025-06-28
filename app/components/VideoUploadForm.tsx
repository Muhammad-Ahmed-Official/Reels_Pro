"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
// import { useNotification } from "./Notification";
// import { apiClient } from "@/lib/api-client";
// import FileUpload from "./FileUpload";

interface VideoFormData {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
}

export default function VideoUploadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // const form = useForm(){
    //     // resolver: zodResolver()
    // }

const onSubmit = async (data: VideoFormData) => {

};

  return (
    <div className="flex justify-center items-center h-[725px] md:h-[620px] px-4">
      <div className="max-w-md space-y-8 bg-base-200 border-base-300 shrink-0 shadow-2xl rounded-box w-sm border p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Upload Reels Pro</h1>
          {/* <p className="mb-4">Login to continue watching Reels</p> */}
        </div>

            {/* onSubmit={form.handleSubmit(onSubmit)} */}
                {/* {form.formState.errors.identifier && ( <p className="text-red-500 text-sm">{form.formState.errors.identifier.message}</p>)} */}
                {/* {...form.register("identifier")} */}
        <form  className="space-y-6">
            <fieldset className="fieldset mx-auto">

                <label className="label text-[16px] font-semibold">Title</label>
                <input type="text" className="input rounded" placeholder="Title"  />

                <label className="label text-[16px] font-semibold">Description</label>
                <textarea  className="textarea rounded" placeholder="Description" />

                <label className="label text-[16px] font-semibold">Upload Video</label>
                <input type="file" className="file-input file-input-accent" />    

                <div className="flex gap-2 items-center font-bold text-[14px] mt-3"> Uploading <Loader2 size={25} className="mr-2 animate-spin text-black" /> </div>
                <progress className="progress progress-neutral w-xs" value={0} max="100"></progress>

                <button className="btn btn-neutral mt-4 w-xs" type="submit" >
                    {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin text-white" />)  : ('Publish Video') }
                </button>
            </fieldset>
        </form>
     </div>
    </div>
  );
}