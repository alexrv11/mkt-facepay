import '../styles/login.scss'
import React from 'react';
import { withRouter } from 'react-router-dom';
import Card from '@andes/card';
import Button from '@andes/button';
import Snackbar from '@andes/snackbar';
import TextField from '@andes/textfield';
import { validateUser } from '../services/login.service';
import { USER_TYPE } from '../constants/index';
import { saveToLocalStorage, getFromLocaleStorage, clearLocaleStorage } from '../services/storage.service';

/** Component that represent home screen  */

class LoginPage extends React.Component {

  constructor(props){
    super(props);
    
    this.state = {
      user : '',
      password : '',
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
          <h1>Face Pay</h1>
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
        </Card>
      </div>
    )
  };
}

export default withRouter(LoginPage);