import { renderLayout } from './views/layout.view.js';
import { renderEconomicView } from './views/economic.view.js';
import { renderQuestionsView } from './views/questions.view.js';
import { renderResultView } from './views/result.view.js';
import { questionGroups, scenarioLibrary } from './data/diagnosis.data.js';
import { BRL, formatInput, toast } from './core/formatters.js';
import { calcEconomic, calcDeva, buildFinalJson } from './core/calculations.js';
import { state, vertex, center } from './core/store.js';
import { captureConfig } from './config/capture.config.js';
import { isLeadDataValid } from './core/leadValidation.js';

function showPage(id) {
  document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function updateEconomicSide() {
  const e = calcEconomic();

  document.getElementById('visibilityLabel').textContent = e.visibility;
  document.getElementById('visibilityDesc').textContent = e.visibility === '—'
    ? 'Aguardando dados'
    : `Confiança econômica ${e.visibility.toLowerCase()}.`;

  document.getElementById('mrrLabel').textContent = e.activeMRR ? BRL.format(e.activeMRR) : '—';
  document.getElementById('mrrDesc').textContent = e.activeMRR
    ? 'Estimativa com base nos dados informados.'
    : 'Aguardando dados';

  document.getElementById('oppLabel').textContent = e.monthlyOpportunity ? BRL.format(e.monthlyOpportunity) : '—';
  document.getElementById('oppDesc').textContent = e.monthlyOpportunity
    ? 'Estimativa mensal antes do DEVA.'
    : 'Aguardando dados';

  document.getElementById('riskLabel').textContent = e.risk;
  document.getElementById('riskDesc').textContent = e.risk === '—'
    ? 'Aguardando dados'
    : 'Quanto menos dados-chave, maior o risco de decisão.';

  document.getElementById('prelimText').textContent = e.visibilityScore >= 80
    ? 'Os dados informados permitem boa leitura econômica antes das perguntas DEVA.'
    : e.visibilityScore >= 45
      ? 'Alguns dados ainda faltam. O custo de oportunidade pode estar parcialmente estimado.'
      : 'Sem dados-chave, o custo de oportunidade pode estar sendo subestimado.';
}

function renderQuestions() {
  const host = document.getElementById('questionHost');
  host.innerHTML = '';

  const classes = { proposto: '', entregue: 'delivered', percebido: 'perceived' };
  let index = 1;

  questionGroups.forEach((group) => {
    const section = document.createElement('div');
    section.className = 'q-section';

    group.items.forEach((item) => {
      const [id, title, subtitle, left, right, value] = item;
      const row = document.createElement('div');
      row.className = 'q-row';
      row.innerHTML = `
        <div class="q-num">${index++}</div>
        <div>
          <div><span class="axis-label ${classes[group.axis]}">${group.label}</span><span class="q-name">${title}</span></div>
          <div class="q-sub">${subtitle}</div>
        </div>
        <div>
          <div class="slider-block">
            <span>${left}</span>
            <input id="${id}" type="range" min="0" max="10" step="1" value="${value}" data-axis="${group.axis}" style="--rangeColor:${group.color};--pct:${value * 10}%">
            <span>${right}</span>
          </div>
          <div class="slider-meta"><span>0</span><span>10</span></div>
        </div>
        <div class="q-value" id="${id}v" style="--rangeColor:${group.color}">${value}</div>
      `;
      section.appendChild(row);
    });

    host.appendChild(section);
  });

  document.querySelectorAll('input[type=range]').forEach((input) => {
    input.addEventListener('input', () => {
      input.style.setProperty('--pct', `${Number(input.value) * 10}%`);
      document.getElementById(`${input.id}v`).textContent = input.value;
      updateQuestionSummary();
    });
  });

  updateQuestionSummary();
}

function updateQuestionSummary() {
  const d = calcDeva();

  document.getElementById('propScoreTop').textContent = d.axisScores.proposto.toFixed(1);
  document.getElementById('delScoreTop').textContent = d.axisScores.entregue.toFixed(1);
  document.getElementById('perScoreTop').textContent = d.axisScores.percebido.toFixed(1);
  document.getElementById('distRing').textContent = `${100 - d.devaIndex}/100`;

  const weakLabel = {
    proposto: 'Valor proposto',
    entregue: 'Valor entregue',
    percebido: 'Valor percebido'
  }[d.weakestAxis];

  document.getElementById('gapText').textContent = `${weakLabel} abaixo do equilíbrio.`;
  document.getElementById('actionText').textContent = `${scenarioLibrary[d.scenario].actions[0]}.`;
}

function drawTriangle() {
  const grid = document.getElementById('grid');
  const labels = document.getElementById('labels');

  grid.innerHTML = '';
  labels.innerHTML = '';

  const poly = `${vertex.proposto.x},${vertex.proposto.y} ${vertex.entregue.x},${vertex.entregue.y} ${vertex.percebido.x},${vertex.percebido.y}`;

  grid.insertAdjacentHTML(
    'beforeend',
    `<polygon points="${poly}" fill="rgba(106,168,255,.03)" stroke="#8fc6ff" stroke-width="2" filter="url(#glow)"/>`
  );

  grid.insertAdjacentHTML(
    'beforeend',
    `<line x1="${center.x}" y1="${center.y}" x2="${vertex.proposto.x}" y2="${vertex.proposto.y}" stroke="rgba(255,255,255,.12)"/>
     <line x1="${center.x}" y1="${center.y}" x2="${vertex.entregue.x}" y2="${vertex.entregue.y}" stroke="rgba(255,255,255,.12)"/>
     <line x1="${center.x}" y1="${center.y}" x2="${vertex.percebido.x}" y2="${vertex.percebido.y}" stroke="rgba(255,255,255,.12)"/>`
  );

  labels.insertAdjacentHTML(
    'beforeend',
    `<text x="${vertex.proposto.x}" y="${vertex.proposto.y - 12}" fill="#fff" text-anchor="middle" font-size="12" font-weight="700">Valor Proposto</text>
     <text x="${vertex.entregue.x - 8}" y="${vertex.entregue.y + 18}" fill="#fff" text-anchor="end" font-size="12" font-weight="700">Valor Entregue</text>
     <text x="${vertex.percebido.x + 8}" y="${vertex.percebido.y + 18}" fill="#fff" text-anchor="start" font-size="12" font-weight="700">Valor Percebido</text>`
  );
}

function updateResult() {
  drawTriangle();

  state.finalJson = buildFinalJson();

  const m = state.finalJson.devaMetrics;
  const e = state.finalJson.economicMetrics;

  document.getElementById('resIndex').textContent = `${m.devaIndexPercent}%`;
  document.getElementById('resRenewal').textContent = `${m.renewalPropensityPercent}%`;
  document.getElementById('resOppMonth').textContent = BRL.format(m.opportunityCostMonthly || 0);
  document.getElementById('resOppLtv').textContent = BRL.format(m.opportunityCostLTV || 0);
  document.getElementById('radialText').textContent = m.radialDistanceNormalized.toFixed(2).replace('.', ',');

  document.getElementById('scenarioTitle').textContent = state.finalJson.interpretation.scenarioTitle;
  document.getElementById('scenarioText').textContent = state.finalJson.interpretation.scenarioText;
  document.getElementById('resGap').textContent = `${state.finalJson.interpretation.mainGap}.`;
  document.getElementById('resRec').textContent = `${state.finalJson.interpretation.recommendation}.`;
  document.getElementById('resConfidence').textContent = e.analysisConfidence;

  document.getElementById('attentionList').innerHTML = state.finalJson.interpretation.attentionPoints
    .map((point) => `<li>${point.title}</li>`)
    .join('');

  document.getElementById('actionsList').innerHTML = state.finalJson.interpretation.directActions
    .map((action) => `<li>${action}</li>`)
    .join('');

  document.getElementById('realPoint').setAttribute('cx', m.geometricPoint.x);
  document.getElementById('realPoint').setAttribute('cy', m.geometricPoint.y);
  document.getElementById('devaPoint').setAttribute('cx', center.x);
  document.getElementById('devaPoint').setAttribute('cy', center.y);
  document.getElementById('radialLine').setAttribute('x1', center.x);
  document.getElementById('radialLine').setAttribute('y1', center.y);
  document.getElementById('radialLine').setAttribute('x2', m.geometricPoint.x);
  document.getElementById('radialLine').setAttribute('y2', m.geometricPoint.y);

}

function bindEconomicEvents() {
  document.querySelectorAll('.field-card input').forEach((input) => {
    input.addEventListener('blur', () => {
      formatInput(input);
      updateEconomicSide();
    });
    input.addEventListener('input', updateEconomicSide);
  });

  document.getElementById('goQuestions').addEventListener('click', () => showPage(state.pages.questions));
  updateEconomicSide();
}


function getLeadData() {
  return {
    name: document.getElementById('leadName')?.value?.trim() || '',
    email: document.getElementById('leadEmail')?.value?.trim() || '',
    whatsapp: document.getElementById('leadWhatsapp')?.value?.trim() || ''
  };
}

function buildSharePayload() {
  if (!state.finalJson) updateResult();

  const lead = getLeadData();
  const payload = {
    ...state.finalJson,
    lead
  };

  const summary = [
    `${captureConfig.emailSubjectPrefix}`,
    '',
    `Nome: ${lead.name || 'não informado'}`,
    `E-mail: ${lead.email || 'não informado'}`,
    `WhatsApp: ${lead.whatsapp || 'não informado'}`,
    '',
    `Índice DEVA: ${payload.devaMetrics.devaIndexPercent}%`,
    `Propensão à renovação: ${payload.devaMetrics.renewalPropensityPercent}%`,
    `Cenário: ${payload.interpretation.scenarioTitle}`,
    `Custo de oportunidade mensal: ${BRL.format(payload.devaMetrics.opportunityCostMonthly || 0)}`,
    `Custo de oportunidade em LTV: ${BRL.format(payload.devaMetrics.opportunityCostLTV || 0)}`,
    '',
    'JSON completo:',
    JSON.stringify(payload, null, 2)
  ].join('\\n');

  return { lead, payload, summary };
}

async function postToEndpoint(payload) {
  if (!captureConfig.endpointUrl) return false;

  const response = await fetch(captureConfig.endpointUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Falha no endpoint');
  return true;
}

function openEmailClient(summary) {
  const subject = encodeURIComponent(`${captureConfig.emailSubjectPrefix}`);
  const body = encodeURIComponent(summary);
  const to = encodeURIComponent(captureConfig.destinationEmail);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

function openWhatsApp(summary) {
  const phone = String(captureConfig.destinationWhatsApp || '').replace(/\\D/g, '');
  const text = encodeURIComponent(summary.slice(0, 3500));
  const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}


function validateLeadData() {
  return isLeadDataValid(getLeadData());
}

function updateSendButtonState() {
  const button = document.getElementById('sendResults');
  const status = document.getElementById('leadStatus');
  if (!button || !status) return;

  const enabled = validateLeadData();
  button.disabled = !enabled;
  status.textContent = enabled
    ? 'Tudo certo. Clique para enviar seus resultados.'
    : 'Preencha nome (3+), e-mail no formato texto@texto e WhatsApp com 8+ caracteres.';
}

function bindNavigationEvents() {
  document.getElementById('backEconomic').addEventListener('click', () => showPage(state.pages.economic));

  document.getElementById('goResult').addEventListener('click', () => {
    updateResult();
    showPage(state.pages.result);
  });

  document.getElementById('backQuestions').addEventListener('click', () => showPage(state.pages.questions));

  ['leadName', 'leadEmail', 'leadWhatsapp'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', updateSendButtonState);
  });

  document.getElementById('sendResults').addEventListener('click', async () => {
    if (!validateLeadData()) {
      updateSendButtonState();
      toast('Preencha os dados corretamente para enviar por WhatsApp.');
      return;
    }

    const { payload } = buildSharePayload();
    const button = document.getElementById('sendResults');
    button.disabled = true;
    button.textContent = 'Enviando...';

    try {
      const response = await fetch('/api/send-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Falha ao enviar');

      toast('Resultados enviados com sucesso.');
      document.getElementById('leadStatus').textContent = 'Resultados enviados. Em breve entraremos em contato.';
      button.textContent = 'Resultados enviados';
    } catch (error) {
      console.error(error);
      toast('Não foi possível enviar agora.');
      document.getElementById('leadStatus').textContent = 'Falha no envio. Verifique a configuração do servidor/API.';
      button.textContent = 'Enviar por WhatsApp';
      updateSendButtonState();
    }
  });

  updateSendButtonState();






}

function init() {
  document.getElementById('app').innerHTML = renderLayout();
  document.getElementById(state.pages.economic).innerHTML = renderEconomicView();
  document.getElementById(state.pages.questions).innerHTML = renderQuestionsView();
  document.getElementById(state.pages.result).innerHTML = renderResultView();

  bindEconomicEvents();
  renderQuestions();
  bindNavigationEvents();
}

init();
