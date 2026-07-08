# 📊 Financial Statement Analyzer

Enter or upload an **income statement** and **balance sheet**, and instantly get
the standard financial ratios — **liquidity, profitability, leverage, and
efficiency** — each rated against rule-of-thumb benchmarks, plus a ranked list
of **plain-English insights** (liquidity risk, leverage, thin interest coverage,
strong returns, and more).

A natural spin-off of my full-stack finance work: the domain analysis I know,
turned into a tool.

Built with **React + Vite**. The ratio and insight engines are written from
first principles and fully unit-tested.

## ✨ Features

- **Three ways to get data in:** type it, upload a CSV, or load a sample company
- **Standard ratios**, grouped and rated:
  - *Liquidity* — current, quick, cash
  - *Profitability* — gross / operating / net margin, ROA, ROE
  - *Leverage* — debt-to-equity, debt ratio, interest coverage
  - *Efficiency* — asset & inventory turnover, days sales outstanding (informational)
- **Insight engine** — ranked observations by severity (critical → info)
- **Derived subtotals** (gross profit, EBIT) computed live so inputs can't contradict themselves
- **Robust CSV import** — case-insensitive label matching, common aliases, handles `$`, commas, and `(parentheses)` negatives
- Divide-by-zero safe, responsive, dark UI

## 🧮 A few of the ratios

| Ratio | Formula | Rule of thumb |
|---|---|---|
| Current ratio | Current assets ÷ current liabilities | ≥ 1.5 healthy |
| Quick ratio | (Current assets − inventory) ÷ current liabilities | ≥ 1.0 healthy |
| Net margin | Net income ÷ revenue | ≥ 10% strong |
| Return on equity | Net income ÷ equity | ≥ 15% strong |
| Debt-to-equity | Total liabilities ÷ equity | ≤ 1.0 conservative |
| Interest coverage | EBIT ÷ interest expense | ≥ 3× safe |

> Thresholds are general guides — real analysis is always industry-relative.

## 🚀 Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm test         # run the unit tests
```

## 🗂️ Project structure

```
src/
  lib/
    model.js          # statement model + derived subtotals (gross profit, EBIT)
    ratios.js         # pure ratio engine with rating logic
    ratios.test.js
    insights.js       # rule-based insight generation, ranked by severity
    insights.test.js
    parseCsv.js        # dependency-free CSV import + label matching
    format.js          # money / ratio formatting
    sampleData.js      # sample company + CSV template
  components/
    StatementInput.jsx # data entry + import controls
    RatioGrid.jsx      # grouped, rated ratio cards
    Insights.jsx       # ranked insight list
  App.jsx
```

## 🧪 Testing

The finance logic is covered by unit tests — ratio values and ratings against a
known company, divide-by-zero safety, and the insight engine's severity rules:

```bash
npm test
```

---

*A finance-meets-code project — the domain I know, expressed in software.*
