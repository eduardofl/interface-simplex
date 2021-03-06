import _ from 'lodash';
import { variavelEntrando, variavelSaindo, resolveModeloSimplex } from './metodo_simplex';
import { variavelEntrando as variavelEntrandoDual, variavelSaindo as variavelSaindoDual} from './dual_simplex';
import { parseText } from './parser.js';
import { geraArquivoTexto } from './exportacao_tableaus';
export const RECEBE_MODELO = 'recebe_modelo';
export const RESOLVE_MODELO = 'resolve_modelo';
export const PROXIMO_TABLEAU = 'proximo_tableau';
export const TABLEAU_ANTERIOR = 'tableau_anterior';
export const EXPORTA_TABLEAUS = 'exporta_tableaus';
export const TROCA_FORMATO = 'troca_formato';
export const GERA_MATRIZ = 'gera_matriz';
export const ATUALIZA_PIVO = 'atualiza_pivo';
export const IMPORTA_ARQUIVO = 'importa_arquivo';
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
  var modelos_resolucao = resolveModeloSimplex(array_modelos);

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

export function importaArquivo(texto_arquivo) {
  return {
    type: IMPORTA_ARQUIVO,
    payload: texto_arquivo
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

// gera uma matriz contendo apenas strings para representar uma tabela da solução.
// essa matriz é repassada aos componentes React que irão realizar a exibição
// dos dados para o usuário
export function geraMatrizString(modelos, tipo, tableau_atual) {
  var matriz_string = null, matriz;
  var math = require('mathjs');

  var modelo = {};
  //if(modelos[tableau_atual]) modelos = modelos[tableau_atual];
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

// verifica qual é o pivô da tabela sendo exibida no momento
// de modo que se possa indicar visualmente para o usuário qual
// variável entra e qual sai
export function atualizaPivo(modelos, num_tableaus, tableau_atual) {
  var coluna, linha;
  const tableaus_dual = modelos.tableaus_dual;

  // caso o tableau atual seja o último retorna um pivô com os atributos
  // nulos, pois não haverá troca de variáveis na base
  if(tableau_atual === (num_tableaus - 1)) {
    coluna = null;
    linha = null;
  } else {
    if(tableaus_dual !== null && tableau_atual < tableaus_dual - 1) {
      linha = variavelSaindoDual(modelos.modelos[tableau_atual]);
      coluna = variavelEntrandoDual(modelos.modelos[tableau_atual], linha);
    } else {
      coluna = variavelEntrando(modelos.modelos[tableau_atual]);
      linha = variavelSaindo(modelos.modelos[tableau_atual], coluna);
    }
  }

  const pivo = {
    coluna: coluna,
    linha: linha
  };

  return {
    type: ATUALIZA_PIVO,
    payload: pivo
  };
}
