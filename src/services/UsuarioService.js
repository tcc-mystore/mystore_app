import { api, authorizationServerRecuperarSenha, refreshToken } from '../core/api';
import UsuarioRepository from '../repository/UsuarioRepository';

const versao = '1';

export const apagarPorId = async (id) => {
    try {
        return UsuarioRepository.deleteById(id);
    } catch (error) {
        console.log(`Erro no método apagarPorId do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const atualizarPorId = async (id) => {
    try {
        return UsuarioRepository.updateAllById(id);
    } catch (error) {
        console.log(`Erro no método cadastrar do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const atualizarRefreshToken = async ({ id, token }) => {
    try {
        const usuario = await refreshToken(token);
        return UsuarioRepository.updateTokenAndRefreshTokenById({ id: usuario.usuarios_id, accessToken: usuario.refresh_token, refreshToken: usuario.refresh_token });
    } catch (error) {
        console.log(`Erro no método atualizarRefreshToken do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const buscarEAtualizarRefreshToken = async () => {
    try {
        const usuario = await buscarRefreshToken();
        if (usuario.rows.item(0)) {
            console.log(`Atualizando token -> ${new Date()}...`);
            await atualizarRefreshToken({ id: usuario.rows.item(0).id, token: usuario.rows.item(0).refreshToken });
        }
    } catch (error) {
        console.log(`Erro no método buscarEAtualizarRefreshToken do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const buscarPorConterNome = async (nome) => {
    try {
        return UsuarioRepository.selectLikeByNome(nome);
    } catch (error) {
        console.log(`Erro no método buscarPorConterNome do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const buscarRefreshToken = async () => {
    try {
        return UsuarioRepository.selectByRefreshToken();
    } catch (error) {
        console.log(`Erro no método buscarRefreshToken do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const buscarTodos = async () => {
    try {
        return UsuarioRepository.selectAll();
    } catch (error) {
        console.log(`Erro no método buscarTodos do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const cadastrar = async (usuario) => {
    try {
        return UsuarioRepository.insert(usuario);
    } catch (error) {
        console.log(`Erro no método cadastrar do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const calculaTempoDeAtualizacaoToken = async () => {
    const usuarioAutenticadoAnteriormente = await UsuarioRepository.selectByTokenExpireData();
    console.log(usuarioAutenticadoAnteriormente);
    const expires = usuarioAutenticadoAnteriormente.rows.item(0).expiresIn;
    const token = usuarioAutenticadoAnteriormente.rows.item(0).accessToken;
    const expiresMilisegundos = Math.round(((//Usando esta função para arredondar os valores em caso utilise uma divisão
        expires //Tempo de expiração em segundos
        - 60 //Subtraindo para compensar a diferença do servidor até o registro do token no local storage
    ) * 1 //Transformar o calculo valor positivo
    ) * 1000 //Milisegundos para realizar os calculos da datas
    );

    const data = usuarioAutenticadoAnteriormente.rows.item(0).data;
    const dataTokenMilisegundos = new Date(JSON.parse(data)).getTime();
    const dataExpiresMilisegundos = expiresMilisegundos + dataTokenMilisegundos;
    const dataAtualMilisegundos = new Date().getTime();
    const dataRestanteMilisegundos = dataExpiresMilisegundos - dataAtualMilisegundos;
    console.log(`Vai expirar em ${expires} segundos!`)
    console.log(`${expires} x 1000 = ${expiresMilisegundos}`)
    console.log(`${new Date(JSON.parse(data))} em milisegundos = ${dataExpiresMilisegundos}`);
    console.log(`${dataAtualMilisegundos}`);
    console.log(dataRestanteMilisegundos);
    //await limparDataAcesso();
    return { dataRestanteMilisegundos, token };
}

export const getTokenLogin = async () => {
    try {
        const dataRestanteMilisegundos = await calculaTempoDeAtualizacaoToken();
        if (dataRestanteMilisegundos > 0) {
            return dataRestanteMilisegundos.token;
        } else {
            return null;
        }
    } catch (error) {
        console.log(`Erro no método getTokenLogin do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const recuperarSenha = async (uri) => {
    const token = await authorizationServerRecuperarSenha();
    try {
        return await api(token.access_token)
            .get(`/v${versao}${uri}`)
            .then((respose) => {
                if (respose)
                    return { codigo: 204, };
            }).catch((error) => {
                console.log(`Erro na requisição da API andpoint codigo-acesso! Erro: ${error}`);
                if (error.response) {
                    return {
                        codigo: error.response.status,
                        erro: error.response.error ? error.response.error : error.title,
                        mensagem: error.response.error_description ? error.response.error_description : error.detail,
                    }
                } else {
                    throw error;
                }
            });
    } catch (error) {
        console.log(`Erro no método recuperarSenha do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const limparDataAcesso = async () => {
    try {
        await UsuarioRepository.updateAllData();
    } catch (error) {
        console.log(`Erro no método getTokenLogin do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const rootEntryPoint = async () => {
    const token = await getTokenLogin();
    try {
        return await api(token)
            .get(`/v${versao}`)
            .then((respose) => {
                if (respose.data !== null) {
                    return respose.data;
                }
            }).catch((error) => {
                console.log(`Erro na requisição da API andpoint rootEntryPoint!`);
                if (error.response) {
                    return {
                        codigo: error.response.status,
                        erro: error.response.data.error,
                        mensagem: error.response.data.error_description,
                    }
                } else {
                    throw error;
                }
            });
    } catch (error) {
        console.log(`Erro no método rootEntryPoint do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const validarAcesso = async (uri, dados) => {
    const token = await authorizationServerRecuperarSenha();
    try {
        return await api(token.access_token)
            .put(`/v${versao}${uri}`, dados)
            .then((respose) => {
                if (respose)
                    return { codigo: 204, };
            }).catch((error) => {
                console.log(`Erro na requisição da API andpoint cadastrar-senha! Erro: ${error}`);
                if (error.response) {
                    return {
                        codigo: error.response.status,
                        erro: error.response.error ? error.response.error : error.title,
                        mensagem: error.response.error_description ? error.response.error_description : error.detail,
                    }
                } else {
                    throw error;
                }
            });
    } catch (error) {
        console.log(`Erro no método cadastrar-senha do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}

export const salvarTokenLogin = async (usuarios_id, token, expires_in, token_type, scope, nome_completo, jti, refresh_token, empresa) => {
    try {
        const data = new Date();
        const expiresIn = expires_in;
        UsuarioRepository.insertOrReplace({ id: usuarios_id, accessToken: token, expiresIn, data, tokenType: token_type, scope, nome: nome_completo, jti, refreshToken: refresh_token, empresa });
    } catch (error) {
        console.log(`Erro no método salvarTokenLogin do arquivo UsuarioService -> ${new Date()} -> erro: ${error}`);
    }
}