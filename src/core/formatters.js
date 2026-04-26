export const BRL = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL', maximumFractionDigits:0});
export const NUM = new Intl.NumberFormat('pt-BR', {maximumFractionDigits:1});

export function onlyNum(value) {
  const normalized = String(value || '').replace(/[^0-9.,-]/g, '').replace(/\./g, '').replace(',', '.');
  return normalized === '' ? null : Number(normalized);
}

export function formatInput(el) {
  const type = el.dataset.type;
  const n = onlyNum(el.value);
  if (n === null || Number.isNaN(n)) return;

  if (type === 'money') el.value = BRL.format(n);
  if (type === 'percent') el.value = `${NUM.format(n)}%`;
  if (type === 'months') el.value = `${NUM.format(n)} meses`;
  if (type === 'int') el.value = String(Math.round(n));
}

export function toast(message) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}
