import { iteracao } from './metodo_simplex';
var math = require('mathjs');

function verificaOtimalidade(modelo) {
  const coeficientes_xb = modelo.coef_xb.map( (conteudo) => {
    return math.fraction(conteudo);
  });
  var count = 0; //contador de coeficientes negativos

  coeficientes_xb.forEach( (coef) => {
    if(math.smaller(coef, 0)) count++;
  });

  if (count === 0) {
    return true;
  } else {
    return false;
  }
}

function variavelSaindo(modelo) {
  const coeficientes_xb = modelo.coef_xb.map( (conteudo) => {
    return math.fraction(conteudo);
  });
  var menor_coef = math.max(...coeficientes_xb);
  var indice_menor;

  coeficientes_xb.forEach( (coef, posicao) => {
    if(math.smaller(coef, menor_coef) && math.smaller(coef, 0)) {
      menor_coef = coef;
      indice_menor = posicao;
    }
  });
  return indice_menor;
}

function variavelEntrando(modelo, linha) {
  const todas_variaveis = [ ...modelo.var_decisao, ...modelo.var_folga ];
  const coeficientes_func_obj = modelo.coef_func_obj.map( (conteudo) => { return math.fraction(conteudo); } );
  const coeficientes_linhas = modelo.coeficientes[linha].map( (conteudo) => { return math.fraction(conteudo); } );

  var aux = coeficientes_func_obj.map( (coef, coluna) => {
    var novo_valor = math.fraction(0);
    if (coeficientes_linhas[coluna].n !== 0) {
      novo_valor = math.abs(math.chain(coef).divide(coeficientes_linhas[coluna]).done());
    }
    return novo_valor;
  });

  var menor_valor = math.max(...aux);
  var indice_menor;

  aux.forEach( (elemento, posicao) => {
    if(math.smaller(elemento, menor_valor)) {
      if(!(modelo.var_basicas.includes(todas_variaveis[posicao]))){
        menor_valor = elemento;
        indice_menor = posicao;
      }
    }
  });

  return indice_menor;
}

export function aplicaDualSimplex(modelo) {
  var array_modelos = [ modelo ];
  var iteracoes = 0;
  var solucaoOtima = verificaOtimalidade(array_modelos[iteracoes]);

  while(!solucaoOtima) {
    const modelo_aux = array_modelos[iteracoes];

    //realiza iteracao
    const novo_modelo = iteracao(
      modelo_aux,
      variavelSaindo(modelo_aux),
      variavelEntrando(modelo_aux, variavelSaindo(modelo_aux))
    );

    //push array_modelos
    array_modelos = [ ...array_modelos, novo_modelo ];

    //iteracoes++
    iteracoes++;

    solucaoOtima = verificaOtimalidade(array_modelos[iteracoes]);
  }


  return array_modelos;

}
