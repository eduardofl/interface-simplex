import { resolveModeloSimplex } from './metodo_simplex';
import { parseText } from './parser.js';
import { geraArquivoTexto } from './exportacao_tableaus';
export const RECEBE_MODELO = 'recebe_modelo';
export const RESOLVE_MODELO = 'resolve_modelo';
export const PROXIMO_TABLEAU = 'proximo_tableau';
export const TABLEAU_ANTERIOR = 'tableau_anterior';
export const EXPORTA_TABLEAUS = 'exporta_tableaus';

export function recebeModelo(modelo) {
  return {
    type: RECEBE_MODELO,
    payload: modelo
  };
}

export function resolveModelo(modelo) {
  //const obj_modelo = parseText(modelo);
  //const modelos_resolucao = resolveModeloSimplex(obj_modelo);
  var array_modelos = parseText(modelo);
  //var modelos_resolucao = _.mapKeys(array_modelos, 'iteracoes'); //usar funçao lodash mapKeys para mapear como objeto
  //const modelo_atual = array_modelos[array_modelos.length - 1];
  var modelos_resolucao = { ...resolveModeloSimplex(array_modelos)};

  return {
    type: RESOLVE_MODELO,
    payload: modelos_resolucao
  };
}

export function proximoTableau(tableauAtual, numTableaus) {
  var proximo;

  if((tableauAtual + 1) >= numTableaus) {
    proximo = tableauAtual;
  } else {
    proximo = tableauAtual + 1;
  }

  return {
    type: PROXIMO_TABLEAU,
    payload: proximo
  };
}

export function tableauAnterior(tableauAtual) {
  var anterior;

  if((tableauAtual - 1) < 0) {
    anterior = 0;
  } else {
    anterior = tableauAtual - 1;
  }

  return {
    type: TABLEAU_ANTERIOR,
    payload: anterior
  };
}

export function exportaTableaus(modelos) {
  const conteudo_texto = geraArquivoTexto(modelos);

  return {
    type: EXPORTA_TABLEAUS,
    payload: conteudo_texto
  };
}
