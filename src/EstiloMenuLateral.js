import React from 'react';
import {
    StyleSheet, 
    Image, 
    View
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import BancoDados from './dao/BancoDados';
import Services from './services/Services';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';


function EstiloMenuLateral(props){

    function renderFoto(){
        const { foto } = BancoDados.contaUsuario;
        if (typeof foto.remoto === 'string' && foto.remoto !== null){
            return {uri: foto.remoto};
        }
        else {
            return require('./img/camera.png');
        }
    }

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <View style={styles.areaSuperior}>
                    <DrawerItem
                    icon={()=> (
                        <Image
                        style={styles.perfilImagem}
                        source={ renderFoto() }
                        />
                    )}
                    label=""
                    onPress={() => props.navigation.navigate('Perfil')}
                    style={styles.perfil}
                    />
                    <DrawerItem
                    icon={()=> (
                        // <Image
                        // style={{width: 40, height: 40, tintColor: '#580084'}} 
                        // source={require('./img/home.png')}
                        // />
                        <IconAntDesign name='home' color={'#580084'} size={40} />
                    )}
                    label="Home"
                    labelStyle={{fontSize: 18}}
                    style={styles.options}
                    onPress={() => props.navigation.navigate('Home')}
                    />
                    <DrawerItem
                    icon={()=> (
                        // <Image
                        // style={{width: 40, height: 40, tintColor: '#580084'}}
                        // source={require('./img/park.png')}
                        // />
                        <IconMaterialCommunityIcons 
                        name='garage-alert-variant' color={'#580084'} size={40} />
                    )}
                    label="Adicionar Garagem"
                    labelStyle={{fontSize: 18}}
                    style={styles.options}
                    onPress={() => props.navigation.navigate('Garagem')}
                    />
                </View>
            </DrawerContentScrollView>
            <View style={styles.areaInferior}>
                <DrawerItem
                icon={()=> (
                    <IconMaterialIcons name='exit-to-app' color={'#580084'} size={40} />
                )}
                label="Sair"
                labelStyle={{fontSize: 18, }}
                style={{alignContent:'flex-end'}}
                onPress={() => Services.logout(props) }
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    areaSuperior: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    perfil: {
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 3,
        borderColor: '#EEE',
        backgroundColor: '#FFF'
    },
    perfilImagem: {
        width: 100,
        height: 100,
        marginLeft: '30%',
        borderRadius: 50,
    },
    options: {
        marginLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    areaInferior: {
        marginLeft: 15,
        borderTopWidth: 3,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF'
    }
});

export default EstiloMenuLateral;