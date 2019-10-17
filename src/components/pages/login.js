import '../styles/login.scss'
import React from 'react';
import Card from '@andes/card';
import Button from '@andes/button';
import TextField from '@andes/textfield';

/** Component that represent home screen  */

class LoginPage extends React.Component {

  handleLogin() {

  }

  render() {
    return (
      <div className='login-page'>     
        <Card className='login-page__card'>
          <h1>Face Pay</h1>
          <div className='login-page_fields'>
            <TextField label="E-mail" message="Ej. ivael@facepay.com" />
            <TextField label="Clave"/>
          </div>
          <div className="login-page__button">
            <Button className="login-page__button--primary" size="large" onClick={this.handleLogin}>Ingresar</Button>
            <Button disabled modifier="transparent">Crear cuenta</Button>
          </div>
        </Card>
      </div>
    )
  };
}

export default LoginPage;