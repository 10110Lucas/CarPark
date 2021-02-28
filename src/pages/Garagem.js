import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    Switch,
    TouchableOpacity,
    Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LinearTextGradient } from 'react-native-text-gradient';
import Enderecos from '../dao/Enderecos';
import RNGooglePlaces from 'react-native-google-places';
import BancoDados from '../dao/BancoDados';
import Usuario from '../autenticacao/Usuario';
import Home from './Home';


export default class Garagem extends Component {
  constructor(){
    super();
    this.state = {
      address: {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        cep: ''
      },
      foto: {local: false, remoto: false},
      id: 0,
      anunciante: '',
      altura: '',
      largura: '',
      comprimento: '',
      cobertura: false,
      rampa: false,
      cadeirante: false,
      location: {
        longitude: 0,
        latitude: 0,
    }
  }
  this.endereco = new Enderecos;
  //this.mapa = new Mapa;

  this.openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal({
        type:'address',
        country: 'BR'
    }, ['address', 'location'])
    .then((place) =>{
        this.edicaoString(place.address)
        this.setState({location: {longitude: place.location.longitude, latitude: place.location.latitude}})
        
    })
    .catch(error => console.log (error.message));
    }
}

  limpeza = () =>{
    this.setState({
      address: {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        cep: ''
      },
      foto: {local: false, remoto: false},
      id: 0,
      anunciante: '',
      userID: '',
      altura: '',
      largura: '',
      comprimento: '',
      cobertura: false,
      rampa: false,
      cadeirante: false,
      location: {
        longitude: 0,
        latitude: 0,
      }
    });
  }

  edicaoString = (address) => {
    var endereco = address
    let re = /\,/g;
    let vet = endereco.split(re);
    let vetor = [];
    let re2 = /\s\-\s/g;
    vet.map( item => item === vet[1] ? item.split(re2).map(valor => vetor.push(valor)) : vetor.push(item) );
    
    this.state.address.rua = vetor[0]
    this.state.address.numero = vetor[1];
    this.state.address.bairro = vetor[2];
    this.state.address.cidade = vetor[3];
    this.state.address.cep = vetor[4];
    this.state.anunciante = BancoDados.contaUsuario.nome;
    this.state.userID = BancoDados.contaUsuario.registroID;
  }

  insert = async () => {
    let valido = false;
    try {
      valido = await this.endereco.adicionarGaragem(this.state);
      if (valido)
        this.voltarHome();
    } catch(error){
      console.log(`Erro ao inserir garagem: ${error}`);
    }
  }

  voltarHome = () => {
    this.limpeza();
    this.props.navigation.navigate('Home');
  }

  _onToggleSwitchCobertura = () => this.setState({ cobertura: !this.state.cobertura });
  _onToggleSwitchRampa = () => this.setState({ rampa: !this.state.rampa });
  _onToggleSwitchCadeirante = () => this.setState({ cadeirante: !this.state.cadeirante });

  render(){

      const {address : {rua, numero, bairro, cidade, cep}} = this.state

      return(
        <ScrollView style={{  backgroundColor: "#FFF"}}>
          <View style={styles.containerPrimario}>
            <View style={styles.containerTitulo}>
              <TouchableOpacity 
              style={styles.btnVoltar}
              onPress={this.voltarHome}
              >
                <Image style={styles.btnVoltarIcon} source={require('../img/voltar.png')}/>
              </TouchableOpacity>
              <LinearTextGradient style={styles.containerVoltarText}>
                <Text>Voltar</Text>
              </LinearTextGradient>
            </View>

            <View style={styles.containerEndereco}>
              <TouchableOpacity
              style={styles.btnEndereco}
              onPress={ this.openSearchModal }
              >
                <LinearGradient style={styles.btnCadastrarColors} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                  <Text style={styles.btnCadastrarText}>Endereço</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.inputCadastroFixo}>Rua: {rua} -{numero} </Text>
              <Text style={styles.inputCadastroFixo}>Bairro: {bairro} </Text>
              <Text style={styles.inputCadastroFixo}>Cidade: {cidade} </Text>
              <Text style={styles.inputCadastroFixo}>CEP: {cep} </Text>
            </View>

            <View style={styles.containerGeometria}>
              <TextInput
                style={styles.inputCadastro}
                placeholder="Altura: mínimo 2.45m"
                autoCorrect={false}
                keyboardType='numeric'
                maxLength={5}
                value={this.state.altura}
                onChangeText={(altura) => {this.setState({altura})}}
              />
              <TextInput
                style={styles.inputCadastro}
                placeholder="Largura: mínimo 3.50m"
                autoCorrect={false}
                keyboardType='numeric'
                maxLength={5}
                value={this.state.largura}
                onChangeText={(largura) => {this.setState({largura})}}
              />
              <TextInput
                style={styles.inputCadastro}
                placeholder="Comprimento: mínimo 5.50m"
                autoCorrect={false}
                keyboardType='numeric'
                maxLength={5}
                value={this.state.comprimento}
                onChangeText={(comprimento) => {this.setState({comprimento})}}
              />
            </View>
  
            <View style={styles.contanierTrugle}>
              <LinearTextGradient
                locations={[0, 1]}
                colors={["#a31aff", "#4c0080"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{marginTop: 10}}
                >
                <Text style={styles.txtCadastro}>Garagem coberta</Text>
              </LinearTextGradient>
    
              <LinearTextGradient
                locations={[0, 1]}
                colors={["#a31aff", "#4c0080"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{marginTop: 10}}
                >
              <Text style={styles.txtCadastro}>Garagem com rampa</Text>
              </LinearTextGradient>
    
              <LinearTextGradient
                locations={[0, 1]}
                colors={["#a31aff", "#4c0080"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{marginTop: 10}}
                  >
              <Text style={styles.txtCadastro}>Acessível para cadeirantes</Text>
              </LinearTextGradient>
            </View>
  
            <View style={styles.contanierSwitch}>
              <Switch
                style={{marginBottom: 7}}
                value={this.state.cobertura}
                onValueChange={this._onToggleSwitchCobertura}
              />    
              <Switch
                style={{marginBottom: 7}}
                value={this.state.rampa}
                onValueChange={this._onToggleSwitchRampa}
              />    
              <Switch
                value={this.state.cadeirante}
                onValueChange={this._onToggleSwitchCadeirante}
              />
            </View>
  
            <View style={styles.viewBtnCadastrar}>
              <TouchableOpacity
              style={styles.btnCadastrar}
              onPress={ this.insert }
              >
                <LinearGradient style={styles.btnCadastrarColors} colors={['#a31aff', '#7a00cc', '#4c0080']}>
                  <Text style={styles.btnCadastrarText}>Cadastrar Garagem</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>


          </View>
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  containerPrimario:{
    flex: 1    
  },
  containerTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFF'
  },
  btnVoltar: {
    marginLeft: 20
  },
  btnVoltarIcon: {
    width: 30,
    height: 30
  },
  containerVoltarText: {
    alignItems: 'flex-start',
    marginLeft: 7,
    fontSize: 23,
    color: '#000',
    backgroundColor: '#FFF'
  },
  containerEndereco:{
    marginTop: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  containerGeometria:{
    flex: 1,
    alignItems: 'center'
  },
  inputCadastro:{
    backgroundColor: '#FFF',
    width: '90%',
    fontSize: 17,
    borderRadius: 25,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#CCC',
  },
  contanierTrugle:{
    justifyContent: 'center',
    marginLeft: 20,
    width: '90%',
  },
  contanierSwitch:{
    marginTop: -95,
    marginRight: 25
  },
  button:{
    flex: 1,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  txtDivisao:{
    color: '#FFF',
    fontSize: 17,
    marginTop: 3
  },
  containerDiv:{
    marginLeft: 20,
    marginBottom: 10
  },
  btEnviar:{
    backgroundColor: '#5641a3',
    width: '90%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginTop: 15
  },
  viewBtnCadastrar:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%'
  },
  btnCadastrar: {
    height: 45,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    elevation: 5,
    marginTop: 15
  },
  btnCadastrarColors: {
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  btnCadastrarText: {
    color: '#FFF',
    fontSize: 20
  },
  txtCadastro:{
    fontSize: 20,
    fontFamily: "roboto-regular",
  },
  btnEndereco:{
    height: 45,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    elevation: 5,
    marginBottom: 10
  },
  inputCadastroFixo: {
    backgroundColor: '#f0f0f0',
    width: '90%',
    fontSize: 17,
    borderRadius: 25,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 20,
    color: '#aaa'
  }
});