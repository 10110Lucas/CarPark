import * as React from 'react';

import Usuario from '../autenticacao/Usuario';
import BancoDados from '../dao/BancoDados';

export default class Services extends React.Component {

    constructor(props){
        super(props)

    }

    static limpeza = () => {
        Usuario.clean();
        BancoDados.clean();
    }

    static logout = (props) => {
        this.limpeza();
        console.log(`Logout Realizado!`);
        props.navigation.navigate('Login');
    }

}