// import { apiClient } from "@/lib/api-client";
// import { IVideo } from "@/models/Video";
// import { useEffect, useState } from "react";

import Home from "./components/Home";

export default function Page() {

  // const [video, setVideo] = useState<IVideo[]>([]);
  // useEffect(() => {
  //   const fetchVideo = async() => {
  //     try {
  //       const data = await apiClient.getVideos();
  //       setVideo(data);
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }

  //   fetchVideo();
  // }, [])

  // console.log(video)

  return (
      <Home />
  );
}
