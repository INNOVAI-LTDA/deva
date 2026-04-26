import { texts } from '../config/texts.pt-BR.js';

export function renderResultView() {
  return `
    <div class="shell">
      <div class="card main-card">
        <h1>${texts.result.title}</h1>
        <p class="muted">${texts.result.subtitle}</p>
        <div class="stepper">
          <div class="step done"><span class="dot">✓</span><span>Contexto econômico</span></div><div class="step-line done"></div>
          <div class="step done"><span class="dot">✓</span><span>Perguntas por eixo</span></div><div class="step-line done"></div>
          <div class="step active"><span class="dot">3</span><span>Resultado DEVA</span></div>
        </div>
        <div class="metric-grid">
          <div class="panel metric-card"><div class="metric-icon">▥</div><div><h3>Índice DEVA</h3><div class="metric-value" id="resIndex">72%</div></div></div>
          <div class="panel metric-card"><div class="metric-icon" style="border-color:var(--blue);color:var(--blue)">♙</div><div><h3>Propensão à renovação</h3><div class="metric-value" id="resRenewal" style="color:#dce6f2">68%</div></div></div>
          <div class="panel metric-card"><div class="metric-icon" style="border-color:var(--orange);color:var(--orange)">⌛</div><div><h3>Custo de oportunidade mensal</h3><div class="metric-value" id="resOppMonth" style="font-size:30px;color:#dce6f2">R$ 67.200</div></div></div>
          <div class="panel metric-card"><div class="metric-icon" style="border-color:var(--purple);color:var(--purple)">$</div><div><h3>Custo de oportunidade em LTV</h3><div class="metric-value" id="resOppLtv" style="font-size:30px;color:#dce6f2">R$ 241.920</div></div></div>
        </div>
        <div class="result-middle">
          <div class="panel map-panel">
            <h2>Mapa geométrico DEVA</h2>
            <div class="triangle-wrap">
              <svg class="deva-svg" id="devaSvg" viewBox="0 0 560 260">
                <defs><filter id="glow"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#6aa8ff" flood-opacity=".55"/></filter></defs>
                <g id="grid"></g><g id="labels"></g>
                <line id="radialLine" x1="280" y1="138" x2="310" y2="102" stroke="#d9e2ee" stroke-width="2" stroke-dasharray="6 5"/>
                <circle id="devaPoint" cx="280" cy="138" r="7" fill="#aab5c5" stroke="#f7f9fc" stroke-width="1.5"/>
                <circle id="realPoint" cx="310" cy="102" r="8" fill="#f5bd42" stroke="#ffe6a3" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="legend"><span><i class="deva"></i>Ponto DEVA</span><span><i class="real"></i>Ponto real</span><span><i class="line"></i>Distância radial</span></div>
            <div class="radial-text">Distância radial: <span id="radialText">0,28</span></div>
          </div>
          <div class="panel read-panel">
            <h2>📖 Leitura do diagnóstico</h2>
            <div class="read-box">
              Cenário identificado: <b id="scenarioTitle">Valor invisível</b><br><br>
              <span id="scenarioText">A entrega e a proposta existem, mas o cliente ainda percebe menos valor do que recebe.</span>
            </div>
          </div>
        </div>
        <div class="bottom-result">
          <div class="panel list-panel"><h2>⚠ Pontos de atenção</h2><ul id="attentionList"></ul></div>
          <div class="panel list-panel"><h2>🎯 Ações diretas</h2><ul id="actionsList"></ul></div>
        </div>
        <div class="lead-panel panel">
          <div>
            <h2>Receber análise e próximos passos</h2>
            <p class="muted">Informe um contato para enviar o diagnóstico e facilitar o convite para uma call.</p>
          </div>
          <div class="lead-grid">
            <input id="leadName" placeholder="Nome">
            <input id="leadEmail" placeholder="E-mail">
            <input id="leadWhatsapp" placeholder="WhatsApp">
          </div>
          <div class="lead-actions">
            <button class="btn" id="backQuestions">Voltar</button>
            <button class="btn btn-primary" id="sendResults" disabled>Enviar resultados</button>
          </div>
          <p class="lead-note" id="leadStatus">Preencha nome, e-mail e WhatsApp para habilitar o envio.</p>
        </div>
      </div>
      <aside class="panel side">
        <div class="side-title">Leitura lateral</div>
        <div class="side-card"><div class="ring blue">i</div><div><h3>O que esse resultado indica?</h3><p>O DEVA mede a distância entre o valor proposto, o valor entregue e o valor percebido pelo cliente. Quanto maior a distância, maior o risco de não renovação.</p></div></div>
        <div class="side-card"><div class="ring orange">⚠</div><div><h3>Maior gap atual</h3><p id="resGap">Valor percebido abaixo do entregue.</p></div></div>
        <div class="side-card"><div class="ring green">💡</div><div><h3>Recomendação imediata</h3><p id="resRec">Reforce checkpoints, devolutivas e evidências antes da renovação.</p></div></div>
        <div class="side-card"><div class="ring purple">♢</div><div><h3>Confiança da análise</h3><div class="big" id="resConfidence">Moderada</div></div></div>
      </aside>
    </div>
  `;
}
