import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BemVindo from '../../views/mystore/BemVindo';
import ListarFornecedor from '../../views/fornecedor/ListarFornecedor';

const Stack = createStackNavigator();

const screenOptionStyle = {
    headerBackTitle: "Voltar",
}

const BemVindoStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <Stack.Screen name="BemVindo" component={BemVindo} options={{ headerShown: false, }} />
            {/* 
            Rotas com autênticação
                     <Stack.Screen name="CadastrarFornecedor" component={CadastrarFornecedor} />
                     <Stack.Screen name="ListarProduto" component={ListarProduto} />
                     <Stack.Screen name="CadastrarProduto" component={CadastrarProduto} />
                     <Stack.Screen name="ListarCliente" component={ListarCliente} />
                     <Stack.Screen name="CadastrarCliente" component={CadastrarCliente} />
                     <Stack.Screen name="ListarVenda" component={ListarVenda} />
                     <Stack.Screen name="CadastrarVenda" component={CadastrarVenda} />
                     <Stack.Screen name="ListarContaPagar" component={ListarContaPagar} />
                     <Stack.Screen name="CadastrarContaPagar" component={CadastrarContaPagar} />
                     <Stack.Screen name="ListarContaReceber" component={ListarContaReceber} />
                     <Stack.Screen name="CadastrarContaReceber" component={CadastrarContaReceber} />
                     <Stack.Screen name="Dashboard" component={Dashboard} />
                     <Stack.Screen name="Relatorio" component={Relatorio} />
                      */}
        </Stack.Navigator>
    );
};

const ListarFornecedorStackNavigator = () => {
    return (
        <Stack.Navigator  screenOptions={screenOptionStyle}>
            <Stack.Screen name="ListarFornecedor" component={ListarFornecedor} />
        </Stack.Navigator>
    );
};

export { BemVindoStackNavigator, ListarFornecedorStackNavigator };