import React from 'react';
import auth from '@react-native-firebase/auth';
import BancoDados from '../dao/BancoDados';

export default class Usuario extends React.Component {


    static autenticado = {
        email: '',
        password: '',
        user: {},
        ativo: false
    }

    static setAutenticado = (email, password, user, ativo) => {
        this.autenticado.email = email;
        this.autenticado.password = password;
        this.autenticado.user = user;
        this.autenticado.ativo = ativo;
    }

    static clean = () => {
        this.setAutenticado('', '', {}, false);
    }

    static setLogin = (email, pass) => {
        this.autenticado.email = email;
        this.autenticado.password = pass;
    }    
    
    static login = async (usuario, senha) => {
        
        this.setLogin(usuario, senha);        
        let uid = false;
        try{
            const { email, password } = this.autenticado;            
            await auth().signInWithEmailAndPassword(email, password)
                .then((Response)=>{
                    this.autenticado.user = Response.user.toJSON();
                    uid = Response.user.uid;
                }
            );            
            // let test = this.autenticado.user.email;            
            // console.log(this.autenticado);
            
            BancoDados.contaUsuario.password = password;
            this.autenticado.ativo = await BancoDados.buscarUsuario(uid);
            
        } catch(err){
            alert('Conta de Usuário Inválido, verifique o email ou senha.')
            console.log(err);
            // this.setAutenticado('','',false,false);
        }
        return this.autenticado.ativo;
    }
    
    static setAuthenticated = (usr, pass, usuario, on) => {
        this.setAutenticado(usr, pass, usuario, on);
        return this.autenticado.ativo;
    }
    
    static getAutenticado = () => {
        return this.autenticado;
    }
}