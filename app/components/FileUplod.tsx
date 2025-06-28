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
        return false;
    }

    const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (!file || !validateFile(file)) return;
        setUploading(true);
        setError(null);

        try {
            const authRes = await fetch("/api/auth/upload-auth");
            const auth = await authRes.json();

            const response = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NextNEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress){
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
            })
            onSuccess(response);
        } catch (error) {
            console.log("Upload failed");
        } finally{
            setUploading(false);
        }
    }

    return (
        <>
        <div className="space-y-8">
            <input type="file" accept={fileType === "video" ? "video/*" : "image/*"} onChange={handleFileChange} />
            { 
                uploading && ( <div className="flex items-center gap-2 text-sm"> <Loader2 className="animate-spin w-4 h-4" /> <span>Uploading....</span> </div> ) 
            }
            {
                error && ( <div className="text-red-500 text-sm">{error}</div> )
            }

            {/* <button type="button" onClick={handleUpload}>
                Upload file
            </button>
            <br />
            Upload progress: <progress value={progress} max={100}></progress> */}
        </div>
        </>
    );
};

export default FileUpload;