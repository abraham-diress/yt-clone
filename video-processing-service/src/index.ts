import { error } from "console";
import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage"; 

setupDirectories();

const app = express();
app.use(express.json())

app.post("/process-video", async (req, res) => {
  //Get path of the input video file from the request body
  let data; 
  try{
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
    data = JSON.parse(message);
    if (!data.name){
      throw new Error('Invalid message payload received.');
    }
  }
  catch (error){
    console.error(error);
    res.status(400).send('Bad request: missing filename.');
    return;
  }
   
  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  //Download the raw video from Cloud Storage
  await downloadRawVideo(inputFileName);

  // Convert the video to 360p
  try {
    convertVideo
   } catch(err) {
      Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
      ])
      console.log(err)
      res.status(500).send('Internal Server Error: video processing failed.');
      return;
   }
  // Upload the processed video to Cloud Storage
  await uploadProcessedVideo(outputFileName)

  Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
    ]);

    res.status(200).send('Processing finished successfully');

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Video processing service listening at http://localhost:${port}`
  )
})