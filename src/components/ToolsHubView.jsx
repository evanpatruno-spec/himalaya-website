import React, { useState, useMemo } from 'react';
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
  Printer
} from 'lucide-react';
import { submitLeadToProspection } from '../utils/prospectionBridge';

// Capitalisation semi-annuelle canadienne (Loi sur l'intérêt au Canada)
function getEffectiveMonthlyRate(annualPct) {
  if (!annualPct || annualPct <= 0) return 0;
  return Math.pow(1 + (annualPct / 100) / 2, 1 / 6) - 1;
}

// Calcul officiel des droits de mutation (Taxe de bienvenue 2026 — Québec & Montréal)
function computeWelcomeTax(price, isMontreal) {
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
        brackets.push({ label: 'Excédent (+ 1 223 100 $)', rate: '3.0 %', amount: rem * 0.03 });
      }
    } else {
      const p2 = 307800;
      const t2b = Math.min(rem, p2 - p1);
      brackets.push({ label: '61 500 $ – 307 800 $', rate: '1.0 %', amount: t2b * 0.01 });
      rem -= t2b;
      if (rem > 0) {
        brackets.push({ label: 'Excédent (+ 307 800 $)', rate: '1.5 %', amount: rem * 0.015 });
      }
    }
  }

  const total = brackets.reduce((acc, b) => acc + b.amount, 0);
  return { total, brackets };
}

export default function ToolsHubView({ lang = 'FR', onNavigate }) {
  const isEn = lang === 'EN';
  const [activeTool, setActiveTool] = useState('plex');

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

  // --- Lead Modal ---
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSent, setLeadSent] = useState(false);

  const fmtCAD = (n) =>
    Math.round(Number(n) || 0).toLocaleString(isEn ? 'en-CA' : 'fr-CA') + (isEn ? ' $' : ' $');

  const toolsList = [
    {
      id: 'plex',
      icon: Building2,
      title: isEn ? 'Commercial & Multi-Family ROI' : 'Rentabilité Plex & Commercial',
      sub: isEn ? 'Cap Rate, GIM, NOI & Cashflow' : 'TGA (Cap Rate), MRB, RNO & Cashflow'
    },
    {
      id: 'affordability',
      icon: Calculator,
      title: isEn ? 'Borrowing Capacity' : 'Capacité d’emprunt',
      sub: isEn ? 'B-20 Stress Test & GDS/TDS' : 'Test B-20 & Ratios ABD/ATD'
    },
    {
      id: 'mortgage',
      icon: Home,
      title: isEn ? 'Mortgage Calculator' : 'Calculatrice hypothécaire',
      sub: isEn ? 'Payments & Amortization' : 'Versements & Amortissement'
    },
    {
      id: 'welcome',
      icon: Landmark,
      title: isEn ? 'Welcome Tax (Transfer Duties)' : 'Taxe de bienvenue',
      sub: isEn ? 'Quebec & Montreal 2026 Brackets' : 'Barèmes Québec & Montréal 2026'
    },
    {
      id: 'closing',
      icon: FileText,
      title: isEn ? 'Closing Costs' : 'Frais de clôture',
      sub: isEn ? 'Required Cash & Notary' : 'Liquidités requises & Notaire'
    },
    {
      id: 'rvb',
      icon: Scale,
      title: isEn ? 'Rent vs. Buy' : 'Louer vs Acheter',
      sub: isEn ? 'Net Equity vs. Lost Rent' : 'Équité bâtie vs Loyers perdus'
    },
    {
      id: 'wait',
      icon: Clock,
      title: isEn ? 'Wait vs. Buy Now' : 'Attendre vs Acheter',
      sub: isEn ? 'Rate Drop vs. Price Growth' : 'Impact baisse de taux vs prix'
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
  const wtResult = useMemo(() => computeWelcomeTax(wtPrice, wtIsMtl), [wtPrice, wtIsMtl]);

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
    const welcome = computeWelcomeTax(ccPrice, true).total;
    const others = Number(ccInsp) + Number(ccNotary) + Number(ccMove);
    const totalCash = down + schlTax + welcome + others;
    return { down, schlPrem, schlTax, welcome, others, totalCash };
  }, [ccPrice, ccDownPct, ccInsp, ccNotary, ccMove]);

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
    <main style={{ flex: 1, padding: '125px 0 80px' }}>
      <div className="container">
        {/* En-tête Outils Immobiliers */}
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
            <span className="badge-gold" style={{ marginBottom: '10px' }}>
              {isEn ? 'Financial & Real Estate Simulators 2026' : 'Centre de calcul & Simulateurs 2026'}
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '6px' }}>
              {isEn ? 'Real Estate & Financial ' : 'Outils Immobiliers '}
              <span className="gold-gradient-text">{isEn ? 'Tools' : '& Financiers'}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', maxWidth: '760px' }}>
              {isEn
                ? 'Strategic analysis calculators based on Canadian banking rules (B-20), CMHC, and Quebec/Montreal transfer duty brackets.'
                : 'Outils d’analyse stratégique et financière basés sur les barèmes canadiens (test B-20, SCHL) et les droits de mutation du Québec et de Montréal.'}
            </p>
          </div>
          <button onClick={() => window.print()} className="btn-outline" style={{ fontSize: '0.82rem' }}>
            <Printer size={15} /> {isEn ? 'Print / Save PDF' : 'Imprimer / Exporter PDF'}
          </button>
        </div>

        {/* Navigation des 7 outils (Grille sobre Noir, Or & Blanc) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '10px',
            marginBottom: '32px'
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
                  background: isActive ? 'rgba(200, 164, 93, 0.14)' : 'var(--bg-card)',
                  border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border-subtle)'}`,
                  borderRadius: '12px',
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <Icon size={18} style={{ color: 'var(--gold)' }} />
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: isActive ? 'var(--gold-light)' : 'var(--text-main)',
                    lineHeight: 1.25
                  }}
                >
                  {tool.title}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.25 }}>
                  {tool.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* =================================================================
            OUTIL 1 : RENTABILITÉ PLEX & COMMERCIAL (TGA / CAP RATE, MRB, RNO)
           ================================================================= */}
        {activeTool === 'plex' && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '14px',
              padding: '30px'
            }}
          >
            {/* 4 KPIs principaux */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px',
                marginBottom: '28px'
              }}
            >
              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '18px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {isEn ? 'GIM (Gross Multiplier)' : 'MRB (Multiplicateur Brut)'}
                </div>
                <div className="gold-gradient-text" style={{ fontSize: '1.75rem', fontWeight: 700, margin: '4px 0' }}>
                  {plexResult.mrb}x
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Price / Gross Income' : 'Prix / Revenus bruts'}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '18px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {isEn ? 'Cap Rate (TGA)' : 'Taux de capitalisation (TGA)'}
                </div>
                <div className="gold-gradient-text" style={{ fontSize: '1.75rem', fontWeight: 700, margin: '4px 0' }}>
                  {plexResult.capRate} %
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'NOI / Purchase Price' : 'RNO / Prix d’achat'}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '18px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {isEn ? 'Net Monthly Cashflow' : 'Cashflow net mensuel'}
                </div>
                <div
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    margin: '4px 0',
                    color: plexResult.monthlyCashflow >= 0 ? 'var(--gold-light)' : '#f87171'
                  }}
                >
                  {(plexResult.monthlyCashflow >= 0 ? '+' : '') + fmtCAD(plexResult.monthlyCashflow)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'After debt & expenses' : 'Après hypothèque & dépenses'}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '18px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {isEn ? 'Cash-on-Cash ROI' : 'Rendement sur mise de fonds'}
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '4px 0', color: 'var(--text-main)' }}>
                  {plexResult.roi} %
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Annual Cashflow / Down Payment' : 'Cashflow annuel / Mise de fonds'}
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
                  {isEn ? '1. Acquisition, Gross Income & Financing' : '1. Acquisition, Revenus bruts & Financement'}
                </h3>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {isEn ? 'Purchase Price ($)' : 'Prix d’achat de l’immeuble ($)'}
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
                      {isEn ? 'Annual Gross Income ($)' : 'Revenus bruts annuels ($)'}
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
                      {isEn ? 'Vacancy Rate (%)' : 'Taux d’inoccupation (%)'}
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
                      {isEn ? 'Down Payment (%)' : 'Mise de fonds (%)'}
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
                      {isEn ? 'Interest Rate (%)' : 'Taux d’intérêt (%)'}
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
                      {isEn ? 'Amortization' : 'Amortissement'}
                    </label>
                    <select
                      className="form-control"
                      value={plexAmort}
                      onChange={(e) => setPlexAmort(Number(e.target.value))}
                    >
                      <option value={20}>20 {isEn ? 'years' : 'ans'}</option>
                      <option value={25}>25 {isEn ? 'years' : 'ans'}</option>
                      <option value={30}>30 {isEn ? 'years' : 'ans'}</option>
                    </select>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)', marginTop: '8px' }}>
                  {isEn ? '2. Annual Operating Expenses' : '2. Dépenses d’exploitation annuelles'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {isEn ? 'Municipal Taxes ($/yr)' : 'Taxes municipales ($/an)'}
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
                      {isEn ? 'School Taxes ($/yr)' : 'Taxes scolaires ($/an)'}
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
                      {isEn ? 'Building Insurance ($/yr)' : 'Assurance immeuble ($/an)'}
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
                      {isEn ? 'Energy / Heating ($/yr)' : 'Énergie / Chauffage ($/an)'}
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
                      {isEn ? 'Maintenance Reserve (%)' : 'Entretien & réserve (%)'}
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
                      {isEn ? 'Management ($/yr)' : 'Gestion / Conciergerie ($/an)'}
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

              {/* Colonne 2 : Bilan Financier Complet */}
              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '16px' }}>
                    {isEn ? 'Financial Operating Summary' : 'Sommaire financier d’exploitation'}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isEn ? 'Down Payment Injected' : 'Mise de fonds injectée'} ({plexDownPct}%)
                      </span>
                      <strong>{fmtCAD(plexResult.downAmount)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isEn ? 'Effective Gross Income (Net of Vacancy)' : 'Revenus effectifs nets de vacance'}
                      </span>
                      <strong>{fmtCAD(plexResult.effectiveIncome)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isEn ? 'Total Operating Expenses' : 'Total des dépenses d’exploitation'}
                      </span>
                      <strong style={{ color: '#f87171' }}>- {fmtCAD(plexResult.totalExpenses)}</strong>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(200, 164, 93, 0.12)',
                        color: 'var(--gold-light)',
                        fontWeight: 700
                      }}
                    >
                      <span>{isEn ? 'Net Operating Income (NOI / RNO)' : 'Revenu Net d’Opération (RNO / NOI)'}</span>
                      <span>{fmtCAD(plexResult.noi)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isEn ? 'Annual Mortgage Debt Service' : 'Service de la dette hypothécaire (annuel)'}
                      </span>
                      <strong style={{ color: '#f87171' }}>- {fmtCAD(plexResult.annualDebtService)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isEn ? '1st Year Principal Repaid (Equity)' : 'Capital remboursé la 1re année (Équité)'}
                      </span>
                      <strong style={{ color: 'var(--gold-light)' }}>+ {fmtCAD(plexResult.firstYearPrincipal)}</strong>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-gold)',
                        fontSize: '1rem',
                        fontWeight: 700
                      }}
                    >
                      <span>{isEn ? 'Real Net Annual Cashflow' : 'Cashflow net annuel réel'}</span>
                      <span style={{ color: plexResult.annualCashflow >= 0 ? 'var(--gold-light)' : '#f87171' }}>
                        {(plexResult.annualCashflow >= 0 ? '+ ' : '') + fmtCAD(plexResult.annualCashflow)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '22px' }}>
                  <button
                    onClick={() => {
                      setLeadSent(false);
                      setLeadModalOpen(true);
                    }}
                    className="btn-gold"
                    style={{ flex: 1 }}
                  >
                    {isEn ? 'Receive Full Analysis Report' : 'Recevoir le bilan détaillé par courriel'}
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('courtiers')}
                    className="btn-outline"
                  >
                    {isEn ? 'Speak with a Broker' : 'Parler à un courtier'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 2 : CAPACITÉ D'EMPRUNT (TEST B-20)
           ================================================================= */}
        {activeTool === 'affordability' && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '14px',
              padding: '30px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  {isEn ? 'Household Income, Debts & Rate' : 'Revenus du ménage, dettes et taux'}
                </h3>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {isEn ? 'Gross Annual Household Income ($)' : 'Revenu annuel brut du ménage ($)'}
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
                      {isEn ? 'Monthly Debt Payments ($)' : 'Dettes mensuelles ($)'}
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
                      {isEn ? 'Available Down Payment ($)' : 'Mise de fonds disponible ($)'}
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
                      {isEn ? 'Negotiated Mortgage Rate (%)' : 'Taux hypothécaire négocié (%)'}
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
                      {isEn ? 'Municipal & School Taxes ($/yr)' : 'Taxes mun. & scolaires ($/an)'}
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
                      {isEn ? 'Condo Fees ($/month)' : 'Frais de copropriété ($/mois)'}
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
                      {isEn ? 'Heating Estimate ($/month)' : 'Chauffage estimé ($/mois)'}
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
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'center'
                }}
              >
                <div>
                  <span className="badge-gold" style={{ marginBottom: '12px' }}>
                    {isEn ? `B-20 Qualifying Rate: ${affResult.stressRate}%` : `Taux de qualification B-20 : ${affResult.stressRate} %`}
                  </span>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {isEn ? 'Maximum Estimated Purchase Price' : 'Prix d’achat maximal estimé'}
                  </div>
                  <div className="gold-gradient-text" style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '20px' }}>
                    {fmtCAD(affResult.maxPrice)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'left' }}>
                    <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {isEn ? 'Net Mortgage Loan' : 'Prêt hypothécaire net'}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px' }}>
                        {fmtCAD(affResult.netLoan)}
                      </div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {isEn ? 'Down Payment Applied' : 'Mise de fonds appliquée'}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px', color: 'var(--gold-light)' }}>
                        {fmtCAD(affDown)}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLeadSent(false);
                    setLeadModalOpen(true);
                  }}
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '22px' }}
                >
                  {isEn ? 'Receive My Pre-Qualification Report' : 'Recevoir mon bilan de capacité d’emprunt'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 3 : CALCULATRICE HYPOTHÉCAIRE CANADIENNE
           ================================================================= */}
        {activeTool === 'mortgage' && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '14px',
              padding: '30px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  {isEn ? 'Mortgage Parameters' : 'Paramètres du prêt hypothécaire'}
                </h3>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {isEn ? 'Mortgage Loan Amount ($)' : 'Montant du prêt hypothécaire ($)'}
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
                      {isEn ? 'Interest Rate (%)' : 'Taux d’intérêt (%)'}
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
                      {isEn ? 'Amortization (Years)' : 'Amortissement (Années)'}
                    </label>
                    <select
                      className="form-control"
                      value={mcAmort}
                      onChange={(e) => setMcAmort(Number(e.target.value))}
                    >
                      <option value={15}>15 {isEn ? 'years' : 'ans'}</option>
                      <option value={20}>20 {isEn ? 'years' : 'ans'}</option>
                      <option value={25}>25 {isEn ? 'years' : 'ans'}</option>
                      <option value={30}>30 {isEn ? 'years' : 'ans'}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {isEn ? 'Payment Frequency' : 'Fréquence des versements'}
                  </label>
                  <select
                    className="form-control"
                    value={mcFreq}
                    onChange={(e) => setMcFreq(Number(e.target.value))}
                  >
                    <option value={12}>{isEn ? 'Monthly (12/yr)' : 'Mensuel (12/an)'}</option>
                    <option value={24}>{isEn ? 'Semi-monthly (24/yr)' : 'Bimensuel (24/an)'}</option>
                    <option value={26}>{isEn ? 'Bi-weekly (26/yr)' : 'Aux 2 semaines (26/an)'}</option>
                    <option value={52}>{isEn ? 'Weekly (52/yr)' : 'Hebdomadaire (52/an)'}</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '28px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {isEn ? 'Estimated Mortgage Payment' : 'Versement hypothécaire estimé'}
                  </div>
                  <div className="gold-gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '18px' }}>
                    {fmtCAD(mcResult.payment)}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'left', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {isEn ? 'Total Interest Over Term' : 'Total des intérêts'}
                      </div>
                      <div style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '3px' }}>
                        {fmtCAD(mcResult.totalInterest)}
                      </div>
                    </div>
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {isEn ? 'Total Paid (Principal + Int.)' : 'Total versé (Capital + Int.)'}
                      </div>
                      <div style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '3px' }}>
                        {fmtCAD(mcResult.totalPaid)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(200, 164, 93, 0.1)',
                      border: '1px solid var(--border-gold)',
                      fontSize: '0.83rem',
                      color: 'var(--text-secondary)',
                      textAlign: 'left'
                    }}
                  >
                    <strong style={{ color: 'var(--gold-light)' }}>
                      {isEn ? 'Accelerated Bi-Weekly Tip: ' : 'Astuce versement accéléré aux 2 sem. : '}
                    </strong>
                    {isEn
                      ? `Save ${fmtCAD(mcResult.savingAccel)} in interest and pay off ~${mcResult.yearsSaved} years faster.`
                      : `Économisez ${fmtCAD(mcResult.savingAccel)} en intérêts et libérez votre prêt ~${mcResult.yearsSaved} ans plus tôt.`}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLeadSent(false);
                    setLeadModalOpen(true);
                  }}
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '20px' }}
                >
                  {isEn ? 'Receive My Amortization Schedule' : 'Recevoir mon tableau d’amortissement complet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 4 : TAXE DE BIENVENUE (DROITS DE MUTATION QC & MTL 2026)
           ================================================================= */}
        {activeTool === 'welcome' && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '14px',
              padding: '30px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  {isEn ? 'Property Transfer Duties (2026 Brackets)' : 'Calcul des droits de mutation (Barèmes 2026)'}
                </h3>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    {isEn ? 'Purchase Price / Tax Base ($)' : 'Prix d’achat / Base d’imposition ($)'}
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
                    {isEn ? 'Municipality' : 'Municipalité'}
                  </label>
                  <select
                    className="form-control"
                    value={wtIsMtl ? 'mtl' : 'qc'}
                    onChange={(e) => setWtIsMtl(e.target.value === 'mtl')}
                  >
                    <option value="mtl">
                      {isEn ? 'Montreal (Progressive brackets up to 3.0%)' : 'Montréal (Tranches progressives jusqu’à 3,0 %)'}
                    </option>
                    <option value="qc">
                      {isEn ? 'Rest of Quebec (Standard brackets up to 1.5%)' : 'Ailleurs au Québec (Tranches standards jusqu’à 1,5 %)'}
                    </option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '26px'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {isEn ? 'Total Transfer Duties Payable' : 'Total de la taxe de bienvenue estimée'}
                  </div>
                  <div className="gold-gradient-text" style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '4px' }}>
                    {fmtCAD(wtResult.total)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {wtResult.brackets.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.86rem'
                      }}
                    >
                      <span>
                        <strong style={{ color: 'var(--gold)', marginRight: '8px' }}>{b.rate}</strong>
                        {b.label}
                      </span>
                      <strong>{fmtCAD(b.amount)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 5 : FRAIS DE CLÔTURE & LIQUIDITÉS CHEZ LE NOTAIRE
           ================================================================= */}
        {activeTool === 'closing' && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '14px',
              padding: '30px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  {isEn ? 'Acquisition & Notary Closing Costs' : 'Paramètres des frais de clôture'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {isEn ? 'Purchase Price ($)' : 'Prix d’achat ($)'}
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
                      {isEn ? 'Down Payment (%)' : 'Mise de fonds (%)'}
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
                      {isEn ? 'Inspection ($)' : 'Inspection ($)'}
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
                      {isEn ? 'Notary ($)' : 'Notaire ($)'}
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
                      {isEn ? 'Moving / Misc ($)' : 'Déménagement ($)'}
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

              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '26px'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {isEn ? 'Total Liquid Cash Required at Closing' : 'Total des liquidités requises à la signature'}
                  </div>
                  <div className="gold-gradient-text" style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '4px' }}>
                    {fmtCAD(ccResult.totalCash)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{isEn ? 'Down Payment' : 'Mise de fonds'}</span>
                    <strong>{fmtCAD(ccResult.down)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {isEn ? 'Welcome Tax (Montreal est.)' : 'Taxe de bienvenue (est. Montréal)'}
                    </span>
                    <strong>{fmtCAD(ccResult.welcome)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {isEn ? '9% Provincial Tax on CMHC Premium' : 'Taxe de 9 % sur prime SCHL'}
                    </span>
                    <strong>{fmtCAD(ccResult.schlTax)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {isEn ? 'Notary, Inspection & Moving' : 'Notaire, inspection et divers'}
                    </span>
                    <strong>{fmtCAD(ccResult.others)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 6 : COMPARATEUR LOUER VS ACHETER
           ================================================================= */}
        {activeTool === 'rvb' && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '14px',
              padding: '30px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  {isEn ? 'Rent vs. Ownership Parameters' : 'Paramètres Louer vs Acheter'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {isEn ? 'Current Monthly Rent ($)' : 'Loyer mensuel actuel ($)'}
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
                      {isEn ? 'Comparison Horizon (Years)' : 'Horizon de comparaison'}
                    </label>
                    <select
                      className="form-control"
                      value={rvbYears}
                      onChange={(e) => setRvbYears(Number(e.target.value))}
                    >
                      <option value={3}>3 {isEn ? 'years' : 'ans'}</option>
                      <option value={5}>5 {isEn ? 'years' : 'ans'}</option>
                      <option value={10}>10 {isEn ? 'years' : 'ans'}</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {isEn ? 'Property Price ($)' : 'Prix propriété ($)'}
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
                      {isEn ? 'Down Payment ($)' : 'Mise de fonds ($)'}
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
                      {isEn ? 'Rate (%)' : 'Taux (%)'}
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
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {isEn ? `Rent Lost (${rvbYears} yrs)` : `Loyers perdus (${rvbYears} ans)`}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginTop: '6px' }}>
                      - {fmtCAD(rvbResult.totalRent)}
                    </div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--gold)', textTransform: 'uppercase' }}>
                      {isEn ? `Total Equity (${rvbYears} yrs)` : `Équité totale (${rvbYears} ans)`}
                    </div>
                    <div className="gold-gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '6px' }}>
                      + {fmtCAD(rvbResult.totalEquity)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: 'rgba(200, 164, 93, 0.1)',
                    border: '1px solid var(--border-gold)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {isEn ? 'New Net Wealth Created (Principal Repaid + 3%/yr Appreciation)' : 'Nouvel enrichissement net créé (Capital remboursé + Plus-value 3 %/an)'}
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--gold-light)', marginTop: '4px' }}>
                    + {fmtCAD(rvbResult.netWealthCreated)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            OUTIL 7 : ATTENDRE VS ACHETER (COÛT DE L'ATTENTE)
           ================================================================= */}
        {activeTool === 'wait' && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: '14px',
              padding: '30px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  {isEn ? 'Cost of Waiting Parameters' : 'Impact d’attendre une baisse de taux'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {isEn ? 'Property Price Today ($)' : 'Prix de la propriété aujourd’hui ($)'}
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
                      {isEn ? 'Wait Period (Months)' : 'Délai d’attente (Mois)'}
                    </label>
                    <select
                      className="form-control"
                      value={waitMonths}
                      onChange={(e) => setWaitMonths(Number(e.target.value))}
                    >
                      <option value={6}>6 {isEn ? 'months' : 'mois'}</option>
                      <option value={12}>12 {isEn ? 'months' : 'mois'}</option>
                      <option value={18}>18 {isEn ? 'months' : 'mois'}</option>
                      <option value={24}>24 {isEn ? 'months' : 'mois'}</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {isEn ? 'Rate Today (%)' : 'Taux actuel (%)'}
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
                      {isEn ? 'Future Rate (%)' : 'Taux espéré (%)'}
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
                      {isEn ? 'Price Growth (%/yr)' : 'Hausse prix (%/an)'}
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
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {isEn ? `Future Property Price (+${waitMonths}m)` : `Prix futur estimé (+${waitMonths} mois)`}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>
                      {fmtCAD(waitResult.priceFuture)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '2px' }}>
                      + {fmtCAD(waitResult.appreciationAmt)}
                    </div>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {isEn ? 'Equity Missed While Waiting' : 'Plus-value manquée en attendant'}
                    </div>
                    <div className="gold-gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>
                      {fmtCAD(waitResult.appreciationAmt)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: 'rgba(200, 164, 93, 0.1)',
                    border: '1px solid var(--border-gold)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6
                  }}
                >
                  {waitResult.totalImpact > 0
                    ? isEn
                      ? `Waiting ${waitMonths} months would cost you approximately ${fmtCAD(waitResult.totalImpact)} more over 5 years due to property appreciation, even with a lower rate.`
                      : `Attendre ${waitMonths} mois vous coûterait environ ${fmtCAD(waitResult.totalImpact)} de plus sur 5 ans en raison de la hausse des prix, même si les taux baissent.`
                    : isEn
                    ? 'The projected interest rate drop offsets the estimated price increase over this period.'
                    : 'La baisse de taux projetée compense la hausse de prix estimée sur cette période.'}
                </div>
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
                    {isEn ? 'Report Request Sent!' : 'Demande transmise !'}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                    {isEn
                      ? 'An Himalaya broker will follow up shortly with your personalized financial analysis.'
                      : 'Un courtier Himalaya vous transmettra votre bilan détaillé sous peu.'}
                  </p>
                  <button onClick={() => setLeadModalOpen(false)} className="btn-gold" style={{ width: '100%' }}>
                    {isEn ? 'Close' : 'Fermer'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                    {isEn ? 'Receive My Detailed Analysis' : 'Recevoir mon bilan chiffré'}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    {isEn
                      ? 'Enter your contact details to receive your personalized report and validate your scenario with an Himalaya broker.'
                      : 'Entrez vos coordonnées pour recevoir votre rapport détaillé et valider votre scénario avec un courtier Himalaya.'}
                  </p>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={isEn ? 'Full Name *' : 'Nom complet *'}
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                  />
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder={isEn ? 'Email Address *' : 'Adresse courriel *'}
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                  />
                  <input
                    type="tel"
                    className="form-control"
                    placeholder={isEn ? 'Phone Number' : 'Numéro de téléphone'}
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button type="submit" className="btn-gold" style={{ flex: 1 }}>
                      {isEn ? 'Send My Report' : 'Envoyer mon bilan'} <ArrowRight size={15} />
                    </button>
                    <button type="button" onClick={() => setLeadModalOpen(false)} className="btn-outline">
                      {isEn ? 'Cancel' : 'Annuler'}
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
