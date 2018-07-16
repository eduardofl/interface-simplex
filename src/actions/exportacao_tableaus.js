import _ from 'lodash';
import { FRACAO } from '../actions';
var math = require('mathjs');

// gera texto para representar apenas um tableau
function geraTextoTableau(modelo, tipo){
  var aux, texto_coeficiente;
  //linha 1
  var texto = "Variáveis| ";
  var largura = 1;
  modelo.var_decisao.forEach( (variavel) => {
    texto += variavel + "      ";
    largura += 7;
  });
  modelo.var_folga.forEach( (variavel, indice) => {
    if(indice !== (modelo.var_folga.length - 1)) {
      texto += variavel + "     ";
      largura += 7;
    } else {
      texto += variavel + "    | Valores de\n";
      largura += 6;
    }
  });
  //linha 2
  texto += " básicas |";
  for(var i = 0;i<largura;i++) texto += " ";
  texto += "| -f e xb\n";

  //divisão de linha
  for(i = 0;i<largura+22;i++) texto += "-";
  texto += "\n";

  //linha 3
  texto += "   -f    | ";
  modelo.coef_func_obj.forEach( (coef, indice) => {
    if(indice !== modelo.coef_func_obj.length - 1) {
      aux = math.number(math.fraction(coef));
      aux = math.round(aux * 10000) / 10000;
      const coef_dec = `${aux}`;

      texto_coeficiente = (tipo === FRACAO) ? coef : coef_dec;
      texto += texto_coeficiente;

      for(i=0;i< 7 - texto_coeficiente.length;i++) texto += " ";
    } else {
      aux = math.number(math.fraction(coef));
      aux = math.round(aux * 10000) / 10000;
      const coef_dec = `${aux}`;

      texto_coeficiente = (tipo === FRACAO) ? coef : coef_dec;
      texto += texto_coeficiente;
      for(i=0;i< 6 - texto_coeficiente.length;i++) texto += " ";
    }
  });
  if(tipo === FRACAO) {
    texto += "|    " + modelo.valor_func_obj + "\n";
  } else {
    aux = math.number(math.fraction(modelo.valor_func_obj));
    aux = math.round(aux * 10000) / 10000;

    const f_dec = `${aux}`;
    texto += "|    " + f_dec + "\n";
  }


  //linhas de restrição
  modelo.var_basicas.forEach( (variavel, linha) => {
    texto += "   " + variavel;
    for(i=0;i< 6 - variavel.length;i++) texto += " ";
    texto += "| ";

    modelo.coeficientes[linha].forEach( (valor, coluna) => {
      if(coluna !== modelo.coeficientes[linha].length - 1) {
        aux = math.number(math.fraction(valor));
        aux = math.round(aux * 10000) / 10000;
        const valor_dec = `${aux}`;

        texto_coeficiente = (tipo === FRACAO) ? valor : valor_dec;
        texto += texto_coeficiente;

        for(i=0;i< 7 - texto_coeficiente.length;i++) texto += " ";
      } else {
        aux = math.number(math.fraction(valor));
        aux = math.round(aux * 10000) / 10000;
        const valor_dec = `${aux}`;

        texto_coeficiente = (tipo === FRACAO) ? valor : valor_dec;
        texto += texto_coeficiente;

        for(i=0;i< 6 - texto_coeficiente.length;i++) texto += " ";
      }
    });
    if(tipo === FRACAO) {
      texto += "|    " + modelo.coef_xb[linha] + "\n";
    } else {
      aux = math.number(math.fraction(modelo.coef_xb[linha]));
      aux = math.round(aux * 10000) / 10000;

      const xb_dec = `${aux}`;
      texto += "|    " + xb_dec + "\n";
    }
  });

  return texto;
}

// cria o conteudo do arquivo .txt a ser exportado, com todos os tableaus
export function geraArquivoTexto(modelos, tipo) {
  var texto_conteudo = "";
  const array_tableaus = _.map(modelos, (modelo) => {
    return geraTextoTableau(modelo, tipo);
  });

  array_tableaus.forEach( (tableau, iteracoes) => {
    texto_conteudo += `#TABLEAU ${iteracoes + 1}\n`;
    texto_conteudo += tableau + "\n\n";
  });

 texto_conteudo = texto_conteudo.replace(/\n/g, "\r\n");
  return texto_conteudo;
}
