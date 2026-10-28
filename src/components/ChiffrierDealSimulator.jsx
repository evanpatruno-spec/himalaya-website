import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Sliders, CheckCircle2, ArrowRight, Sparkles, TrendingUp, Building2 } from 'lucide-react';
import { tr, pickLang } from '../data/translations';
import { submitLeadToProspection } from '../utils/prospectionBridge';

// Programmes institutionnels du Chiffrier Himalaya (Conventionnel & SCHL APH Select)
export const HIMALAYA_CHIFRIER_PROGRAMS = [
  {
    key: 'conv_75',
    label: 'Conventionnel 75 %',
    label_en: 'Conventional 75%',
    label_es: 'Convencional 75 %',
    label_zh: '常规商业按揭 75%',
    badge: 'Amort. 25 ans • RPV 75 % • RCD 1.20x',
    amortYears: 25,
    maxLtv: 0.75,
    minDcr: 1.20,
    schlPremium: 0,
    defaultRate: 4.89
  },
  {
    key: 'schl_85',
    label: 'SCHL Standard 85 %',
    label_en: 'CMHC Standard 85%',
    label_es: 'SCHL Estándar 85 %',
    label_zh: 'CMHC 标准多户保险 85%',
    badge: 'Amort. 30 ans • RPV 85 % • RCD 1.30x',
    amortYears: 30,
    maxLtv: 0.85,
    minDcr: 1.30,
    schlPremium: 0.0475,
    defaultRate: 4.19
  },
  {
    key: 'aph_50',
    label: 'APH Select 50 pts',
    label_en: 'MLI Select 50 pts',
    label_es: 'APH Select 50 pts',
    label_zh: 'APH Select 50分 (40年)',
    badge: 'Amort. 40 ans • RPV 85 % • RCD 1.10x',
    amortYears: 40,
    maxLtv: 0.85,
    minDcr: 1.10,
    schlPremium: 0.0525,
    defaultRate: 4.09
  },
  {
    key: 'aph_70',
    label: 'APH Select 70 pts',
    label_en: 'MLI Select 70 pts',
    label_es: 'APH Select 70 pts',
    label_zh: 'APH Select 70分 (45年)',
    badge: 'Amort. 45 ans • RPV 85 % • RCD 1.10x',
    amortYears: 45,
    maxLtv: 0.85,
    minDcr: 1.10,
    schlPremium: 0.055,
    defaultRate: 4.05
  },
  {
    key: 'aph_100',
    label: 'APH Select 100 pts',
    label_en: 'MLI Select 100 pts',
    label_es: 'APH Select 100 pts',
    label_zh: 'APH Select 100分 (50年 • 95%)',
    badge: 'Amort. 50 ans • RPV 95 % • RCD 1.10x',
    amortYears: 50,
    maxLtv: 0.95,
    minDcr: 1.10,
    schlPremium: 0.0575,
    defaultRate: 3.99
  }
];

// Calculateur IRR (TRI) Newton-Raphson + Dichotomie identique à Himalaya Chiffrier
function computeIRR(cashflows, guess = 0.1) {
  if (!cashflows || cashflows.length < 2) return null;
  let hasPos = false;
  let hasNeg = false;
  for (const v of cashflows) {
    if (v > 0) hasPos = true;
    if (v < 0) hasNeg = true;
  }
  if (!hasPos || !hasNeg) return null;

  let low = -0.5;
  let high = 1.5;
  const npv = (r) => cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + r, t), 0);
  let fLow = npv(low);
  let fHigh = npv(high);
  if (fLow * fHigh > 0) return guess;

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const fMid = npv(mid);
    if (Math.abs(fMid) < 1e-6) return mid;
    if (fLow * fMid < 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }
  return (low + high) / 2;
}

// Taxe de Bienvenue officielle Québec / Montréal (issue de Himalaya Chiffrier)
export function calculateWelcomeTaxChiffrier(prix, isMontreal = false) {
  if (!prix || prix <= 0) return 0;
  const brackets = isMontreal
    ? [
        { limit: 61500, rate: 0.005 },
        { limit: 307800, rate: 0.01 },
        { limit: 552300, rate: 0.015 },
        { limit: 1104700, rate: 0.02 },
        { limit: 2136500, rate: 0.025 },
        { limit: 3113000, rate: 0.035 },
        { limit: Infinity, rate: 0.04 }
      ]
    : [
        { limit: 61500, rate: 0.005 },
        { limit: 307800, rate: 0.01 },
        { limit: Infinity, rate: 0.015 }
      ];

  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (prix > prev) {
      const slice = Math.min(prix, b.limit) - prev;
      tax += slice * b.rate;
      prev = b.limit;
    } else {
      break;
    }
  }
  return Math.round(tax);
}

function parseSpecMoney(val) {
  if (!val) return 0;
  const cleaned = String(val).replace(/[^\d.,]/g, '').replace(/\s+/g, '');
  const num = parseFloat(cleaned.replace(',', '.'));
  // Pour "180 137 $", garder uniquement les chiffres
  const digitsOnly = Number(String(val).replace(/[^\d]/g, ''));
  return digitsOnly > 0 ? digitsOnly : (isNaN(num) ? 0 : num);
}

function extractUnitsFromDeal(deal) {
  if (!deal) return 6;
  const rawUnits = deal.specs?.["Nombre d'unités au total"] || deal.specs?.['Nombre de chambres'];
  if (rawUnits) {
    const n = parseInt(String(rawUnits).replace(/[^\d]/g, ''), 10);
    if (n > 0 && n <= 1000) return n;
  }
  const descMatch = String(deal.description || '').match(/(\d{1,3})\s*(?:unit[eé]s|logements|portes|chambres|chalets|cc)/i);
  if (descMatch) {
    const parsed = parseInt(descMatch[1], 10);
    if (parsed > 0 && parsed <= 600) return parsed;
  }
  return 8;
}

export default function ChiffrierDealSimulator({
  deal,
  lang = 'FR',
  compact = false,
  onOpenFullChiffrier
}) {
  const defaultPrice = Math.max(100000, Math.round(Number(deal?.price) || 1250000));
  const defaultMunTax = useMemo(() => {
    const parsed = parseSpecMoney(deal?.specs?.['Taxes municipales']);
    return parsed > 0 ? parsed : Math.round(defaultPrice * 0.0085);
  }, [deal, defaultPrice]);

  const defaultScolTax = useMemo(() => {
    const parsed = parseSpecMoney(deal?.specs?.['Taxes scolaires']);
    return parsed > 0 ? parsed : Math.round(defaultPrice * 0.0008);
  }, [deal, defaultPrice]);

  const defaultUnits = useMemo(() => extractUnitsFromDeal(deal), [deal]);

  const [programKey, setProgramKey] = useState('conv_75');
  const [prixAchat, setPrixAchat] = useState(defaultPrice);
  const [nbPortes, setNbPortes] = useState(defaultUnits);
  const [revenuBrut, setRevenuBrut] = useState(() => Math.round(defaultPrice * 0.092));
  const [tauxInoccupation, setTauxInoccupation] = useState(2.5);
  const [taxesMun, setTaxesMun] = useState(defaultMunTax);
  const [taxesScol, setTaxesScol] = useState(defaultScolTax);
  const [autresDepenses, setAutresDepenses] = useState(() => Math.round(defaultPrice * 0.014));
  const [interestRate, setInterestRate] = useState(4.89);
  const [bpvAmount, setBpvAmount] = useState(0);
  const [bpvRate, setBpvRate] = useState(5.5);
  const [showAdvanced, setShowAdvanced] = useState(!compact);
  const [targetIrr, setTargetIrr] = useState(15);
  const [leadSaved, setLeadSaved] = useState(false);

  useEffect(() => {
    const p = Math.max(100000, Math.round(Number(deal?.price) || 1250000));
    setPrixAchat(p);
    setRevenuBrut(Math.round(p * 0.092));
    const mun = parseSpecMoney(deal?.specs?.['Taxes municipales']);
    setTaxesMun(mun > 0 ? mun : Math.round(p * 0.0085));
    const scol = parseSpecMoney(deal?.specs?.['Taxes scolaires']);
    setTaxesScol(scol > 0 ? scol : Math.round(p * 0.0008));
    setAutresDepenses(Math.round(p * 0.014));
    setNbPortes(extractUnitsFromDeal(deal));
  }, [deal?.id, deal?.mls_number, deal?.price]);

  const activeProgram = useMemo(
    () => HIMALAYA_CHIFRIER_PROGRAMS.find(p => p.key === programKey) || HIMALAYA_CHIFRIER_PROGRAMS[0],
    [programKey]
  );

  const handleSelectProgram = (prog) => {
    setProgramKey(prog.key);
    setInterestRate(prog.defaultRate);
  };

  const isMontreal = useMemo(() => {
    const loc = `${deal?.city || ''} ${deal?.region || ''}`;
    return /montr[eé]al/i.test(loc);
  }, [deal]);

  // Moteur de calcul financier & SCHL APH Select
  const metrics = useMemo(() => {
    const revEffectif = revenuBrut * (1 - tauxInoccupation / 100);
    const totalDepenses = Number(taxesMun) + Number(taxesScol) + Number(autresDepenses);
    const rne = Math.max(0, revEffectif - totalDepenses);

    // Capitalisation semi-annuelle canadienne
    const rMonth = Math.pow(1 + (interestRate / 100) / 2, 1 / 6) - 1;
    const nMonths = activeProgram.amortYears * 12;
    const annuityFactor = rMonth > 0 ? (1 - Math.pow(1 + rMonth, -nMonths)) / rMonth : nMonths;

    // 1. Contrainte RPV sur Prix d'achat / Valeur économique
    const maxLoanByLtv = prixAchat * activeProgram.maxLtv;

    // 2. Contrainte RCD (Ratio de couverture de la dette) exigée par le prêteur / SCHL
    const maxAnnualDebtService = rne / activeProgram.minDcr;
    const maxMonthlyPmtByDcr = maxAnnualDebtService / 12;
    const maxLoanByDcr = Math.max(0, maxMonthlyPmtByDcr * annuityFactor);

    // Prêt de base autorisé (le plus restrictif entre RPV et RCD)
    const baseLoan = Math.round(Math.min(maxLoanByLtv, maxLoanByDcr));
    const schlPremAmount = Math.round(baseLoan * activeProgram.schlPremium);
    const totalLoanWithSchl = baseLoan + schlPremAmount;

    const monthlyPmt1st = annuityFactor > 0 ? totalLoanWithSchl / annuityFactor : 0;
    const annualDebt1st = monthlyPmt1st * 12;

    // Balance de prix de vente (BPV / VTB) intérêt seulement
    const annualBpvInterest = bpvAmount * (bpvRate / 100);
    const totalAnnualDebtService = annualDebt1st + annualBpvInterest;

    const downPayment = Math.max(0, prixAchat - baseLoan - bpvAmount);
    const welcomeTax = calculateWelcomeTaxChiffrier(prixAchat, isMontreal);
    const schlQstTax = Math.round(schlPremAmount * 0.09); // Taxe de 9% sur prime SCHL au Québec
    const totalCashRequired = downPayment + welcomeTax + schlQstTax + 4500; // + Notaire/Inspection

    const cashflowAnnuel = rne - totalAnnualDebtService;
    const cashflowMensuel = cashflowAnnuel / 12;

    const tga = prixAchat > 0 ? (rne / prixAchat) * 100 : 0;
    const mrb = revenuBrut > 0 ? prixAchat / revenuBrut : 0;
    const mrn = rne > 0 ? prixAchat / rne : 0;
    const rcdReel = totalAnnualDebtService > 0 ? rne / totalAnnualDebtService : 0;
    const effectiveLtv = prixAchat > 0 ? (baseLoan / prixAchat) * 100 : 0;
    const pricePerDoor = nbPortes > 0 ? Math.round(prixAchat / nbPortes) : prixAchat;
    const cashOnCash = totalCashRequired > 0 ? (cashflowAnnuel / totalCashRequired) * 100 : 0;

    // Projection 5 ans (croissance RNE 3%/an + capitalisation prêt) pour calcul du TRI (IRR)
    const cfs = [-Math.max(1, totalCashRequired)];
    let loanBalance = totalLoanWithSchl;
    for (let yr = 1; yr <= 5; yr++) {
      const yrRne = rne * Math.pow(1.03, yr - 1);
      const yrCf = yrRne - totalAnnualDebtService;
      for (let m = 0; m < 12; m++) {
        const interestM = loanBalance * rMonth;
        const principalM = Math.max(0, monthlyPmt1st - interestM);
        loanBalance = Math.max(0, loanBalance - principalM);
      }
      if (yr < 5) {
        cfs.push(yrCf);
      } else {
        const exitCap = Math.max(0.042, (tga / 100) || 0.055);
        const exitValue = (rne * Math.pow(1.03, 5)) / exitCap;
        const netExitEquity = exitValue - loanBalance - bpvAmount;
        cfs.push(yrCf + netExitEquity);
      }
    }

    const irr5Yr = (computeIRR(cfs, 0.12) || 0) * 100;

    // Solveur inversé : Prix d'achat maximal pour atteindre targetIrr / RCD
    const targetYield = Math.max(0.045, (interestRate / 100) + 0.012 + (targetIrr - 12) * 0.0025);
    const suggestedMaxPrice = rne > 0 ? Math.round(rne / targetYield) : prixAchat;

    return {
      revEffectif,
      totalDepenses,
      rne,
      baseLoan,
      schlPremAmount,
      totalLoanWithSchl,
      downPayment,
      welcomeTax,
      totalCashRequired,
      monthlyPmt1st,
      totalAnnualDebtService,
      cashflowAnnuel,
      cashflowMensuel,
      tga,
      mrb,
      mrn,
      rcdReel,
      effectiveLtv,
      pricePerDoor,
      cashOnCash,
      irr5Yr,
      suggestedMaxPrice,
      constrainedBy: maxLoanByDcr < maxLoanByLtv ? 'RCD (Revenus)' : 'RPV Max'
    };
  }, [
    prixAchat,
    nbPortes,
    revenuBrut,
    tauxInoccupation,
    taxesMun,
    taxesScol,
    autresDepenses,
    interestRate,
    bpvAmount,
    bpvRate,
    activeProgram,
    isMontreal,
    targetIrr
  ]);

  const locale = lang === 'EN' ? 'en-CA' : 'fr-CA';
  const fmt = (n) => Math.round(Number(n) || 0).toLocaleString(locale) + ' $';

  const handleSaveSimulationLead = async () => {
    await submitLeadToProspection({
      type: 'chiffrier',
      fullName: 'Investisseur Chiffrier Web',
      subject: `Simulation Chiffrier Himalaya (${activeProgram.label}) — ${deal?.title || 'Immeuble'}`,
      mls: deal?.mls_number || 'Sim-Chiffrier',
      dealTitle: deal?.title || 'Analyse Chiffrier',
      city: deal?.city || '',
      region: deal?.region || '',
      assigned_broker: deal?.assigned_broker || 'Roger Rhéaume',
      message: `Prix: ${fmt(prixAchat)} | RNE: ${fmt(metrics.rne)} | TGA: ${metrics.tga.toFixed(2)}% | Prêt: ${fmt(metrics.baseLoan)} (${activeProgram.label}) | Cashflow: ${fmt(metrics.cashflowAnnuel)}/an | TRI 5 ans: ${metrics.irr5Yr.toFixed(1)}%`
    });
    setLeadSaved(true);
    setTimeout(() => setLeadSaved(false), 3500);
  };

  return (
    <div style={{
      paddingTop: compact ? '18px' : '0',
      borderTop: compact ? '1px solid rgba(200, 164, 93, 0.35)' : 'none'
    }}>
      {/* En-tête du Chiffrier */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '14px'
      }}>
        <div>
          <div className="badge-gold" style={{ marginBottom: '4px' }}>
            <Calculator size={13} color="var(--gold)" />{' '}
            {tr(
              lang,
              'HIMALAYA CHIFFRIER — ANALYSE FINANCIÈRE & SCHL APH SELECT',
              'HIMALAYA CHIFFRIER — FINANCIAL ANALYSIS & CMHC MLI SELECT',
              'HIMALAYA CHIFFRIER — ANÁLISIS FINANCIERO Y SCHL APH SELECT',
              '喜马拉雅财务模型 — 财务分析与 CMHC APH Select 精算引擎'
            )}
          </div>
          <h4 className="serif-title" style={{ fontSize: compact ? '1.35rem' : '1.75rem', fontWeight: 600 }}>
            {tr(
              lang,
              'Simuler ce deal en direct (Conventionnel, SCHL & APH Select)',
              'Simulate This Deal Live (Conventional, CMHC & MLI Select)',
              'Simular esta propiedad en vivo (Convencional, SCHL y APH Select)',
              '实时模拟该项目收益（常规商业按揭、CMHC 与 APH Select）'
            )}
          </h4>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(prev => !prev)}
          className="btn-outline"
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
        >
          <Sliders size={13} color="var(--gold)" />
          {showAdvanced
            ? tr(lang, 'Vue synthétique', 'Compact View', 'Vista compacta', '精简视图')
            : tr(lang, 'Paramètres revenus / taxes / BPV', 'Adjust Income / Taxes / VTB', 'Ajustar ingresos / impuestos', '调整收入 / 税费 / 卖方融资')}
        </button>
      </div>

      {/* Sélecteur des 5 programmes de financement du Chiffrier Himalaya */}
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        marginBottom: '16px'
      }}>
        {HIMALAYA_CHIFRIER_PROGRAMS.map(prog => {
          const active = prog.key === programKey;
          return (
            <button
              key={prog.key}
              type="button"
              onClick={() => handleSelectProgram(prog)}
              style={{
                padding: '7px 11px',
                borderRadius: '6px',
                border: active ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.12)',
                background: active ? 'rgba(200, 164, 93, 0.18)' : 'rgba(255,255,255,0.02)',
                color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                fontSize: '0.74rem',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                textAlign: 'left'
              }}
            >
              <div>{pickLang(prog, 'label', lang)}</div>
              <div style={{ fontSize: '0.64rem', opacity: 0.78 }}>{prog.badge}</div>
            </button>
          );
        })}
      </div>

      {/* Contrôles d'entrées financières pré-remplies avec les données Centris */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
        gap: '10px',
        marginBottom: '16px'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {tr(lang, 'Prix d’acquisition ($)', 'Purchase Price ($)', 'Precio de compra ($)', '收购价格 ($)')}
          </label>
          <input
            type="number"
            className="form-control"
            style={{ padding: '7px 10px', fontSize: '0.82rem' }}
            value={prixAchat}
            step={25000}
            onChange={e => setPrixAchat(Math.max(0, Number(e.target.value)))}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {tr(lang, 'Revenus bruts / an ($)', 'Gross Annual Income ($)', 'Ingresos brutos / año ($)', '年毛收入 ($)')}
          </label>
          <input
            type="number"
            className="form-control"
            style={{ padding: '7px 10px', fontSize: '0.82rem' }}
            value={revenuBrut}
            step={5000}
            onChange={e => setRevenuBrut(Math.max(0, Number(e.target.value)))}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {tr(lang, 'Taux d’intérêt (%)', 'Interest Rate (%)', 'Tasa de interés (%)', '按揭年利率 (%)')}
          </label>
          <input
            type="number"
            className="form-control"
            style={{ padding: '7px 10px', fontSize: '0.82rem' }}
            value={interestRate}
            step={0.1}
            onChange={e => setInterestRate(Math.max(0.5, Number(e.target.value)))}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {tr(lang, 'Unités / Portes', 'Units / Doors', 'Unidades / Puertas', '单元 / 房间数量')}
          </label>
          <input
            type="number"
            className="form-control"
            style={{ padding: '7px 10px', fontSize: '0.82rem' }}
            value={nbPortes}
            min={1}
            onChange={e => setNbPortes(Math.max(1, Number(e.target.value)))}
          />
        </div>
      </div>

      {showAdvanced && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          gap: '10px',
          marginBottom: '16px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {tr(lang, 'Taxes municipales ($)', 'Municipal Taxes ($)', 'Impuestos municipales ($)', '市政税 ($)')}
            </label>
            <input
              type="number"
              className="form-control"
              style={{ padding: '7px 10px', fontSize: '0.8rem' }}
              value={taxesMun}
              onChange={e => setTaxesMun(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {tr(lang, 'Taxes scolaires ($)', 'School Taxes ($)', 'Impuestos escolares ($)', '学校税 ($)')}
            </label>
            <input
              type="number"
              className="form-control"
              style={{ padding: '7px 10px', fontSize: '0.8rem' }}
              value={taxesScol}
              onChange={e => setTaxesScol(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {tr(lang, 'Assur. / Énergie / Entretien ($)', 'Operating Expenses ($)', 'Gastos operativos ($)', '保险 / 能源 / 维护 ($)')}
            </label>
            <input
              type="number"
              className="form-control"
              style={{ padding: '7px 10px', fontSize: '0.8rem' }}
              value={autresDepenses}
              onChange={e => setAutresDepenses(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {tr(lang, 'Balance de vente BPV ($)', 'Seller Financing VTB ($)', 'Financiamiento vendedor ($)', '卖方融资余额 BPV ($)')}
            </label>
            <input
              type="number"
              className="form-control"
              style={{ padding: '7px 10px', fontSize: '0.8rem' }}
              value={bpvAmount}
              step={25000}
              onChange={e => setBpvAmount(Math.max(0, Number(e.target.value)))}
            />
          </div>
        </div>
      )}

      {/* Tableau des indicateurs clés & APH Select */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
        gap: '12px',
        padding: '14px 0',
        borderTop: '1px solid rgba(200, 164, 93, 0.28)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '14px'
      }}>
        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {tr(lang, 'RNE (NOI Annuel)', 'Annual NOI', 'NOI Anual', '年净营业收入 (NOI)')}
          </div>
          <div className="num-metric" style={{ fontSize: '1.18rem', fontWeight: 700, color: '#fff' }}>
            {fmt(metrics.rne)}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--gold-light)' }}>
            TGA (Cap Rate) : <strong>{metrics.tga.toFixed(2)} %</strong>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {tr(lang, 'Prêt Max Autorisé', 'Max Approved Loan', 'Préstamo Máximo', '最高可贷金额')}
          </div>
          <div className="num-metric" style={{ fontSize: '1.18rem', fontWeight: 700, color: '#fff' }}>
            {fmt(metrics.baseLoan)}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            RPV effectif : <strong>{metrics.effectiveLtv.toFixed(1)} %</strong> ({metrics.constrainedBy})
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {tr(lang, 'Mise de fonds + Mutation', 'Down Payment + Duties', 'Enganche + Impuestos', '首付 + 欢迎税总计')}
          </div>
          <div className="num-metric" style={{ fontSize: '1.18rem', fontWeight: 700, color: '#fff' }}>
            {fmt(metrics.totalCashRequired)}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            {tr(lang, 'Dont Bienvenue :', 'Incl. Welcome Tax:', 'Incl. Transferencia:', '含欢迎税：')} {fmt(metrics.welcomeTax)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {tr(lang, 'Cashflow Net (An 1)', 'Net Cashflow (Yr 1)', 'Flujo de Caja (Año 1)', '第一年净现金流')}
          </div>
          <div
            className="num-metric"
            style={{
              fontSize: '1.18rem',
              fontWeight: 700,
              color: metrics.cashflowAnnuel >= 0 ? 'var(--gold-light)' : '#f87171'
            }}
          >
            {fmt(metrics.cashflowAnnuel)} / {tr(lang, 'an', 'yr', 'año', '年')}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            {fmt(metrics.cashflowMensuel)} / {tr(lang, 'mois', 'mo', 'mes', '月')} • RCD {metrics.rcdReel.toFixed(2)}x
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {tr(lang, 'TRI 5 Ans & Multiples', '5-Yr IRR & Multiples', 'TIR 5 Años y Múltiplos', '5年内部收益率 (IRR)')}
          </div>
          <div className="num-metric gold-gradient-text" style={{ fontSize: '1.18rem', fontWeight: 700 }}>
            {metrics.irr5Yr.toFixed(1)} % {tr(lang, 'TRI', 'IRR', 'TIR', 'IRR')}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            MRB {metrics.mrb.toFixed(1)}x • {fmt(metrics.pricePerDoor)}/{tr(lang, 'porte', 'unit', 'unidad', '套')}
          </div>
        </div>
      </div>

      {/* Solveur inversé + Boutons d'action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
          <TrendingUp size={14} color="var(--gold)" />
          <span>
            {tr(
              lang,
              `Solveur financier (TRI cible ${targetIrr} %) : Prix max suggéré = `,
              `Financial Solver (Target IRR ${targetIrr}%): Suggested max price = `,
              `Solucionador financiero (TIR objetivo ${targetIrr} %): Precio máx. = `,
              `财务逆向求解器 (目标 IRR ${targetIrr}%)：建议最高出价 = `
            )}
            <strong style={{ color: 'var(--gold-light)' }}>{fmt(metrics.suggestedMaxPrice)}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSaveSimulationLead}
            className="btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.74rem' }}
          >
            {leadSaved ? (
              <>
                <CheckCircle2 size={13} color="var(--gold)" />
                {tr(lang, 'Transmis au courtier !', 'Sent to Broker!', '¡Enviado al corredor!', '已发送给经纪人！')}
              </>
            ) : (
              <>
                <Sparkles size={13} color="var(--gold)" />
                {tr(lang, 'Envoyer ce scénario au courtier', 'Send Scenario to Broker', 'Enviar escenario al corredor', '将此测算方案发送给经纪人')}
              </>
            )}
          </button>

          {onOpenFullChiffrier && (
            <button
              type="button"
              onClick={() => onOpenFullChiffrier(deal)}
              className="btn-gold"
              style={{ padding: '7px 14px', fontSize: '0.75rem' }}
            >
              <Building2 size={13} />
              {tr(lang, 'Ouvrir dans le Chiffrier Complet →', 'Open in Full Chiffrier →', 'Abrir en Simulador Completo →', '在完整版精算模型中打开 →')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
