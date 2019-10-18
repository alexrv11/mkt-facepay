import '../styles/login.scss'
import React from 'react';
import Card from '@andes/card';
import Button from '@andes/button';
import TextField from '@andes/textfield';
import Logo from '../views/logo'
import KrakenLogo from '../views/kraken-logo'
import LogoMP from '../views/mercado-pago-logo'

/** Component that represent home screen  */

class LoginPage extends React.Component {

  handleLogin() {

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
            <TextField label="E-mail" 
                    message="Ingrese su usuario"
                    placeholder="Ej. juan@facepay.com"
                    messageFixed
                    labelFixed/>
            <TextField label="Clave" 
                    message="Ingrese su clave"
                    messageFixed
                    labelFixed/>
          </div>
          <div className="login-page__button">
            <Button className="login-page__button--primary" size="large" onClick={this.handleLogin}>Ingresar</Button>
            <Button disabled modifier="transparent">Crear cuenta</Button>
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

export default LoginPage;