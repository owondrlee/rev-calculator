/**
 * Revenue Leak Calculator
 * Pure functions for calculations; UI binding at bottom.
 */

/* --- Constants --- */
const LEADS_INCREASE_REL = 0.1;
const CONVERSION_INCREASE_REL = 0.2;
const WEB_CONVERSION_INCREASE_REL = 0.15;

const RESPONSE_TIME_PENALTY = {
  0: 0.0,   // Instant (<5 min)
  1: 0.05,  // Within 1 hour
  2: 0.1,   // Same day
  3: 0.2,   // 1-2 days
  4: 0.3,   // 3+ days
};

/* --- Pure calculation functions --- */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function conversionRate(deals, leads) {
  if (leads <= 0) return 0;
  return deals / leads;
}

function currentRevenueEstimate(deals, avgRevenuePerCustomer) {
  return deals * avgRevenuePerCustomer;
}

function projectedLeads(leads) {
  return leads * (1 + LEADS_INCREASE_REL);
}

function projectedConversion(conversion, responseTimeKey) {
  const penalty = RESPONSE_TIME_PENALTY[responseTimeKey] ?? 0;
  return clamp(conversion * (1 + CONVERSION_INCREASE_REL - penalty), 0, 1);
}

function projectedDeals(projectedLeadsVal, projectedConversionVal) {
  return projectedLeadsVal * projectedConversionVal;
}

function projectedRevenue(projectedDealsVal, avgRevenuePerCustomer) {
  return projectedDealsVal * avgRevenuePerCustomer;
}

function leakage(projectedRevenueVal, currentRevenueVal) {
  return Math.max(projectedRevenueVal - currentRevenueVal, 0);
}

function splitLeakage(leakageVal, responseTimeKey) {
  const a = RESPONSE_TIME_PENALTY[responseTimeKey] ?? 0;
  const b = CONVERSION_INCREASE_REL;
  const c = LEADS_INCREASE_REL;
  const total = a + b + c;
  if (total <= 0) return [leakageVal / 3, leakageVal / 3, leakageVal / 3];
  return [
    (a / total) * leakageVal,
    (b / total) * leakageVal,
    (c / total) * leakageVal,
  ];
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', maximumFractionDigits: 0 }).format(val);
}

function formatPercent(val) {
  return `${Math.round(val * 100)}%`;
}

/* --- UI state --- */
let mode = 'calm';

/* --- Read inputs --- */
function getInputs() {
  return {
    leads: parseInt(document.getElementById('leads').value, 10) || 0,
    deals: parseInt(document.getElementById('deals').value, 10) || 0,
    avgRevenuePerCustomer: parseInt(document.getElementById('avg-revenue').value, 10) || 0,
    traffic: parseInt(document.getElementById('traffic').value, 10) || 0,
    responseTimeKey: parseInt(document.getElementById('response-time').value, 10) || 0,
  };
}

const MAX_REVENUE = 100000;

/* --- Update current metrics (live) --- */
function updateCurrentMetrics() {
  const { leads, deals, avgRevenuePerCustomer } = getInputs();
  const conv = conversionRate(deals, leads);
  const rev = currentRevenueEstimate(deals, avgRevenuePerCustomer);

  document.getElementById('conversion-display').textContent = formatPercent(conv);
  document.getElementById('revenue-display').textContent = formatCurrency(rev);
}

/* --- Update bucket fill & tap (live) --- */
function updateBucketVisual(revenue) {
  const fillHeight = Math.min(100, (revenue / MAX_REVENUE) * 100);
  const streamIntensity = Math.min(1, revenue / MAX_REVENUE);

  const fillEl = document.getElementById('bucket-fill');
  const tapEl = document.getElementById('tap-stream');

  fillEl.style.height = `${fillHeight}%`;
  tapEl.style.setProperty('--stream-intensity', streamIntensity);
  tapEl.classList.toggle('active', revenue > 0);

  document.getElementById('label-flowing').textContent = formatCurrency(revenue);
  document.getElementById('label-captured').textContent = formatCurrency(revenue);
}

/* --- Update slider displays --- */
function updateSliderDisplays() {
  const monthlyRev = parseInt(document.getElementById('monthly-revenue').value, 10);
  const avgRev = parseInt(document.getElementById('avg-revenue').value, 10);

  document.getElementById('monthly-revenue-value').textContent = formatCurrency(monthlyRev);
  document.getElementById('avg-revenue-value').textContent = formatCurrency(avgRev);
}

/* --- Analyze: run calculations, animate, reveal --- */
function runAnalyze() {
  const { leads, deals, avgRevenuePerCustomer, responseTimeKey } = getInputs();

  const conv = conversionRate(deals, leads);
  const currentRev = currentRevenueEstimate(deals, avgRevenuePerCustomer);

  const projLeads = projectedLeads(leads);
  const projConv = projectedConversion(conv, responseTimeKey);
  const projDeals = projectedDeals(projLeads, projConv);
  const projRev = projectedRevenue(projDeals, avgRevenuePerCustomer);
  const leakVal = leakage(projRev, currentRev);

  const [leak1, leak2, leak3] = splitLeakage(leakVal, responseTimeKey);

  const holesEl = document.getElementById('bucket-holes');
  const resultsEl = document.getElementById('results-section');

  holesEl.setAttribute('aria-hidden', 'false');
  resultsEl.setAttribute('aria-hidden', 'false');

  holesEl.classList.add('revealed');
  resultsEl.classList.add('visible');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const leakIntensity = Math.min(1, leakVal / Math.max(currentRev, 1));
  holesEl.style.setProperty('--leak-intensity', leakIntensity);

  document.getElementById('label-captured').textContent = formatCurrency(currentRev);
  document.getElementById('label-leaking').textContent = formatCurrency(leakVal);
  document.getElementById('label-leaking-wrap').classList.add('visible');

  document.getElementById('leakage-total').textContent = formatCurrency(leakVal);

  const maxBar = Math.max(currentRev, projRev, 1);
  document.getElementById('bar-current').style.width = `${(currentRev / maxBar) * 100}%`;
  document.getElementById('bar-projected').style.width = `${(projRev / maxBar) * 100}%`;
  document.getElementById('bar-current-value').textContent = formatCurrency(currentRev);
  document.getElementById('bar-projected-value').textContent = formatCurrency(projRev);

  const hasLeakage = leakVal > 0;
  const leakCardsEl = document.getElementById('leak-cards');
  const zeroMsg = document.getElementById('zero-leakage-message');
  leakCardsEl.classList.toggle('zero-leakage', !hasLeakage);
  zeroMsg.hidden = hasLeakage;
  leakCardsEl.querySelectorAll('.leak-card').forEach((card) => {
    card.hidden = !hasLeakage;
  });

  document.getElementById('leak-card-1-amount').textContent = formatCurrency(leak1);
  document.getElementById('leak-card-2-amount').textContent = formatCurrency(leak2);
  document.getElementById('leak-card-3-amount').textContent = formatCurrency(leak3);

  // Mode toggle: show calm or savage suggestions
  document.querySelectorAll('.leak-card-suggestion.calm').forEach((el) => {
    el.hidden = mode === 'savage';
  });
  document.querySelectorAll('.leak-card-suggestion.savage').forEach((el) => {
    el.hidden = mode === 'calm';
  });
}

/* --- Mode toggle --- */
function setMode(newMode) {
  mode = newMode;
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  // Re-apply if results already visible
  document.querySelectorAll('.leak-card-suggestion.calm').forEach((el) => {
    el.hidden = mode === 'savage';
  });
  document.querySelectorAll('.leak-card-suggestion.savage').forEach((el) => {
    el.hidden = mode === 'calm';
  });
}

/* --- Bind events --- */
function bind() {
  const inputs = ['leads', 'deals', 'avg-revenue', 'traffic', 'monthly-revenue', 'response-time'];
  inputs.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      updateSliderDisplays();
      updateCurrentMetrics();
      const { deals, avgRevenuePerCustomer } = getInputs();
      updateBucketVisual(currentRevenueEstimate(deals, avgRevenuePerCustomer));
    });
  });

  document.getElementById('btn-analyze').addEventListener('click', runAnalyze);

  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });
}

/* --- Init --- */
updateSliderDisplays();
updateCurrentMetrics();
const { deals, avgRevenuePerCustomer } = getInputs();
updateBucketVisual(currentRevenueEstimate(deals, avgRevenuePerCustomer));
bind();
