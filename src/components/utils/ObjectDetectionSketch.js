import * as p5 from "p5";
import "p5/lib/addons/p5.dom";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as faceapi from "face-api.js";
const MODEL_URL = "/models";
// this will pick public folder by default

export default function sketch(p) {
  // Variables
  // save current camera image
  let capture = null;
  // save cocossd Model
  let cocossdModel = null;
  // to save the result of cocossd and face-api results
  let cocoDrawings = [];
  let faceDrawings = [];

  // Custom Function
  // Used to store the result of coco-ssd model
  function showCocoSSDResults(results) {
    const id = capture.id();
    cocoDrawings = results;
  }
  // used to store the result for the face-api.js model
  function showFaceDetectionData(data) {
    faceDrawings = data;
  }

  // P5.js Functions
  p.setup = async function() {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadAgeGenderModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);

    p.createCanvas(1280, 720);

    const constraints = {
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720
        },
        optional: [{ maxFrameRate: 10 }]
      },
      audio: false
    };
    capture = p.createCapture(constraints, () => {});

    capture.id("video_element");
    capture.size(1280, 720);
    capture.hide(); // this is require as we don't want to show the deafault video input

    cocoSsd
      .load()
      .then(model => {
        try {
          cocossdModel = model;
        } catch (e) {
          console.log(e);
        }
      })
      .catch(e => {
        console.log("Error occured : ", e);
      });
  };
  p.draw = function() {};
}
