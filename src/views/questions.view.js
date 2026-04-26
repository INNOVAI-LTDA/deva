import { texts } from '../config/texts.pt-BR.js';

export function renderQuestionsView() {
  return `
    <div class="shell">
      <div class="card main-card">
        <h1>${texts.questions.title}</h1>
        <p class="muted">${texts.questions.subtitle}</p>
        <div class="stepper">
          <div class="step done"><span class="dot">✓</span><span>Contexto econômico</span></div><div class="step-line done"></div>
          <div class="step active"><span class="dot">2</span><span>Perguntas por eixo</span></div><div class="step-line"></div>
          <div class="step"><span class="dot">3</span><span>Resultado DEVA</span></div>
        </div>
        <div class="axis-summary">
          <div class="axis-mini"><div class="circle">◎</div><div><h3>Proposto</h3><p class="small muted">Média das respostas</p></div><div class="score" id="propScoreTop">7.7</div></div>
          <div class="axis-mini delivered"><div class="circle">▱</div><div><h3>Entregue</h3><p class="small muted">Média das respostas</p></div><div class="score" id="delScoreTop">5.7</div></div>
          <div class="axis-mini perceived"><div class="circle">♙</div><div><h3>Percebido</h3><p class="small muted">Média das respostas</p></div><div class="score" id="perScoreTop">4.3</div></div>
        </div>
        <h2 style="margin:16px 0 8px">Perguntas de diagnóstico</h2>
        <div id="questionHost" class="q-table"></div>
        <div class="separator"></div>
        <div class="action-row"><button class="btn" id="backEconomic">Voltar</button><button class="btn btn-primary" id="goResult">${texts.questions.continue}</button></div>
      </div>
      <aside class="panel side">
        <div class="side-title">Leitura lateral</div>
        <div class="side-card"><div class="ring blue">i</div><div><h3>Por que isso importa?</h3><p>Cada resposta ajuda a localizar o ponto real do cliente e antecipar o cenário de renovação.</p></div></div>
        <div class="side-card" style="border-color:var(--gold)"><div class="ring" id="distRing">40/100</div><div><h3>Distância entre valores</h3><p>Quanto maior a distância entre promessa, entrega e percepção, maior o risco de desalinhamento.</p></div></div>
        <div class="side-card" style="border-color:var(--orange)"><div class="ring orange">⚠</div><div><h3>Maior gap atual</h3><p id="gapText">Valor percebido abaixo do entregue.</p></div></div>
        <div class="side-card" style="border-color:var(--green)"><div class="ring green">✓</div><div><h3>Ação sugerida</h3><p id="actionText">Reforce checkpoints, devolutivas e evidências de progresso antes da renovação.</p></div></div>
        <div class="side-footer">Escala: 0 a 10 <span class="info-dot">i</span></div>
      </aside>
    </div>
  `;
}
