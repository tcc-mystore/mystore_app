import { api } from '../core/api';
import CidadeRepository from '../repository/CidadeRepository';

export const getCidades = async (token) => {
    try {
        const ultimaVersao = await CidadeRepository.selectUltimaVersao();
        let ultVersao = -1;
        if (ultimaVersao.rows && ultimaVersao.rows.item(0).versao != null)
            ultVersao = ultimaVersao.rows.item(0).versao;

        return await api(token)
            .get(`/v1/cidades/versao/${ultVersao}`)
            .then((respose) => {
                if (respose.data !== null) {
                    return respose.data;
                }
            }).catch((error) => {
                console.log(`Erro na requisição da API andpoint getCidades! Erro: ${error.message}`);
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
        console.log(`Erro no método getCidades do arquivo CidadesService -> ${new Date()} -> erro: ${error}`);
    }
}

export const buscarPorConterNome = async (nome, estadoId) => {
    try {
        return CidadeRepository.selectLikeByNomeAndEstadoId(nome, estadoId);
    } catch (error) {
        console.log(`Erro no método buscarPorConterNome do arquivo CidadesService -> ${new Date()} -> erro: ${error}`);
    }
}

export const cadastrar = async (cidade) => {
    try {
        return CidadeRepository.insert(cidade);
    } catch (error) {
        console.log(`Erro no método cadastrar do arquivo CidadesService -> ${new Date()} -> erro: ${error}`);
    }
}

export const cadastrarOuAtualizar = async (cidade) => {
    try {
        return CidadeRepository.insertOrReplace(cidade);
    } catch (error) {
        console.log(`Erro no método cadastrar do arquivo CidadesService -> ${new Date()} -> erro: ${error}`);
    }
}

export const sincronizar = async (token) => {
    try {
        let cidade = await getCidades(token);
        if (cidade._embedded)
            cidade._embedded.cidades.forEach(async (element) => {
                await cadastrarOuAtualizar({
                    id: element.id, nome: element.nome, versao: element.versao, estados_id: element.estado.id, ativo: element.ativo
                })
            });
    } catch (error) {
        console.log(`Erro no método cadastrar do arquivo sincronizar  -> ${new Date()} -> erro: ${error}`);
    }
}