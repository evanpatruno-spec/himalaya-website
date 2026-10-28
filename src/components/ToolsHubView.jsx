import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Building2,
  Home,
  FileText,
  Landmark,
  Scale,
  Clock,
  CheckCircle2,
  ArrowRight,
  Printer,
  X
} from 'lucide-react';
import { submitLeadToProspection } from '../utils/prospectionBridge';
import { INITIAL_HIMALAYA_BROKERS } from '../data/brokersData';
import { tr, pickLang } from '../data/translations';
import ChiffrierDealSimulator from './ChiffrierDealSimulator';

// Capitalisation semi-annuelle canadienne (Loi sur l'intérêt au Canada)
function getEffectiveMonthlyRate(annualPct) {
  if (!annualPct || annualPct <= 0) return 0;
  return Math.pow(1 + (annualPct / 100) / 2, 1 / 6) - 1;
}

// Calcul officiel des droits de mutation (Taxe de bienvenue 2026 — Québec & Montréal)
function computeWelcomeTax(price, isMontreal, lang = 'FR') {
  let rem = Math.max(0, Number(price) || 0);
  const brackets = [];
  const p1 = 61500;
  const t1 = Math.min(rem, p1);
  brackets.push({ label: '0 $ – 61 500 $', rate: '0.5 %', amount: t1 * 0.005 });
  rem -= t1;

  if (rem > 0) {
    if (isMontreal) {
      const mt2 = 307800;
      const mt3 = 611500;
      const mt4 = 1223100;
      const t2 = Math.min(rem, mt2 - p1);
      brackets.push({ label: '61 500 $ – 307 800 $', rate: '1.0 %', amount: t2 * 0.01 });
      rem -= t2;

      if (rem > 0) {
        const t3 = Math.min(rem, mt3 - mt2);
        brackets.push({ label: '307 800 $ – 611 500 $', rate: '1.5 %', amount: t3 * 0.015 });
        rem -= t3;
      }
      if (rem > 0) {
        const t4 = Math.min(rem, mt4 - mt3);
        brackets.push({ label: '611 500 $ – 1 223 100 $', rate: '2.0 %', amount: t4 * 0.02 });
        rem -= t4;
      }
      if (rem > 0) {
        brackets.push({
          label: tr(lang, 'Excédent (+ 1 223 100 $)', 'Excess (+ $1,223,100)', 'Excedente (+ 1 223 100 $)', '超出部分 (+ 1 223 100 $)'),
          rate: '3.0 %',
          amount: rem * 0.03
        });
      }
    } else {
      const p2 = 307800;
      const t2b = Math.min(rem, p2 - p1);
      brackets.push({ label: '61 500 $ – 307 800 $', rate: '1.0 %', amount: t2b * 0.01 });
      rem -= t2b;
      if (rem > 0) {
        brackets.push({
          label: tr(lang, 'Excédent (+ 307 800 $)', 'Excess (+ $307,800)', 'Excedente (+ 307 800 $)', '超出部分 (+ 307 800 $)'),
          rate: '1.5 %',
          amount: rem * 0.015
        });
      }
    }
  }

  const total = brackets.reduce((acc, b) => acc + b.amount, 0);
  return { total, brackets };
}

export default function ToolsHubView({ lang: propLang = 'FR', t, onNavigate, preselectedDeal, onClearPreselectedDeal, initialTool }) {
  const lang = t?.code || propLang || 'FR';
  const [activeTool, setActiveTool] = useState(initialTool || 'plex');

  useEffect(() => {
    if (initialTool) {
      setActiveTool(initialTool);
    }
  }, [initialTool]);

  // --- 1. Rentabilité Commerciale & Plex (calculateur_rentabilite_plex_2026) ---
  const [plexPrice, setPlexPrice] = useState(850000);
  const [plexGrossIncome, setPlexGrossIncome] = useState(72000);
  const [plexVacancy, setPlexVacancy] = useState(3.0);
  const [plexDownPct, setPlexDownPct] = useState(25);
  const [plexRate, setPlexRate] = useState(4.69);
  const [plexAmort, setPlexAmort] = useState(25);
  const [plexTaxMun, setPlexTaxMun] = useState(6400);
  const [plexTaxScol, setPlexTaxScol] = useState(550);
  const [plexInsurance, setPlexInsurance] = useState(3200);
  const [plexEnergy, setPlexEnergy] = useState(1800);
  const [plexMaintPct, setPlexMaintPct] = useState(4.0);
  const [plexMgmt, setPlexMgmt] = useState(0);

  // --- 2. Capacité d'emprunt (Test B-20) ---
  const [affIncome, setAffIncome] = useState(135000);
  const [affDebts, setAffDebts] = useState(500);
  const [affDown, setAffDown] = useState(75000);
  const [affRateNeg, setAffRateNeg] = useState(4.69);
  const [affTaxes, setAffTaxes] = useState(4200);
  const [affCondo, setAffCondo] = useState(0);
  const [affHeat, setAffHeat] = useState(150);

  // --- 3. Calculatrice Hypothécaire ---
  const [mcLoan, setMcLoan] = useState(500000);
  const [mcRate, setMcRate] = useState(4.69);
  const [mcAmort, setMcAmort] = useState(25);
  const [mcFreq, setMcFreq] = useState(12);

  // --- 4. Taxe de Bienvenue ---
  const [wtPrice, setWtPrice] = useState(650000);
  const [wtIsMtl, setWtIsMtl] = useState(true);

  // --- 5. Frais de Clôture ---
  const [ccPrice, setCcPrice] = useState(550000);
  const [ccDownPct, setCcDownPct] = useState(10);
  const [ccInsp, setCcInsp] = useState(950);
  const [ccNotary, setCcNotary] = useState(2200);
  const [ccMove, setCcMove] = useState(1500);

  // --- 6. Louer vs Acheter ---
  const [rvbRent, setRvbRent] = useState(1950);
  const [rvbRentInc, setRvbRentInc] = useState(3.0);
  const [rvbYears, setRvbYears] = useState(5);
  const [rvbPrice, setRvbPrice] = useState(480000);
  const [rvbDown, setRvbDown] = useState(48000);
  const [rvbRate, setRvbRate] = useState(4.59);

  // --- 7. Attendre vs Acheter ---
  const [waitPrice, setWaitPrice] = useState(550000);
  const [waitRateNow, setWaitRateNow] = useState(4.69);
  const [waitMonths, setWaitMonths] = useState(12);
  const [waitApprec, setWaitApprec] = useState(5.0);
  const [waitRateFuture, setWaitRateFuture] = useState(4.0);

  // --- 8. Loyer Commercial Net vs Brut ($/pi²/an) ---
  const [clArea, setClArea] = useState(2500);
  const [clBaseRent, setClBaseRent] = useState(28);
  const [clAddRent, setClAddRent] = useState(14);
  const [clEscalation, setClEscalation] = useState(3);
  const [clTermYears, setClTermYears] = useState(5);

  // --- 9. Évalue ma propriété (Vendre ou Louer) ---
  const [valPurpose, setValPurpose] = useState('Vendre');
  const [valAssetType, setValAssetType] = useState('Commercial / Industriel / Bureau');
  const [valCity, setValCity] = useState('');
  const [valSurfaceOrUnits, setValSurfaceOrUnits] = useState('');
  const [valGrossRevenue, setValGrossRevenue] = useState('');
  const [valExpectedPrice, setValExpectedPrice] = useState('');
  const [valBrokerId, setValBrokerId] = useState('');
  const [valFullName, setValFullName] = useState('');
  const [valPhone, setValPhone] = useState('');
  const [valEmail, setValEmail] = useState('');
  const [valNotes, setValNotes] = useState('');
  const [valSubmitted, setValSubmitted] = useState(false);

  // --- Lead Modal ---
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSent, setLeadSent] = useState(false);

  // Pré-remplissage automatique lorsqu'on arrive depuis une fiche propriété (#6)
  useEffect(() => {
    if (!preselectedDeal) return;
    const p = Math.round(Number(preselectedDeal.price) || 0);
    if (p >= 25000) {
      setPlexPrice(p);
      setPlexGrossIncome(Math.round(p * 0.085));
      setMcLoan(Math.round(p * 0.75));
      setWtPrice(p);
      setWtIsMtl(/montr[eé]al/i.test(String(preselectedDeal.city || '') + ' ' + String(preselectedDeal.region || '')));
      setCcPrice(p);
      setRvbPrice(p);
      setRvbDown(Math.round(p * 0.2));
      setWaitPrice(p);

      const rawMun = preselectedDeal.specs?.['Taxes municipales'];
      if (rawMun) {
        const parsedMun = Number(String(rawMun).replace(/[^\d]/g, ''));
        if (parsedMun > 0) setPlexTaxMun(parsedMun);
      }
      const rawScol = preselectedDeal.specs?.['Taxes scolaires'];
      if (rawScol) {
        const parsedScol = Number(String(rawScol).replace(/[^\d]/g, ''));
        if (parsedScol > 0) setPlexTaxScol(parsedScol);
      }
    }
  }, [preselectedDeal]);

  const fmtCAD = (n) =>
    Math.round(Number(n) || 0).toLocaleString(tr(lang, 'fr-CA', 'en-CA', 'es-ES', 'zh-CN')) + ' $';

  const toolsList = [
    {
      id: 'valuation',
      icon: Building2,
      title: tr(lang, 'Évalue ma propriété', 'Value My Property', 'Evalúa mi propiedad', '评估我的物业'),
      sub: tr(lang, 'Évaluation pour vendre ou louer', 'Valuation to Sell or Lease', 'Evaluación para vender o alquilar', '出售或出租物业评估')
    },
    {
      id: 'plex',
      icon: Building2,
      title: tr(lang, 'Rentabilité Plex & Commercial', 'Commercial & Multi-Family ROI', 'Rentabilidad Comercial y Plex', '商业与多户公寓收益分析'),
      sub: tr(lang, 'TGA (Cap Rate), MRB, RNO & Cashflow', 'Cap Rate, GIM, NOI & Cashflow', 'Cap Rate, MRB, NOI y Flujo de Caja', '资本化率、净营业收入与现金流')
    },
    {
      id: 'affordability',
      icon: Calculator,
      title: tr(lang, 'Capacité d’emprunt', 'Borrowing Capacity', 'Capacidad de Endeudamiento', '贷款能力评估 (B-20)'),
      sub: tr(lang, 'Test B-20 & Ratios ABD/ATD', 'B-20 Stress Test & GDS/TDS', 'Prueba B-20 y Ratios', 'B-20 压力测试与负债率')
    },
    {
      id: 'mortgage',
      icon: Home,
      title: tr(lang, 'Calculatrice hypothécaire', 'Mortgage Calculator', 'Calculadora Hipotecaria', '按揭贷款计算器'),
      sub: tr(lang, 'Versements & Amortissement', 'Payments & Amortization', 'Pagos y Amortización', '月供与摊销计算')
    },
    {
      id: 'welcome',
      icon: Landmark,
      title: tr(lang, 'Taxe de bienvenue', 'Welcome Tax (Transfer Duties)', 'Impuesto de Transferencia', '魁北克欢迎税 (土地转让税)'),
      sub: tr(lang, 'Barèmes Québec & Montréal 2026', 'Quebec & Montreal 2026 Brackets', 'Tarifas Quebec y Montreal 2026', '魁北克与蒙特利尔 2026 税率')
    },
    {
      id: 'closing',
      icon: FileText,
      title: tr(lang, 'Frais de clôture', 'Closing Costs', 'Costos de Cierre', '交割费用与公证预算'),
      sub: tr(lang, 'Liquidités requises & Notaire', 'Required Cash & Notary', 'Liquidez requerida y Notario', '过户所需流动资金与公证费')
    },
    {
      id: 'rvb',
      icon: Scale,
      title: tr(lang, 'Louer vs Acheter', 'Rent vs. Buy', 'Alquilar vs. Comprar', '租房 vs 买房对比'),
      sub: tr(lang, 'Équité bâtie vs Loyers perdus', 'Net Equity vs. Lost Rent', 'Capital acumulado vs. Alquiler', '净资产积累与租金成本对比')
    },
    {
      id: 'wait',
      icon: Clock,
      title: tr(lang, 'Attendre vs Acheter', 'Wait vs. Buy Now', 'Esperar vs. Comprar Ahora', '等待降息 vs 立即购买'),
      sub: tr(lang, 'Impact baisse de taux vs prix', 'Rate Drop vs. Price Growth', 'Baja de tasas vs. Aumento de precio', '利率下降与房价上涨成本对比')
    },
    {
      id: 'commercialLease',
      icon: Building2,
      title: tr(lang, 'Loyer Commercial (Net / Brut)', 'Commercial Lease (Net / Gross)', 'Alquiler Comercial (Neto / Bruto)', '商业租约计算器 (净租/毛租)'),
      sub: tr(lang, 'Commercial & Franchises', 'Commercial & Franchises', 'Comercial y Franquicias', '商业地产与连锁选址')
    }
  ];

  // Calcul 1 : Rentabilité Plex & Commercial
  const plexResult = useMemo(() => {
    const downAmount = Math.round(plexPrice * (plexDownPct / 100));
    const loanAmount = Math.max(0, plexPrice - downAmount);
    const effectiveIncome = plexGrossIncome * (1 - plexVacancy / 100);
    const maintCost = plexGrossIncome * (plexMaintPct / 100);
    const totalExpenses =
      Number(plexTaxMun) +
      Number(plexTaxScol) +
      Number(plexInsurance) +
      Number(plexEnergy) +
      maintCost +
      Number(plexMgmt);
    const noi = effectiveIncome - totalExpenses;

    const r = getEffectiveMonthlyRate(plexRate);
    const n = plexAmort * 12;
    const monthlyPmt = loanAmount > 0 && r > 0 ? loanAmount * (r / (1 - Math.pow(1 + r, -n))) : 0;
    const annualDebtService = monthlyPmt * 12;
    const firstYearInterest = loanAmount * (plexRate / 100);
    const firstYearPrincipal = Math.max(0, annualDebtService - firstYearInterest);
    const annualCashflow = noi - annualDebtService;
    const monthlyCashflow = annualCashflow / 12;

    const mrb = plexGrossIncome > 0 ? (plexPrice / plexGrossIncome).toFixed(1) : '0.0';
    const capRate = plexPrice > 0 ? ((noi / plexPrice) * 100).toFixed(2) : '0.00';
    const roi = downAmount > 0 ? ((annualCashflow / downAmount) * 100).toFixed(1) : '0.0';

    return {
      downAmount,
      loanAmount,
      effectiveIncome,
      totalExpenses,
      noi,
      annualDebtService,
      firstYearPrincipal,
      annualCashflow,
      monthlyCashflow,
      mrb,
      capRate,
      roi
    };
  }, [
    plexPrice,
    plexGrossIncome,
    plexVacancy,
    plexDownPct,
    plexRate,
    plexAmort,
    plexTaxMun,
    plexTaxScol,
    plexInsurance,
    plexEnergy,
    plexMaintPct,
    plexMgmt
  ]);

  // Calcul 2 : Capacité d'emprunt B-20
  const affResult = useMemo(() => {
    const stressRate = Math.max(Number(affRateNeg) + 2, 5.25);
    const r = getEffectiveMonthlyRate(stressRate);
    const monthlyInc = Number(affIncome) / 12;
    const limitGDS = monthlyInc * 0.39;
    const limitTDS = monthlyInc * 0.44;
    const fixedCosts = Number(affHeat) + Number(affTaxes) / 12 + Number(affCondo) * 0.5;
    const maxPayGDS = limitGDS - fixedCosts;
    const maxPayTDS = limitTDS - Number(affDebts) - fixedCosts;
    const maxPayment = Math.max(0, Math.min(maxPayGDS, maxPayTDS));
    const n = 25 * 12;
    const totalLoan = r > 0 ? (maxPayment * (1 - Math.pow(1 + r, -n))) / r : 0;

    let price = totalLoan + Number(affDown);
    let netLoan = totalLoan;
    const ratio = price > 0 ? Number(affDown) / price : 0;
    if (ratio < 0.2 && price > 0) {
      let premium = 0.04;
      if (ratio >= 0.15) premium = 0.028;
      else if (ratio >= 0.1) premium = 0.031;
      price = totalLoan / (1 + premium) + Number(affDown);
      netLoan = price - Number(affDown);
    }

    return {
      stressRate: stressRate.toFixed(2),
      maxPrice: Math.max(0, price),
      netLoan: Math.max(0, netLoan),
      maxPayment: Math.max(0, maxPayment)
    };
  }, [affIncome, affDebts, affDown, affRateNeg, affTaxes, affCondo, affHeat]);

  // Calcul 3 : Calculatrice Hypothécaire
  const mcResult = useMemo(() => {
    const r = getEffectiveMonthlyRate(mcRate);
    const n = mcAmort * 12;
    const pMonthly =
      mcLoan > 0 && r > 0 ? (mcLoan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1) : 0;
    const payment = (pMonthly * 12) / mcFreq;
    const totalPaid = pMonthly * n;
    const totalInterest = Math.max(0, totalPaid - mcLoan);

    // Simulation accélérée aux 2 semaines
    const pAccel = pMonthly / 2;
    const rBiweekly = Math.pow(1 + (mcRate / 100) / 2, 2 / 26) - 1;
    let bal = mcLoan;
    let interestAccel = 0;
    let periods = 0;
    while (bal > 0 && periods < 26 * 40) {
      const intP = bal * rBiweekly;
      if (bal + intP <= pAccel) {
        interestAccel += intP;
        bal = 0;
        periods++;
        break;
      }
      bal -= pAccel - intP;
      interestAccel += intP;
      periods++;
    }
    const savingAccel = Math.max(0, totalInterest - interestAccel);
    const yearsSaved = Math.max(0, (n - (periods * 12) / 26) / 12).toFixed(1);

    return {
      payment,
      pMonthly,
      totalPaid,
      totalInterest,
      savingAccel,
      yearsSaved
    };
  }, [mcLoan, mcRate, mcAmort, mcFreq]);

  // Calcul 4 : Taxe de Bienvenue
  const wtResult = useMemo(() => computeWelcomeTax(wtPrice, wtIsMtl, lang), [wtPrice, wtIsMtl, lang]);

  // Calcul 5 : Frais de clôture
  const ccResult = useMemo(() => {
    const down = Math.round(ccPrice * (ccDownPct / 100));
    let schlRate = 0;
    if (ccDownPct >= 5 && ccDownPct < 10) schlRate = 0.04;
    else if (ccDownPct >= 10 && ccDownPct < 15) schlRate = 0.031;
    else if (ccDownPct >= 15 && ccDownPct < 20) schlRate = 0.028;
    const loan = Math.max(0, ccPrice - down);
    const schlPrem = loan * schlRate;
    const schlTax = schlPrem * 0.09; // 9% taxe provinciale sur prime SCHL au Québec
    const welcome = computeWelcomeTax(ccPrice, true, lang).total;
    const others = Number(ccInsp) + Number(ccNotary) + Number(ccMove);
    const totalCash = down + schlTax + welcome + others;
    return { down, schlPrem, schlTax, welcome, others, totalCash };
  }, [ccPrice, ccDownPct, ccInsp, ccNotary, ccMove, lang]);

  // Calcul 6 : Louer vs Acheter
  const rvbResult = useMemo(() => {
    let totalRent = 0;
    let currRent = Number(rvbRent);
    for (let i = 0; i < rvbYears; i++) {
      totalRent += currRent * 12;
      currRent *= 1 + Number(rvbRentInc) / 100;
    }
    const endRent = Number(rvbRent) * Math.pow(1 + Number(rvbRentInc) / 100, rvbYears - 1);

    let loan = Math.max(0, rvbPrice - rvbDown);
    if (rvbPrice > 0 && rvbDown / rvbPrice < 0.2) loan *= 1.04;
    const r = getEffectiveMonthlyRate(rvbRate);
    const n = 25 * 12;
    const pmt = loan > 0 && r > 0 ? (loan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1) : 0;

    let balance = loan;
    let principalPaid = 0;
    for (let m = 1; m <= rvbYears * 12; m++) {
      const interest = balance * r;
      const principal = Math.max(0, pmt - interest);
      principalPaid += principal;
      balance -= principal;
    }
    const futurePrice = rvbPrice * Math.pow(1.03, rvbYears);
    const capitalGain = futurePrice - rvbPrice;
    const totalEquity = Number(rvbDown) + principalPaid + capitalGain;
    const netWealthCreated = principalPaid + capitalGain;

    return {
      totalRent,
      endRent,
      principalPaid,
      capitalGain,
      futurePrice,
      totalEquity,
      netWealthCreated
    };
  }, [rvbRent, rvbRentInc, rvbYears, rvbPrice, rvbDown, rvbRate]);

  // Calcul 7 : Attendre vs Acheter
  const waitResult = useMemo(() => {
    const rNow = getEffectiveMonthlyRate(waitRateNow);
    const n = 25 * 12;
    const loanNow = waitPrice * 0.9;
    const pmtNow = loanNow > 0 && rNow > 0 ? (loanNow * rNow) / (1 - Math.pow(1 + rNow, -n)) : 0;

    const appreciationAmt = waitPrice * ((waitApprec / 100) * (waitMonths / 12));
    const priceFuture = Number(waitPrice) + appreciationAmt;
    const loanFuture = priceFuture * 0.9;
    const rFuture = getEffectiveMonthlyRate(waitRateFuture);
    const pmtFuture =
      loanFuture > 0 && rFuture > 0 ? (loanFuture * rFuture) / (1 - Math.pow(1 + rFuture, -n)) : 0;
    const pmtDiff = pmtFuture - pmtNow;
    const totalImpact = appreciationAmt + pmtDiff * 60;

    return {
      appreciationAmt,
      priceFuture,
      pmtNow,
      pmtFuture,
      pmtDiff,
      totalImpact
    };
  }, [waitPrice, waitRateNow, waitMonths, waitApprec, waitRateFuture]);

  // Calcul 8 : Loyer Commercial Net vs Brut ($/pi²/an)
  const clResult = useMemo(() => {
    const area = Math.max(0, Number(clArea) || 0);
    const baseRate = Math.max(0, Number(clBaseRent) || 0);
    const addRate = Math.max(0, Number(clAddRent) || 0);
    const escalationPct = Math.max(0, Number(clEscalation) || 0);
    const years = Math.max(1, Math.round(Number(clTermYears) || 1));

    const grossRateSqFt = baseRate + addRate;
    const grossRateSqM = grossRateSqFt * 10.7639;
    const monthlyBase = (baseRate * area) / 12;
    const monthlyAdd = (addRate * area) / 12;
    const monthlyGrossYear1 = ((baseRate + addRate) * area) / 12;
    const annualGrossYear1 = (baseRate + addRate) * area;

    let totalLeaseCommitment = 0;
    for (let y = 0; y < years; y++) {
      const indexedBaseRate = baseRate * Math.pow(1 + escalationPct / 100, y);
      totalLeaseCommitment += (indexedBaseRate + addRate) * area;
    }

    return {
      grossRateSqFt: grossRateSqFt.toFixed(2),
      grossRateSqM: grossRateSqM.toFixed(2),
      monthlyBase,
      monthlyAdd,
      monthlyGrossYear1,
      annualGrossYear1,
      totalLeaseCommitment,
      years
    };
  }, [clArea, clBaseRent, clAddRent, clEscalation, clTermYears]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const currentToolObj = toolsList.find((t) => t.id === activeTool);
    await submitLeadToProspection({
      type: 'simulation_outil_immobilier',
      source: `Outil Himalaya : ${currentToolObj ? currentToolObj.title : activeTool}`,
      nom: leadName,
      email: leadEmail,
      telephone: leadPhone,
      outil: activeTool
    });
    setLeadSent(true);
  };

  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        {/* Bandeau de propriété pré-sélectionnée (#6) */}
        {preselectedDeal && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            padding: '14px 20px',
            marginBottom: '22px',
            borderRadius: '12px',
            background: 'rgba(200, 164, 93, 0.12)',
            border: '1px solid var(--gold)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span className="badge-gold">MLS {preselectedDeal.mls_number}</span>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                  {tr(
                    lang,
                    'Simulation pré-remplie avec la propriété sélectionnée :',
                    'Active Property Simulation Pre-filled:',
                    'Simulación prellenada con la propiedad seleccionada:',
                    '已根据所选房产预填模拟数据：'
                  )}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                  {pickLang(preselectedDeal, 'title', lang)} — {preselectedDeal.city} ({fmtCAD(preselectedDeal.price)})
                </div>
              </div>
            </div>
            {onClearPreselectedDeal && (
              <button
                onClick={onClearPreselectedDeal}
                className="btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <X size={14} /> {tr(lang, 'Réinitialiser', 'Reset to default values', 'Restablecer valores', '重置为默认值')}
              </button>
            )}
          </div>
        )}

        {/* En-tête Outils Immobiliers + Partenaire Multi-Prêts (#2) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px'
          }}
        >
          <div>
            <span className="badge-gold" style={{ marginBottom: '8px' }}>
              {tr(lang, 'Centre de calcul & Simulateurs 2026', 'Financial & Real Estate Simulators 2026', 'Centro de Cálculo y Simuladores 2026', '2026 房地产与金融模拟计算中心')}
            </span>
            <h2 className="serif-title" style={{ fontSize: '2.4rem', fontWeight: 600, lineHeight: 1.15, marginBottom: '6px' }}>
              {tr(lang, 'Outils Immobiliers ', 'Real Estate & Financial ', 'Herramientas Inmobiliarias ', '房地产与金融 ')}
              <span className="gold-gradient-text">{tr(lang, '& Financiers', 'Tools', 'y Financieras', '分析工具')}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', maxWidth: '720px' }}>
              {tr(
                lang,
                'Outils d’analyse stratégique et financière basés sur les barèmes canadiens (test B-20, SCHL) et les droits de mutation du Québec et de Montréal.',
                'Strategic analysis calculators based on Canadian banking rules (B-20), CMHC, and Quebec/Montreal transfer duty brackets.',
                'Herramientas de análisis estratégico y financiero basadas en las normas bancarias canadienses (B-20, SCHL) y los impuestos de transferencia de Quebec y Montreal.',
                '基于加拿大银行规范（B-20 压力测试、CMHC）及魁北克与蒙特利尔土地转让税率的房地产财务分析工具。'
              )}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href="https://equipeimpact-multi-prets.zohobookings.ca/#/Himalaya"
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
              style={{
                borderColor: 'var(--border-gold)',
                padding: '8px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.8rem'
              }}
              title={tr(lang, 'Prendre rendez-vous hypothécaire avec Multi-Prêts', 'Book a mortgage consultation with Multi-Prêts', 'Reservar consulta hipotecaria con Multi-Prêts', '预约 Multi-Prêts 按揭顾问')}
            >
              <img
                src="/gx/m/Multi_Prets.png"
                alt="Multi-Prêts Hypothèques"
                style={{ height: '22px', objectFit: 'contain' }}
              />
              <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                {tr(lang, 'Préqualification Multi-Prêts →', 'Multi-Prêts Pre-Approval →', 'Precalificación Multi-Prêts →', 'Multi-Prêts 按揭预审 →')}
              </span>
            </a>
            <button onClick={() => window.print()} className="btn-outline" style={{ fontSize: '0.82rem' }}>
              <Printer size={15} /> {tr(lang, 'Imprimer / Exporter PDF', 'Print / Save PDF', 'Imprimir / Exportar PDF', '打印 / 导出 PDF')}
            </button>
          </div>
        </div>

        {/* Navigation des 7 outils — Barre d'onglets éditoriale sans boîtes imbriquées (#17) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '40px'
          }}
        >
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem'
                }}
              >
                <Icon size={15} style={{ color: isActive ? 'var(--gold)' : 'var(--text-muted)' }} />
                <span>{tool.title}</span>
              </button>
            );
          })}
        </div>

        {/* =================================================================
            OUTIL 1 : RENTABILITÉ PLEX & COMMERCIAL (TGA / CAP RATE, MRB, RNO)
           ================================================================= */}
        {activeTool === 'plex' && (
          <div style={{ paddingTop: '4px' }}>
            {/* Module Chiffrier financier & SCHL APH Select (50 / 70 / 100 pts) intégré (#5) */}
            <div style={{
              marginBottom: '44px',
              paddingBottom: '36px',
              borderBottom: '1px solid rgba(200, 164, 93, 0.35)'
            }}>
              <ChiffrierDealSimulator
                deal={preselectedDeal || { price: plexPrice, specs: { 'Taxes municipales': plexTaxMun, 'Taxes scolaires': plexTaxScol } }}
                lang={lang}
                compact={false}
              />
            </div>

            {/* 4 KPIs principaux en bandeau éditorial épuré (zéro cadre dans un cadre #17) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                paddingBottom: '32px',
                marginBottom: '36px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ textAlign: 'center', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {tr(lang, 'MRB (Multiplicateur Brut)', 'GIM (Gross Multiplier)', 'MRB (Multiplicador Bruto)', 'GIM (总收入乘数)')}
                </div>
                <div className="num-metric gold-gradient-text" style={{ fontSize: '2.15rem', fontWeight: 700, margin: '6px 0' }}>
                  {plexResult.mrb}x
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {tr(lang, 'Prix / Revenus bruts', 'Price / Gross Income', 'Precio / Ingresos brutos', '购买价 / 年度总收入')}
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {tr(lang, 'Taux de capitalisation (TGA)', 'Cap Rate (TGA)', 'Tasa de Capitalización (Cap Rate)', '资本化率 (Cap Rate)')}
                </div>
                <div className="num-metric gold-gradient-text" style={{ fontSize: '2.15rem', fontWeight: 700, margin: '6px 0' }}>
                  {plexResult.capRate} %
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {tr(lang, 'RNO / Prix d’achat', 'NOI / Purchase Price', 'NOI / Precio de compra', '净营业收入 / 购买价')}
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {tr(lang, 'Cashflow net mensuel', 'Net Monthly Cashflow', 'Flujo de caja neto mensual', '每月净现金流')}
                </div>
                <div
                  className="num-metric"
                  style={{
                    fontSize: '2.15rem',
                    fontWeight: 700,
                    margin: '6px 0',
                    color: plexResult.monthlyCashflow >= 0 ? 'var(--gold-light)' : '#f87171'
                  }}
                >
                  {(plexResult.monthlyCashflow >= 0 ? '+' : '') + fmtCAD(plexResult.monthlyCashflow)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {tr(lang, 'Après hypothèque & dépenses', 'After debt & expenses', 'Después de hipoteca y gastos', '扣除按揭与运营开支后')}
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {tr(lang, 'Rendement sur mise de fonds', 'Cash-on-Cash ROI', 'Retorno sobre capital (ROI)', '首付现金回报率 (ROI)')}
                </div>
                <div className="num-metric" style={{ fontSize: '2.15rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-main)' }}>
                  {plexResult.roi} %
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {tr(lang, 'Cashflow annuel / Mise de fonds', 'Annual Cashflow / Down Payment', 'Flujo anual / Pago inicial', '年度现金流 / 首付款')}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '26px'
              }}
            >
              {/* Colonne 1 : Acquisition & Financement */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  {tr(
                    lang,
                    '1. Acquisition, Revenus bruts & Financement',
                    '1. Acquisition, Gross Income & Financing',
                    '1. Adquisición, Ingresos Brutos y Financiamiento',
                    '1. 收购价格、总收入与融资方案'
                  )}
                </h3>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {tr(lang, 'Prix d’achat de l’immeuble ($)', 'Purchase Price ($)', 'Precio de compra del inmueble ($)', '物业购买价格 ($)')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={plexPrice}
                    step="10000"
                    onChange={(e) => setPlexPrice(Number(e.target.value))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Revenus bruts annuels ($)', 'Annual Gross Income ($)', 'Ingresos brutos anuales ($)', '年度总租金收入 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexGrossIncome}
                      step="1000"
                      onChange={(e) => setPlexGrossIncome(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taux d’inoccupation (%)', 'Vacancy Rate (%)', 'Tasa de vacancia (%)', '空置率 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexVacancy}
                      step="0.5"
                      onChange={(e) => setPlexVacancy(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Mise de fonds (%)', 'Down Payment (%)', 'Pago inicial (%)', '首付比例 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexDownPct}
                      step="1"
                      onChange={(e) => setPlexDownPct(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taux d’intérêt (%)', 'Interest Rate (%)', 'Tasa de interés (%)', '贷款利率 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexRate}
                      step="0.05"
                      onChange={(e) => setPlexRate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Amortissement', 'Amortization', 'Amortización', '摊销年限')}
                    </label>
                    <select
                      className="form-control"
                      value={plexAmort}
                      onChange={(e) => setPlexAmort(Number(e.target.value))}
                    >
                      <option value={20}>20 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                      <option value={25}>25 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                      <option value={30}>30 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                    </select>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)', marginTop: '8px' }}>
                  {tr(lang, '2. Dépenses d’exploitation annuelles', '2. Annual Operating Expenses', '2. Gastos Operativos Anuales', '2. 年度运营开支')}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taxes municipales ($/an)', 'Municipal Taxes ($/yr)', 'Impuestos municipales ($/año)', '市政税 ($/年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexTaxMun}
                      step="100"
                      onChange={(e) => setPlexTaxMun(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taxes scolaires ($/an)', 'School Taxes ($/yr)', 'Impuestos escolares ($/año)', '学校税 ($/年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexTaxScol}
                      step="50"
                      onChange={(e) => setPlexTaxScol(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Assurance immeuble ($/an)', 'Building Insurance ($/yr)', 'Seguro del edificio ($/año)', '建筑保险 ($/年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexInsurance}
                      step="100"
                      onChange={(e) => setPlexInsurance(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Énergie / Chauffage ($/an)', 'Energy / Heating ($/yr)', 'Energía / Calefacción ($/año)', '能源 / 供暖 ($/年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexEnergy}
                      step="100"
                      onChange={(e) => setPlexEnergy(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Entretien & réserve (%)', 'Maintenance Reserve (%)', 'Mantenimiento y reserva (%)', '维护与准备金 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexMaintPct}
                      step="0.5"
                      onChange={(e) => setPlexMaintPct(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Gestion / Conciergerie ($/an)', 'Management ($/yr)', 'Gestión / Conserjería ($/año)', '物业管理费 ($/年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={plexMgmt}
                      step="100"
                      onChange={(e) => setPlexMgmt(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Colonne 2 : Bilan Financier Complet (Épuré sans boîte) */}
              <div
                style={{
                  padding: '4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gold-light)', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {tr(lang, 'Sommaire financier d’exploitation', 'Financial Operating Summary', 'Resumen Financiero Operativo', '年度财务运营汇总')}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Mise de fonds injectée', 'Down Payment Injected', 'Pago inicial inyectado', '投入首付款')} ({plexDownPct}%)
                      </span>
                      <strong>{fmtCAD(plexResult.downAmount)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Revenus effectifs nets de vacance', 'Effective Gross Income (Net of Vacancy)', 'Ingresos efectivos netos de vacancia', '扣除空置后的有效总收入')}
                      </span>
                      <strong>{fmtCAD(plexResult.effectiveIncome)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Total des dépenses d’exploitation', 'Total Operating Expenses', 'Total de gastos operativos', '运营总开支')}
                      </span>
                      <strong style={{ color: '#f87171' }}>- {fmtCAD(plexResult.totalExpenses)}</strong>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 0',
                        borderBottom: '1px solid rgba(200, 164, 93, 0.35)',
                        color: 'var(--gold-light)',
                        fontWeight: 700
                      }}
                    >
                      <span>{tr(lang, 'Revenu Net d’Opération (RNO / NOI)', 'Net Operating Income (NOI / RNO)', 'Ingreso Operativo Neto (NOI)', '净营业收入 (NOI)')}</span>
                      <span>{fmtCAD(plexResult.noi)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Service de la dette hypothécaire (annuel)', 'Annual Mortgage Debt Service', 'Servicio de deuda hipotecaria (anual)', '年度按揭还本付息总额')}
                      </span>
                      <strong style={{ color: '#f87171' }}>- {fmtCAD(plexResult.annualDebtService)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Capital remboursé la 1re année (Équité)', '1st Year Principal Repaid (Equity)', 'Capital amortizado el 1.er año (Patrimonio)', '第一年偿还本金 (净资产积累)')}
                      </span>
                      <strong style={{ color: 'var(--gold-light)' }}>+ {fmtCAD(plexResult.firstYearPrincipal)}</strong>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '14px 0 4px',
                        borderTop: '1px solid var(--border-gold)',
                        fontSize: '1.05rem',
                        fontWeight: 700
                      }}
                    >
                      <span>{tr(lang, 'Cashflow net annuel réel', 'Real Net Annual Cashflow', 'Flujo de caja neto anual real', '实际年度净现金流')}</span>
                      <span className="num-metric" style={{ fontSize: '1.22rem', color: plexResult.annualCashflow >= 0 ? 'var(--gold-light)' : '#f87171' }}>
                        {(plexResult.annualCashflow >= 0 ? '+ ' : '') + fmtCAD(plexResult.annualCashflow)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '26px' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {tr(lang, 'Recevoir le bilan détaillé par courriel', 'Receive Full Analysis Report', 'Recibir informe detallado por correo', '通过电子邮件接收完整分析报告')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline"
                  >
                    <Printer size={15} /> {tr(lang, 'Imprimer / Exporter ce bilan (PDF)', 'Print / Export Summary (PDF)', 'Imprimir / Exportar resumen (PDF)', '打印 / 导出计算报告 (PDF)')}
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('courtiers')}
                    className="btn-outline"
                  >
                    {tr(lang, 'Parler à un courtier', 'Speak with a Broker', 'Hablar con un corredor', '联系经纪人咨询')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 2 : CAPACITÉ D'EMPRUNT (TEST B-20) — Épuré sans boîte
           ================================================================= */}
        {activeTool === 'affordability' && (
          <div style={{ paddingTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gold-light)', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {tr(lang, 'Revenus du ménage, dettes et taux', 'Household Income, Debts & Rate', 'Ingresos del hogar, deudas y tasa', '家庭收入、负债与按揭利率')}
                </h3>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {tr(lang, 'Revenu annuel brut du ménage ($)', 'Gross Annual Household Income ($)', 'Ingreso anual bruto del hogar ($)', '家庭年度总收入 ($)')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={affIncome}
                    step="2500"
                    onChange={(e) => setAffIncome(Number(e.target.value))}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Dettes mensuelles ($)', 'Monthly Debt Payments ($)', 'Pagos de deudas mensuales ($)', '每月其他债务支出 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={affDebts}
                      step="50"
                      onChange={(e) => setAffDebts(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Mise de fonds disponible ($)', 'Available Down Payment ($)', 'Pago inicial disponible ($)', '可用首付款资金 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={affDown}
                      step="2500"
                      onChange={(e) => setAffDown(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taux hypothécaire négocié (%)', 'Negotiated Mortgage Rate (%)', 'Tasa hipotecaria negociada (%)', '协商按揭利率 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={affRateNeg}
                      step="0.05"
                      onChange={(e) => setAffRateNeg(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taxes mun. & scolaires ($/an)', 'Municipal & School Taxes ($/yr)', 'Impuestos mun. y escolares ($/año)', '市政税与学校税 ($/年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={affTaxes}
                      step="100"
                      onChange={(e) => setAffTaxes(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Frais de copropriété ($/mois)', 'Condo Fees ($/month)', 'Gastos de condominio ($/mes)', '公寓物业管理费 ($/月)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={affCondo}
                      step="25"
                      onChange={(e) => setAffCondo(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Chauffage estimé ($/mois)', 'Heating Estimate ($/month)', 'Calefacción estimada ($/mes)', '预估供暖费 ($/月)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={affHeat}
                      step="10"
                      onChange={(e) => setAffHeat(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span className="badge-gold" style={{ marginBottom: '12px' }}>
                    {tr(
                      lang,
                      `Taux de qualification B-20 : ${affResult.stressRate} %`,
                      `B-20 Qualifying Rate: ${affResult.stressRate}%`,
                      `Tasa de calificación B-20: ${affResult.stressRate} %`,
                      `B-20 压力测试合格利率：${affResult.stressRate}%`
                    )}
                  </span>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    {tr(lang, 'Prix d’achat maximal estimé', 'Maximum Estimated Purchase Price', 'Precio máximo de compra estimado', '预估最高可购房价')}
                  </div>
                  <div className="num-metric gold-gradient-text" style={{ fontSize: '2.45rem', fontWeight: 700, marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {fmtCAD(affResult.maxPrice)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ borderLeft: '2px solid rgba(255,255,255,0.18)', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tr(lang, 'Prêt hypothécaire net', 'Net Mortgage Loan', 'Préstamo hipotecario neto', '净按揭贷款额')}
                      </div>
                      <div className="num-metric" style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '4px' }}>
                        {fmtCAD(affResult.netLoan)}
                      </div>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tr(lang, 'Mise de fonds appliquée', 'Down Payment Applied', 'Pago inicial aplicado', '已投入首付款')}
                      </div>
                      <div className="num-metric" style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '4px', color: 'var(--gold-light)' }}>
                        {fmtCAD(affDown)}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '28px' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {tr(lang, 'Recevoir mon bilan de capacité d’emprunt', 'Receive My Pre-Qualification Report', 'Recibir mi informe de capacidad de endeudamiento', '获取我的贷款能力评估报告')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline"
                  >
                    <Printer size={15} /> {tr(lang, 'Imprimer / Exporter ce bilan (PDF)', 'Print / Export Summary (PDF)', 'Imprimir / Exportar resumen (PDF)', '打印 / 导出计算报告 (PDF)')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 3 : CALCULATRICE HYPOTHÉCAIRE CANADIENNE — Épuré sans boîte
           ================================================================= */}
        {activeTool === 'mortgage' && (
          <div style={{ paddingTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gold-light)', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {tr(lang, 'Paramètres du prêt hypothécaire', 'Mortgage Parameters', 'Parámetros del préstamo hipotecario', '按揭贷款参数设置')}
                </h3>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {tr(lang, 'Montant du prêt hypothécaire ($)', 'Mortgage Loan Amount ($)', 'Monto del préstamo hipotecario ($)', '按揭贷款金额 ($)')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={mcLoan}
                    step="10000"
                    onChange={(e) => setMcLoan(Number(e.target.value))}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taux d’intérêt (%)', 'Interest Rate (%)', 'Tasa de interés (%)', '贷款年利率 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={mcRate}
                      step="0.05"
                      onChange={(e) => setMcRate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Amortissement (Années)', 'Amortization (Years)', 'Amortización (Años)', '摊销年限 (年)')}
                    </label>
                    <select
                      className="form-control"
                      value={mcAmort}
                      onChange={(e) => setMcAmort(Number(e.target.value))}
                    >
                      <option value={15}>15 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                      <option value={20}>20 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                      <option value={25}>25 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                      <option value={30}>30 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {tr(lang, 'Fréquence des versements', 'Payment Frequency', 'Frecuencia de pagos', '还款频率')}
                  </label>
                  <select
                    className="form-control"
                    value={mcFreq}
                    onChange={(e) => setMcFreq(Number(e.target.value))}
                  >
                    <option value={12}>{tr(lang, 'Mensuel (12/an)', 'Monthly (12/yr)', 'Mensual (12/año)', '每月还款 (12次/年)')}</option>
                    <option value={24}>{tr(lang, 'Bimensuel (24/an)', 'Semi-monthly (24/yr)', 'Quincenal (24/año)', '半月还款 (24次/年)')}</option>
                    <option value={26}>{tr(lang, 'Aux 2 semaines (26/an)', 'Bi-weekly (26/yr)', 'Cada 2 semanas (26/año)', '双周还款 (26次/年)')}</option>
                    <option value={52}>{tr(lang, 'Hebdomadaire (52/an)', 'Weekly (52/yr)', 'Semanal (52/año)', '每周还款 (52次/年)')}</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {tr(lang, 'Versement hypothécaire estimé', 'Estimated Mortgage Payment', 'Pago hipotecario estimado', '预估每期按揭还款额')}
                  </div>
                  <div className="num-metric gold-gradient-text" style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {fmtCAD(mcResult.payment)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ borderLeft: '2px solid rgba(255,255,255,0.18)', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tr(lang, 'Total des intérêts', 'Total Interest Over Term', 'Interés total acumulado', '贷款期总利息')}
                      </div>
                      <div className="num-metric" style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '3px' }}>
                        {fmtCAD(mcResult.totalInterest)}
                      </div>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tr(lang, 'Total versé (Capital + Int.)', 'Total Paid (Principal + Int.)', 'Total pagado (Capital + Int.)', '还款总额 (本金 + 利息)')}
                      </div>
                      <div className="num-metric" style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '3px' }}>
                        {fmtCAD(mcResult.totalPaid)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(200, 164, 93, 0.25)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <strong style={{ color: 'var(--gold-light)' }}>
                      {tr(lang, 'Astuce versement accéléré aux 2 sem. : ', 'Accelerated Bi-Weekly Tip: ', 'Consejo de pago quincenal acelerado: ', '加速双周还款建议：')}
                    </strong>
                    {tr(
                      lang,
                      `Économisez ${fmtCAD(mcResult.savingAccel)} en intérêts et libérez votre prêt ~${mcResult.yearsSaved} ans plus tôt.`,
                      `Save ${fmtCAD(mcResult.savingAccel)} in interest and pay off ~${mcResult.yearsSaved} years faster.`,
                      `Ahorre ${fmtCAD(mcResult.savingAccel)} en intereses y liquide su préstamo ~${mcResult.yearsSaved} años antes.`,
                      `可节省 ${fmtCAD(mcResult.savingAccel)} 利息，并提前约 ${mcResult.yearsSaved} 年还清贷款。`
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {tr(lang, 'Recevoir mon tableau d’amortissement complet', 'Receive My Amortization Schedule', 'Recibir mi tabla de amortización completa', '获取我的完整摊销还款表')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline"
                  >
                    <Printer size={15} /> {tr(lang, 'Imprimer / Exporter ce bilan (PDF)', 'Print / Export Summary (PDF)', 'Imprimir / Exportar resumen (PDF)', '打印 / 导出计算报告 (PDF)')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 4 : TAXE DE BIENVENUE (DROITS DE MUTATION QC & MTL 2026) — Épuré
           ================================================================= */}
        {activeTool === 'welcome' && (
          <div style={{ paddingTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gold-light)', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {tr(lang, 'Calcul des droits de mutation (Barèmes 2026)', 'Property Transfer Duties (2026 Brackets)', 'Cálculo de Impuestos de Transferencia (Tarifas 2026)', '土地转让税计算 (2026 税率标准)')}
                </h3>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {tr(lang, 'Prix d’achat / Base d’imposition ($)', 'Purchase Price / Tax Base ($)', 'Precio de compra / Base imponible ($)', '购买价格 / 计税基数 ($)')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={wtPrice}
                    step="10000"
                    onChange={(e) => setWtPrice(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {tr(lang, 'Municipalité', 'Municipality', 'Municipio', '所在城市')}
                  </label>
                  <select
                    className="form-control"
                    value={wtIsMtl ? 'mtl' : 'qc'}
                    onChange={(e) => setWtIsMtl(e.target.value === 'mtl')}
                  >
                    <option value="mtl">
                      {tr(lang, 'Montréal (Tranches progressives jusqu’à 3,0 %)', 'Montreal (Progressive brackets up to 3.0%)', 'Montreal (Tramos progresivos hasta 3,0 %)', '蒙特利尔 (累进税率最高 3.0%)')}
                    </option>
                    <option value="qc">
                      {tr(lang, 'Ailleurs au Québec (Tranches standards jusqu’à 1,5 %)', 'Rest of Quebec (Standard brackets up to 1.5%)', 'Resto de Quebec (Tramos estándar hasta 1,5 %)', '魁北克其他地区 (标准税率最高 1.5%)')}
                    </option>
                  </select>
                </div>
              </div>

              <div style={{ padding: '4px 0' }}>
                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {tr(lang, 'Total de la taxe de bienvenue estimée', 'Total Transfer Duties Payable', 'Total estimado del impuesto de transferencia', '预估欢迎税 (土地转让税) 总额')}
                  </div>
                  <div className="num-metric gold-gradient-text" style={{ fontSize: '2.35rem', fontWeight: 700, marginTop: '4px' }}>
                    {fmtCAD(wtResult.total)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {wtResult.brackets.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.88rem'
                      }}
                    >
                      <span>
                        <strong style={{ color: 'var(--gold)', marginRight: '10px' }}>{b.rate}</strong>
                        <span style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
                      </span>
                      <strong>{fmtCAD(b.amount)}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {tr(lang, 'Recevoir ce bilan par courriel', 'Receive Summary by Email', 'Recibir resumen por correo', '通过电子邮件接收计算报告')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline"
                  >
                    <Printer size={15} /> {tr(lang, 'Imprimer / Exporter ce bilan (PDF)', 'Print / Export Summary (PDF)', 'Imprimir / Exportar resumen (PDF)', '打印 / 导出计算报告 (PDF)')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* =================================================================
            OUTIL 5 : FRAIS DE CLÔTURE & LIQUIDITÉS CHEZ LE NOTAIRE — Épuré
           ================================================================= */}
        {activeTool === 'closing' && (
          <div style={{ paddingTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gold-light)', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {tr(lang, 'Paramètres des frais de clôture', 'Acquisition & Notary Closing Costs', 'Parámetros de costos de cierre y notaría', '交割与公证费用参数')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Prix d’achat ($)', 'Purchase Price ($)', 'Precio de compra ($)', '购买价格 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={ccPrice}
                      step="10000"
                      onChange={(e) => setCcPrice(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Mise de fonds (%)', 'Down Payment (%)', 'Pago inicial (%)', '首付比例 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={ccDownPct}
                      step="1"
                      min="5"
                      max="90"
                      onChange={(e) => setCcDownPct(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Inspection ($)', 'Inspection ($)', 'Inspección ($)', '验房费 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={ccInsp}
                      step="50"
                      onChange={(e) => setCcInsp(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Notaire ($)', 'Notary ($)', 'Notario ($)', '公证费 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={ccNotary}
                      step="100"
                      onChange={(e) => setCcNotary(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Déménagement ($)', 'Moving / Misc ($)', 'Mudanza / Otros ($)', '搬家及杂费 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={ccMove}
                      step="100"
                      onChange={(e) => setCcMove(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div style={{ padding: '4px 0' }}>
                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {tr(lang, 'Total des liquidités requises à la signature', 'Total Liquid Cash Required at Closing', 'Total de liquidez requerida al cierre', '过户交割所需流动资金总额')}
                  </div>
                  <div className="num-metric gold-gradient-text" style={{ fontSize: '2.35rem', fontWeight: 700, marginTop: '4px' }}>
                    {fmtCAD(ccResult.totalCash)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{tr(lang, 'Mise de fonds', 'Down Payment', 'Pago inicial', '首付款')}</span>
                    <strong>{fmtCAD(ccResult.down)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {tr(lang, 'Taxe de bienvenue (est. Montréal)', 'Welcome Tax (Montreal est.)', 'Impuesto de transferencia (est. Montreal)', '欢迎税 (蒙特利尔预估)')}
                    </span>
                    <strong>{fmtCAD(ccResult.welcome)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {tr(lang, 'Taxe de 9 % sur prime SCHL', '9% Provincial Tax on CMHC Premium', 'Impuesto provincial del 9 % sobre prima SCHL', 'CMHC 按揭保险费 9% 省税')}
                    </span>
                    <strong>{fmtCAD(ccResult.schlTax)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {tr(lang, 'Notaire, inspection et divers', 'Notary, Inspection & Moving', 'Notario, inspección y varios', '公证、验房及搬家杂费')}
                    </span>
                    <strong>{fmtCAD(ccResult.others)}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {tr(lang, 'Recevoir ce bilan par courriel', 'Receive Summary by Email', 'Recibir resumen por correo', '通过电子邮件接收计算报告')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline"
                  >
                    <Printer size={15} /> {tr(lang, 'Imprimer / Exporter ce bilan (PDF)', 'Print / Export Summary (PDF)', 'Imprimir / Exportar resumen (PDF)', '打印 / 导出计算报告 (PDF)')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* =================================================================
            OUTIL 6 : COMPARATEUR LOUER VS ACHETER — Épuré sans boîte
           ================================================================= */}
        {activeTool === 'rvb' && (
          <div style={{ paddingTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gold-light)', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {tr(lang, 'Paramètres Louer vs Acheter', 'Rent vs. Ownership Parameters', 'Parámetros Alquilar vs. Comprar', '租房 vs 买房对比参数')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Loyer mensuel actuel ($)', 'Current Monthly Rent ($)', 'Alquiler mensual actual ($)', '当前每月租金 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={rvbRent}
                      step="50"
                      onChange={(e) => setRvbRent(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Horizon de comparaison', 'Comparison Horizon (Years)', 'Horizonte de comparación', '对比周期 (年)')}
                    </label>
                    <select
                      className="form-control"
                      value={rvbYears}
                      onChange={(e) => setRvbYears(Number(e.target.value))}
                    >
                      <option value={3}>3 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                      <option value={5}>5 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                      <option value={10}>10 {tr(lang, 'ans', 'years', 'años', '年')}</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Prix propriété ($)', 'Property Price ($)', 'Precio propiedad ($)', '房产价格 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={rvbPrice}
                      step="10000"
                      onChange={(e) => setRvbPrice(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Mise de fonds ($)', 'Down Payment ($)', 'Pago inicial ($)', '首付款 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={rvbDown}
                      step="2500"
                      onChange={(e) => setRvbDown(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taux (%)', 'Rate (%)', 'Tasa (%)', '利率 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={rvbRate}
                      step="0.05"
                      onChange={(e) => setRvbRate(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '22px'
                }}
              >
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ borderLeft: '2px solid #f87171', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tr(lang, `Loyers perdus (${rvbYears} ans)`, `Rent Lost (${rvbYears} yrs)`, `Alquileres perdidos (${rvbYears} años)`, `累计纯租金支出 (${rvbYears} 年)`)}
                      </div>
                      <div className="num-metric" style={{ fontSize: '1.55rem', fontWeight: 700, color: '#f87171', marginTop: '4px' }}>
                        - {fmtCAD(rvbResult.totalRent)}
                      </div>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tr(lang, `Équité totale (${rvbYears} ans)`, `Total Equity (${rvbYears} yrs)`, `Patrimonio total (${rvbYears} años)`, `累计房产净值 (${rvbYears} 年)`)}
                      </div>
                      <div className="num-metric gold-gradient-text" style={{ fontSize: '1.55rem', fontWeight: 700, marginTop: '4px' }}>
                        + {fmtCAD(rvbResult.totalEquity)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {tr(
                        lang,
                        'Nouvel enrichissement net créé (Capital remboursé + Plus-value 3 %/an)',
                        'New Net Wealth Created (Principal Repaid + 3%/yr Appreciation)',
                        'Nueva riqueza neta creada (Capital amortizado + Plusvalía 3 %/año)',
                        '新增净财富积累 (已还本金 + 每年 3% 房产增值)'
                      )}
                    </div>
                    <div className="num-metric gold-gradient-text" style={{ fontSize: '2.1rem', fontWeight: 700, marginTop: '4px' }}>
                      + {fmtCAD(rvbResult.netWealthCreated)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {tr(lang, 'Recevoir ce bilan par courriel', 'Receive Summary by Email', 'Recibir resumen por correo', '通过电子邮件接收计算报告')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline"
                  >
                    <Printer size={15} /> {tr(lang, 'Imprimer / Exporter ce bilan (PDF)', 'Print / Export Summary (PDF)', 'Imprimir / Exportar resumen (PDF)', '打印 / 导出计算报告 (PDF)')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 7 : ATTENDRE VS ACHETER (COÛT DE L'ATTENTE) — Épuré sans boîte
           ================================================================= */}
        {activeTool === 'wait' && (
          <div style={{ paddingTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gold-light)', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {tr(lang, 'Impact d’attendre une baisse de taux', 'Cost of Waiting Parameters', 'Impacto de esperar una baja de tasas', '等待降息 vs 立即购买参数')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Prix de la propriété aujourd’hui ($)', 'Property Price Today ($)', 'Precio de la propiedad hoy ($)', '当前房产价格 ($)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={waitPrice}
                      step="10000"
                      onChange={(e) => setWaitPrice(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Délai d’attente (Mois)', 'Wait Period (Months)', 'Período de espera (Meses)', '等待周期 (月)')}
                    </label>
                    <select
                      className="form-control"
                      value={waitMonths}
                      onChange={(e) => setWaitMonths(Number(e.target.value))}
                    >
                      <option value={6}>6 {tr(lang, 'mois', 'months', 'meses', '个月')}</option>
                      <option value={12}>12 {tr(lang, 'mois', 'months', 'meses', '个月')}</option>
                      <option value={18}>18 {tr(lang, 'mois', 'months', 'meses', '个月')}</option>
                      <option value={24}>24 {tr(lang, 'mois', 'months', 'meses', '个月')}</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taux actuel (%)', 'Rate Today (%)', 'Tasa actual (%)', '当前利率 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={waitRateNow}
                      step="0.05"
                      onChange={(e) => setWaitRateNow(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Taux espéré (%)', 'Future Rate (%)', 'Tasa futura esperada (%)', '预期未来利率 (%)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={waitRateFuture}
                      step="0.05"
                      onChange={(e) => setWaitRateFuture(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Hausse prix (%/an)', 'Price Growth (%/yr)', 'Aumento de precio (%/año)', '房价年涨幅 (%/年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={waitApprec}
                      step="0.5"
                      onChange={(e) => setWaitApprec(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '18px' }}>
                    <div style={{ borderLeft: '2px solid #f87171', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tr(lang, `Prix futur estimé (+${waitMonths} mois)`, `Future Property Price (+${waitMonths}m)`, `Precio futuro estimado (+${waitMonths} meses)`, `预估未来房价 (+${waitMonths} 个月)`)}
                      </div>
                      <div className="num-metric" style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '4px' }}>
                        {fmtCAD(waitResult.priceFuture)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '2px' }}>
                        + {fmtCAD(waitResult.appreciationAmt)}
                      </div>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '14px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tr(lang, 'Plus-value manquée en attendant', 'Equity Missed While Waiting', 'Plusvalía perdida por esperar', '等待期间错失的房产增值')}
                      </div>
                      <div className="num-metric gold-gradient-text" style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '4px' }}>
                        {fmtCAD(waitResult.appreciationAmt)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.92rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {waitResult.totalImpact > 0
                      ? tr(
                          lang,
                          `Attendre ${waitMonths} mois vous coûterait environ ${fmtCAD(waitResult.totalImpact)} de plus sur 5 ans en raison de la hausse des prix, même si les taux baissent.`,
                          `Waiting ${waitMonths} months would cost you approximately ${fmtCAD(waitResult.totalImpact)} more over 5 years due to property appreciation, even with a lower rate.`,
                          `Esperar ${waitMonths} meses le costaría aproximadamente ${fmtCAD(waitResult.totalImpact)} más en 5 años debido al aumento de precios, incluso si bajan las tasas.`,
                          `由于房价上涨，即使未来利率下调，等待 ${waitMonths} 个月仍将在 5 年内使您的总成本增加约 ${fmtCAD(waitResult.totalImpact)}。`
                        )
                      : tr(
                          lang,
                          'La baisse de taux projetée compense la hausse de prix estimée sur cette période.',
                          'The projected interest rate drop offsets the estimated price increase over this period.',
                          'La baja de tasa proyectada compensa el aumento de precio estimado durante este período.',
                          '在此期间，预期的利率下降足以抵消预估的房价上涨成本。'
                        )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {tr(lang, 'Recevoir ce bilan par courriel', 'Receive Summary by Email', 'Recibir resumen por correo', '通过电子邮件接收计算报告')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline"
                  >
                    <Printer size={15} /> {tr(lang, 'Imprimer / Exporter ce bilan (PDF)', 'Print / Export Summary (PDF)', 'Imprimir / Exportar resumen (PDF)', '打印 / 导出计算报告 (PDF)')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* =================================================================
            OUTIL 8 : LOYER COMMERCIAL NET VS BRUT ($/PI²/AN) — Épuré sans boîte (#8)
           ================================================================= */}
        {activeTool === 'commercialLease' && (
          <div style={{ paddingTop: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              {/* Colonne gauche : Champs d'entrée */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="serif-title" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gold-light)', margin: 0 }}>
                    {tr(lang, 'Paramètres du bail commercial', 'Commercial Lease Parameters', 'Parámetros del contrato comercial', '商业租约参数设置')}
                  </h3>
                  <span className="badge-gold">
                    {tr(lang, 'Commercial & Franchises', 'Commercial & Franchises', 'Comercial y Franquicias', '商业地产与连锁选址')}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {tr(lang, 'Superficie du local (pi²)', 'Premises Area (sq. ft.)', 'Superficie del local (pies²)', '商铺/办公面积 (平方英尺 pi²)')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={clArea}
                    min="200"
                    max="50000"
                    step="100"
                    onChange={(e) => setClArea(Number(e.target.value))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Loyer de base Net ($ / pi² / an)', 'Base Net Rent ($ / sq. ft. / yr)', 'Alquiler base Neto ($ / pie² / año)', '基本净租金 ($ / 平方英尺 / 年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={clBaseRent}
                      min="5"
                      max="150"
                      step="0.5"
                      onChange={(e) => setClBaseRent(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Loyer additionnel — Taxes, assurances, entretien CAM ($ / pi² / an)', 'Additional Rent — Taxes, Insurance, CAM ($ / sq. ft. / yr)', 'Alquiler adicional — Impuestos, seguros, CAM ($ / pie² / año)', '附加租金 — 税费、保险及物业维护 CAM ($ / pi² / 年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={clAddRent}
                      min="0"
                      max="80"
                      step="0.5"
                      onChange={(e) => setClAddRent(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Indexation annuelle du loyer de base (% / an)', 'Annual Base Rent Escalation (% / yr)', 'Indexación anual del alquiler base (% / año)', '基本租金年度递增率 (% / 年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={clEscalation}
                      min="0"
                      max="10"
                      step="0.5"
                      onChange={(e) => setClEscalation(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {tr(lang, 'Durée du bail commercial (années)', 'Commercial Lease Term (years)', 'Duración del contrato comercial (años)', '商业租约期限 (年)')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={clTermYears}
                      min="1"
                      max="20"
                      step="1"
                      onChange={(e) => setClTermYears(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Colonne droite : Résultats calculés */}
              <div
                style={{
                  padding: '4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {tr(
                      lang,
                      'Loyer mensuel Brut total (Année 1, avant TPS/TVQ)',
                      'Total Gross Monthly Rent (Year 1, before GST/QST)',
                      'Alquiler mensual Bruto total (Año 1, antes de impuestos)',
                      '第一年每月总毛租金 (税前 GST/QST)'
                    )}
                  </div>
                  <div className="num-metric gold-gradient-text" style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {fmtCAD(clResult.monthlyGrossYear1)} <span style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{tr(lang, '/ mois', '/ month', '/ mes', '/ 月')}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Taux Brut global au pi² (et équivalent m²)', 'Total Gross Rate per sq. ft. (& sq. m. eq.)', 'Tasa Bruta global por pie² (y equiv. m²)', '每平方英尺综合毛租金率 (及每平方米折算)')}
                      </span>
                      <strong style={{ color: 'var(--gold-light)' }}>
                        {clResult.grossRateSqFt} $ / pi² / {tr(lang, 'an', 'yr', 'año', '年')} ({clResult.grossRateSqM} $ / m² / {tr(lang, 'an', 'yr', 'año', '年')})
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Loyer mensuel de base (Net)', 'Monthly Base Rent (Net)', 'Alquiler mensual base (Neto)', '每月基本净租金 (Net)')}
                      </span>
                      <strong>
                        {fmtCAD(clResult.monthlyBase)} {tr(lang, '/ mois', '/ month', '/ mes', '/ 月')}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Loyer mensuel additionnel (Frais CAM)', 'Monthly Additional Rent (Operating / CAM)', 'Alquiler mensual adicional (Gastos CAM)', '每月附加租金 (税保及运营维护 CAM)')}
                      </span>
                      <strong>
                        {fmtCAD(clResult.monthlyAdd)} {tr(lang, '/ mois', '/ month', '/ mes', '/ 月')}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {tr(lang, 'Budget annuel total (Année 1)', 'Total Annual Budget (Year 1)', 'Presupuesto anual total (Año 1)', '第一年年度总租金预算')}
                      </span>
                      <strong>
                        {fmtCAD(clResult.annualGrossYear1)} {tr(lang, '/ an', '/ yr', '/ año', '/ 年')}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0 4px',
                        borderTop: '1px solid var(--border-gold)',
                        fontSize: '1.02rem',
                        fontWeight: 700
                      }}
                    >
                      <span>
                        {tr(
                          lang,
                          `Engagement total sur le bail (${clResult.years} ans, indexé à ${clEscalation} %/an)`,
                          `Total Lease Commitment (${clResult.years} yrs, ${clEscalation}%/yr escalation)`,
                          `Compromiso total del contrato (${clResult.years} años, indexado al ${clEscalation} %/año)`,
                          `租约期总承诺金额 (${clResult.years} 年，基本租金年递增 ${clEscalation}%)`
                        )}
                      </span>
                      <span className="num-metric" style={{ fontSize: '1.22rem', color: 'var(--gold-light)' }}>
                        {fmtCAD(clResult.totalLeaseCommitment)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {tr(lang, 'Recevoir ce bilan par courriel', 'Receive Summary by Email', 'Recibir resumen por correo', '通过电子邮件接收计算报告')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline"
                  >
                    <Printer size={15} /> {tr(lang, 'Imprimer / Exporter ce bilan (PDF)', 'Print / Export Summary (PDF)', 'Imprimir / Exportar resumen (PDF)', '打印 / 导出计算报告 (PDF)')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* =================================================================
            OUTIL 9 : ÉVALUE MA PROPRIÉTÉ (POUR VENDRE OU LOUER)
           ================================================================= */}
        {activeTool === 'valuation' && (
          <div style={{ paddingTop: '4px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '48px',
                alignItems: 'start'
              }}
            >
              <div>
                <span className="badge-gold" style={{ marginBottom: '8px' }}>
                  {tr(lang, 'Service Clients • Vente & Location', 'Client Service • Sale & Lease', 'Servicio al Cliente • Venta y Alquiler', '客户服务 • 出售与出租')}
                </span>
                <h3 className="serif-title" style={{ fontSize: '2.1rem', fontWeight: 600, marginBottom: '12px' }}>
                  {tr(lang, 'Évalue ma propriété', 'Value My Property', 'Evalúa mi propiedad', '评估我的物业')}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '24px' }}>
                  {tr(
                    lang,
                    'Vous souhaitez vendre ou louer un immeuble commercial, industriel, un terrain, une entreprise récréotouristique (pourvoirie, camping, auberge) ou une propriété résidentielle ? Nos courtiers réalisent une analyse de valeur marchande rigoureuse et confidentielle.',
                    'Looking to sell or lease a commercial, industrial, land, resort (outfitter, campground, inn) or residential property? Our brokers provide a rigorous, confidential market valuation.',
                    '¿Desea vender o alquilar una propiedad comercial, industrial, turística o residencial? Nuestros corredores realizan un análisis de valor de mercado riguroso y confidencial.',
                    '想要出售或出租商业、工业、度假村或住宅物业？我们的资深经纪人为您提供严谨保密的市场价值评估。'
                  )}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                  {[
                    tr(lang, 'Analyse comparative des transactions récentes (Centris / MLS & hors-marché)', 'Comparative analysis of recent transactions (Centris / MLS & off-market)', 'Análisis comparativo de transacciones recientes (Centris / MLS)', '近期成交案例对比分析 (Centris / MLS 及非公开市场)'),
                    tr(lang, 'Évaluation du taux de capitalisation (TGA / Cap Rate) et normalisation du RNO', 'Cap Rate valuation and NOI normalization for income properties', 'Evaluación de tasa de capitalización (Cap Rate) y NOI', '收益型物业资本化率 (Cap Rate) 与净营业收入评估'),
                    tr(lang, 'Mise en marché stratégique locale et internationale (réseau CQF & acheteurs qualifiés)', 'Strategic local and international marketing (CQF network & qualified buyers)', 'Comercialización estratégica local e internacional', '本地及国际战略营销推广（CQF 网络与合格买家库）')
                  ].map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(200, 164, 93, 0.35)',
                  borderRadius: '12px',
                  padding: '28px'
                }}
              >
                {valSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '24px 8px' }}>
                    <CheckCircle2 size={44} style={{ color: 'var(--gold)', margin: '0 auto 12px' }} />
                    <h4 className="serif-title" style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>
                      {tr(lang, 'Demande d’évaluation transmise', 'Valuation Request Sent', 'Solicitud de evaluación enviada', '评估申请已提交')}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
                      {tr(
                        lang,
                        'Votre demande d’évaluation a été acheminée avec succès. Votre courtier communiquera avec vous rapidement.',
                        'Your valuation request has been routed successfully. Your broker will contact you shortly.',
                        'Su solicitud de evaluación ha sido enviada con éxito.',
                        '您的物业评估申请已成功分派，经纪人将尽快与您联系。'
                      )}
                    </p>
                    <button type="button" onClick={() => setValSubmitted(false)} className="btn-gold">
                      {tr(lang, 'Nouvelle demande d’évaluation', 'New Valuation Request', 'Nueva solicitud', '提交新的评估申请')}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const chosenBroker = INITIAL_HIMALAYA_BROKERS.find(b => b.id === valBrokerId) || null;
                      await submitLeadToProspection({
                        type: 'valuation',
                        source: `Outil Évalue ma propriété (${valPurpose})`,
                        name: valFullName,
                        fullName: valFullName,
                        phone: valPhone,
                        email: valEmail,
                        city: valCity,
                        assetType: valAssetType,
                        revenue: valGrossRevenue || valExpectedPrice,
                        assigned_broker: chosenBroker ? chosenBroker.name : 'Direction générale — Immobilier Himalaya',
                        broker_email: chosenBroker ? chosenBroker.email : 'info@himalayacorp.com',
                        message: `[Objectif : ${valPurpose}] [Type : ${valAssetType}] [Ville/Adresse : ${valCity}] [Superficie/Unités : ${valSurfaceOrUnits}] [Revenus/Prix : ${valGrossRevenue} / ${valExpectedPrice}] ${valNotes}`
                      });
                      setValSubmitted(true);
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    {/* Objectif : Vendre ou Louer */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                        {tr(lang, 'Objectif de la démarche', 'Objective', 'Objetivo', '委托目标')}
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[
                          { id: 'Vendre', label: tr(lang, 'Vendre ma propriété', 'Sell My Property', 'Vender mi propiedad', '出售我的物业') },
                          { id: 'Louer', label: tr(lang, 'Louer ma propriété', 'Lease My Property', 'Alquilar mi propiedad', '出租我的物业') }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setValPurpose(opt.id)}
                            className={valPurpose === opt.id ? 'btn-gold' : 'btn-outline'}
                            style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Choix du courtier */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {tr(lang, 'Choisir directement votre courtier (optionnel)', 'Choose Your Broker (optional)', 'Elegir su corredor (opcional)', '选择负责经纪人（可选）')}
                      </label>
                      <select
                        className="form-control"
                        value={valBrokerId}
                        onChange={e => setValBrokerId(e.target.value)}
                      >
                        <option value="">
                          {tr(lang, 'Direction générale — Immobilier Himalaya (info@himalayacorp.com)', 'General Management — Immobilier Himalaya (info@himalayacorp.com)', 'Dirección General — Immobilier Himalaya', '喜马拉雅地产总部管理层')}
                        </option>
                        {INITIAL_HIMALAYA_BROKERS.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name} — {pickLang(b, 'shortTitle', lang)} ({b.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type d'actif */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {tr(lang, 'Catégorie de propriété', 'Property Category', 'Categoría de propiedad', '物业类别')}
                      </label>
                      <select
                        className="form-control"
                        value={valAssetType}
                        onChange={e => setValAssetType(e.target.value)}
                      >
                        <option value="Commercial / Industriel / Bureau">{tr(lang, 'Immeuble commercial / Industriel / Bureau', 'Commercial / Industrial / Office', 'Comercial / Industrial / Oficina', '商业 / 工业 / 办公楼')}</option>
                        <option value="Auberge / Camping / Pourvoirie">{tr(lang, 'Auberge / Camping / Pourvoirie / Hôtellerie', 'Inn / Campground / Outfitter / Resort', 'Posada / Camping / Coto / Hotel', '旅馆 / 露营地 / 度假村 / 酒店')}</option>
                        <option value="Multilogement / Plex">{tr(lang, 'Multilogement / Plex d’investissement', 'Multi-Family / Investment Plex', 'Multifamiliar / Plex de inversión', '多户投资公寓 (Plex)')}</option>
                        <option value="Terrain de développement">{tr(lang, 'Terrain de développement', 'Development Land', 'Terreno de desarrollo', '开发用地')}</option>
                        <option value="Propriété résidentielle">{tr(lang, 'Propriété résidentielle', 'Residential Property', 'Propiedad residencial', '住宅物业')}</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder={tr(lang, 'Ville ou adresse de la propriété *', 'Property City or Address *', 'Ciudad o dirección *', '物业所在城市或地址 *')}
                        value={valCity}
                        onChange={e => setValCity(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder={tr(lang, 'Superficie (pi²/acres) ou nb d’unités', 'Area (sq.ft./acres) or Units', 'Superficie o unidades', '面积或单元数量')}
                        value={valSurfaceOrUnits}
                        onChange={e => setValSurfaceOrUnits(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={tr(lang, 'Revenus bruts annuels ($) (si applicable)', 'Annual Gross Income ($)', 'Ingresos brutos anuales ($)', '年度总营收 ($)')}
                        value={valGrossRevenue}
                        onChange={e => setValGrossRevenue(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder={tr(lang, 'Prix ou loyer visé ($)', 'Target Price or Rent ($)', 'Precio o alquiler deseado ($)', '期望售价或租金 ($)')}
                        value={valExpectedPrice}
                        onChange={e => setValExpectedPrice(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder={tr(lang, 'Votre nom complet *', 'Your Full Name *', 'Nombre completo *', '您的姓名 *')}
                        value={valFullName}
                        onChange={e => setValFullName(e.target.value)}
                      />
                      <input
                        required
                        type="tel"
                        className="form-control"
                        placeholder={tr(lang, 'Téléphone *', 'Phone *', 'Teléfono *', '联系电话 *')}
                        value={valPhone}
                        onChange={e => setValPhone(e.target.value)}
                      />
                    </div>

                    <input
                      required
                      type="email"
                      className="form-control"
                      placeholder={tr(lang, 'Adresse courriel *', 'Email Address *', 'Correo electrónico *', '电子邮箱 *')}
                      value={valEmail}
                      onChange={e => setValEmail(e.target.value)}
                    />

                    <textarea
                      rows={3}
                      className="form-control"
                      placeholder={tr(lang, 'Précisions sur la propriété (rénovations, bail, équipements, échéancier)...', 'Property details (renovations, lease, equipment, timeline)...', 'Detalles de la propiedad...', '物业补充说明...')}
                      value={valNotes}
                      onChange={e => setValNotes(e.target.value)}
                    />

                    <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                      {tr(lang, 'Demander mon évaluation confidentielle', 'Request My Confidential Valuation', 'Solicitar mi evaluación confidencial', '申请保密物业估值')} <ArrowRight size={15} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modale de réception du bilan par courriel */}
        {leadModalOpen && (
          <div className="modal-backdrop" onClick={() => setLeadModalOpen(false)}>
            <div
              className="modal-panel"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '480px', padding: '28px' }}
            >
              {leadSent ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle2 size={42} style={{ color: 'var(--gold)', margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
                    {tr(lang, 'Demande transmise !', 'Report Request Sent!', '¡Solicitud enviada!', '报告申请已发送！')}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                    {tr(
                      lang,
                      'Un courtier Himalaya vous transmettra votre bilan détaillé sous peu.',
                      'An Himalaya broker will follow up shortly with your personalized financial analysis.',
                      'Un corredor de Himalaya le enviará su análisis financiero detallado en breve.',
                      '喜马拉雅地产经纪人将很快与您联系并发送个性化财务分析报告。'
                    )}
                  </p>
                  <button onClick={() => setLeadModalOpen(false)} className="btn-gold" style={{ width: '100%' }}>
                    {tr(lang, 'Fermer', 'Close', 'Cerrar', '关闭')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                    {tr(lang, 'Recevoir mon bilan chiffré', 'Receive My Detailed Analysis', 'Recibir mi análisis detallado', '获取我的详细财务分析报告')}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    {tr(
                      lang,
                      'Entrez vos coordonnées pour recevoir votre rapport détaillé et valider votre scénario avec un courtier Himalaya.',
                      'Enter your contact details to receive your personalized report and validate your scenario with an Himalaya broker.',
                      'Ingrese sus datos de contacto para recibir su informe detallado y validar su escenario con un corredor de Himalaya.',
                      '请输入您的联系方式以接收详细分析报告，并与喜马拉雅地产经纪人核实您的投资方案。'
                    )}
                  </p>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={tr(lang, 'Nom complet *', 'Full Name *', 'Nombre completo *', '姓名 *')}
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                  />
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder={tr(lang, 'Adresse courriel *', 'Email Address *', 'Correo electrónico *', '电子邮箱 *')}
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                  />
                  <input
                    type="tel"
                    className="form-control"
                    placeholder={tr(lang, 'Numéro de téléphone', 'Phone Number', 'Número de teléfono', '联系电话')}
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button type="submit" className="btn-gold" style={{ flex: 1 }}>
                      {tr(lang, 'Envoyer mon bilan', 'Send My Report', 'Enviar mi informe', '发送我的报告')} <ArrowRight size={15} />
                    </button>
                    <button type="button" onClick={() => setLeadModalOpen(false)} className="btn-outline">
                      {tr(lang, 'Annuler', 'Cancel', 'Cancelar', '取消')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
