import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { resolve } from 'path';
import { rejects } from 'assert';


const storage = new Storage();

const rawVideoBucketName = "yt-raw-vids";
const processedVideoBucketName = "yt-processed-vids"

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";



export function setupDirectories() {

} 

export function convertVideo(rawVideoName: string, processedVideoName: string){
  return new Promise<void>((resolve, reject) => {
    ffmpeg( `${localRawVideoPath}/${rawVideoName}`)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
      console.log("Processing completed successfully")
      resolve();
    })
    .on("error", (err) => {
      console.log(`An error occured: ${err.message}`)
      reject(err);
    })
    .save(`${localProcessedVideoPath}/${processedVideoName}`)
})
}

export async function downloadRawVideo(filename: string){
  // We download the file from rawVideoBucket 
  // Then save it to LocalRawVideo 
  storage.bucket(rawVideoBucketName)
  .file(filename)
  .download({ destination: `${localRawVideoPath}/${filename}`})

  console.log(
    "Downloded raw video successfully!"
  )
}

export async function uploadProcessedVideo(filename: string){
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${filename}`, {
        destination: filename
    });

    console.log(
      "Uploaded successfully!"
    )

    await bucket.file(filename).makePublic();
}