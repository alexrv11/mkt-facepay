import React from "react";
import * as faceapi from "face-api.js";
import { parseBase64Image, payment } from "../../services/faceIntegration";
import { registerPayer } from "../services/login.service";

import "../styles/faceRecognition.scss";
import Loader from "react-loader-spinner";
const queryString = require("query-string");

let video;

export default class FaceRecognition extends React.Component {
  constructor(props) {
    super(props);
    const { amount, desc, register } = queryString.parse(props.location.search);
    this.state = {
      faceRecognized: false,
      isPaying: false,
      paymentOK: null,
      amount,
      desc,
      register
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
        if (score >= 0.8 && !this.state.faceRecognized) {
          console.log(detections.detection.score);
          clearInterval(detectFaceInterval);
          const imageCanvas = faceapi.createCanvasFromMedia(
            document.getElementById("inputVideo"),
            {
              width: 480,
              height: 272
            }
          );
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
    if (this.state.register) {
      this.registerFace(parsedImage);
    } else {
      this.requestPayment(parsedImage);
    }
    this.setState({
      isPaying: true
    });
  }

  registerFace(face) {
    registerPayer(face)
      .then(response => {
        console.log(response.data);
        window.location.href = response.data;
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  requestPayment(face) {
    payment(face, this.state.amount, this.state.desc)
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
        faceRecognized: false
      });
      this.startRecognition();
    }, 3000);
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
            <Loader
              className="loader"
              type="Puff"
              color="#008744"
              height={480}
              width={480}
            />
          )}
          {paymentOK === false && (
            <Loader
              className="loader"
              type="Puff"
              color="#D12440"
              height={480}
              width={480}
            />
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
