import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LinearTextGradient } from 'react-native-text-gradient';
import BancoDados from '../dao/BancoDados';
import Enderecos from '../dao/Enderecos';
import SetGaragem from './SetGaragem';
// import FilesFlow from '../services/FilesFlow';

export default class Home extends Component {
    
    constructor(props){
        super(props);
        this.enderecos = new Enderecos();
        this.state = {
            garagens: []
        }
        this.listarGaragens();
        this.setGaragem = new SetGaragem();
    }

    listarGaragens = async () => {
        let garagens = this.state.garagens;
        try{
            garagens = await this.enderecos.lista(BancoDados.contaUsuario.registroID);
        } catch(error){
            console.log('Erro ao listar garagens: ',error);
        }
        // console.log(`Garagens: ${JSON.stringify(garagens)}`)
        this.setState({garagens});
    }

    limpeza = () => this.setState({garagens: []});
    
    atualizarGaragem = (id) => {
        this.props.navigation.navigate('GaragemOpt', {id: id})
        // this.props.navigation.navigate('Alterar Garagem', {id: id})
    };

    renderFoto = (link) => {
        const { remoto } = link;
        if (remoto && typeof remoto === 'string' && remoto != null && remoto != undefined){
            return {uri: remoto};
        } else {
            return require('../img/camera.png');
        }
    }

    renderItem = (garagem) => {
        if (garagem.item.aluguel){
            return(
                <TouchableOpacity
                style={styles.card}
                onPress={ () => this.atualizarGaragem(garagem.item.id) }
                >
                    <LinearGradient style={styles.cardGradient} colors={['#fff', '#fff', '#fff']}>
                        <View style={styles.containerCardFoto}>
                            <Image
                            source={ this.renderFoto(garagem.item.foto)}
                            style={styles.cardFoto}
                            />
                        </View>
                        <Text style={styles.enderecoDestaque}>Garagem Alugada</Text>
                        <Text style={styles.endereco}>{garagem.item.endereco}</Text>
                        <Text style={styles.endereco}>{garagem.item.bairro}</Text>
                    </LinearGradient>
                    <Image style={styles.imagem}source={require('../img/marker.png')} />
                </TouchableOpacity>
            );
        }
        return(
            <TouchableOpacity
            style={styles.card}
            onPress={ () => this.atualizarGaragem(garagem.item.id) }
            >
                <LinearGradient style={styles.cardGradient} colors={['#fff', '#fff', '#fff']}>
                    <View style={styles.containerCardFoto}>
                        <Image
                        source={ this.renderFoto(garagem.item.foto)}
                        style={styles.cardFoto}
                        />
                    </View>
                    <Text style={styles.enderecoDestaque}>Garagem Disponível</Text>
                    <Text style={styles.endereco}>{garagem.item.endereco}</Text>
                    <Text style={styles.endereco}>{garagem.item.bairro}</Text>
                </LinearGradient>
                <Image style={styles.imagem}source={require('../img/marker.png')} />
            </TouchableOpacity>
        );
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.containerTitulo}>
                    <View style={styles.viewMenu}>
                        <TouchableOpacity
                            style={styles.menu}
                            onPress={this.props.navigation.openDrawer}
                        >
                            <Image style={{width:30, height: 23}} source={require('../img/menu.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titulo}>
                        <LinearTextGradient
                            locations={[0, 1]}
                            colors={["#a31aff", "#4c0080"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.tituloText}
                        >
                            <Text>{BancoDados.contaUsuario.nome}</Text>
                        </LinearTextGradient>
                        {/* <LinearGradient 
                        colors={['#a31aff', '#4c0080']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{paddingLeft: 8, borderRadius: 10}}> */}
                            <Image style={styles.fotoPerfil} source={require('../img/Car_logo.png')}/>
                        {/* </LinearGradient> */}
                    </View>
                </View>

                <View style={styles.containerHeader}>
                    {/* <TouchableOpacity
                    style={styles.btnGaragem}
                    onPress={ this.adicionarGaragem }
                    >
                        <LinearGradient style={styles.btnGaragemColors} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                            <Text style={styles.btnGaragemText}>Adicionar Garagem</Text>
                        </LinearGradient>
                    </TouchableOpacity> */}
                </View>
                
                <View style={styles.containerCards}>
                    <LinearTextGradient
                        locations={[0, 1]}
                        colors={["#a31aff", "#4c0080"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tituloText2}
                    >
                        <Text>Minhas Garagens</Text>
                    </LinearTextGradient>
                    <FlatList
                    style={styles.cards}
                    data={this.state.garagens}
                    keyExtractor={item => String(item.key)}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    containerTitulo: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingHorizontal: 5,
        backgroundColor: '#FFF',
    },
    viewMenu: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        backgroundColor: '#FFF'
    },
    menu: {
        marginLeft: 10,
        alignSelf: 'center',
    },
    titulo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#FFF'
    },
    tituloText: {
        alignSelf: 'center',
        marginRight: 10,
        fontSize: 27,
        backgroundColor: '#FFF'
    },
    fotoPerfil: {
        alignSelf: 'center',
        width: 40,
        height: 40,
        marginRight: 10,
        borderWidth: 2,
        borderRadius: 5,
        tintColor: '#9400D3',
    },
    containerHeader: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    btnGaragem: {
        height: 45,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        elevation: 5,
        marginTop: 15,
    },
    btnGaragemColors: {
        height: 45,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,        
    },
    btnGaragemText: {
        color: '#FFF',
        fontSize: 20
    },
    containerCards: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    tituloText2: {
        alignSelf: 'center',
        fontSize: 22,
        marginBottom: 20,
        backgroundColor: '#FFF'
    },
    cards: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFF'
    },
    card: {
        marginTop: '2%',
        marginHorizontal: '7%',
        marginBottom: '4%',
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 8,
        paddingBottom: 10,
    },
    imagem:{
        width: 90,
        height: 90,
        position: 'absolute',
        marginTop: 148,
        marginLeft: -22
    },
    containerCardFoto: {
        width: 300,
        height: 150,
        borderRadius: 7,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#4C0080',
        alignSelf:'center',
        justifyContent:'center',
        marginTop: 5
    },
    cardFoto: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 7,
    },
    endereco: {
        fontSize: 18,
        color: '#4c0080',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    enderecoDestaque: {
        fontSize: 20,
        color: '#999',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
});