import { chromium } from 'playwright';

const apiBase = 'http://localhost:4000';
const baseUrl = process.env.VITE_DEV_URL || 'http://localhost:5173';
const lifetimeByLevel = { green: 120, orange: 45, red: 14 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const assert = (cond, message) => {
  if (!cond) throw new Error(message);
};
const extractNumber = (text) => {
  const cleaned = `${text ?? ''}`.replace(/,/g, '');
  const match = cleaned.match(/(-?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : NaN;
};

async function updateDashboard(patch) {
  const res = await fetch(`${apiBase}/api/profile/dashboard`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error(`Dashboard update failed: ${res.status} ${await res.text()}`);
  }
}

async function readEconomicChurn(expectedLevel) {
  const res = await fetch(`${apiBase}/api/profile/dashboard/economic-churn`);
  if (!res.ok) {
    throw new Error(`Economic churn fetch failed: ${res.status} ${await res.text()}`);
  }
  const payload = await res.json();
  if (payload.level !== expectedLevel) {
    throw new Error(`Level mismatch: expected ${expectedLevel}, got ${payload.level}`);
  }
  return payload;
}

async function readChurnUi(page, expectedLevel, expectedLifetimeDays, balance) {
  await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
  await page.waitForLoadState('networkidle');

  const badge = page.getByTestId('churn-badge');
  await badge.waitFor({ state: 'visible', timeout: 5000 });
  const badgeText = `${(await badge.textContent()) ?? ''}`.trim();
  assert(badgeText.toLowerCase().includes(expectedLevel), `UI badge mismatch: expected ${expectedLevel}, got "${badgeText}"`);

  const lifetime = page.getByTestId('churn-lifetime');
  await lifetime.waitFor({ state: 'visible', timeout: 5000 });
  const lifetimeText = `${(await lifetime.textContent()) ?? ''}`.trim();
  const lifetimeNumber = parseInt(lifetimeText.match(/\d+/)?.[0] ?? 'NaN', 10);
  assert(lifetimeNumber === expectedLifetimeDays, `UI lifetime mismatch: expected ${expectedLifetimeDays}, got "${lifetimeText}"`);

  const value = page.getByTestId('churn-value');
  await value.waitFor({ state: 'visible', timeout: 5000 });
  const valueText = `${(await value.textContent()) ?? ''}`.trim();
  const valueNumber = extractNumber(valueText);
  assert(valueText.toLowerCase().includes('usd'), `UI value missing USD: got "${valueText}"`);
  if (balance > 0) {
    assert(!Number.isNaN(valueNumber) && valueNumber > 0, `UI value not > 0: got "${valueText}"`);
  }

  return { badgeText, lifetimeText, valueText, lifetimeNumber, valueNumber };
}

async function runCase(testCase, browser) {
  const { label, expectedLevel, patch } = testCase;
  const expectedLifetimeDays = lifetimeByLevel[expectedLevel];
  assert(expectedLifetimeDays, `Unknown expected lifetime for level ${expectedLevel}`);

  await updateDashboard(patch);
  await sleep(200);

  const data = await readEconomicChurn(expectedLevel);

  const page = await browser.newPage();
  let ui;
  try {
    ui = await readChurnUi(page, expectedLevel, expectedLifetimeDays, patch.balance ?? 0);
  } finally {
    await page.close();
  }

  return { label, status: 'PASS', data, ui };
}

const cases = [
  {
    label: 'CASE A',
    expectedLevel: 'green',
    patch: {
      onboarding: { progressPct: 80 },
      dailyPL: 100,
      balance: 50000,
      equity: 49000,
      openPositions: [
        { symbol: 'BTCUSD', side: 'Buy', size: 0.2, entry: 91800, pl: 420 },
        { symbol: 'NAS100', side: 'Sell', size: 1, entry: 25640, pl: -180 },
      ],
    },
  },
  {
    label: 'CASE B',
    expectedLevel: 'orange',
    patch: {
      onboarding: { progressPct: 80 },
      dailyPL: -50,
      balance: 50000,
      equity: 49000,
      openPositions: [
        { symbol: 'BTCUSD', side: 'Buy', size: 0.2, entry: 91800, pl: 420 },
        { symbol: 'NAS100', side: 'Sell', size: 1, entry: 25640, pl: -180 },
      ],
    },
  },
  {
    label: 'CASE C',
    expectedLevel: 'red',
    patch: {
      onboarding: { progressPct: 20 },
      dailyPL: -200,
      balance: 50000,
      equity: 30000,
      openPositions: [
        { symbol: 'BTCUSD', side: 'Buy', size: 0.2, entry: 91800, pl: 420 },
        { symbol: 'NAS100', side: 'Sell', size: 1, entry: 25640, pl: -180 },
        { symbol: 'EURUSD', side: 'Buy', size: 1.2, entry: 1.09, pl: -50 },
        { symbol: 'XAUUSD', side: 'Buy', size: 0.5, entry: 2410, pl: 95 },
      ],
    },
  },
];

const main = async () => {
  const results = [];
  const browser = await chromium.launch({ headless: true });

  try {
    for (const testCase of cases) {
      try {
        const result = await runCase(testCase, browser);
        results.push(result);
        const { level, estimatedLifetimeDays, estimatedEconomicValue, metrics } = result.data;
        console.log(`${testCase.label}: PASS`, JSON.stringify({ level, estimatedLifetimeDays, estimatedEconomicValue, metrics }));
        console.log(
          `${testCase.label} (CHURN UI): PASS`,
          JSON.stringify({
            badge: result.ui.badgeText,
            lifetime: result.ui.lifetimeText,
            value: result.ui.valueText,
          })
        );
      } catch (err) {
        results.push({ label: testCase.label, status: 'FAIL', error: err.message });
        console.error(`${testCase.label}: FAIL -> ${err.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.length - passCount;
  console.log(`SUMMARY: ${passCount} passed, ${failCount} failed`);

  if (failCount > 0) {
    process.exit(1);
  }
};

main();
