import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input, Card, Text } from 'react-native-elements';
import logo from '../../../assets/images/logo.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import BotaoEntrar from '../../../components/BotaoEntrar';

const Login = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const criticas = () => {
        if (!email) {
            Alert.alert("Dados incompletos","Preencha o campo email!");
            return false;
        }
        if (!senha) {
            Alert.alert("Dados incompletos","Preencha o campo senha!");
            return false;
        }

        return true;
    }

    const entrar = async () => {
        if (!criticas()) return;
        navigation.navigate('BemVindo');
    }

    const recuperarSenha = () => {
        navigation.navigate('RecuperarSenha');
    }

    const validarAcesso = () => {
        navigation.navigate('PrimeiroAcesso');
    }

    return (
        <>
            <View>
                <Card>
                    <Card.Image source={logo} style={styles.logo} />
                    <Input
                        placeholder="Digite seu email aqui"
                        onChangeText={value => setEmail(value)}
                        errorMessage={!email ? 'E-mail é obrigatório!' : ''}
                        leftIcon={<Icon name="envelope" size={18} />} />

                    <Input
                        placeholder='Digite sua senha aqui'
                        onChangeText={value => setSenha(value)}
                        errorMessage={!senha ? 'Senha é obrigatório!' : ''}
                        secureTextEntry={true}
                        leftIcon={<Icon name="key" size={18} />} />

                    <BotaoEntrar titulo="Entrar" pressionado={entrar} />
                    <Card.Divider />
                    <Card.Title>
                        <Text style={styles.recuperarSenha} onPress={recuperarSenha}>Esqueceu a senha?</Text>
                        {' '}
                        <Text style={styles.validarAcesso} onPress={validarAcesso}>Primeiro acesso?</Text>
                    </Card.Title>
                </Card>
            </View>
        </>
    )
}

export default Login;