import { onlyNum } from './formatters.js';

export const state = {
  finalJson: null,
  pages: {
    economic: 'economicPage',
    questions: 'questionsPage',
    result: 'resultPage'
  }
};

export const vertex = {
  proposto: { x: 280, y: 42 },
  entregue: { x: 170, y: 190 },
  percebido: { x: 390, y: 190 }
};

export const center = {
  x: (vertex.proposto.x + vertex.entregue.x + vertex.percebido.x) / 3,
  y: (vertex.proposto.y + vertex.entregue.y + vertex.percebido.y) / 3
};

export const radius = Math.hypot(vertex.proposto.x - center.x, vertex.proposto.y - center.y);

export function getEconomicInputs() {
  return {
    ticketMedioMensal: onlyNum(document.getElementById('ticket')?.value),
    clientesAtivos: onlyNum(document.getElementById('activeClients')?.value),
    clientesEmRenovacao: onlyNum(document.getElementById('renewalClients')?.value),
    tempoMedioVidaMeses: onlyNum(document.getElementById('lifetime')?.value),
    taxaRenovacaoAtualPercent: onlyNum(document.getElementById('renewalRate')?.value),
    margemMediaPercent: onlyNum(document.getElementById('margin')?.value),
    cacMedio: onlyNum(document.getElementById('cac')?.value)
  };
}
