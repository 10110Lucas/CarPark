import React from 'react';
import {
    StyleSheet,
    Switch,
    ScrollView,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LinearTextGradient } from 'react-native-text-gradient';
import ImagePicker from 'react-native-image-picker';
import ImageScalable from 'react-native-scalable-image';

import Enderecos from '../dao/Enderecos';
import BancoDados from '../dao/BancoDados';

export default class GaragemOpt extends React.Component {

    constructor(props){
        super(props);
        this.enderecos = new Enderecos();


        this.state = {
            foto: {local: false, remoto: false},
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            cep: '',
            id: 0,
            aluguel: {
                chat: {idLocatario: '', nomeLocatario: '', celularLocatario: ''},
                veiculo: {cor: '', modelo: '', placa: '', dataInicial: '', dataFinal: '', valorTotal: 0}
            },
            preco: 0,
            diaria: 0,
            altura: '',
            largura: '',
            comprimento: '',
            cobertura: false,
            rampa: false,
            cadeirante: false,
        }

        this.imagePickerOptions = {
            title: 'Selecione uma Opção:',
            storageOptions: {
                path: '../Locador/Media/Garagem'
            },
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Tirar uma Foto',
            chooseFromLibraryButtonTitle: 'Procurar Foto da Galeria',
        };
    }

    componentDidMount(){
        this.carregarDados();
    }

    carregarDados = async () => {
        const { id } = this.props.route.params;
        try{
            let garagem = await this.enderecos.buscar(id)
            this.setState({
                foto: garagem.foto,
                rua: garagem.address.rua,
                numero: garagem.address.numero,
                bairro: garagem.address.bairro,
                cidade: garagem.address.cidade,
                cep: garagem.address.cep,
                id: garagem.id,
                altura: garagem.altura,
                aluguel: garagem.aluguel,
                preco: garagem.preco,
                diaria: garagem.diaria,
                largura: garagem.largura,
                comprimento: garagem.comprimento,
                cobertura: garagem.cobertura,
                rampa: garagem.rampa,
                cadeirante: garagem.cadeirante,
            });
        } catch(error) {
            console.log('Erro ao carregar dados:',error);
        }
    }

    entrarChat = async () => {
    }
    encerrarContrato = async () => {
        let valido = await this.enderecos.encerrarContrato(this.state);
        if (valido) {
            this.voltarHome();
        }
        else return;
    }
    salvarDados = async () => {
        let valido = false;
        const { local } = this.state.foto;
        try {
            let nomeFoto = local.split('\/');
            let url = await BancoDados.uploadFoto(local, 'Garagem', nomeFoto[nomeFoto.length - 1]);
            
            this.setState({foto: {local: local, remoto: url}});

            valido = await this.enderecos.atualizar(this.state);
            if(valido)
                this.voltarHome();
        } catch (error) {
            console.log('Erro ao salvar dados:',error);
        }
    }
    excluir = async () => {
        let valido = false;
        try {
            valido = await this.enderecos.excluir(this.state);
            if(valido)
                this.voltarHome();
        } catch (error) {
            console.log('Erro ao salvar dados:',error);
        }
    }    
    voltarHome = () => {
        this.props.navigation.navigate('Home');
    }
    formatar = (valor) => {
        return String(valor).replace(/(\W|\D+)/g, '');
    }
    maskerCel = (dado) => {
        let valor = String(dado);
        if(valor !== '')
            valor = this.formatar(valor);
        parseInt(valor);
        if (valor.length < 3)
            return valor.replace(/(\d{1,2})/g, '\(\$1');
        else if (valor.length > 2 && valor.length < 8)
            return valor.replace(/(\d{2})(\d+)/g, '\(\$1\)\ \$2');
        else if (valor.length > 7)
            return valor.replace(/(\d{2})(\d{5})(\d{1,4})/g, '\(\$1\)\ \$2\-\$3');
    }
    renderFoto = () => {
        const { foto } = this.state;
        if (typeof foto.remoto === 'string' && foto.remoto !== null && foto.remoto !== undefined){
            return {uri: foto.remoto};
        }
        else {
            return require('../img/camera.png');
        }
    }

    render(){

        return(
            <View style={styles.container}>

                <View style={styles.containerHeader}>
                    <TouchableOpacity 
                        style={styles.btnHeader}
                        onPress={this.voltarHome}
                    >
                        <Image style={styles.btnIcon} source={require('../img/voltar.png')}/>
                    </TouchableOpacity>
                    <LinearTextGradient
                    locations={[0, 1]}
                    colors={["#a31aff", "#4c0080"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                    >
                        {
                            this.state.aluguel ?
                            <Text style={styles.textGradient}>GARAGEM ALUGADA</Text> :
                            <Text style={styles.textGradient}>GARAGEM DISPONIVEL</Text>
                        }
                    </LinearTextGradient>
                    <View style={{flex: 1}}></View>
                </View>


                <ScrollView style={styles.containerScroll}>
                    <View
                    style={styles.btnInserirFoto}
                    >
                        <View style={styles.btnContainerFoto}>
                            {/* <Image source={ this.renderFoto() } style={styles.foto} /> */}
                            <ImageScalable
                            height={176}
                            source={ this.renderFoto() }
                            style={styles.foto}
                            />
                        </View>
                    </View>

                    <View style={styles.itemContainer}>
                        <Text style={styles.itemContrato}>Preço do dia: R$ {this.state.diaria},00</Text>
                        <Text style={styles.itemContrato}>Preço Mensal: R$ {this.state.preco},00</Text>
                    </View>

                    {
                        this.state.aluguel ?
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemContrato}>Nome Locatario: {this.state.aluguel.chat.nomeLocatario}</Text>
                            <Text style={styles.itemContrato}>Telefone: {this.maskerCel(this.state.aluguel.chat.celularLocatario)}</Text>
                            <Text style={styles.itemContrato}>
                                Veiculo: {this.state.aluguel.veiculo.modelo} - {this.state.aluguel.veiculo.cor}, {this.state.aluguel.veiculo.placa}
                            </Text>
                            <Text style={styles.itemContrato}>Data Inicial: {this.state.aluguel.veiculo.dataInicial}</Text>
                            <Text style={styles.itemContrato}>Data Final: {this.state.aluguel.veiculo.dataFinal}</Text>
                            <Text style={styles.itemContrato}>Valor Total: R$ {this.state.aluguel.veiculo.valorTotal},00</Text>
                            {/* <TouchableOpacity
                            style={styles.botao}
                            onPress={ this.entrarChat }
                            >
                                <LinearGradient
                                style={styles.botaoGradiente}
                                colors={['#a31aff', '#7a00cc', '#4c0080']}
                                >
                                    <Text style={styles.botaoGradienteText}>Chat</Text>
                                </LinearGradient>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                            style={styles.botao}
                            onPress={ this.encerrarContrato }
                            >
                                <LinearGradient
                                style={styles.botaoGradiente}
                                colors={['#a31aff', '#7a00cc', '#4c0080']}
                                >
                                    <Text style={styles.botaoGradienteText}>Encerrar Contrato</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View> : null
                    }


                    <TouchableOpacity
                    style={styles.botao}
                    onPress={ () => this.props.navigation.navigate('Alterar Garagem', {id: this.state.id}) }
                    >
                        <LinearGradient
                        style={styles.botaoGradiente}
                        colors={['#a31aff', '#7a00cc', '#4c0080']}
                        >
                            <Text style={styles.botaoGradienteText}>Alterar Garagem</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#EEE',
    },
    btnHeader: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    btnIcon: {
        width:35,
        height: 35,
        alignSelf: 'flex-start',
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textGradient: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        fontFamily: 'roboto-regular',
    },
    containerScroll: {
        flex: 1,
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    btnInserirFoto: {
        width: '90%',
        height: 180,
        borderRadius: 7,
        borderColor: '#4C0080',
        borderWidth: 2,
        borderStyle: 'solid',
        alignSelf:'center',
        justifyContent:'center',
        backgroundColor: '#CCC'
    },
    btnContainerFoto: {
        width: '100%',
        height: '100%',
        borderRadius: 7,
    },
    foto: {
        alignSelf: 'center',
        borderRadius: 7
    },
    itemContainer: {
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 10,
        marginTop: 10,
        marginHorizontal: 20,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#580084',
        backgroundColor: '#f0f0f0',
    },
    itemContrato: {
        fontSize: 18,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        color: '#000',
    },
    botao: {
        height: 45,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        elevation: 5,
        marginTop: 15
    },
    botaoGradiente: {
        height: 45,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    botaoGradienteText: {
        color: '#FFF',
        fontSize: 20
    },
});