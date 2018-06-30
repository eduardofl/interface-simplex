var math = require('mathjs');
var necessita_dual = false;
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

function getCoeficiente(expressao, variavel) {
  const node = math.parse(expressao);
  const obj_txt = `{ "${variavel}": 1 }`;
  const scope = JSON.parse(obj_txt);
  var coeficiente = null, coeficiente_txt = "0";

  node.traverse( (node, path, parent) => {
    if(node.isOperatorNode && node.op === "*") {
      if(node.args[0].isSymbolNode && node.args[0].name === variavel) {
        const novo_valor = math.fraction(node.eval(scope));
        if(parent && (parent.op === "-" && parent.args[1] === node)) {
          novo_valor.s *= -1;
        }
        coeficiente = novo_valor;
      } else if(node.args[1].isSymbolNode && node.args[1].name === variavel) {
        const novo_valor = math.fraction(node.eval(scope));
        if(parent && (parent.op === "-" && parent.args[1] === node)) {
          novo_valor.s *= -1;
        }
        coeficiente = novo_valor;
      }
    } else if (node.isOperatorNode && node.op === "-") {
      if(node.fn === "unaryMinus") {
        if(node.args[0].isSymbolNode && node.args[0].name === variavel) {
          coeficiente = math.fraction(-1);
        }
      } else if (node.fn === "subtract") {
        if(node.args[1].isSymbolNode && node.args[1].name === variavel) {
          coeficiente = math.fraction(-1);
        }
      }
    } else if(node.isOperatorNode && node.op === "+") {
      if((node.args[1].isSymbolNode && node.args[1].name === variavel) || (node.args[0].isSymbolNode && node.args[0].name === variavel)) {
        coeficiente = math.fraction(1);
      }
    } /*else if(node.isSymbolNode && node.name === variavel) {
      if(parent && (parent.isOperatorNode && parent.op === "-")) {
        coeficiente = math.fraction(-1);
      } else
        coeficiente = math.fraction(1);
    }*/
  });

  if(coeficiente !== null){
    var sinal = (coeficiente.s === -1) ? "-" : "";
    coeficiente_txt = (coeficiente.d === 1) ? `${sinal}${coeficiente.n}` : `${sinal}${coeficiente.n}/${coeficiente.d}`;
  }

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

  linhas.forEach( (conteudo, linha) => {
    if(linha === 0) {
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
      } else if (node.isOperatorNode && node.op === ">=") {
        obj_modelo.coef_xb = [...obj_modelo.coef_xb, node.args[1].value.toString()];
        necessita_dual = true;
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
    var aux = getCoeficiente(linhas[0], variavel);
    obj_modelo.coef_func_obj = [...obj_modelo.coef_func_obj, aux];
  });

  for(var i = 1; i <= restricoes.length; i++) {
    var var_folga = `s${i}`;
    obj_modelo.var_folga = [...obj_modelo.var_folga, var_folga];
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
        linha_coeficientes = [...linha_coeficientes, getCoeficiente(restricoes[linha], variavel)];
      } else if(obj_modelo.var_basicas[linha] === todas_variaveis[coluna]) {
        aux = "1";
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
  console.log(obj_modelo);
  return obj_modelo;
}
