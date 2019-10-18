import React from 'react';

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Helmet } from 'react-helmet';

import LoginPage from './components/pages/login'
import HomePage from './components/pages/home'
import PayScreen from './components/pages/pay'
import FaceRecognition from './components/pages/faceRecognition';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import './App.scss';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>FacePay</title>
        <meta name="description" content="You have a face? Pay with it!" />
        <meta name="theme-color" content="#ffe600" />
        <meta name="author" content="Kraken Team" />
      </Helmet>
      <BrowserRouter>
        <div className="main">
          <Switch>
            <Route path="/" exact component={HomePage}/>
            <Route path="/login" exact component={LoginPage}/>
            <Route path="/pay" exact component={PayScreen}/>
            <Route path="/face" exact component={FaceRecognition}/>
          </Switch>
        </div>  
      </BrowserRouter>
    </div>
  );
}

export default App;
