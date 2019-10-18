import React from "react";
import * as faceapi from "face-api.js";

let video;

export default class FaceRecognition extends React.Component {
  constructor() {
    video = document.getElementById("video");

    video.addEventListener("play", () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }, 100);
    });
  }
  async initFaceRecognition() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")
    ]).then(this.startVideo);
  }

  startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => (video.srcObject = stream),
      err => console.error(err)
    );
  }

  render() {
    return (
      <div className="face-recognition-container">
        <video
          width="480"
          height="480"
          id="inputVideo"
          autoplay
          muted
          onloadedmetadata="onPlay(this)"
          playsinline
        />
      </div>
    );
  }
}
