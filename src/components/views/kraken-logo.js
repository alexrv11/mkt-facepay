import '../styles/kraken-logo.scss'
import React from 'react';


/** Component that represent home screen  */
const KrakenLogo = (props) => {
    return (
        <div className={`kraken-logo ${props.invert ? 'invert' : ''}`}>     
        </div>
    )
}

export default KrakenLogo;