import '../styles/home.scss'

import React from 'react'
import Card from '@andes/card';
import Logo from '../views/logo'
import KrakenLogo from '../views/kraken-logo'
import TextField from '@andes/textfield';
import Button from '@andes/button'
import { getUser, logout } from '../services/login.service';

/** Component that represent home screen  */
class HomePage extends React.Component {  
    
    constructor(props) {
        super(props);
        
        this.state = {
            description: '',
            amount: '',
            errors: {}
        }

        if (!getUser()) {
            window.location.href = '/login';
        }

        this.inputChanged = this.inputChanged.bind(this);
        this.amountChanged = this.amountChanged.bind(this);
        this.logoutHandle = this.logoutHandle.bind(this);
    }

    

    scanHandle = () => {
        if (this.state.description.length > 0 && this.state.amount.length > 0) {
            // go to scan
            window.location.href = `/face?amount=${this.state.amount}&desc=${this.state.description}`
        } else {
            this.updateErrors();
        }
    }

    logoutHandle = () => {
        logout();
        window.location.href = '/login';
    }

    inputChanged = (event) => {
        const {id, value} = event.target
        const obj = this.state;
        obj[id] = value;
        obj.errors[id] = false;

        this.setState(obj);
    }

    updateErrors = () => {
        this.setState({
            errors: {
                amount: this.state.amount.length === 0,
                description: this.state.description.length === 0
            }
        });
    }

    amountChanged = (event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/, '');
        this.inputChanged(event)
    }

    render() {
        const user = getUser();
        
        return (
            <div className="page-container">
                <div className="gray-gradient" />
                <div className="background-flip">
                    <KrakenLogo />
                </div>
                <div className="content"> 
                    <div className="header">
                        <Logo />
                        <div className="header-name">Face Pay</div>
                    </div>   
                    <div className="title">
                        Datos <b>personales</b> 
                    </div>
                    <Card className="user-data">
                        <div className="col field-names">
                            <div className="row">Nombre de usuario:</div>
                            <div className="row">Tipo de usuario regristrado:</div>
                            <div className="row">Nombre de dispositivo:</div>
                        </div>
                        <div className="col values">
                            <div className="row">{user.user_name}</div>
                            <div className="row">{user.user_type}</div>
                            <div className="row">{`${user.user_name}_001`} <div className="settings"/></div>
                        </div>
                    </Card> 
                    <div className="title">
                        Personaliza tu <b>pago</b>
                    </div>
                    <Card className="pay-config">
                        <TextField id='description'
                                className="description" 
                                label="Descripción" 
                                message="Sus usuarios lo verán en sus pagos"
                                placeholder="Ej.: Boleto transporte"
                                messageFixed
                                labelFixed
                                value={this.state.description}
                                onChange={this.inputChanged}
                                modifier={this.state.errors.description ? 'error' : 'default'} />

                        <div className="row">
                            <TextField id='amount'
                                label="Suma de dinero" 
                                message="Elija la suma que desea cobrar"
                                placeholder="0.00"
                                prefix="$"
                                messageFixed
                                labelFixed
                                autoFocus
                                value={this.state.amount}
                                onChange={this.amountChanged}
                                modifier={this.state.errors.amount ? 'error' : 'default'} />
                            <Button className="demo-button" onClick={this.scanHandle}>
                                Scan
                            </Button>
                        </div>
                        
                    </Card> 
                </div>
                    <Button className='logout-button' modifier='outline' onClick={this.logoutHandle}>
                        Cerrar sesión
                    </Button>
            </div>
        )
    }
}

export default HomePage;