import axios from "axios";

export const parseBase64Image = function(base64Image) {
  const splitStart = "data:image/jpeg;base64,";

  try {
    return base64Image.split(splitStart)[1];
  } catch (e) {
    return base64Image;
  }
};

export const authFace = function(base64Image) {
  return axios.post("https://thawing-wildwood-80127.herokuapp.com/validate", {
    face: base64Image
  });
};

export const payment = function(base64Image, amount, description) {
  return axios.post("https://thawing-wildwood-80127.herokuapp.com/payments", {
    image: base64Image,
    amount: Number(amount),
    description,
  });
};