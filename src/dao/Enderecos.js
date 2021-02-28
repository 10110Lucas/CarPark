import React from 'react';
import database from '@react-native-firebase/database';

export default class Enderecos extends React.Component {

    constructor(props){
        super(props)

        this.garagem = {
            foto: {local: false, remoto: false}
        }
    }
 
    adicionarGaragem = async (garagem) => {
        let ref = database().ref('/carpark/enderecos');
        let enderecos = [];
        await ref.once('value').then((snapshot)=>{
            snapshot.forEach((childSnapshot)=>{
                var dado = childSnapshot.val()
                if(dado)
                    enderecos.push(dado)
            });
        });
        await database().ref('/carpark/tabelaprecos').once('value').then( snapshot => {
            snapshot.forEach(childSnapshot => {
                // console.log(childSnapshot.val());
                    garagem['preco'] = childSnapshot.val().mensal;
                    garagem['diaria'] = childSnapshot.val().diaria;
            })
        })
        console.log('-------------');
        console.log(garagem);
        enderecos.push(garagem);
        enderecos.forEach((valor, index) => {
            valor.id = index;
        });
        ref = database().ref('/carpark/');
        await ref.update({enderecos});

        return true
    }

    lista = async (userID) => {
        let ref = database().ref('/carpark/enderecos/');
        let garagens = [];
        let formato = { key: '', id: 0, foto: {local: false, remoto: false}, aluguel: {}, endereco: '', bairro: '', cidade: '' };
        let cont = 1;
        await ref.once('value').then((snapshot)=>{
            snapshot.forEach((childSnapshot)=>{
                var dado = childSnapshot.val()
                if(dado.userID === userID){
                    formato.key = String(cont);
                    formato.id = dado.id;
                    formato.foto = dado.foto;
                    formato.endereco = `${dado.address.rua},${dado.address.numero}`;
                    formato.bairro = dado.address.bairro;
                    formato.cidade = dado.address.cidade;
                    formato.aluguel = dado.aluguel;
                    garagens.push(formato);
                    formato = { key: '', id: 0, foto: '', endereco: '', bairro: '', cidade: '' };
                    cont += 1;
                }
            });
        });
        return garagens;
    }

    buscar = async (id) => {
        let ref = database().ref('/carpark/enderecos/'+id);
        
        return await ref.once('value').then((snapshot)=>{
            return snapshot.val();
        });
    }

    atualizar = async ({foto, rua, numero, bairro, cidade, cep, id, altura, largura, comprimento, cobertura, rampa, cadeirante}) => {
        this.garagem.foto = foto;
        let dado = {
            address: {rua: rua, numero: numero, bairro: bairro, cidade: cidade, cep: cep},
            id: id,
            foto: foto,
            altura: altura,
            largura: largura,
            comprimento: comprimento,
            cobertura: cobertura,
            rampa: rampa,
            cadeirante: cadeirante
        }
        await database().ref('/carpark/enderecos/'+id).update(dado);
        return true
    }

    excluir = async (garagem) => {
        await database().ref('/carpark/enderecos/'+garagem.id).remove();
        return true
    }

    encerrarContrato = async ({id, aluguel}) => {
        let locatarioUID = aluguel.chat.idLocatario;
        let locadorEncerra = await database().ref('/carpark/enderecos/'+id+'/aluguel/').remove().then(() => {return true});
        if (locadorEncerra){
            await database().ref('/carpark/locatario/'+locatarioUID+'/contratos/').remove();
            await database().ref('/carpark/locatario/'+locatarioUID+'/conversas/').remove();
            return true;
        }
    }

    excluirMuitos = async (userID) => {
        let ref = database().ref('/carpark/enderecos/');
        let enderecos = [];
        await ref.once('value').then((snapshot)=>{
            snapshot.forEach((childSnapshot)=>{
                let dado = childSnapshot.val()
                if(dado.userID === userID){
                    enderecos.push(dado);
                }
            });
        });
        console.log('Remover isso:',enderecos)
        enderecos.map((valor) => database().ref(`/carpark/enderecos/${valor.id}`).remove() );
    }
}