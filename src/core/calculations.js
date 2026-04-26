import { getEconomicInputs, vertex, center, radius } from './store.js';
import { questionGroups, scenarioLibrary, attentionCatalog } from '../data/diagnosis.data.js';

function avg(ids) {
  return ids.reduce((sum, id) => sum + Number(document.getElementById(id).value), 0) / ids.length;
}

export function calcEconomic() {
  const inputs = getEconomicInputs();

  const filledRequired = [
    'ticketMedioMensal',
    'clientesAtivos',
    'clientesEmRenovacao',
    'tempoMedioVidaMeses',
    'taxaRenovacaoAtualPercent'
  ].filter((key) => inputs[key] != null && !Number.isNaN(inputs[key])).length;

  const filledOptional = ['margemMediaPercent', 'cacMedio']
    .filter((key) => inputs[key] != null && !Number.isNaN(inputs[key])).length;

  const visibilityScore = Math.round(((filledRequired / 5) * 80) + ((filledOptional / 2) * 20));
  const visibility = visibilityScore >= 80 ? 'Alta' : visibilityScore >= 45 ? 'Média' : visibilityScore > 0 ? 'Baixa' : '—';
  const risk = visibilityScore >= 80 ? 'Baixo' : visibilityScore >= 45 ? 'Moderado' : visibilityScore > 0 ? 'Alto' : '—';

  const activeMRR = inputs.ticketMedioMensal && inputs.clientesAtivos
    ? inputs.ticketMedioMensal * inputs.clientesAtivos
    : null;

  const renewalMRR = inputs.ticketMedioMensal && inputs.clientesEmRenovacao
    ? inputs.ticketMedioMensal * inputs.clientesEmRenovacao
    : null;

  const notRenewalRisk = inputs.taxaRenovacaoAtualPercent != null
    ? Math.max(0, Math.min(1, 1 - inputs.taxaRenovacaoAtualPercent / 100))
    : 0.40;

  const monthlyOpportunity = renewalMRR != null ? renewalMRR * notRenewalRisk : null;

  const ltvPerClient = inputs.ticketMedioMensal && inputs.tempoMedioVidaMeses
    ? inputs.ticketMedioMensal * inputs.tempoMedioVidaMeses
    : null;

  const ltvOpportunity = ltvPerClient != null && inputs.clientesEmRenovacao
    ? ltvPerClient * inputs.clientesEmRenovacao * notRenewalRisk
    : null;

  const marginAdjustedLtvOpportunity = ltvOpportunity != null && inputs.margemMediaPercent != null
    ? ltvOpportunity * (inputs.margemMediaPercent / 100)
    : null;

  const replacementCost = inputs.cacMedio && inputs.clientesEmRenovacao
    ? inputs.cacMedio * inputs.clientesEmRenovacao * notRenewalRisk
    : null;

  return {
    inputs,
    visibilityScore,
    visibility,
    risk,
    activeMRR,
    renewalMRR,
    notRenewalRisk,
    monthlyOpportunity,
    ltvPerClient,
    ltvOpportunity,
    marginAdjustedLtvOpportunity,
    replacementCost
  };
}

export function calcDeva() {
  const axisScores = {
    proposto: avg(['q1', 'q2', 'q3']),
    entregue: avg(['q4', 'q5', 'q6']),
    percebido: avg(['q7', 'q8', 'q9'])
  };

  const sum = axisScores.proposto + axisScores.entregue + axisScores.percebido || 1;

  const weights = {
    proposto: axisScores.proposto / sum,
    entregue: axisScores.entregue / sum,
    percebido: axisScores.percebido / sum
  };

  const point = {
    x: weights.proposto * vertex.proposto.x + weights.entregue * vertex.entregue.x + weights.percebido * vertex.percebido.x,
    y: weights.proposto * vertex.proposto.y + weights.entregue * vertex.entregue.y + weights.percebido * vertex.percebido.y
  };

  const radialDistance = Math.min(1, Math.hypot(point.x - center.x, point.y - center.y) / radius);
  const radialDistancePercent = Math.round(radialDistance * 100);
  const devaIndex = Math.max(0, Math.min(100, 100 - radialDistancePercent));
  const maturity = (axisScores.proposto + axisScores.entregue + axisScores.percebido) / 3;

  const deviations = {
    proposto: weights.proposto - 1 / 3,
    entregue: weights.entregue - 1 / 3,
    percebido: weights.percebido - 1 / 3
  };

  const sorted = Object.entries(deviations).sort((a, b) => b[1] - a[1]);
  const dominantAxis = sorted[0][0];
  const weakestAxis = sorted[2][0];

  let scenario = 'alinhado';
  if (maturity < 4.2) scenario = 'baixo';
  else if (devaIndex > 82) scenario = 'alinhado';
  else if (weakestAxis === 'percebido' && (dominantAxis === 'proposto' || dominantAxis === 'entregue')) scenario = 'invisivel';
  else if (dominantAxis === 'proposto' && weakestAxis === 'entregue') scenario = 'sobrepromessa';
  else if (weakestAxis === 'proposto') scenario = 'propostaFraca';
  else if (dominantAxis === 'percebido') scenario = 'percepcaoAlta';

  return {
    axisScores,
    weights,
    point,
    baricenter: center,
    radialDistance,
    radialDistancePercent,
    devaIndex,
    maturity,
    deviations,
    dominantAxis,
    weakestAxis,
    scenario
  };
}

export function buildFinalJson() {
  const economic = calcEconomic();
  const deva = calcDeva();
  const lib = scenarioLibrary[deva.scenario];
  const riskFromDeva = 1 - (deva.devaIndex / 100);

  const renewalPropensity = Math.round(
    (deva.devaIndex * 0.60) +
    (deva.maturity * 10 * 0.25) +
    ((economic.inputs.taxaRenovacaoAtualPercent ?? 60) * 0.15)
  );

  const renewalClients = economic.inputs.clientesEmRenovacao ?? 0;
  const ticket = economic.inputs.ticketMedioMensal ?? 0;
  const lifetime = economic.inputs.tempoMedioVidaMeses ?? 0;

  const monthlyOpportunity = renewalClients * ticket * riskFromDeva;
  const ltvOpportunity = renewalClients * ticket * lifetime * riskFromDeva;

  const weakQuestions = questionGroups
    .flatMap((group) => group.items)
    .map((q) => ({ id: q[0], value: Number(document.getElementById(q[0]).value) }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 3);

  const attentionPoints = weakQuestions.map((x) => ({
    id: x.id,
    score: x.value,
    title: attentionCatalog[x.id][0],
    detail: attentionCatalog[x.id][1]
  }));

  const confidence = economic.visibilityScore >= 80 ? 'Alta' : economic.visibilityScore >= 45 ? 'Moderada' : 'Baixa';

  return {
    generatedAt: new Date().toISOString(),
    economicInputs: economic.inputs,
    economicMetrics: {
      visibilityScore: economic.visibilityScore,
      visibility: economic.visibility,
      analysisConfidence: confidence,
      activeMRR: economic.activeMRR,
      renewalWindowMRR: economic.renewalMRR,
      preliminaryOpportunityMonthly: economic.monthlyOpportunity,
      ltvPerClient: economic.ltvPerClient,
      preliminaryOpportunityLTV: economic.ltvOpportunity,
      marginAdjustedLTVOpportunity: economic.marginAdjustedLtvOpportunity,
      replacementCostEstimate: economic.replacementCost
    },
    devaAnswers: Object.fromEntries(
      questionGroups.flatMap((group) => group.items).map((q) => [q[0], Number(document.getElementById(q[0]).value)])
    ),
    devaMetrics: {
      axisScores: deva.axisScores,
      weights: deva.weights,
      geometricPoint: deva.point,
      devaPointBaricenter: deva.baricenter,
      radialDistanceNormalized: deva.radialDistance,
      devaIndexPercent: deva.devaIndex,
      valueMaturity: deva.maturity,
      deviations: deva.deviations,
      dominantAxis: deva.dominantAxis,
      weakestAxis: deva.weakestAxis,
      scenario: lib.title,
      renewalPropensityPercent: Math.max(0, Math.min(100, renewalPropensity)),
      opportunityCostMonthly: monthlyOpportunity,
      opportunityCostLTV: ltvOpportunity
    },
    interpretation: {
      scenarioTitle: lib.title,
      scenarioText: lib.text,
      attentionPoints,
      directActions: lib.actions,
      mainGap: `Valor ${deva.weakestAxis} abaixo do equilíbrio`,
      recommendation: lib.actions[0]
    }
  };
}
