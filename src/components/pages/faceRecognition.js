import React from "react";
import * as faceapi from "face-api.js";
import { parseBase64Image, payment } from "../../services/faceIntegration";
import "../styles/faceRecognition.scss";
import Loader from "react-loader-spinner";
import Card from '@andes/card';

const queryString = require("query-string");

let video;

export default class FaceRecognition extends React.Component {
  constructor(props) {
    super(props);
    const { amount, desc } = queryString.parse(props.location.search);
    this.state = {
      faceRecognized: false,
      isPaying: false,
      paymentOK: null,
      amount,
      desc,
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
      faceRecognized: true,
      isPaying: true
    });
    const imageBase64 = imageCanvas.toDataURL("image/jpeg");
    const parsedImage = parseBase64Image(imageBase64);
    this.requestPayment(parsedImage);

  }

  requestPayment(face) {
    payment(face, this.state.amount, this.state.desc)
      .then(res => {
        console.log("successfull", res);
        this.setState({
          isPaying: false,
          payer: res.data.payment.userName
        });
        this.setPaymentState(true);

        setTimeout(() => {
          this.setState({
            payer: null
          });
        }, 4000)
      })
      .catch(err => {
        console.log("Error", err);
        this.setState({
          isPaying: false,
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
        <div className="column">
          <Card className={`payer-card ${this.state.payer ? 'animate' : ''}`}>
            <div className="title">Usuario Pagador</div>
            <div className="text">{`${this.state.payer}`}</div>
          </Card>

        </div>
        <div className="column left">
          <Card>
            <div className="title">Monto</div>
            <div className="text">{`$ ${this.state.amount}`}</div>
          </Card>

          <Card>
            <div className="title">Descripción</div>
            <div className="text">{`${this.state.desc}`}</div>
          </Card>
        </div>
      </div>
    );
  }
}
