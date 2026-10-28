import React, { useState, useMemo } from 'react';
import {
  Globe,
  Shield,
  Building2,
  Landmark,
  Scale,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { tr, pickLang } from '../data/translations';
import { useExchangeRates, FALLBACK_CURRENCY_RATES } from '../utils/currencyService';
import { submitLeadToProspection, dealBelongsToBroker } from '../utils/prospectionBridge';

export default function InternationalInvestorsView({
  lang = 'FR',
  brokers = [],
  deals = [],
  onSelectBroker,
  onSelectDeal,
  onNavigate
}) {
  const rateInfo = useExchangeRates();
  const rates = rateInfo?.rates || FALLBACK_CURRENCY_RATES;

  // Simulateur de pouvoir d'achat international -> CAD $
  const [foreignAmount, setForeignAmount] = useState(1000000);
  const [foreignCurrency, setForeignCurrency] = useState(
    lang === 'ZH' ? 'CNY' : lang === 'ES' ? 'USD' : 'EUR'
  );
  const [leverageLtv, setLeverageLtv] = useState(60); // 60% financement commercial non-résident

  // Filtre linguistique rapide pour les courtiers internationaux
  const [selectedLangFilter, setSelectedLangFilter] = useState('all');

  // Formulaire de consultation internationale (synchronisé avec Himalaya Prospection CRM)
  const [intlForm, setIntlForm] = useState({
    fullName: '',
    country: '',
    preferredChannel: 'WhatsApp / Téléphone',
    preferredLanguage: lang === 'ZH' ? 'Mandarin (中文)' : lang === 'ES' ? 'Español' : lang === 'EN' ? 'English' : 'Français',
    investmentFocus: 'Immobilier Commercial / Multilogements (4+ unités)',
    liquidity: '1m_3m',
    phone: '',
    email: '',
    message: ''
  });
  const [formSent, setFormSent] = useState(false);

  const purchasingPower = useMemo(() => {
    const rateFromCad = rates[foreignCurrency] || FALLBACK_CURRENCY_RATES[foreignCurrency] || 1;
    // Convertir le montant en devise étrangère vers CAD $
    const cadEquity = foreignCurrency === 'CAD' ? foreignAmount : Math.round(foreignAmount / rateFromCad);
    const ltvDec = Math.min(0.75, Math.max(0, leverageLtv / 100));
    const maxAcquisitionCad = ltvDec < 1 ? Math.round(cadEquity / (1 - ltvDec)) : cadEquity;
    const estimatedLoanCad = Math.max(0, maxAcquisitionCad - cadEquity);
    return {
      cadEquity,
      maxAcquisitionCad,
      estimatedLoanCad,
      rateUsed: rateFromCad
    };
  }, [foreignAmount, foreignCurrency, leverageLtv, rates]);

  // Courtiers internationaux avec leurs langues parlées
  const getBrokerSpokenCodes = (b) => {
    const id = b.id || '';
    const codes = ['fr', 'en'];
    if (['olivier_meunier', 'yun_zhang', 'pengbo_zhao'].includes(id)) codes.push('zh');
    if (['roger_rheaume', 'sylvie_castonguay', 'eric_barelier'].includes(id)) codes.push('es');
    if (['mike_ainajian', 'joseph_jacob', 'taline_ovayan'].includes(id)) codes.push('ar_hy');
    return codes;
  };

  const getBrokerSpokenLabels = (b) => {
    const codes = getBrokerSpokenCodes(b);
    const labels = [
      tr(lang, 'Français', 'French', 'Francés', '法语'),
      tr(lang, 'Anglais', 'English', 'Inglés', '英语')
    ];
    if (codes.includes('zh')) labels.push(tr(lang, 'Mandarin (中文)', 'Mandarin (中文)', 'Mandarín (中文)', '普通话 (中文)'));
    if (codes.includes('es')) labels.push(tr(lang, 'Espagnol', 'Spanish', 'Español', '西班牙语'));
    if (codes.includes('ar_hy')) labels.push(tr(lang, 'Arabe / Arménien', 'Arabic / Armenian', 'Árabe / Armenio', '阿拉伯语 / 亚美尼亚语'));
    return labels;
  };

  const filteredIntlBrokers = useMemo(() => {
    return brokers.filter(b => {
      const codes = getBrokerSpokenCodes(b);
      const isIntl =
        (Array.isArray(b.categories) && b.categories.includes('international')) ||
        codes.length > 2 ||
        ['roger_rheaume', 'geniev_mondoux', 'mike_ainajian', 'lucie_bourbeau'].includes(b.id);
      if (!isIntl) return false;
      if (selectedLangFilter === 'all') return true;
      return codes.includes(selectedLangFilter);
    });
  }, [brokers, selectedLangFilter]);

  // Sélection de mandats commerciaux, pourvoiries et terrains éligibles aux investisseurs non-résidents
  const eligibleDeals = useMemo(() => {
    return deals
      .filter(d => {
        const cat = String(d.category || '').toLowerCase();
        return (
          cat.includes('commercial') ||
          cat.includes('pourvoirie') ||
          cat.includes('camping') ||
          cat.includes('terrain') ||
          cat.includes('hotellerie') ||
          Number(d.price) >= 1000000
        );
      })
      .slice(0, 6);
  }, [deals]);

  const handleSubmitIntl = async (e) => {
    e.preventDefault();
    await submitLeadToProspection({
      type: 'international',
      fullName: intlForm.fullName,
      company: `Pays : ${intlForm.country}`,
      phone: intlForm.phone,
      email: intlForm.email,
      city: intlForm.country,
      liquidity: intlForm.liquidity,
      subject: `Investisseur International (${intlForm.preferredLanguage}) — ${intlForm.investmentFocus}`,
      message: `[Canal: ${intlForm.preferredChannel}] [Pays: ${intlForm.country}] ${intlForm.message}`,
      assigned_broker:
        intlForm.preferredLanguage.includes('中文')
          ? 'Olivier Meunier'
          : intlForm.preferredLanguage.includes('Arabe')
          ? 'Mike Ainajian'
          : 'Roger Rhéaume'
    });
    setFormSent(true);
  };

  const locale = lang === 'EN' ? 'en-CA' : 'fr-CA';

  const pillars = [
    {
      icon: Shield,
      badge: tr(lang, 'CADRE LÉGAL CANADIEN', 'CANADIAN LEGAL FRAMEWORK', 'MARCO LEGAL CANADIENSE', '加拿大法律与豁免政策'),
      title: tr(
        lang,
        'Actifs 100 % exemptés de la loi sur les non-résidents',
        'Assets 100% Exempt from Foreign Buyer Restrictions',
        'Activos 100 % exentos de las restricciones a no residentes',
        '100% 豁免外国买家禁令的商业与收益资产'
      ),
      desc: tr(
        lang,
        'La Loi sur l’interdiction d’achat d’immeubles résidentiels par des non-Canadiens ne s’applique PAS à l’immobilier commercial, industriel, aux immeubles multilogements de 4 unités et plus (4-plex+), aux pourvoiries, campings, hôtels, franchises ni aux régions récréotouristiques hors RMR.',
        'Canada’s Prohibition on the Purchase of Residential Property by Non-Canadians Act does NOT apply to commercial or industrial buildings, multi-family properties with 4+ units, outfitters, campgrounds, hotels, franchises, or recreational regions outside CMAs.',
        'La Ley canadiense sobre compradores no residentes NO se aplica a inmuebles comerciales, industriales, edificios multifamiliares de 4 o más unidades, pourvoiries, campings, hoteles, franquicias ni zonas recreativas fuera de las áreas metropolitanas.',
        '加拿大非居民住宅购买限制令完全不适用于：商业与工业地产、4套及以上的多户公寓楼（4-plex+）、狩猎垂钓度假村、露营地、酒店、连锁特许经营商业以及大都市圈以外的旅游度假区。'
      )
    },
    {
      icon: Landmark,
      badge: tr(lang, 'STRUCTURE & FISCALITÉ', 'CORPORATE & TAX STRUCTURE', 'ESTRUCTURA Y FISCALIDAD', '跨境公司架构与税务筹划'),
      title: tr(
        lang,
        'Incorporation canadienne (Inc.) & Accompagnement CPA / Avocats',
        'Canadian Corporation (Inc.) & CPA / Legal Structuring',
        'Sociedad canadiense (Inc.) y acompañamiento CPA / Abogados',
        '加拿大公司注册 (Inc.) 与 CPA 会计师 / 律师团队护航'
      ),
      desc: tr(
        lang,
        'Sous la direction de Geniev Mondoux (CPA, MBA, Vice-Président), de Lucie Bourbeau (ex-notaire) et de nos cabinets juridiques partenaires (Fasken, Tutino Joseph Grégoire), nous coordonnons la création de votre société d’acquisition québécoise ou fédérale et les conventions fiscales.',
        'Led by Geniev Mondoux (CPA, MBA, Vice-President), Lucie Bourbeau (former Notary), and our partner law firms (Fasken, Tutino Joseph Grégoire), we coordinate your Quebec or federal acquisition corporation and cross-border tax compliance.',
        'Bajo la dirección de Geniev Mondoux (CPA, MBA, Vicepresidente), Lucie Bourbeau (exnotaria) y nuestros bufetes asociados (Fasken, Tutino Joseph Grégoire), coordinamos la constitución de su sociedad de adquisición en Quebec o Canadá.',
        '由副总裁 Geniev Mondoux（注册会计师 CPA、MBA）、前公证人 Lucie Bourbeau 及合作顶级律所（Fasken 等）领衔，为您一站式办理魁北克或联邦控股公司（Inc.）架构及跨境税务合规。'
      )
    },
    {
      icon: Building2,
      badge: tr(lang, 'FRANCHISES & IMMIGRATION D’AFFAIRES', 'FRANCHISES & BUSINESS EXPANSION', 'FRANQUICIAS Y EXPANSIÓN', '连锁特许经营与商业落地'),
      title: tr(
        lang,
        'Implantation de franchises (CQF) & Acquisition d’entreprises',
        'Franchise Expansion (CQF) & Turnkey Business Acquisitions',
        'Implantación de franquicias (CQF) y adquisición de empresas',
        '特许经营品牌选址落户 (CQF) 与成熟企业并购'
      ),
      desc: tr(
        lang,
        'Présente au Salon de la Franchise de Paris et aux congrès nord-américains ICSC, Immobilier Himalaya accompagne les entrepreneurs et investisseurs étrangers dans l’acquisition de franchises établies (restauration, commerce, hôtellerie) et de bâtisses commerciales au Québec.',
        'Active at Franchise Expo Paris and North American ICSC conventions, Immobilier Himalaya guides international entrepreneurs and investors in acquiring established franchises (dining, retail, hospitality) and commercial properties across Quebec.',
        'Presente en el Salón de la Franquicia de París y en los congresos norteamericanos ICSC, Immobilier Himalaya acompaña a empresarios e inversores extranjeros en la adquisición de franquicias consolidadas e inmuebles comerciales en Quebec.',
        '喜马拉雅地产常年参展巴黎国际特许经营展与北美 ICSC 峰会，协助国际企业家与投资人收购魁北克成熟连锁品牌门店（餐饮、零售、酒店）及高收益商业物业。'
      )
    },
    {
      icon: Scale,
      badge: tr(lang, 'FINANCEMENT TRANSFRONTALIER', 'CROSS-BORDER FINANCING', 'FINANCIAMIENTO TRANSFRONTERIZO', '非居民商业按揭与卖方融资'),
      title: tr(
        lang,
        'Effet de levier bancaire canadien & Balance de prix de vente (BPV)',
        'Canadian Commercial Financing & Seller Financing (VTB)',
        'Financiamiento comercial canadiense y Saldo de precio de venta',
        '加拿大银行商业贷款杠杆与卖方融资 (VTB)'
      ),
      desc: tr(
        lang,
        'Accès aux prêteurs commerciaux canadiens, institutions financières et structures de balance de prix de vente (BPV) permettant de financer de 50 % à 75 % de la valeur d’acquisition en dollars canadiens (CAD $).',
        'Access Canadian commercial lenders, financial institutions, and Vendor Take-Back (VTB) structures enabling 50% to 75% financing in Canadian dollars (CAD $).',
        'Acceso a prestamistas comerciales canadienses, instituciones financieras y estructuras de financiamiento del vendedor (VTB) que permiten financiar entre el 50 % y el 75 % en dólares canadienses (CAD $).',
        '对接加拿大商业银行、金融机构及卖方融资（BPV/VTB）方案，国际买家最高可获得 50% 至 75% 的加元（CAD $）低息贷款杠杆。'
      )
    }
  ];

  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        {/* En-tête éditorial prestige */}
        <div style={{
          paddingBottom: '36px',
          marginBottom: '48px',
          borderBottom: '1px solid rgba(200, 164, 93, 0.32)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <span className="badge-gold">
              <Globe size={13} />{' '}
              {tr(
                lang,
                'PORTAIL INVESTISSEURS INTERNATIONAUX • MONTRÉAL • PARIS • CARAÏBES • ASIE',
                'INTERNATIONAL INVESTORS PORTAL • MONTREAL • PARIS • CARIBBEAN • ASIA',
                'PORTAL DE INVERSORES INTERNACIONALES • MONTREAL • PARÍS • CARIBE • ASIA',
                '国际投资者专属门户 • 蒙特利尔 • 巴黎 • 加勒比 • 亚洲'
              )}
            </span>
          </div>

          <h1 className="serif-title" style={{ fontSize: 'clamp(2.1rem, 4vw, 3.1rem)', fontWeight: 600, lineHeight: 1.15, marginBottom: '14px' }}>
            {tr(
              lang,
              'Investir dans l’immobilier commercial, les pourvoiries et les franchises au ',
              'Invest in Commercial Real Estate, Resorts & Franchises in ',
              'Invertir en bienes raíces comerciales, resorts y franquicias en ',
              '投资魁北克与加拿大商业地产、度假庄园及连锁特许经营 '
            )}
            <span className="gold-gradient-text">
              {tr(lang, 'Québec & au Canada', 'Quebec & Canada', 'Quebec y Canadá', '全球尊享通道')}
            </span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '860px', lineHeight: 1.7 }}>
            {tr(
              lang,
              'Depuis 2008, Immobilier Himalaya Real Estate Corp. accompagne les investisseurs privés, family offices et franchiseurs d’Europe (France, Belgique, Suisse), d’Asie, des États-Unis, d’Amérique latine et du Moyen-Orient dans leurs acquisitions stratégiques en dollars canadiens, en français, anglais, mandarin, espagnol, arabe et arménien.',
              'Since 2008, Immobilier Himalaya Real Estate Corp. has guided private investors, family offices, and franchisors from Europe, Asia, the United States, Latin America, and the Middle East in their strategic Canadian dollar acquisitions — with service in French, English, Mandarin, Spanish, Arabic, and Armenian.',
              'Desde 2008, Immobilier Himalaya Real Estate Corp. acompaña a inversores privados, family offices y franquiciadores de Europa, Asia, Estados Unidos, América Latina y Medio Oriente en sus adquisiciones estratégicas en dólares canadienses, con atención en francés, inglés, mandarín, español, árabe y armenio.',
              '自 2008 年创立以来，喜马拉雅地产集团（Immobilier Himalaya Real Estate Corp.）协助来自欧洲、亚洲、美国、拉丁美洲及中东的私人投资者、家族办公室与连锁品牌方完成加元资产配置，提供法语、英语、普通话（中文）、西班牙语、阿拉伯语及亚美尼亚语母语级专业服务。'
            )}
          </p>
        </div>

        {/* 4 Piliers juridiques, fiscaux et financiers (#20) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          marginBottom: '64px'
        }}>
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                style={{
                  borderTop: '1px solid rgba(200, 164, 93, 0.4)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '26px 0 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Icon size={16} color="var(--gold)" />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 600, marginBottom: '10px', lineHeight: 1.25 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.68 }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simulateur de Pouvoir d'Acquisition International (EUR / USD / CNY -> CAD $ avec Taux Banque du Canada) (#11 & #20) */}
        <div style={{
          padding: '32px 0',
          marginBottom: '64px',
          borderTop: '1px solid rgba(200, 164, 93, 0.35)',
          borderBottom: '1px solid rgba(200, 164, 93, 0.35)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: '6px' }}>
                {tr(
                  lang,
                  'TAUX EN DIRECT BANQUE DU CANADA • EFFET DE LEVIER CAD $',
                  'LIVE BANK OF CANADA RATES • CAD $ LEVERAGE SIMULATOR',
                  'TASAS EN VIVO BANCO DE CANADÁ • APALANCAMIENTO CAD $',
                  '加拿大央行实时汇率 • 跨境加元购买力与杠杆模拟器'
                )}
              </span>
              <h2 className="serif-title" style={{ fontSize: '2rem', fontWeight: 600 }}>
                {tr(
                  lang,
                  'Simulateur de pouvoir d’acquisition au Québec (EUR € / USD $ / CNY ¥ → CAD $)',
                  'Quebec Purchasing Power Simulator (EUR € / USD $ / CNY ¥ → CAD $)',
                  'Simulador de poder adquisitivo en Quebec (EUR € / USD $ / CNY ¥ → CAD $)',
                  '魁北克置业购买力模拟器 (欧元 € / 美元 $ / 人民币 ¥ → 加元 CAD $)'
                )}
              </h2>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--gold-light)' }}>
              1 CAD = {rates.EUR} EUR • {rates.USD} USD • {rates.CNY} CNY {rateInfo?.date ? `(${rateInfo.date})` : ''}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            alignItems: 'end',
            marginBottom: '26px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {tr(lang, 'Devise de votre mise de fonds', 'Your Equity Currency', 'Divisa de su capital', '您的自有资金币种')}
              </label>
              <select
                className="form-control"
                value={foreignCurrency}
                onChange={e => setForeignCurrency(e.target.value)}
              >
                <option value="EUR">EUR € — Euro (France / Europe)</option>
                <option value="USD">USD $ — Dollar US (États-Unis / International)</option>
                <option value="CNY">CNY ¥ — Yuan RMB (Chine / Asie)</option>
                <option value="CAD">CAD $ — Dollar Canadien</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {tr(lang, 'Apport / Liquidités disponibles', 'Available Capital / Equity', 'Capital disponible', '可用首付资金金额')} ({foreignCurrency})
              </label>
              <input
                type="number"
                className="form-control"
                value={foreignAmount}
                step={50000}
                onChange={e => setForeignAmount(Math.max(0, Number(e.target.value)))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {tr(lang, 'Financement bancaire / BPV (%)', 'Commercial Loan / VTB LTV (%)', 'Financiamiento bancario / VTB (%)', '商业贷款 / 卖方融资比例 (%)')} : <strong>{leverageLtv} %</strong>
              </label>
              <select
                className="form-control"
                value={leverageLtv}
                onChange={e => setLeverageLtv(Number(e.target.value))}
              >
                <option value={0}>0 % ({tr(lang, 'Achat comptant 100 %', '100% Cash Purchase', 'Compra al contado 100 %', '100% 全款收购')})</option>
                <option value={50}>50 % RPV ({tr(lang, 'Standard Non-Résident', 'Standard Non-Resident', 'Estándar No Residente', '非居民标准按揭 50%')})</option>
                <option value={60}>60 % RPV ({tr(lang, 'Commercial / Filiale Canadienne', 'Commercial / Canadian Subsidiary', 'Comercial / Filial Canadiense', '加拿大子公司商业贷款 60%')})</option>
                <option value={70}>70 % RPV ({tr(lang, 'Multilogements + BPV Vendeur', 'Multi-Family + Seller VTB', 'Multifamiliar + VTB Vendedor', '多户公寓 + 卖方融资组合 70%')})</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {tr(lang, 'Mise de fonds convertie en CAD $', 'Converted Equity in CAD $', 'Capital convertido en CAD $', '折合加元首付本金 (CAD $)')}
              </div>
              <div className="num-metric" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                {purchasingPower.cadEquity.toLocaleString(locale)} CAD $
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {tr(lang, 'Financement canadien estimé', 'Estimated Canadian Financing', 'Financiamiento canadiense estimado', '预计可获加元融资贷款')}
              </div>
              <div className="num-metric" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }}>
                + {purchasingPower.estimatedLoanCad.toLocaleString(locale)} CAD $
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                {tr(lang, 'Capacité d’acquisition totale au Québec', 'Total Quebec Acquisition Capacity', 'Capacidad total de adquisición en Quebec', '在魁北克最高可收购资产总值')}
              </div>
              <div className="num-metric gold-gradient-text" style={{ fontSize: '1.95rem', fontWeight: 700, marginTop: '4px' }}>
                {purchasingPower.maxAcquisitionCad.toLocaleString(locale)} CAD $
              </div>
            </div>
          </div>
        </div>

        {/* Équipe Multilingue d'Immobilier Himalaya (#20) */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: '6px' }}>
                {tr(lang, 'COURTIERS MULTILINGUES OACIQ', 'MULTILINGUAL OACIQ BROKERS', 'CORREDORES MULTILINGÜES OACIQ', '多语种持牌经纪专家团队')}
              </span>
              <h2 className="serif-title" style={{ fontSize: '2.1rem', fontWeight: 600 }}>
                {tr(
                  lang,
                  'Parlez directement à un courtier dans votre langue',
                  'Speak Directly with a Broker in Your Language',
                  'Hable directamente con un corredor en su idioma',
                  '直接与讲您母语的专属经纪人沟通'
                )}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: tr(lang, 'Toutes les langues', 'All Languages', 'Todos los idiomas', '全部语言') },
                { id: 'zh', label: '中文 (Mandarin)' },
                { id: 'fr', label: 'Français (France / QC)' },
                { id: 'en', label: 'English' },
                { id: 'es', label: 'Español (LatAm / Caraïbes)' },
                { id: 'ar_hy', label: 'العربية / Հայերեն (Arabe & Arménien)' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedLangFilter(f.id)}
                  className={selectedLangFilter === f.id ? 'btn-gold' : 'btn-outline'}
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="brokers-grid">
            {filteredIntlBrokers.map(broker => {
              const bDeals = deals.filter(d => dealBelongsToBroker(d, broker.name));
              const cleanPhoneDigits = String(broker.phone || '').replace(/[^\d]/g, '');
              const whatsappUrl = cleanPhoneDigits ? `https://wa.me/1${cleanPhoneDigits.slice(-10)}` : null;

              return (
                <div key={broker.id} className="broker-card">
                  <div className="broker-photo-wrap" onClick={() => onSelectBroker && onSelectBroker(broker)}>
                    <img
                      src={broker.photo}
                      alt={broker.name}
                      loading="lazy"
                      onError={e => { e.target.src = '/gx/00/defaut_courtier.jpg'; }}
                    />
                  </div>
                  <div style={{ padding: '16px 2px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div onClick={() => onSelectBroker && onSelectBroker(broker)} style={{ cursor: 'pointer', marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
                        {pickLang(broker, 'shortTitle', lang) || pickLang(broker, 'title', lang)}
                      </div>
                      <h3 className="serif-title" style={{ fontSize: '1.4rem', fontWeight: 600 }}>{broker.name}</h3>
                      <div className="broker-name-line" />
                      <div style={{ fontSize: '0.76rem', color: 'var(--gold-light)', marginBottom: '4px' }}>
                        {getBrokerSpokenLabels(broker).join(' • ')}
                      </div>
                      {Array.isArray(broker.markets) && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {pickLang(broker, 'markets', lang).join(' • ')}
                        </div>
                      )}
                      {bDeals.length > 0 && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {bDeals.length} {tr(lang, 'mandats actifs', 'active listings', 'propiedades activas', '个在售项目')}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <a href={`tel:${broker.phone}`} className="btn-outline" style={{ padding: '6px 10px', fontSize: '0.75rem', flex: 1 }}>
                        <Phone size={12} color="var(--gold)" /> {broker.phone}
                      </a>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline"
                          style={{ padding: '6px 10px', fontSize: '0.75rem', borderColor: 'rgba(200,164,93,0.45)', color: 'var(--gold-light)' }}
                        >
                          <MessageSquare size={12} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sélection d'actifs éligibles aux investisseurs non-résidents + Formulaire de conciergerie internationale */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '48px',
          alignItems: 'start',
          paddingTop: '44px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '8px' }}>
              {tr(lang, 'ACTIFS ÉLIGIBLES NON-RÉSIDENTS', 'ELIGIBLE FOREIGN-BUYER ASSETS', 'ACTIVOS ELEGIBLES NO RESIDENTES', '非居民可直接收购的精选资产')}
            </span>
            <h3 className="serif-title" style={{ fontSize: '1.85rem', fontWeight: 600, marginBottom: '12px' }}>
              {tr(
                lang,
                'Exemples de mandats commerciaux, terrains & villégiature',
                'Featured Commercial, Land & Resort Mandates',
                'Mandatos comerciales, terrenos y complejos turísticos',
                '精选商业开发用地、度假村及收益型物业'
              )}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '22px' }}>
              {tr(
                lang,
                'Ces propriétés commerciales, terrains de développement et domaines récréotouristiques ne sont pas visés par les restrictions résidentielles aux acheteurs étrangers.',
                'These commercial properties, development lots, and resort estates are exempt from residential foreign buyer restrictions.',
                'Estas propiedades comerciales, terrenos de desarrollo y complejos turísticos están exentos de las restricciones residenciales para compradores extranjeros.',
                '以下商业物业、大型多户开发用地及旅游度假庄园均完全豁免加拿大外国买家住宅限制。'
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {eligibleDeals.map(d => (
                <div
                  key={d.id}
                  onClick={() => onSelectDeal && onSelectDeal(d)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <img
                      src={d.main_photo}
                      alt={pickLang(d, 'title', lang)}
                      style={{ width: '68px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {pickLang(d, 'category', lang)} • {d.city}
                      </div>
                      <div className="serif-title" style={{ fontSize: '1.1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pickLang(d, 'title', lang)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="serif-title gold-gradient-text" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                      {pickLang(d, 'price_raw', lang)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('proprietes', { filtrePropriete: 'commercial' })}
              className="btn-outline"
            >
              {tr(lang, 'Explorer tous nos mandats commerciaux & pourvoiries', 'Explore All Commercial & Resort Mandates', 'Explorar todos los mandatos comerciales', '浏览全部在售商业与度假庄园项目')} <ArrowRight size={14} />
            </button>
          </div>

          {/* Formulaire de Conciergerie Internationale (WeChat / WhatsApp / Zoom) */}
          <div>
            <span className="badge-gold" style={{ marginBottom: '8px' }}>
              <Sparkles size={13} />{' '}
              {tr(lang, 'CONCIERGERIE INTERNATIONALE', 'INTERNATIONAL DESK', 'CONSERJERÍA INTERNACIONAL', '国际投资者贵宾专线 (支持微信 / WhatsApp)')}
            </span>
            <h3 className="serif-title" style={{ fontSize: '1.85rem', fontWeight: 600, marginBottom: '12px' }}>
              {tr(
                lang,
                'Planifier un entretien confidentiel (Zoom, WhatsApp ou WeChat)',
                'Schedule a Confidential Consultation (Zoom, WhatsApp or WeChat)',
                'Agendar una consulta confidencial (Zoom, WhatsApp o WeChat)',
                '预约机密投资咨询（支持 Zoom、WhatsApp 或微信 WeChat）'
              )}
            </h3>

            {formSent ? (
              <div style={{ padding: '28px 0', borderTop: '1px solid var(--gold)' }}>
                <CheckCircle2 size={38} color="var(--gold)" style={{ marginBottom: '12px' }} />
                <h4 className="serif-title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                  {tr(lang, 'Demande internationale transmise à notre équipe', 'International Inquiry Forwarded to Our Desk', 'Solicitud internacional enviada', '您的国际投资咨询已同步至专属团队')}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {tr(
                    lang,
                    'Un courtier parlant votre langue vous contactera sous 24 heures via votre canal privilégié.',
                    'A broker fluent in your language will contact you within 24 hours via your preferred channel.',
                    'Un corredor que habla su idioma se comunicará con usted en menos de 24 horas.',
                    '讲您母语的持牌经纪人将在 24 小时内通过您首选的方式与您联系。'
                  )}
                </p>
                <button type="button" onClick={() => setFormSent(false)} className="btn-gold">
                  {tr(lang, 'Nouvelle demande', 'New Inquiry', 'Nueva consulta', '发送新咨询')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitIntl} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder={tr(lang, 'Nom complet *', 'Full Name *', 'Nombre completo *', '您的姓名 *')}
                    value={intlForm.fullName}
                    onChange={e => setIntlForm({ ...intlForm, fullName: e.target.value })}
                  />
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder={tr(lang, 'Pays / Ville de résidence *', 'Country / City of Residence *', 'País / Ciudad de residencia *', '所在国家 / 城市 *')}
                    value={intlForm.country}
                    onChange={e => setIntlForm({ ...intlForm, country: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <select
                    className="form-control"
                    value={intlForm.preferredLanguage}
                    onChange={e => setIntlForm({ ...intlForm, preferredLanguage: e.target.value })}
                  >
                    <option value="Français">Français</option>
                    <option value="English">English</option>
                    <option value="Mandarin (中文)">Mandarin (中文 / 普通话)</option>
                    <option value="Español">Español</option>
                    <option value="Arabe / Arménien">Arabe / Arménien (العربية / Հայերեն)</option>
                  </select>

                  <select
                    className="form-control"
                    value={intlForm.preferredChannel}
                    onChange={e => setIntlForm({ ...intlForm, preferredChannel: e.target.value })}
                  >
                    <option value="WhatsApp / Téléphone">WhatsApp / Téléphone</option>
                    <option value="WeChat (微信)">WeChat (微信)</option>
                    <option value="Visioconférence Zoom / Teams">Zoom / Microsoft Teams</option>
                    <option value="Courriel uniquement">Courriel / Email</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder={tr(lang, 'Téléphone / WhatsApp / ID WeChat *', 'Phone / WhatsApp / WeChat ID *', 'Teléfono / WhatsApp / WeChat *', '电话 / WhatsApp / 微信号 *')}
                    value={intlForm.phone}
                    onChange={e => setIntlForm({ ...intlForm, phone: e.target.value })}
                  />
                  <input
                    required
                    type="email"
                    className="form-control"
                    placeholder={tr(lang, 'Courriel professionnel *', 'Email Address *', 'Correo electrónico *', '电子邮箱 *')}
                    value={intlForm.email}
                    onChange={e => setIntlForm({ ...intlForm, email: e.target.value })}
                  />
                </div>

                <select
                  className="form-control"
                  value={intlForm.investmentFocus}
                  onChange={e => setIntlForm({ ...intlForm, investmentFocus: e.target.value })}
                >
                  <option value="Immobilier Commercial / Multilogements (4+ unités)">
                    {tr(lang, 'Immobilier Commercial & Multilogements (4+ portes)', 'Commercial & Multi-Family (4+ units)', 'Comercial y Multifamiliar (4+ unidades)', '商业地产与多户公寓 (4套以上)')}
                  </option>
                  <option value="Pourvoirie, Hôtellerie, Camping & Domaine">
                    {tr(lang, 'Pourvoirie, Hôtellerie, Camping & Villégiature', 'Outfitter, Hotel, Campground & Resort', 'Pourvoirie, Hotel, Camping y Resort', '狩猎垂钓度假村、酒店与露营地')}
                  </option>
                  <option value="Implantation de Franchise / Commerce au Québec">
                    {tr(lang, 'Implantation de Franchise (CQF) / Commerce', 'Franchise Expansion (CQF) / Retail', 'Expansión de Franquicia (CQF) / Comercio', '连锁特许经营品牌落户 / 零售商业')}
                  </option>
                  <option value="Terrain de développement / Industriel">
                    {tr(lang, 'Terrain de développement & Foncier industriel', 'Development Land & Industrial', 'Terreno de desarrollo e Industrial', '大型开发用地与工业厂房')}
                  </option>
                </select>

                <textarea
                  rows={3}
                  className="form-control"
                  placeholder={tr(
                    lang,
                    'Précisez votre budget, vos objectifs de rendement ou votre calendrier de visite à Montréal / Paris...',
                    'Specify your target budget, yield goals, or upcoming visit dates in Montreal / Paris...',
                    'Indique su presupuesto, objetivos de rentabilidad o fechas de visita a Montreal / París...',
                    '请简述您的预算范围、目标回报率或近期访问蒙特利尔/巴黎的计划...'
                  )}
                  value={intlForm.message}
                  onChange={e => setIntlForm({ ...intlForm, message: e.target.value })}
                />

                <button type="submit" className="btn-gold" style={{ width: '100%' }}>
                  {tr(
                    lang,
                    'Être contacté par le Pôle International Himalaya',
                    'Connect with Himalaya International Desk',
                    'Contactar con la División Internacional Himalaya',
                    '提交并预约喜马拉雅国际部顾问'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
