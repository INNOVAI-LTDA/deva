export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.DIAGNOSIS_TO_EMAIL;
    const from = process.env.DIAGNOSIS_FROM_EMAIL || 'Diagnóstico DEVA <onboarding@resend.dev>';

    if (!apiKey || !to) {
      return res.status(500).json({
        ok: false,
        error: 'Missing RESEND_API_KEY or DIAGNOSIS_TO_EMAIL environment variable'
      });
    }

    const lead = payload.lead || {};
    const metrics = payload.devaMetrics || {};
    const interpretation = payload.interpretation || {};

    const subject = `Novo Diagnóstico DEVA${lead.name ? ` - ${lead.name}` : ''}`;

    const html = `
      <div style="font-family:Arial,sans-serif;color:#10213a;line-height:1.5">
        <h1>Novo Diagnóstico DEVA</h1>

        <h2>Contato</h2>
        <p><strong>Nome:</strong> ${escapeHtml(lead.name || 'Não informado')}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(lead.email || 'Não informado')}</p>
        <p><strong>WhatsApp:</strong> ${escapeHtml(lead.whatsapp || 'Não informado')}</p>

        <h2>Resumo</h2>
        <p><strong>Índice DEVA:</strong> ${safe(metrics.devaIndexPercent)}%</p>
        <p><strong>Propensão à renovação:</strong> ${safe(metrics.renewalPropensityPercent)}%</p>
        <p><strong>Cenário:</strong> ${escapeHtml(interpretation.scenarioTitle || 'Não informado')}</p>
        <p><strong>Custo de oportunidade mensal:</strong> ${formatCurrency(metrics.opportunityCostMonthly)}</p>
        <p><strong>Custo de oportunidade em LTV:</strong> ${formatCurrency(metrics.opportunityCostLTV)}</p>

        <h2>JSON completo</h2>
        <pre style="white-space:pre-wrap;background:#f6f8fa;padding:16px;border-radius:8px;border:1px solid #ddd">${escapeHtml(JSON.stringify(payload, null, 2))}</pre>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ ok: false, error: 'Email provider error', detail: data });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Unexpected error' });
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safe(value) {
  return value ?? '—';
}

function formatCurrency(value) {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
