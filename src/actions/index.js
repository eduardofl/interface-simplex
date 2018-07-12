import _ from 'lodash';
import { resolveModeloSimplex } from './metodo_simplex';
import { parseText } from './parser.js';
import { geraArquivoTexto } from './exportacao_tableaus';
export const RECEBE_MODELO = 'recebe_modelo';
export const RESOLVE_MODELO = 'resolve_modelo';
export const PROXIMO_TABLEAU = 'proximo_tableau';
export const TABLEAU_ANTERIOR = 'tableau_anterior';
export const EXPORTA_TABLEAUS = 'exporta_tableaus';
export const TROCA_FORMATO = 'troca_formato';
export const GERA_MATRIZ = 'gera_matriz';
export const FRACAO = 'fracao';
export const DECIMAL = 'decimal';

export function recebeModelo(modelo) {
  return {
    type: RECEBE_MODELO,
    payload: modelo
  };
}

export function resolveModelo(modelo) {
  var array_modelos = parseText(modelo);
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

export function exportaTableaus(modelos, tipo) {
  const conteudo_texto = geraArquivoTexto(modelos, tipo);

  return {
    type: EXPORTA_TABLEAUS,
    payload: conteudo_texto
  };
}

export function trocaFormato(novo_formato) {
  return {
    type: TROCA_FORMATO,
    payload: novo_formato
  };
}

export function geraMatrizString(modelos, tipo, tableau_atual) {
  var matriz_string = null, matriz;
  var math = require('mathjs');

  var modelo = {};
  Object.keys(modelos).forEach( (iteracoes) => {
    if(modelos[iteracoes].iteracoes === tableau_atual) {
      modelo = modelos[iteracoes];
    }
  });

  if(!(_.isEmpty(modelo))){
    if(tipo === FRACAO) {
      matriz = [
        ["Variaveis basicas", ...modelo.var_decisao, ...modelo.var_folga, "Valores de -f e Xb"],
        ["-f", ...modelo.coef_func_obj, modelo.valor_func_obj]
      ];
      modelo.var_basicas.forEach( (variavel_basica, linha) => {
        matriz = [...matriz, [variavel_basica, ...modelo.coeficientes[linha], modelo.coef_xb[linha]] ];
      });
      matriz_string = matriz;
    } else if(tipo === DECIMAL){
      //linha 1
      matriz = [
        ["Variaveis basicas", ...modelo.var_decisao, ...modelo.var_folga, "Valores de -f e Xb"]
      ];

      //linha 2
      var linha2 = ["-f"];
      modelo.coef_func_obj.forEach( (coef) => {
        var num_decimal = math.number(math.fraction(coef));
        num_decimal = math.round(num_decimal * 10000) / 10000;

        var aux = `${num_decimal}`;
        linha2 = [...linha2, aux];
      });
      var f_decimal = math.number(math.fraction(modelo.valor_func_obj));
      f_decimal = math.round(f_decimal * 10000) / 10000;
      linha2 = [...linha2, `${f_decimal}`];

      matriz = [...matriz, linha2];

      //linhas restantes
      modelo.var_basicas.forEach( (variavel_basica, linha) => {
        var nova_linha = [variavel_basica];

        modelo.coeficientes[linha].forEach( (coef) => {
          var num_decimal = math.number(math.fraction(coef));
          num_decimal = math.round(num_decimal * 10000) / 10000;

          nova_linha = [...nova_linha, `${num_decimal}`];
        });
        var xb_decimal = math.number(math.fraction(modelo.coef_xb[linha]));
        xb_decimal = math.round(xb_decimal * 10000) / 10000;

        nova_linha = [...nova_linha, `${xb_decimal}`];


        matriz = [...matriz, nova_linha ];
      });

      matriz_string = matriz;
    }
  }

  return {
    type: GERA_MATRIZ,
    payload: matriz_string
  };
}
