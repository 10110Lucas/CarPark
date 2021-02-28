import React from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Enderecos from './Enderecos';
import RNFS from 'react-native-fs';

export default class BancoDados extends React.Component {

    static contaUsuario = {
        foto: {local: false, remoto: false},
        nome: '', 
        sobrenome: '',
        cpf: '',
        celular: '',
        email: '',
        password: '',
        registroID: false,
    }

    static setContaUsuario(foto, nome, sobrenome, cpf, celular, email, password, uid){
        this.contaUsuario.foto = foto;
        this.contaUsuario.nome = nome;
        this.contaUsuario.sobrenome = sobrenome;
        this.contaUsuario.cpf = cpf;
        this.contaUsuario.celular = celular;
        this.contaUsuario.email = email;
        this.contaUsuario.password = password;
        this.contaUsuario.registroID = uid;
    }

    static clean = () => {
        this.setContaUsuario({local: false, remoto: false}, '', '', '', '', '', '', false);
    }

    static setUsuario(foto, nome, sobrenome, cpf, celular, email, uid){
        this.contaUsuario.foto = foto;
        this.contaUsuario.nome = nome;
        this.contaUsuario.sobrenome = sobrenome;
        this.contaUsuario.cpf = cpf;
        this.contaUsuario.celular = celular;
        this.contaUsuario.email = email;
        this.contaUsuario.registroID = uid;
    }

    static criarConta = async ({foto, nome, sobrenome, cpf, celular, email, password}) => {

        this.contaUsuario.registroID = await auth().createUserWithEmailAndPassword(email, password)
        .then((response)=>{
            // console.log(response.user.toJSON());
            // if(!this.contaUsuario.registroID)
            // this.contaUsuario.registroID = response.user.uid;
            return response.user.uid;
            //     this.setState({registroID: database().ref().child('/carpark/locador').push().key})
            // userId: response.user.uid,
            // this.props.navigation.navigate('Home');
        }).catch(error => {
            if (error.code === 'auth/email-already-in-use'){
                console.log('\nEsse endereço de email já esta em uso!\n');
                return;
            } else if (error.code === 'auth/invalid-email'){
                console.log('Endereço de email invalido!');
                return;
            }
            console.error('Erro para criar login',error);
            return;
        });

        let url = await this.uploadFoto(foto.local, 'Perfil');

        let updates = {};
        updates['/carpark/locador/'+this.contaUsuario.registroID] = {
            foto: {local: foto.local, remoto: url},
            nome: nome,
            sobrenome: sobrenome,
            cpf: cpf,
            celular: celular,
            email: email,
            dataCriacao: `${new Date().getDate()}-${(new Date().getMonth() + 1)}-${new Date().getFullYear()}`
        }
        let referencia = database().ref();
        await referencia.update(updates)
        .then(() => {
            // console.log(`Conta de Locador criado!`);
        })
        .catch( error => { console.log(`Erro para registrar dados: ${error}`) });
    }

    static buscarUsuario = async (uid) => {
        await database().ref(`/carpark/locador/${uid}`).once('value').then((snapshot)=>{

            let foto = snapshot.child('foto').val();
            let nome = snapshot.child('nome').val();
            let sobrenome = snapshot.child('sobrenome').val();
            let cpf = snapshot.child('cpf').val();
            let celular = snapshot.child('celular').val();
            let email = snapshot.child('email').val();
            
            this.setUsuario(foto, nome, sobrenome, cpf, celular, email, uid);
        });
        return true;
    }

    static atualizar = async ({foto, nome, sobrenome, cpf, celular, email, password}) => {
        let dado = {foto: foto, nome: nome, sobrenome: sobrenome, cpf: cpf, celular: celular, email: email};
        this.setContaUsuario(foto, nome, sobrenome, cpf, celular, email, password, this.contaUsuario.registroID);

        await database().ref('/carpark/locador/'+this.contaUsuario.registroID).update(dado);
        await auth().currentUser.updateEmail(email);
        await auth().currentUser.updatePassword(password);
        return true
    }
    
    static excluir = async () => {
        let enderecos = new Enderecos();
        await enderecos.excluirMuitos(this.contaUsuario.registroID);
        await database().ref('/carpark/locador/'+this.contaUsuario.registroID).remove();
        await auth().currentUser.delete();
        return true
    }

    static usuario = () => {
        return this.contaUsuario;
    }

    static uploadFoto = async (img, pasta) => {
        const destino = `Locador/${this.contaUsuario.registroID}/${pasta}`;
        let nome = String(img).split('\/');
        nome = nome[nome.length - 1];

        let reference = storage().ref(`${destino}/${nome}`);

        //realizar upload
        // const task = reference.putFile(String(img));
        let imagem = await RNFS.readFile(img, 'base64');
        const task = reference.putString(imagem, 'base64');
        task.on(
            'state_changed',
            snapshot => {
                let porcentagem = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(`Uploading Foto ${porcentagem}%`);
            },
            error => {
                console.log('UpLoad foto erro:', error);
            }
        );
        const foto = [];
        await task.then(async imageSnapshot => {
            await storage()
                .ref(imageSnapshot.metadata.fullPath)
                .getDownloadURL()
                .then(downloadURL => {
                    foto.push({url: downloadURL});
                })
                .catch(err => console.log('Falha de URL: '+err))
        });
        return foto[0].url;
    }
}