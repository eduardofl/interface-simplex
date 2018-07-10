var math = require('mathjs');

//  verifica os coeficientes na linha da função objetivo,
//  se ainda há variáveis que caso adicionadas na base,
//  melhorem a solução viável atual, a solução não é ótima
//
//  o teste consiste em verificar se os coeficientes das variáveis
//  não-básicas, caso todos sejam <= 0, a solução é ótima
function verificaOtimalidade(modelo) {
  var count = 0;

  modelo.coef_func_obj.forEach( conteudo => {
    var coef = math.fraction(conteudo);
    if(math.larger(coef, 0)) count++;
  });

  if(count > 0) {
    return false;
  } else {
    return true;
  }
}

function variavelEntrando(modelo) {
  const coeficientes_funcao = modelo.coef_func_obj;
  var maior_coef = math.fraction(coeficientes_funcao[0]);
  var indice_maior = 0;

  coeficientes_funcao.forEach( (conteudo, posicao) => {
    var coef = math.fraction(conteudo);
    if(math.larger(coef, 0) && math.larger(coef, maior_coef)) {
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

  var aux = coeficientes_xb.map( (conteudo, posicao) => {
    var xb = math.fraction(conteudo);
    var xi = math.fraction(coefs[posicao][coluna]);
    if(xi.n === 0) return 0;
    else {
      return (math.chain(xb).divide(xi).done());
    }
  });

  var menor_valor = math.max(...aux);
  var indice_menor = -1;

  aux.forEach( (elemento, posicao) => {
    if(math.larger(elemento, 0) && math.smallerEq(elemento, menor_valor)) {
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
export function iteracao(modelo, linha_pivo, coluna_pivo) {
  var novo_modelo = JSON.parse(JSON.stringify(modelo));
  var novo_conteudo, sinal;
  const todas_variaveis = [ ...novo_modelo.var_decisao, ...novo_modelo.var_folga ];

  // altera o nome da variável na tabela para que o usuário saiba
  // qual variável entrou
  novo_modelo.var_basicas[linha_pivo] = todas_variaveis[coluna_pivo];

  var valor_pivo = math.fraction(novo_modelo.coeficientes[linha_pivo][coluna_pivo]);

  // multiplica a linha do pivo de modo a deixa-lo com o valor 1
  novo_modelo.coeficientes[linha_pivo].forEach( (conteudo, coluna) => {
    var valor = math.fraction(conteudo);
    var novo_valor = math.chain(valor).multiply(math.fraction(`${valor_pivo.d}/${valor_pivo.n}`)).multiply(valor_pivo.s).done();
    sinal = (novo_valor.s === -1) ? "-" : "";
    novo_conteudo = (novo_valor.d === 1) ? `${sinal}${novo_valor.n}` : `${sinal}${novo_valor.n}/${novo_valor.d}`;
    novo_modelo.coeficientes[linha_pivo][coluna] = novo_conteudo;
  });

  var novo_coef_xb = math.chain(math.fraction(novo_modelo.coef_xb[linha_pivo])).multiply(math.fraction(`${valor_pivo.d}/${valor_pivo.n}`)).multiply(valor_pivo.s).done();
  sinal = (novo_coef_xb.s === -1) ? "-" : "";
  novo_conteudo = (novo_coef_xb.d === 1) ? `${sinal}${novo_coef_xb.n}` : `${sinal}${novo_coef_xb.n}/${novo_coef_xb.d}`;
  novo_modelo.coef_xb[linha_pivo] = novo_conteudo;

  // realiza operações entre as linhas da tabela de modo a deixar os
  // outros elementos da coluna do pivô com valor igual a 0
  novo_modelo.coeficientes.forEach((array_linha, linha) => {
    if(linha !== linha_pivo) {
      const coeficiente_linha = math.chain(math.fraction(array_linha[coluna_pivo])).multiply(-1).done();

      array_linha.forEach( (conteudo, coluna) => {
        var valor = math.fraction(conteudo);
        var novo_valor = math.chain(valor).add( math.chain(coeficiente_linha).multiply(math.fraction(novo_modelo.coeficientes[linha_pivo][coluna])).done() ).done();
        sinal = (novo_valor.s === -1) ? "-" : "";
        novo_conteudo = (novo_valor.d === 1) ? `${sinal}${novo_valor.n}` : `${sinal}${novo_valor.n}/${novo_valor.d}`;
        novo_modelo.coeficientes[linha][coluna] = novo_conteudo;
      });

      var novo_coef_xb = math.chain(math.fraction(novo_modelo.coef_xb[linha])).add( math.chain(coeficiente_linha).multiply(math.fraction(novo_modelo.coef_xb[linha_pivo])).done() ).done();
      sinal = (novo_coef_xb.s === -1) ? "-" : "";
      novo_conteudo = (novo_coef_xb.d === 1) ? `${sinal}${novo_coef_xb.n}` : `${sinal}${novo_coef_xb.n}/${novo_coef_xb.d}`;
      novo_modelo.coef_xb[linha] = novo_conteudo;
    }
  });

  //para a linha de coeficientes da função objetivo também
  const coeficiente_linha = math.chain(math.fraction(novo_modelo.coef_func_obj[coluna_pivo])).multiply(-1).done();

  novo_modelo.coef_func_obj.forEach( (conteudo, coluna) => {
    var novo_valor = math.chain(math.fraction(novo_modelo.coef_func_obj[coluna])).add( math.chain(coeficiente_linha).multiply(math.fraction(novo_modelo.coeficientes[linha_pivo][coluna])).done() ).done();
    sinal = (novo_valor.s === -1) ? "-" : "";
    novo_conteudo = (novo_valor.d === 1) ? `${sinal}${novo_valor.n}` : `${sinal}${novo_valor.n}/${novo_valor.d}`;
    novo_modelo.coef_func_obj[coluna] = novo_conteudo;
  });

  //atualiza o valor da função objetivo
  var novo_valor_func_obj = math.chain(math.fraction(novo_modelo.valor_func_obj)).add( math.chain(coeficiente_linha).multiply(math.fraction(novo_modelo.coef_xb[linha_pivo])).done() ).done();
  sinal = (novo_valor_func_obj.s === -1) ? "-" : "";
  novo_conteudo = (novo_valor_func_obj.d === 1) ? `${sinal}${novo_valor_func_obj.n}` : `${sinal}${novo_valor_func_obj.n}/${novo_valor_func_obj.d}`;
  novo_modelo.valor_func_obj = novo_conteudo;

  //incrementa o número de iterações
  novo_modelo.iteracoes = novo_modelo.iteracoes + 1;


  return novo_modelo;
}

export function resolveModeloSimplex(modelos) {
  var array_modelos = [ ...modelos ];
  var iteracoes = modelos[modelos.length - 1].iteracoes;
  var solucaoOtima = verificaOtimalidade(array_modelos[iteracoes]);

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
