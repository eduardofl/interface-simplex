import { resolveModeloSimplex } from './metodo_simplex';
export const RECEBE_MODELO = 'recebe_modelo';
export const RESOLVE_MODELO = 'resolve_modelo';
export const PROXIMO_TABLEAU = 'proximo_tableau';
export const TABLEAU_ANTERIOR = 'tableau_anterior';

export function recebeModelo(modelo) {
  return {
    type: RECEBE_MODELO,
    payload: modelo
  };
}

export function resolveModelo(modelo) {
  const modelos_resolucao = resolveModeloSimplex(modelo);

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
