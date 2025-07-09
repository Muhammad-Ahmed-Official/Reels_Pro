"use client" 

import { ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError, upload } from "@imagekit/next";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
    onSuccess: (res:any) => void;
    onProgress?: (progress: number) => any;
    fileType?: "image" | "video" 
} 

const FileUpload = ({onSuccess, onProgress, fileType="image"}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file");
                return false;
            };
            if (file.size > 100 * 1024 * 1024) {
                setError("File size must be less than 100 MB");
                return false;
            };
        } else {
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if(!validTypes.includes(file?.type)){
                setError("please upload a valid file(JPEG, PNG, WEBP)");
                return false;
            };
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5 MB");
                return false;
            };
        }
        return true;
    }

    const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (!file || !validateFile(file)) return;
        setUploading(true);
        setError(null);

        try {
            const authRes = await fetch("/api/upload-auth");
            const auth = await authRes.json();

            const response = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth?.authenticationParams.signature,
                expire: auth?.authenticationParams.expire,
                token: auth?.authenticationParams.token,
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress){
                        const percent = Math.round((event.loaded / event.total) * 100);
                        setProgress(percent); 
                        if (onProgress) onProgress(percent);
                    }
                },
            })
            onSuccess(response);
        } catch (error) {
            setError("Upload failed. Please try again.");
            console.log("Upload failed");
        } finally{
            setUploading(false);
        }
    }

    return (
            <>
            <div className="space-y-8">
                <input className="cursor-pointer mb-2 inline-block size-15 rounded-full ring-2 ring-white bg-white" type="file" accept={fileType === "video" ? "video/*" : "image/*"} onChange={handleFileChange} />
                {uploading && (
                    <>
                        <div className="flex gap-2 items-center font-bold text-[14px] m-0">
                        Uploading <Loader2 size={20} className="animate-spin text-black" />
                        </div>
                        {onProgress && <progress className="progress progress-accent w-full" value={progress} max={100} />}
                    </>
                )}

                {
                    error && ( <div className="text-red-500 text-sm">{error}</div> )
                }
            </div>
        </>
    );
};

export default FileUpload;