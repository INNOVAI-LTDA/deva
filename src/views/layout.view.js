import { brand } from '../config/brand.default.js';

export function renderLayout() {
  return `
    <div class="diagnosis-app">
      <aside class="diagnosis-sidebar">
        <div class="brand">
          <img src="${brand.logoPath}" alt="${brand.name}">
          <div>
            <div class="brand-title">${brand.name}</div>
            <div class="brand-sub">${brand.subtitle}</div>
          </div>
        </div>

        <div class="diagnosis-side-card active">
          <span class="nav-ico">☑</span>
          <div>
            <strong>Diagnóstico DEVA</strong>
            <small>Prévia de renovação</small>
          </div>
        </div>

        <div class="flow-card">
          <strong>Fluxo do diagnóstico</strong>
          <ol>
            <li>Contexto econômico</li>
            <li>Perguntas por eixo</li>
            <li>Resultado DEVA</li>
            <li>Envio do diagnóstico</li>
          </ol>
        </div>

        <div class="about">
          <strong>Distância Entre Valores</strong>
          <p>Entenda a distância entre valor proposto, valor entregue e valor percebido antes da renovação.</p>
        </div>
      </aside>

      <main class="diagnosis-main">
        <section id="economicPage" class="page active"></section>
        <section id="questionsPage" class="page"></section>
        <section id="resultPage" class="page"></section>
      </main>
    </div>
  `;
}
