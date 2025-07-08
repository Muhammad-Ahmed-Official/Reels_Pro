"use client"
import { apiClient } from "@/lib/api-client";
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    ; (
      async () => {
        await asyncHandlerFront(async () => {
          // const res = await apiClient.getToken();

          // console.log("res ==>", res);
        }, (error:any) => {
          console.log("error ==>", error.message);
        })
      }
    )()
  }, [])
  return (
    <div>
      Home page
    </div>
  );
}