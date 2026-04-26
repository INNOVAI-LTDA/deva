import { texts } from '../config/texts.pt-BR.js';

export function renderEconomicView() {
  return `
    <div class="shell">
      <div class="card main-card">
        <h1>${texts.economic.title}</h1>
        <p class="muted">${texts.economic.subtitle}</p>
        <div class="stepper">
          <div class="step active"><span class="dot">1</span><span>Contexto econômico</span></div><div class="step-line"></div>
          <div class="step"><span class="dot">2</span><span>Perguntas por eixo</span></div><div class="step-line"></div>
          <div class="step"><span class="dot">3</span><span>Resultado DEVA</span></div>
        </div>
        <div class="separator"></div>
        <div class="economic-grid">
          <div class="field-card"><div class="field-head">Ticket médio mensal <span class="info-dot">i</span></div><input id="ticket" data-type="money" placeholder="Ex: R$ 4.800"></div>
          <div class="field-card"><div class="field-head">Clientes ativos <span class="info-dot">i</span></div><input id="activeClients" data-type="int" placeholder="Ex: 120"></div>
          <div class="field-card"><div class="field-head">Clientes em janela de renovação <span class="info-dot">i</span></div><input id="renewalClients" data-type="int" placeholder="Ex: 35"></div>
          <div class="field-card"><div class="field-head">Tempo médio de vida <span class="info-dot">i</span></div><input id="lifetime" data-type="months" placeholder="Ex: 18 meses"></div>
          <div class="field-card"><div class="field-head">Taxa atual de renovação <span class="info-dot">i</span></div><input id="renewalRate" data-type="percent" placeholder="Ex: 62%"></div>
          <div class="field-card"><div class="field-head">Margem média <span class="muted">(Opcional)</span> <span class="info-dot">i</span></div><input id="margin" data-type="percent" placeholder="Ex: 45%"></div>
          <div class="field-card field-wide"><div class="field-head">CAC médio / custo de reposição <span class="muted">(Opcional)</span> <span class="info-dot">i</span></div><input id="cac" data-type="money" placeholder="Ex: R$ 600"></div>
        </div>
        <div class="separator"></div>
        <div class="action-row"><button class="btn">Voltar</button><button class="btn btn-primary" id="goQuestions">${texts.economic.continue}</button></div>
      </div>
      <aside class="panel side">
        <div class="side-title">Impacto econômico estimado <span class="info-dot">i</span></div>
        <div class="side-card"><div class="ring">▥</div><div><h3>Visibilidade econômica</h3><div class="big" id="visibilityLabel">—</div><p id="visibilityDesc">Aguardando dados</p></div></div>
        <div class="side-card"><div class="ring blue">$</div><div><h3>Receita recorrente mensal</h3><div class="big" id="mrrLabel">—</div><p id="mrrDesc">Aguardando dados</p></div></div>
        <div class="side-card"><div class="ring orange">⌛</div><div><h3>Custo de oportunidade</h3><div class="big" id="oppLabel">—</div><p id="oppDesc">Aguardando dados</p></div></div>
        <div class="side-card"><div class="ring purple">♢</div><div><h3>Risco por baixa visibilidade</h3><div class="big" id="riskLabel">—</div><p id="riskDesc">Aguardando dados</p></div></div>
        <div class="side-card prelim"><div class="ring">💡</div><div><h3>Leitura preliminar</h3><p id="prelimText">Sem dados-chave, o custo de oportunidade pode estar sendo subestimado.</p></div></div>
        <div class="side-footer">Preencha os campos para estimar impacto econômico e custo de oportunidade.</div>
      </aside>
    </div>
  `;
}
