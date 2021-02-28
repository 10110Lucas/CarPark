import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'

import EstiloMenuLateral from './EstiloMenuLateral';

// import Chat from './pages/Chat';
import Home from './pages/Home';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Garagem from './pages/Garagem';
import Cadastro from './pages/Cadastro';
import GaragemOpt from './pages/GaragemOpt';
import SetGaragem from './pages/SetGaragem';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MenuLateral(){
  return (
    <Drawer.Navigator 
    drawerContent={props => <EstiloMenuLateral {...props}/>}
    initialRouteName='Home'>
      <Drawer.Screen
      name='Home'
      component={Home}
      options={{
        unmountOnBlur: true
      }}
      />
      <Drawer.Screen
      name='Perfil'
      component={Perfil}
      options={{
        unmountOnBlur: true
      }}
      />
      <Drawer.Screen
      name='Alterar Garagem'
      component={SetGaragem}
      options={{
        unmountOnBlur: true
      }}
      />
      <Drawer.Screen
      name='GaragemOpt'
      component={GaragemOpt}
      options={{
        unmountOnBlur: true
      }}
      />
      <Drawer.Screen
      name='Garagem'
      component={Garagem}
      options={{
        title: 'Garagem',
        unmountOnBlur: true
      }}
      />
    </Drawer.Navigator>
  );
}

function NavegacaoTelas(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Login}>
        <Stack.Screen 
          name='Login'
          component={Login}
          options={{
            headerShown: false,
            unmountOnBlur: true
          }}
        />
        <Stack.Screen 
          name='Cadastro'
          component={Cadastro}
          options={{
            title: 'Cadastrar',
            headerShown: false,
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
        <Stack.Screen 
          name='Home'
          component={MenuLateral}
          options={{
            headerShown: false,
            unmountOnBlur: true
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Routes = () => {
  return (
    <NavegacaoTelas />
  );
}

export default Routes;