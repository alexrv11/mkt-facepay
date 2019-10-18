import React from "react";
import * as faceapi from "face-api.js";
import { parseBase64Image, authFace } from "../../services/faceIntegration";
import "../styles/faceRecognition.scss";
import Loader from "react-loader-spinner";

let video;

export default class FaceRecognition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      faceRecognized: false,
      isPaying: false,
      paymentOK: null
    };
  }

  componentDidMount() {
    this.initFaceRecognition();
    video = document.getElementById("inputVideo");

    video.addEventListener("play", () => {
      this.startRecognition();
    });
  }

  startRecognition() {
    const detectFaceInterval = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      console.log("Detecting");
      if (detections) {
        // Face detected with high score
        const score = detections.detection.score;
        if (score >= 0.85 && !this.state.faceRecognized) {
          console.log(detections.detection.score);
          clearInterval(detectFaceInterval);
          const imageCanvas = faceapi.createCanvasFromMedia(
            document.getElementById("inputVideo"),
            {
              width: 480,
              height: 272
            }
          );
          debugger
          this.faceRecognized(imageCanvas);
        }
      }
    }, 200);
  }

  async initFaceRecognition() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")
    ]).then(this.startVideo);
  }

  faceRecognized(imageCanvas) {
    // Now we should call the api, or trigger the OK binding
    this.setState({
      faceRecognized: true
    });
    const imageBase64 = imageCanvas.toDataURL("image/jpeg");
    const parsedImage = parseBase64Image(imageBase64);
    this.requestPayment(parsedImage);
    this.setState({
      isPaying: true
    });
  }

  requestPayment(face) {
    authFace(face)
      .then(res => {
        console.log("successfull", res);
        this.setState({
          isPaying: false
        });
        this.setPaymentState(true);
      })
      .catch(err => {
        console.log("Error", err);
        this.setState({
          isPaying: false
        });
        this.setPaymentState(false);
      });
  }

  setPaymentState(state) {
    this.setState({
      paymentOK: state
    });
    setTimeout(() => {
      this.setState({
        paymentOK: null,
        faceRecognized: false,
      });
      this.startRecognition();
    }, 2000);
  }

  startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => (video.srcObject = stream),
      err => console.error(err)
    );
  }

  render() {
    const { isPaying, paymentOK } = this.state;
    return (
      <div className="face-recognition-container">
        <div className="video-container">
          {isPaying && (
            <Loader
              className="loader"
              type="Oval"
              color="#00BFFF"
              height={480}
              width={480}
            />
          )}
          {paymentOK === true && (
            <Loader className="loader" type="Puff" color="#008744" height={480} width={480} />
          )}
          {paymentOK === false && (
            <Loader className="loader" type="Puff" color="#D12440" height={480} width={480} />
          )}
          <video
            className="video-element"
            width="480"
            height="480"
            id="inputVideo"
            autoPlay
            muted
            playsInline
          />
        </div>
      </div>
    );
  }
}
