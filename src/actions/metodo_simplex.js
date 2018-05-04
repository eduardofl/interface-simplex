//import _ from 'lodash';

//  verifica os coeficientes na linha da função objetivo,
//  se ainda há variáveis que caso adicionadas na base,
//  melhorem a solução viável atual, a solução não é ótima
//
//  o teste consiste em verificar se os coeficientes das variáveis
//  não-básicas, caso todos sejam <= 0, a solução é ótima
function verificaOtimalidade(modelo) {
  var count = 0;

  modelo.coef_func_obj.forEach( coef => {
    if(coef > 0) count++;
  });

  if(count > 0) {
    return false;
  } else {
    return true;
  }
}

function variavelEntrando(modelo) {
  const coeficientes_funcao = modelo.coef_func_obj;
  var maior_coef = coeficientes_funcao[0];
  var indice_maior = 0;

  coeficientes_funcao.forEach( (coef, posicao) => {
    if(coef > 0 && coef > maior_coef) {
      maior_coef = coef;
      indice_maior = posicao;
    }
  });

  //-----ainda retorna o primeiro elemento quando a solução é otima-----//
  return indice_maior;
}

function variavelSaindo(modelo, coluna) {
  const coeficientes_xb = [ ...modelo.coef_xb ];
  const coefs = modelo.coeficientes;

  var aux = coeficientes_xb.map( (xb, posicao) => {
    var xi = coefs[posicao][coluna];
    if(xi === 0) return 0;
    else {
      return (xb/xi);
    }
  });

  var menor_valor = Math.max(...aux);
  var indice_menor = -1;

  aux.forEach( (elemento, posicao) => {
    if(elemento > 0 && elemento <= menor_valor) {
      menor_valor = elemento;
      indice_menor = posicao;
    }
  });

  //console.log("menor_valor: ", menor_valor);
  //console.log("posicao: ", indice_menor);

  if(indice_menor === -1) return null;
  return indice_menor;

}

//realiza a iteração a partir do modelo recebido e
//retorna um novo modelo
function iteracao(modelo, linha_pivo, coluna_pivo) {
  var novo_modelo = JSON.parse(JSON.stringify(modelo));
  const todas_variaveis = [ ...novo_modelo.var_decisao, ...novo_modelo.var_folga ];

  // altera o nome da variável na tabela para que o usuário saiba
  // qual variável entrou
  novo_modelo.var_basicas[linha_pivo] = todas_variaveis[coluna_pivo];

  var valor_pivo = novo_modelo.coeficientes[linha_pivo][coluna_pivo];

  // multiplica a linha do pivo de modo a deixa-lo com o valor 1
  novo_modelo.coeficientes[linha_pivo].forEach( (valor, coluna) => {
    novo_modelo.coeficientes[linha_pivo][coluna] = valor * (1/valor_pivo);
  });

  novo_modelo.coef_xb[linha_pivo] *= (1/valor_pivo);

  // realiza operações entre as linhas da tabela de modo a deixar os
  // outros elementos da coluna do pivô com valor igual a 0
  novo_modelo.coeficientes.forEach((array_linha, linha) => {
    if(linha !== linha_pivo) {
      const coeficiente_linha = array_linha[coluna_pivo] * (-1);

      array_linha.forEach( (valor, coluna) => {
        novo_modelo.coeficientes[linha][coluna] = novo_modelo.coeficientes[linha][coluna] + (coeficiente_linha * novo_modelo.coeficientes[linha_pivo][coluna]);
      });

      novo_modelo.coef_xb[linha] = novo_modelo.coef_xb[linha] + (coeficiente_linha * novo_modelo.coef_xb[linha_pivo]);
    }
  });

  //para a linha de coeficientes da função objetivo também
  const coeficiente_linha = novo_modelo.coef_func_obj[coluna_pivo] * (-1);

  novo_modelo.coef_func_obj.forEach( (valor, coluna) => {
    novo_modelo.coef_func_obj[coluna] = novo_modelo.coef_func_obj[coluna] + (coeficiente_linha * novo_modelo.coeficientes[linha_pivo][coluna]);
  });

  //atualiza o valor da função objetivo
  novo_modelo.valor_func_obj = novo_modelo.valor_func_obj + (coeficiente_linha * novo_modelo.coef_xb[linha_pivo]);

  //incrementa o número de iterações
  novo_modelo.iteracoes = novo_modelo.iteracoes + 1;


  return novo_modelo;
}

export function resolveModeloSimplex(modelo) {
  var array_modelos = [ modelo ];
  var solucaoOtima = false;
  var iteracoes = 0;

  while(!solucaoOtima) {
    const modelo_aux = array_modelos[iteracoes];
    //realiza iteracao
    const novo_modelo = iteracao(
      modelo_aux,
      variavelSaindo(modelo_aux, variavelEntrando(modelo_aux)),
      variavelEntrando(modelo_aux)
    );
    //push modelos_resolucao
    array_modelos = [ ...array_modelos, novo_modelo ];

    //iteracoes++
    iteracoes += 1;

    solucaoOtima = verificaOtimalidade(array_modelos[iteracoes]);


  }

  var modelos_resolucao = {};
  array_modelos.forEach( (modelo) => {
    modelos_resolucao = { ...modelos_resolucao, [modelo.iteracoes]: modelo };
  });

  return { ...modelos_resolucao };
}
