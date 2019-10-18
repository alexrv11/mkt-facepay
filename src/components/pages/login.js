import '../styles/login.scss'
import React from 'react';
import { withRouter } from 'react-router-dom';
import Card from '@andes/card';
import Button from '@andes/button';
import TextField from '@andes/textfield';
import { validateUser, getUser } from '../services/login.service';
import { USER_TYPE } from '../constants/index';
import { saveToLocalStorage, getFromLocalStorage, clearLocalStorage } from '../services/storage.service';
import Logo from '../views/logo'
import KrakenLogo from '../views/kraken-logo'
import LogoMP from '../views/mercado-pago-logo'

/** Component that represent home screen  */

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      user : '',
      password : '',
    }

    if (getUser()) {
      window.location.href = '/';
    }

    this.updateUserInput = this.updateUserInput.bind(this);
    this.updatePasswordInput = this.updatePasswordInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.resetInputs = this.resetInputs.bind(this);
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
        const userType = response.data.user_type;
        if (userType === USER_TYPE.SELLER){
          saveToLocalStorage('user', response)
          this.props.history.push('/');
        }
      })
      .catch((error) => {
        this.resetInputs();
        this.props.history.push('/login');
      });
  }

  render() {
    return (
      <div className='login-page'>     
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
                  disabled
                  modifier="transparent">
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