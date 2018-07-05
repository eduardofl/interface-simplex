import _ from 'lodash';

function geraTextoTableau(modelo){
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
  modelo.coef_func_obj.forEach( (variavel, indice) => {
    if(indice !== modelo.coef_func_obj.length - 1) {
      texto += variavel;
      for(i=0;i< 7 - variavel.length;i++) texto += " ";
    } else {
      texto += variavel;
      for(i=0;i< 6 - variavel.length;i++) texto += " ";
    }
  });
  texto += "|    " + modelo.valor_func_obj + "\n";

  //linhas de restrição
  modelo.var_basicas.forEach( (variavel, linha) => {
    texto += "   " + variavel;
    for(i=0;i< 6 - variavel.length;i++) texto += " ";
    texto += "| ";

    modelo.coeficientes[linha].forEach( (valor, coluna) => {
      if(coluna !== modelo.coeficientes[linha].length - 1) {
        texto += valor;
        for(i=0;i< 7 - valor.length;i++) texto += " ";
      } else {
        texto += valor;
        for(i=0;i< 6 - valor.length;i++) texto += " ";
      }
    });
    texto += "|    " + modelo.coef_xb[linha] + "\n";
  });

  return texto;
}

export function geraArquivoTexto(modelos) {
  var texto_conteudo = "";
  const array_tableaus = _.map(modelos, (modelo) => {
    return geraTextoTableau(modelo);
  });

  array_tableaus.forEach( (tableau, iteracoes) => {
    texto_conteudo += `#TABLEAU ${iteracoes + 1}\n`;
    texto_conteudo += tableau + "\n\n";
  });

 texto_conteudo = texto_conteudo.replace(/\n/g, "\r\n");
  return texto_conteudo;
}
