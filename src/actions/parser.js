import { aplicaDualSimplex } from './dual_simplex';
var math = require('mathjs');
var tipo;
/*'Max 3x + 2y + 5z
s.a.
x + 2y + z <= 430
3x + 2z <= 460
x + 4y <= 420'*/

/*Max 0.2x + 0.1y
s.a.
0.1y <= 200
0.25x <= 800
3x + 2y <= 12000*/

function getCoeficiente(expressao, variavel, todas_variaveis) {
  const node_aux = math.parse(expressao);
  var node_expr;
  if(node_aux.isOperatorNode && (node_aux.op === "<=" || node_aux.op === ">=" || node_aux.op === "=")) {
    node_expr = node_aux.args[0];
  } else {
    node_expr = node_aux;
  }

  var obj_txt = "{ ";
  todas_variaveis.forEach( (aux, posicao) => {
    if(aux !== variavel) {
      obj_txt += `"${aux}": 0`;
      (posicao === (todas_variaveis.length-1)) ? obj_txt += " " :  obj_txt += ", ";
    } else {
      obj_txt += `"${aux}": 1`;
      (posicao === (todas_variaveis.length-1)) ? obj_txt += " " :  obj_txt += ", ";
    }
  });
  obj_txt += "}";

  const scope = JSON.parse(obj_txt);

  var coeficiente = math.fraction(node_expr.eval(scope));

  var sinal = (coeficiente.s === -1) ? "-" : "";
  const coeficiente_txt = (coeficiente.d === 1) ? `${sinal}${coeficiente.n}` : `${sinal}${coeficiente.n}/${coeficiente.d}`;

  return coeficiente_txt;
}

function parseEquation(node, linha) {
  switch (node.type) {
    case 'OperatorNode':
      if(node.isUnary()) {
        parseEquation(node.args[0], linha);
      }
      else {
        parseEquation(node.args[0], linha);
        parseEquation(node.args[1], linha);
      }
      break;

    case 'SymbolNode':
      if(linha === 0) {
        if(node.name === 'Max' || node.name === 'max' || node.name === 'Min' || node.name === 'min') {
          tipo = node.name;
        }
      }
      break;

    default:
      break;
  }
}

export function parseText(texto_modelo) {
  var obj_modelo = {
    iteracoes: 0,
    var_decisao: [],
    var_folga: [],
    var_basicas: [],
    coef_func_obj: [],
    valor_func_obj: "0",
    coeficientes: [
    ],
    coef_xb: []
  };

  var linhas = texto_modelo.split('\n');
  var restricoes = [], node;
  var coefs_var_folga = [], num_folgas = 0;
  var necessita_dual = false, linhas_dual = [];
  var modelos_resolucao = [];


  linhas.forEach( (conteudo, linha) => {
    if(linha === 0) {
      /*var aux = conteudo.split(" ");
      if(aux[0] === 'Max' || aux[0] === 'max' || aux[0] === 'Min' || aux[0] === 'min') {
        tipo = aux[0];
      }*/
      //else modelo invalido
      
      node = math.parse(conteudo);
      parseEquation(node, linha);
      linhas[0] = linhas[0].replace(`${tipo}`, '');
      /*node.forEach( (node, path, parent) => {
        if(node.isSymbolNode) {
          if(node.name === 'Max' || node.name === 'max' || node.name === 'Min' || node.name === 'min') {
            tipo = node.name;
          } else if(!(obj_modelo.var_decisao.includes(node.name))) {
            obj_modelo.var_decisao = [...obj_modelo.var_decisao, node.name];
          }
        }
      });*/
    } else if((conteudo !== 'st') && (conteudo !== 'sa')) {
      restricoes = [...restricoes, conteudo];
      node = math.parse(conteudo);
      if(node.isOperatorNode && node.op === "<=") {
        obj_modelo.coef_xb = [...obj_modelo.coef_xb, node.args[1].value.toString()];
        coefs_var_folga = [...coefs_var_folga, 1];
      } else if (node.isOperatorNode && node.op === ">=") {
        obj_modelo.coef_xb = [...obj_modelo.coef_xb, node.args[1].value.toString()];
        coefs_var_folga = [...coefs_var_folga, -1];
        necessita_dual = true;
        linhas_dual = [...linhas_dual, linha -2];
      } else if(node.isOperatorNode && node.op === "=") {
        obj_modelo.coef_xb = [...obj_modelo.coef_xb, node.args[1].value.toString()];
        coefs_var_folga = [...coefs_var_folga, 0];
      }
    }
  });

  var func_obj = math.parse(linhas[0]);
  func_obj.traverse( (node, path, parent) => {
    if(node.isSymbolNode && !(obj_modelo.var_decisao.includes(node.name))) {
      obj_modelo.var_decisao = [...obj_modelo.var_decisao, node.name];
    }
  });

  obj_modelo.var_decisao.forEach( (variavel) => {
    var aux = getCoeficiente(linhas[0], variavel, obj_modelo.var_decisao);
    obj_modelo.coef_func_obj = [...obj_modelo.coef_func_obj, aux];
  });

  for(var i = 0; i < restricoes.length; i++) {
    if(coefs_var_folga[i] !== 0) {
      var var_folga = `s${1 + num_folgas}`;
      obj_modelo.var_folga = [...obj_modelo.var_folga, var_folga];
      num_folgas++;
    }
  }
  obj_modelo.var_basicas = [...obj_modelo.var_folga];

  obj_modelo.var_folga.forEach( (variavel, indice) => {
    obj_modelo.coef_func_obj = [...obj_modelo.coef_func_obj, "0"];
  });

  const todas_variaveis = [...obj_modelo.var_decisao, ...obj_modelo.var_folga];
  obj_modelo.coeficientes = obj_modelo.var_folga.map( (var_folga, linha) => {
    var linha_coeficientes= [];
    todas_variaveis.forEach( (variavel, coluna) => {
      var aux = "0";
      if(obj_modelo.var_decisao.includes(variavel)) {
        linha_coeficientes = [...linha_coeficientes, getCoeficiente(restricoes[linha], variavel, obj_modelo.var_decisao)];
      } else if(obj_modelo.var_basicas[linha] === todas_variaveis[coluna]) {
        var sinal = (coefs_var_folga[linha] === -1) ? "-" : "";
        aux = `${sinal}1`;
        linha_coeficientes = [...linha_coeficientes, aux];
      } else {
        linha_coeficientes = [...linha_coeficientes, aux];
      }
      //obj_modelo.coeficientes[linha] = [...obj_modelo.coeficientes[linha], aux];
    });
    return linha_coeficientes;
  });

  //caso seja operação de minimo, transforma Min f = Max -f
  if(tipo === 'Min' || tipo === 'min') {
    obj_modelo.coef_func_obj.forEach ( (conteudo, coluna) => {
      var valor = math.fraction(conteudo);
      var novo_valor = math.chain(valor).multiply(math.fraction(-1)).done();
      var sinal = (novo_valor.s === -1) ? "-" : "";
      obj_modelo.coef_func_obj[coluna] = (novo_valor.d === 1) ? `${sinal}${novo_valor.n}` : `${sinal}${novo_valor.n}/${novo_valor.d}`;
    });
  }

  if(necessita_dual === true) {
    linhas_dual.forEach( (linha) => {
      obj_modelo.coeficientes[linha].forEach( (conteudo, coluna) => {
        var valor = math.fraction(conteudo);
        var novo_valor = math.chain(valor).multiply(math.fraction(-1)).done();
        var sinal = (novo_valor.s === -1) ? "-" : "";
        obj_modelo.coeficientes[linha][coluna] = (novo_valor.d === 1) ? `${sinal}${novo_valor.n}` : `${sinal}${novo_valor.n}/${novo_valor.d}`;
      });
      var coef_xb = obj_modelo.coef_xb[linha];
      var valor = math.fraction(coef_xb);
      var novo_coef = math.chain(valor).multiply(math.fraction(-1)).done();
      var sinal = (novo_coef.s === -1) ? "-" : "";
      obj_modelo.coef_xb[linha] = (novo_coef.d === 1) ? `${sinal}${novo_coef.n}` : `${sinal}${novo_coef.n}/${novo_coef.d}`;
    });
    modelos_resolucao = aplicaDualSimplex(obj_modelo);
  } else {
    modelos_resolucao = [ obj_modelo ];
  }

  return modelos_resolucao;
}
