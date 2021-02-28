import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    PermissionsAndroid,
} from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import LinearGradient from 'react-native-linear-gradient';
import BancoDados from '../dao/BancoDados';
import Usuario from '../autenticacao/Usuario';
import ImagePicker from 'react-native-image-picker';

export default class Cadastro extends Component {

    constructor(props){
        super(props)
        this.state = {
            foto: {local: false, remoto: false},
            nome: '',
            sobrenome: '',
            cpf: '',
            celular: '',
            email: '',
            password: '',
            passwordConf: '',
            passwordConfAux: true,
            showPassword: true,
            showPasswordImage: require('../img/showPasswordTrue.png'),
            showPassword2: true,
            showPasswordImage2: require('../img/showPasswordTrue.png'),
            registroID: false
        }

        this.imagePickerOptions = {
            title: 'Selecione uma Opção:',
            storageOptions: {
                privateDirectory: true,
                path: '../CarPark/Media/Perfil',
            },
            mediaType: 'photo',
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Tirar uma Foto',
            chooseFromLibraryButtonTitle: 'Procurar Foto da Galeria',
        };
    }
    
    createAcount = async () => {
        let valido = false;
        if (this.inputsValidos()){
            try {
                await BancoDados.criarConta(this.state);
                valido = await Usuario.login(this.state.email, this.state.password);
                if (valido) this.props.navigation.navigate('Home');
                else this.limpeza();
            }catch (err){
                console.log(`Falha de criação de conta: ${JSON.stringify(err)}`);
                this.limpeza();
                this.props.navigation.navigate('Login');
            }
        } else alert('Verifique se está tudo preenchido, para continuar-mos');
    }

    limpeza = () => {
        this.setState({
            foto: {local: false, remoto: false},
            nome: '',
            sobrenome: '',
            cpf: '',
            celular: '',
            email: '',
            password: '',
            passwordConf: '',
            passwordConfAux: true,
            showPassword: true,
            showPasswordImage: require('../img/showPasswordTrue.png'),
            showPassword2: true,
            showPasswordImage2: require('../img/showPasswordTrue.png'),
            registroID: false
        });
    }

    passwordShow = () => {
        let img = !this.state.showPassword ? require('../img/showPasswordTrue.png') : require('../img/showPasswordFalse.png');
        this.setState({
            showPassword: !this.state.showPassword,
            showPasswordImage: img
        });
    }
    passwordConfShow = () => {
        let img = !this.state.showPassword2 ? require('../img/showPasswordTrue.png') : require('../img/showPasswordFalse.png');
        this.setState({
            showPassword2: !this.state.showPassword2,
            showPasswordImage2: img
        });
    }

    inputsValidos = () => {
        let valido = true;
        if (!this.state.foto.local){
            this.setState({foto: {local: false, remoto: false}});
            valido = false;
        }
        if (!this.state.nome){
            this.setState({nome: false});
            valido = false;
        }
        if (!this.state.sobrenome){
            this.setState({sobrenome: false});
            valido = false;
        }
        if (!this.validarCPF(this.state.cpf)){
            this.setState({cpf: false});
            valido = false;
        }
        if (!this.state.celular){
            this.setState({celular: false});
            valido = false;
        }
        if (!this.state.email){
            this.setState({email: false});
            valido = false;
        }
        if (!this.state.password){
            this.setState({password: false});
            valido = false;
        }
        if (!this.state.passwordConf){
            this.setState({passwordConf: false});
            valido = false;
        }
        if (!this.validarSenhas()){
            valido = false;
        }
        return valido;
    }

    converter = (valor) => {
        if(valor !== '')
            valor = this.formatar(valor);
        parseInt(valor);
        if (valor.length < 12)
            return this.maskerCPF(valor);
        else
            return this.maskerCNPJ(valor);
    }
    formatar = (valor) => {
        return valor.replace(/(\W|\D+)/g, '');
    }
    maskerCPF = (valor) => {
        if(valor.length < 4)
            return valor.replace(/(\d{1,3})/g, '\$1');
        else if(valor.length > 3 && valor.length <= 6)
            return valor.replace(/(\d{3})(\d{1,3})/g, '\$1.\$2');
        else if(valor.length > 6 && valor.length <= 9)
            return valor.replace(/(\d{3})(\d{3})(\d{1,3})/g, '\$1.\$2.\$3');
        else if(valor.length > 9 && valor.length <= 11)
            return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/g, '\$1.\$2.\$3\-\$4');
    }
    maskerCNPJ = (valor) => {
        if(valor.length === 12)
            return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/g, '\$1.\$2.\$3\/\$4');
        else
            return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/g, '\$1.\$2.\$3\/\$4\-\$5');
    }
    maskerCel = (valor) => {
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

    validarSenhas = () => {
        if(this.state.password === this.state.passwordConf){
            this.setState({passwordConfAux: true})
            return true;
        }
        else {
            if(this.state.password !== false)
                this.setState({passwordConfAux: false})
            return false;
        }
    }

    validarCPF(param) {
        let cpf = ''+param;
        cpf = this.formatar(cpf);
        // cpf = cpf.replace(/[^\d]+/g,'');
        if(cpf == '') return false;	
        // Elimina CPFs invalidos conhecidos
        if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || 
            cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || 
            cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
                return false;		
        // Valida 1o digito	
        let add = 0;
        let rev = 0;
        for (let i=0; i < 9; i ++)		
            add += parseInt(cpf.charAt(i)) * (10 - i);	
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)		
            rev = 0;	
        if (rev != parseInt(cpf.charAt(9)))		
            return false;		
        // Valida 2o digito	
        add = 0;	
        for (let i = 0; i < 10; i ++)
            add += parseInt(cpf.charAt(i)) * (11 - i);	
        rev = 11 - (add % 11);	
        if (rev == 10 || rev == 11)	
            rev = 0;	
        if (rev != parseInt(cpf.charAt(10)))
            return false;		
        return true;   
    }

    voltarLogin = () => {
        this.limpeza();
        this.props.navigation.navigate('Login');
    }

    tirarFoto = async () => {
        let camera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {   title: "Permissão de Câmera",
            message: "O App precisa de acesso à câmera.",
            buttonNeutral: "Pergunte-me depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"    
        });
        let leitura = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        let escrita = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if (camera === PermissionsAndroid.RESULTS.GRANTED && 
            leitura === PermissionsAndroid.RESULTS.GRANTED &&
            escrita === PermissionsAndroid.RESULTS.GRANTED){

            ImagePicker.showImagePicker(this.imagePickerOptions, (data) => {
                
                // console.log(`De onde a foto vem: ${data}`);
                if (data.didCancel) return;
                if (data.error) {
                    console.log(`Erro de foto: ${JSON.stringify(data)}`);
                    // console.log(`Erro de foto: ${data.error}`);
                    return;
                }
                if (data.customButton) return;
                if (!data.uri) return;
                this.setState({foto: {...this.state.foto, local: data.uri}});
            });
        } else {
            alert('Permissão de Câmera negada');
        }
    }

    renderFoto = () => {
        const { foto } = this.state;
        if (foto.local && typeof foto.local === 'string' && foto.local !== null && foto.local !== undefined){
            return {uri: foto.local};
        } else if (foto.remoto && typeof foto.remoto === 'string' && foto.remoto !== null && foto.remoto !== undefined){
            return {uri: foto.remoto};
        } else {
            return require('../img/camera.png');
        }
    }

    render(){
        return (
            <View style={styles.container}>
                
                <View style={styles.containerHeader}>
                    <TouchableOpacity 
                        style={styles.btnHeader}
                        onPress={this.voltarLogin}
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
                        <Text style={styles.textGradient}>CRIAR CONTA</Text>
                    </LinearTextGradient>
                    <View style={{flex: 1}}></View>
                </View>

                <TouchableOpacity
                style={styles.btnInserirFoto}
                onPress={ this.tirarFoto }
                >
                    <View style={styles.btnContainerFoto}>
                        <Image style={styles.foto} source={ this.renderFoto() } />
                    </View>
                </TouchableOpacity>
                
                {this.state.nome !== false ? null : <Text style={styles.textValidation}>Nome precisa ser preenchido</Text>}
                <TextInput
                style={styles.input}
                placeholder='Nome'
                value={String(this.state.nome === false ? '' : this.state.nome)}
                onChangeText={(nome)=>{this.setState({nome})}}
                />

                {this.state.sobrenome !== false ? null : <Text style={styles.textValidation}>Sobrenome precisa ser preenchido</Text>}
                <TextInput
                style={styles.input}
                placeholder='Sobrenome'
                value={String(this.state.sobrenome === false ? '' : this.state.sobrenome)}
                onChangeText={(sobrenome)=>{this.setState({sobrenome})}}
                />

                {this.state.cpf !== false ? null : <Text style={styles.textValidation}>CPF precisa ser preenchido</Text>}
                <TextInput
                style={styles.input}
                placeholder='Digite seu CPF'
                keyboardType='numeric'
                maxLength={14}
                value={this.state.cpf !== false ? this.converter(this.state.cpf) : ''}
                onChangeText={(cpf)=>{this.setState({cpf})}}
                />
                
                {this.state.celular !== false ? null : <Text style={styles.textValidation}>Número de celular precisa ser preenchido</Text>}
                <TextInput
                style={styles.input}
                keyboardType='numeric'
                placeholder='Celular: (00) 9000-0000'
                maxLength={15}
                value={this.state.celular !== false ? this.maskerCel(this.state.celular) : ''}
                onChangeText={(celular)=>{this.setState({celular})}}
                />

                {this.state.email !== false ? null : <Text style={styles.textValidation}>Email precisa ser preenchido</Text>}
                <TextInput
                style={styles.input}
                placeholder='E-mail'
                autoCapitalize='none'
                autoCompleteType='email'
                autoCorrect={false}
                autoFocus={false}
                maxLength={40}
                value={String(this.state.email === false ? '' : this.state.email)}
                onChangeText={(email)=> this.setState({email})}
                />

                {/* -------------------------------------------------------------------------------------------------------------------- */}
                {this.state.password !== false ? null : <Text style={styles.textValidation}>Senha precisa ser preenchido</Text>}
                <View style={styles.containerPassword}>
                    <TextInput
                    style={styles.inputPassword}
                    placeholder='Senha: mínimo(6) e máximo(15) caracteres'
                    secureTextEntry={this.state.showPassword}
                    maxLength={15}
                    value={String(this.state.password === false ? '' : this.state.password)}
                    onChangeText={(password)=>{this.setState({password})}}
                    />
                    <TouchableOpacity
                    style={styles.btnShowPassword}
                    onPress={this.passwordShow}
                    >
                        <Image style={styles.btnPasswordImage} source={this.state.showPasswordImage} />
                    </TouchableOpacity>
                </View>
                
                {this.state.passwordConf !== false ? null : <Text style={styles.textValidation}>Confirme sua nova senha</Text>}
                {this.state.passwordConfAux !== false ? null : <Text style={styles.textValidation}>Senhas diferentes</Text>}
                <View style={styles.containerPassword}>
                    <TextInput
                    style={styles.inputPassword}
                    placeholder='Confirmar Senha'
                    secureTextEntry={this.state.showPassword2}
                    maxLength={15}
                    value={String(this.state.passwordConf === false ? '' : this.state.passwordConf)}
                    onChangeText={(passwordConf)=>{this.setState({passwordConf})}}
                    />
                    <TouchableOpacity
                    style={styles.btnShowPassword}
                    onPress={this.passwordConfShow}
                    >
                        <Image style={styles.btnPasswordImage} source={this.state.showPasswordImage2} />
                    </TouchableOpacity>
                </View>
                {/* -------------------------------------------------------------------------------------------------------------------- */}
                <TouchableOpacity
                style={styles.btnCadastrar}
                onPress={ this.createAcount }
                >
                    <LinearGradient
                        style={styles.btnCadastrarGradiente}
                        colors={['#a31aff', '#7a00cc', '#4c0080']}
                    >
                        <Text style={styles.btnCadastrarText}>Cadastrar</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',        
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
    btnInserirFoto: {
        width: '48%',
        height: 180,
        borderRadius: 110,
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
        borderRadius: 110,
    },
    foto: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 110,
    },
    input: {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#CCC',
        borderRadius: 25,
        width: '90%',
        marginBottom: 10,
        padding: 10,
        paddingHorizontal: 20,
        fontSize: 17,
        backgroundColor: '#FFF'
    },
    containerPassword: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#CCC',
        borderRadius: 25,
        width: '90%',
        marginBottom: 10,
        paddingHorizontal: 13,
        backgroundColor: '#FFF'
    },
    inputPassword: {
        width: '90%',
        fontSize: 17,
    },
    btnShowPassword: {
        padding: 1,
        marginLeft: -5,
        backgroundColor: 'transparent'
    },
    btnPasswordImage: {
        height: 35,
        width: 35,
    },
    textValidation: {
        alignSelf: 'flex-start',
        marginLeft: '10%',
        color: '#F55',
        fontWeight: 'bold',
        fontSize: 17
    },
    btnCadastrar: {
        height: 45,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        elevation: 5,
        marginTop: 15
    },
    btnCadastrarGradiente: {
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
});
