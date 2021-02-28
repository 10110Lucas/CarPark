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

export default class SetGaragem extends React.Component {

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
            aluguel: {},
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

    _onToggleSwitchCobertura = () => this.setState({ cobertura: !this.state.cobertura });
    _onToggleSwitchRampa = () => this.setState({ rampa: !this.state.rampa });
    _onToggleSwitchCadeirante = () => this.setState({ cadeirante: !this.state.cadeirante });

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
                        <Text style={styles.textGradient}>ATUALIZAR GARAGEM</Text>
                    </LinearTextGradient>
                    <View style={{flex: 1}}></View>
                </View>


                <ScrollView style={styles.containerScroll}>
                    <TouchableOpacity
                    style={styles.btnInserirFoto}
                    onPress={() => ImagePicker.showImagePicker(this.imagePickerOptions, (data) => {
                        if (data.didCancel) {
                          return;
                        }
                        if (data.error) {
                          return;
                        }
                        if (data.customButton) {
                          return;
                        }
                        if (!data.uri) {
                          return;
                        }
                        const { remoto } = this.state.foto;
                        this.setState({foto: {local: data.uri, remoto: remoto || false}});
                    })}
                    >
                        <View style={styles.btnContainerFoto}>
                            {/* <Image source={ this.renderFoto() } style={styles.foto} /> */}
                            <ImageScalable
                            height={176}
                            source={ this.renderFoto() }
                            style={styles.foto}
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.containerEndereco}>
                        <View style={styles.containerDuplo}>
                            <View style={styles.ladoEsq}>
                                <TextInput
                                    style={styles.inputEsq}
                                    placeholder="Endereço"
                                    autoCorrect={false}
                                    value={this.state.rua}
                                    onChangeText={rua => this.setState({rua})}
                                />
                            </View>
                            <View style={styles.ladoDir}>
                                <TextInput
                                    style={styles.inputDir}
                                    placeholder="Número"
                                    autoCorrect={false}
                                    value={this.state.numero}
                                    onChangeText={(numero) => {this.setState({numero})}}
                                />
                            </View>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Bairro"
                            autoCorrect={false}
                            value={this.state.bairro}
                            onChangeText={(bairro) => {this.setState({bairro})}}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Cidade"
                            autoCorrect={false}
                            value={this.state.cidade}
                            onChangeText={(cidade) => {this.setState({cidade})}}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Altura: mínimo 2.45m"
                            autoCorrect={false}
                            keyboardType='numeric'
                            maxLength={5}
                            value={this.state.altura}
                            onChangeText={(altura) => {this.setState({altura})}}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Largura: mínimo 3.50m"
                            autoCorrect={false}
                            keyboardType='numeric'
                            maxLength={5}
                            value={this.state.largura}
                            onChangeText={(largura) => {this.setState({largura})}}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Comprimento: mínimo 5.50m"
                            autoCorrect={false}
                            keyboardType='numeric'
                            maxLength={5}
                            value={this.state.comprimento}
                            onChangeText={(comprimento) => {this.setState({comprimento})}}
                        />
                    </View>
            
                    <View style={styles.containerTogle}>
                        <View style={styles.containerTogleLeft}>
                            <LinearTextGradient
                                locations={[0, 1]}
                                colors={["#a31aff", "#4c0080"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.togleGradient}
                                >
                                    <Text style={styles.togleTxt}>Garagem coberta</Text>
                            </LinearTextGradient>
                        </View>
                        <View style={styles.containerTogleRight}>
                            <Switch
                                style={styles.togle}
                                value={this.state.cobertura}
                                onValueChange={this._onToggleSwitchCobertura}
                            />
                        </View>
                    </View>
                            
                    <View style={styles.containerTogle}>
                        <View style={styles.containerTogleLeft}>
                            <LinearTextGradient
                                locations={[0, 1]}
                                colors={["#a31aff", "#4c0080"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.togleGradient}
                                >
                                    <Text style={styles.togleTxt}>Garagem com rampa</Text>
                            </LinearTextGradient>
                        </View>
                        <View style={styles.containerTogleRight}>
                            <Switch
                                style={styles.togle}
                                value={this.state.rampa}
                                onValueChange={this._onToggleSwitchRampa}
                            />
                        </View>
                    </View>

                    <View style={styles.containerTogle}>
                        <View style={styles.containerTogleLeft}>
                            <LinearTextGradient
                                locations={[0, 1]}
                                colors={["#a31aff", "#4c0080"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.togleGradient}
                                >
                                    <Text style={styles.togleTxt}>Acessível para cadeirantes</Text>
                            </LinearTextGradient>
                        </View>
                        <View style={styles.containerTogleRight}>
                            <Switch
                                style={styles.togle}
                                value={this.state.cadeirante}
                                onValueChange={this._onToggleSwitchCadeirante}
                            />
                        </View>
                    </View>

                    <View style={styles.containerDuplo}>
                        <View style={styles.viewEsq}>
                            <TouchableOpacity
                            style={styles.botao}
                            onPress={ this.excluir }
                            >
                                <LinearGradient style={styles.botaoGradient} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                                    <Text style={styles.botaoText}>Excluir</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewDir}>
                            <TouchableOpacity
                            style={styles.botao}
                            onPress={ this.salvarDados }
                            >
                                <LinearGradient style={styles.botaoGradient} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                                    <Text style={styles.botaoText}>Salvar</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        alignSelf: 'flex-end',
        fontSize: 20,
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
        // width: '100%',
        // height: '100%',
        borderRadius: 7
    },
    containerEndereco: {
        marginTop: 15,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    input: {
        width: '90%',
        fontSize: 17,
        borderRadius: 25,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    containerDuplo: {
        flexDirection: 'row',
        width: '90%',
        marginHorizontal: '5%',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    ladoEsq: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    inputEsq: {
        width: '95%',
        fontSize: 17,
        borderRadius: 25,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    ladoDir: {
        justifyContent: 'flex-end',
        width: '25%',
        backgroundColor: '#FFF'
    },
    inputDir: {
        width: '100%',
        fontSize: 17,
        borderRadius: 25,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    containerTogle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginBottom: 2,
        paddingHorizontal: '8%',
        backgroundColor: '#FFF'
    },
    containerTogleLeft: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        backgroundColor: '#FFF'
    },
    togleGradient: {
        alignItems: 'center'
    },
    togleTxt: {
        fontSize: 20,
        fontFamily: "roboto-regular",
    },
    containerTogleRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: '100%',
        width: '18%',
        backgroundColor: '#FFF'
    },
    togle: {
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        marginLeft: '5%',
        backgroundColor: '#FFF'
    },
    viewEsq: {
        flex: 1,
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#FFF'
    },
    viewDir: {
        flex: 1,
        alignItems: 'flex-end',
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#FFF'
    },
    botao: {
        height: 45,
        width: '95%',
        borderRadius: 25,
        elevation: 5,
    },
    botaoGradient: {
        height: 45,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,        
    },
    botaoText: {
        color: '#FFF',
        fontSize: 20
    },
});