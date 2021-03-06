import '../styles/login.scss'
import React from 'react';
import { withRouter } from 'react-router-dom';
import Card from '@andes/card';
import Button from '@andes/button';
import TextField from '@andes/textfield';
import { validateUser, getUser, registerPayer } from '../services/login.service';
import { saveToLocalStorage } from '../services/storage.service';
import Logo from '../views/logo'
import KrakenLogo from '../views/kraken-logo'
import LogoMP from '../views/mercado-pago-logo'
const Snackbar = require('@andes/snackbar');
const queryString = require("query-string");

/** Component that represent home screen  */

class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    
    this.state = {
      user : '',
      password : '',
      snackbarMessage: '',
      snackbarType: '',
      showSnackbar: false,
    }

    if (getUser()) {
      window.location.href = '/';
    }
    
    this.updateUserInput = this.updateUserInput.bind(this);
    this.updatePasswordInput = this.updatePasswordInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.resetInputs = this.resetInputs.bind(this);
  }

  componentDidMount() {
    const { status } = queryString.parse(this.props.location.search);

    if(status === 'registered') {
      this.showToast('Se ha registrado correctamente', 'success');
    }
    if(status === 'error') {
      this.showToast('Hubo un problema con el registro', 'error');
    }
  }

  showToast(message, type) {
    this.setState({
      snackbarMessage: message,
      snackbarType: type,
      showSnackbar: true,
    });
  }

  updateUserInput(event){
    this.setState({user : event.target.value})
  }

  updatePasswordInput(event){
    this.setState({password : event.target.value})
  }

  resetInputs(){
    this.setState({user: '', password: ''});
  }

  handleLogin = () => {
    validateUser({user: this.state.user, password: this.state.password })
      .then((response) => {
        // const userType = response.data.user_type;
        // if (userType === USER_TYPE.SELLER){
          saveToLocalStorage('user', response.data)
          this.setState({outAnimation: true})
          setTimeout(() => {
            this.props.history.push('/');
          }, 400);
          
        // }
      })
      .catch((error) => {
        this.resetInputs();
        this.props.history.push('/login');
      });
  }

  handleRegisterPayer = () => {
    this.props.history.push('/face?register=true');
  }

  render() {
    const {snackbarMessage, snackbarType, showSnackbar} = this.state;
    return (
      <div className={`login-page ${this.state.outAnimation ? 'outAnimation' : ''}`}>   
      {showSnackbar && <Snackbar
          message={snackbarMessage}
          type={snackbarType}
          show
          delay={3000}
        />
        }  
        <Card className='login-page__card'>
          <div className="header">
              <Logo />
              <div className="header-name">Face Pay</div>
          </div>   
          <div className='login-page__fields'>
            <TextField 
                    label="E-mail" 
                    message="Ingrese su usuario"
                    placeholder="Ej. juan@facepay.com"
                    messageFixed
                    value={this.state.user}
                    labelFixed
                    onChange={this.updateUserInput}/>
            <TextField 
                    label="Clave"
                    message="Ingrese su clave"
                    messageFixed
                    labelFixed
                    type='password'
                    value={this.state.password}
                    onChange={this.updatePasswordInput}/>
          </div>
          <div className="login-page__button">
            <Button 
                  className="login-page__button--primary" 
                  size="large" 
                  onClick={this.handleLogin}>
                  Ingresar
            </Button>
            <Button
                  modifier="transparent"
                  onClick={this.handleRegisterPayer}>
                  Crear cuenta
            </Button>
          </div>
          <KrakenLogo invert/>
        </Card>

        <div className="intro-container">
          <div className="intro-column">
            <img src= {require('../../assets/intro.gif')} alt="intro" />
            <div className="quote">
              “Los datos biométricos ofrecen gran protección contra el fraude financiero y distintos tipos de robos ya que son mucho más seguros que una tipica contraseña o PIN.”
            </div>
            <div className="referer">
              Dr. Thirimachos Bourlai - Fundador & Director
            </div>

            <div className="mp-container">
              <div className="powered-mp">Powered by</div>
              <LogoMP />
            </div>
            
          </div>  
        </div>
      </div>
    )
  };
}

export default withRouter(LoginPage);