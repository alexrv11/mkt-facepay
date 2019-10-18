import '../styles/home.scss'

import React from 'react'
import Card from '@andes/card';
import Logo from '../views/logo'
import KrakenLogo from '../views/kraken-logo'
import TextField from '@andes/textfield';
import Button from '@andes/button'

/** Component that represent home screen  */
const HomePage = (props = {}) => {
    /* temp */
    props = {};
    props.collector = {
        username: 'Linea 184 - Ersa Urbano',
        deviceName: 'Unidad 48',
        mercadoPago: {
            nickname: 'LINEA-COLECTIVO-184'
        }
    }

    const {
        username,
        deviceName,
        mercadoPago
    } = props.collector;
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
                        <div className="row">Mercado Pago Nickname:</div>
                        <div className="row">Nombre de dispositivo:</div>
                    </div>
                    <div className="col values">
                        <div className="row">{username}</div>
                        <div className="row">{mercadoPago.nickname}</div>
                        <div className="row">{deviceName}</div>
                    </div>
                </Card> 
                <div className="title">
                    Personaliza tu <b>pago</b>
                </div>
                <Card className="pay-config">
                    <TextField className="description" label="Descripción" 
                            message="Sus usuarios lo verán en sus pagos"
                            placeholder="Ej.: Boleto transporte"
                            messageFixed
                            labelFixed/>

                    <div className="row">
                        <TextField label="Suma de dinero" 
                            message="Elija la suma que desea cobrar"
                            placeholder="0.00"
                            prefix="$"
                            messageFixed
                            labelFixed
                            autoFocus/>
                        <Button className="demo-button">
                            Scan
                        </Button>
                    </div>
                    
                </Card> 
            </div>
            
        </div>
    )
}

export default HomePage;