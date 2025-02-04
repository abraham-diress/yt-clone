import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { resolve } from 'path';
import { rejects } from 'assert';
import exp from 'constants';
import { dir } from 'console';


const storage = new Storage();

const rawVideoBucketName = "yt-raw-vids";
const processedVideoBucketName = "yt-processed-vids"

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";



export function setupDirectories() {
  ensureDirectoryExistence(localRawVideoPath)
  ensureDirectoryExistence(localProcessedVideoPath)
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

export function deleteRawVideo(fileName: string){
      deleteFile(`${localRawVideoPath}/${fileName}`)
}

export function deleteProcessedVideo(fileName: string){
  deleteFile(`${localProcessedVideoPath}/${fileName}`)
}

function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)){
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Failed to delete file")
            reject(err)
          }
          else {
            console.log("File deleted successfully")
            resolve();
          }
        })
    }
    else {
      console.log("File not found, skipping the delete")
      resolve()
    }
  })
}

function ensureDirectoryExistence(dirPath: string){
  if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created at ${dirPath}`);
  }
}
