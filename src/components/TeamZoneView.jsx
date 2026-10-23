import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Database,
  Users,
  Calculator,
  LogOut,
  Shield,
  Phone,
  Mail
} from 'lucide-react';
import { tr } from '../data/translations';
import {
  fetchCrmConnectionStatus,
  resyncPendingWebLeads,
  loginBrokerToProspection,
  getSavedBrokerSession,
  clearBrokerSession,
  fetchCrmLiveDashboard,
  getStoredWebLeads
} from '../utils/prospectionBridge';

export default function TeamZoneView({
  lang = 'FR',
  t,
  webLeads = [],
  onLeadsUpdated,
  activeDealsCount = 0,
  onNavigate
}) {
  const [crmStatus, setCrmStatus] = useState({ online: false, loading: true, metrics: null });
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [leadFilter, setLeadFilter] = useState('all');

  // Session courtier connectée à Himalaya Prospection
  const [brokerSession, setBrokerSession] = useState(() => getSavedBrokerSession());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [liveDashboard, setLiveDashboard] = useState(null);

  const checkStatus = async () => {
    setCrmStatus(prev => ({ ...prev, loading: true }));
    const st = await fetchCrmConnectionStatus();
    setCrmStatus({ ...st, loading: false });
  };

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (brokerSession?.token) {
      fetchCrmLiveDashboard(brokerSession.token)
        .then(data => setLiveDashboard(data))
        .catch(() => {});
    } else {
      setLiveDashboard(null);
    }
  }, [brokerSession]);

  const handleResync = async () => {
    setSyncing(true);
    setSyncMsg('');
    const { leads, newlySynced } = await resyncPendingWebLeads();
    if (onLeadsUpdated) onLeadsUpdated(leads);
    await checkStatus();
    setSyncing(false);
    setSyncMsg(
      newlySynced > 0
        ? tr(
            lang,
            `${newlySynced} prospect(s) synchronisé(s) avec succès dans Himalaya Prospection CRM.`,
            `${newlySynced} lead(s) successfully synchronized with Himalaya Prospection CRM.`,
            `${newlySynced} prospecto(s) sincronizado(s) con éxito en Himalaya Prospection CRM.`,
            `已成功将 ${newlySynced} 条网站客户线索同步至喜马拉雅 CRM 系统。`
          )
        : tr(
            lang,
            'Tous les prospects locaux sont déjà synchronisés ou en attente du serveur local (port 8000).',
            'All local leads are already synced or awaiting the local CRM server (port 8000).',
            'Todos los prospectos locales ya están sincronizados o esperando al servidor local (puerto 8000).',
            '所有本地线索均已同步（或等待本地端口 8000 服务器启动）。'
          )
    );
  };

  const handleBrokerLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      const session = await loginBrokerToProspection(username, password);
      setBrokerSession(session);
      setPassword('');
    } catch (err) {
      setAuthError(err.message || 'Erreur de connexion au serveur Himalaya Prospection');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleBrokerLogout = () => {
    clearBrokerSession();
    setBrokerSession(null);
    setLiveDashboard(null);
  };

  const filteredLeads = useMemo(() => {
    const list = Array.isArray(webLeads) ? webLeads : getStoredWebLeads();
    if (leadFilter === 'all') return list;
    return list.filter(l => l.type === leadFilter);
  }, [webLeads, leadFilter]);

  const crmUrl =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5176'
      : 'https://himalaya-prospection.vercel.app';

  return (
    <main style={{ flex: 1, padding: '44px 0 80px' }}>
      <div className="container">
        {/* Bandeau Principal Zone Équipe & Passerelle CRM (#17) */}
        <div style={{
          borderTop: '1px solid var(--gold)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '32px 0',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span className="badge-gold">
                  <Lock size={12} /> {t?.team?.badge || tr(lang, 'PORTAIL ÉQUIPE & COURTIERS', 'BROKER & TEAM PORTAL', 'PORTAL DE CORREDORES', '经纪人内部门户')}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: crmStatus.online ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid rgba(200, 164, 93, 0.4)',
                  color: crmStatus.online ? '#6ee7b7' : 'var(--gold-light)'
                }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: crmStatus.online ? '#10b981' : 'var(--gold)'
                  }} />
                  {crmStatus.online
                    ? tr(lang, 'Serveur CRM Himalaya Prospection : EN LIGNE (8000)', 'Himalaya Prospection CRM Server: ONLINE (8000)', 'Servidor CRM Himalaya Prospection: EN LÍNEA (8000)', '喜马拉雅 CRM 后端服务：在线 (端口 8000)')
                    : tr(lang, 'Mode file d’attente locale (Sync auto dès ouverture du CRM)', 'Local Queue Mode (Auto-syncs when CRM opens)', 'Modo cola local (Sincronización automática)', '本地缓存模式（启动 CRM 后自动同步）')}
                </span>
              </div>

              <h1 className="serif-title" style={{ fontSize: '2.35rem', fontWeight: 600 }}>
                {t?.team?.titleStart || 'Passerelle Directe'}{' '}
                <span className="gold-gradient-text">Himalaya Prospection CRM & Chiffrier</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '6px', maxWidth: '760px' }}>
                {tr(
                  lang,
                  'Tous les prospects capturés sur le site web (ententes de confidentialité NDA, demandes d’évaluation vendeur, simulations Chiffrier MREX et investisseurs internationaux) sont acheminés vers le pipeline Kanban des courtiers.',
                  'All leads captured on the website (signed NDAs, property valuation requests, MREX Chiffrier simulations, and international investor inquiries) are routed directly to the brokers’ Kanban pipeline.',
                  'Todos los prospectos capturados en el sitio web (NDA firmados, solicitudes de valuación, simulaciones MREX e inversores internacionales) se envían directamente al pipeline CRM.',
                  '网站捕获的所有客户线索（已签署 NDA 保密协议、卖方估价申请、MREX 财务测算及国际买家咨询）均实时路由至经纪人 CRM 看板系统。'
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleResync}
                disabled={syncing}
                className="btn-outline"
              >
                <RefreshCw size={14} />
                {syncing
                  ? tr(lang, 'Synchronisation...', 'Syncing...', 'Sincronizando...', '正在同步...')
                  : tr(lang, 'Synchroniser vers CRM', 'Sync Leads to CRM', 'Sincronizar con CRM', '立即同步至 CRM')}
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('outils', { toolTab: 'plex' })}
                className="btn-outline"
              >
                <Calculator size={14} color="var(--gold)" />
                {tr(lang, 'Ouvrir Chiffrier MREX', 'Open MREX Simulator', 'Abrir Simulador MREX', '打开 MREX 精算模型')}
              </button>

              <a
                href={crmUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
              >
                <Sparkles size={15} /> {t?.team?.openCrmBtn || 'Ouvrir Himalaya Prospection'} <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {syncMsg && (
            <div style={{
              marginBottom: '20px',
              padding: '10px 14px',
              borderLeft: '3px solid var(--gold)',
              background: 'rgba(200, 164, 93, 0.08)',
              fontSize: '0.84rem',
              color: 'var(--gold-light)'
            }}>
              {syncMsg}
            </div>
          )}

          {/* Compteurs temps réel de l'écosystème Himalaya */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {tr(lang, 'Mandats Actifs (Prêt API Centris)', 'Active Listings (Centris API Ready)', 'Mandatos Activos (Listo API Centris)', '当前在售房源 (已就绪对接 Centris API)')}
              </div>
              <div className="serif-title gold-gradient-text" style={{ fontSize: '2rem', fontWeight: 600 }}>
                {activeDealsCount}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                {tr(lang, 'Synchronisation API Centris prête à brancher', 'Direct Centris API bridge ready', 'Puente directo API Centris listo', 'Centris 官方 API 接口架构已就绪')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {tr(lang, 'Leads & NDA capturés sur ce poste', 'Web Leads & NDAs Captured', 'Prospectos y NDA capturados', '本机已捕获网站线索与 NDA')}
              </div>
              <div className="serif-title" style={{ fontSize: '2rem', fontWeight: 600, color: '#fff' }}>
                {webLeads.length}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                {webLeads.filter(l => l.synced_to_crm).length} {tr(lang, 'synchronisé(s) avec le serveur CRM', 'synced with CRM server', 'sincronizado(s) con el servidor CRM', '条已同步至 CRM 数据库')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {tr(lang, 'Contacts Centraux CRM (SQLite)', 'Central CRM Contacts (SQLite)', 'Contactos Centrales CRM', 'CRM 核心数据库联系人')}
              </div>
              <div className="serif-title" style={{ fontSize: '2rem', fontWeight: 600, color: '#fff' }}>
                {crmStatus.metrics ? crmStatus.metrics.crm_contacts_count : '—'}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                {crmStatus.metrics
                  ? `${crmStatus.metrics.buyer_leads_count} acheteurs qualifiés • ${crmStatus.metrics.prospects_count} dossiers`
                  : tr(lang, 'Lancez LANCER_PROSPECTION_HIMALAYA.bat pour voir le direct', 'Start Himalaya Prospection server for live counts', 'Inicie el servidor CRM para ver métricas en vivo', '启动后端服务即可查看实时数据')}
              </div>
            </div>
          </div>
        </div>

        {/* Grille 2 colonnes : Journal des Prospects Web + Connexion directe Courtier au CRM */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '44px',
          alignItems: 'start'
        }}>
          {/* Colonne 1 : Journal des leads capturés depuis le site web */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <h2 className="serif-title" style={{ fontSize: '1.75rem', fontWeight: 600 }}>
                {t?.team?.leadsTitle || tr(lang, 'Prospects & NDA capturés sur le site', 'Captured Website Leads & NDAs', 'Prospectos y NDA capturados', '网站实时捕获客户与保密协议')} ({filteredLeads.length})
              </h2>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: tr(lang, 'Tous', 'All', 'Todos', '全部') },
                  { id: 'nda', label: 'NDA' },
                  { id: 'valuation', label: tr(lang, 'Évaluations', 'Valuations', 'Valuaciones', '卖方估价') },
                  { id: 'international', label: tr(lang, 'International', 'International', 'Internacional', '国际买家') },
                  { id: 'chiffrier', label: 'Chiffrier' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLeadFilter(tab.id)}
                    className={leadFilter === tab.id ? 'btn-gold' : 'btn-outline'}
                    style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div style={{
                padding: '28px 0',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.88rem'
              }}>
                {tr(
                  lang,
                  'Aucun prospect enregistré dans cette catégorie pour le moment. Testez le formulaire NDA, l’évaluation vendeur ou le Chiffrier MREX pour voir la synchronisation en direct.',
                  'No leads recorded in this category yet. Submit an NDA, property valuation, or MREX simulation to test live CRM sync.',
                  'Aún no hay prospectos registrados en esta categoría.',
                  '该类别下暂无客户记录。您可以提交 NDA、估价申请或 MREX 模拟来测试实时同步。'
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredLeads.slice(0, 15).map(lead => (
                  <div
                    key={lead.id}
                    style={{
                      padding: '14px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge-gold">
                          {lead.type === 'nda'
                            ? 'NDA SIGNÉ'
                            : lead.type === 'valuation'
                            ? 'ÉVALUATION VENDEUR'
                            : lead.type === 'international'
                            ? 'INTERNATIONAL'
                            : lead.type === 'chiffrier'
                            ? 'CHIFFRIER MREX'
                            : 'CONTACT WEB'}
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: '#fff' }}>
                          {lead.fullName || lead.nom || 'Investisseur'}
                        </strong>
                      </div>

                      <span style={{
                        fontSize: '0.7rem',
                        color: lead.synced_to_crm ? '#6ee7b7' : 'var(--gold-light)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle2 size={12} />
                        {lead.synced_to_crm ? 'Synchronisé CRM' : 'Sauvegardé localement'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--gold-light)' }}>
                      {lead.dealTitle || lead.subject || lead.assetType || 'Demande générale'}
                      {lead.mls ? ` • MLS ${lead.mls}` : ''}
                    </div>

                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {lead.phone && (
                        <span>
                          <Phone size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {lead.phone}
                        </span>
                      )}
                      {lead.email && (
                        <span>
                          <Mail size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {lead.email}
                        </span>
                      )}
                      {lead.assigned_broker && (
                        <span>
                          Courtier : <strong style={{ color: '#fff' }}>{lead.assigned_broker}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colonne 2 : Accès authentifié en direct à la base CRM Himalaya Prospection (#17) */}
          <div style={{
            paddingLeft: '24px',
            borderLeft: '1px solid var(--border-subtle)'
          }}>
            <div className="badge-gold" style={{ marginBottom: '8px' }}>
              <Shield size={13} />{' '}
              {tr(lang, 'CONNEXION DIRECTE COURTIER (OACIQ)', 'DIRECT BROKER LOGIN (OACIQ)', 'ACCESO DIRECTO CORREDOR (OACIQ)', '持牌经纪人直连登录 (OACIQ)')}
            </div>

            {!brokerSession ? (
              <div>
                <h3 className="serif-title" style={{ fontSize: '1.65rem', fontWeight: 600, marginBottom: '8px' }}>
                  {tr(
                    lang,
                    'Consulter vos contacts CRM en direct',
                    'View Your Live CRM Contacts & Pipeline',
                    'Consultar sus contactos CRM en vivo',
                    '实时查看您的 CRM 客户与交易管道'
                  )}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.6 }}>
                  {tr(
                    lang,
                    'Connectez-vous avec vos identifiants Himalaya Prospection (ex. roger, evan, nathan ou votre courriel @himalayacorp.com) pour afficher vos acheteurs qualifiés et alertes du Cockpit du Matin directement ici.',
                    'Sign in with your Himalaya Prospection credentials to view your qualified buyers and Morning Cockpit alerts right here.',
                    'Inicie sesión con sus credenciales de Himalaya Prospection para ver sus compradores calificados.',
                    '使用您的喜马拉雅 CRM 账号登录，即可在此直接查看合格买家及晨间简报提醒。'
                  )}
                </p>

                {authError && (
                  <div style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '12px' }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleBrokerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder={tr(lang, 'Identifiant courtier (ex. roger, evan...)', 'Broker username', 'Usuario del corredor', '经纪人用户名')}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                  <input
                    required
                    type="password"
                    className="form-control"
                    placeholder={tr(lang, 'Mot de passe CRM', 'CRM Password', 'Contraseña CRM', 'CRM 密码')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button type="submit" disabled={loggingIn} className="btn-gold" style={{ width: '100%' }}>
                    <Database size={14} />
                    {loggingIn
                      ? tr(lang, 'Connexion...', 'Signing in...', 'Conectando...', '登录中...')
                      : tr(lang, 'Se connecter au serveur CRM', 'Connect to CRM Server', 'Conectar al servidor CRM', '连接至 CRM 服务器')}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 className="serif-title" style={{ fontSize: '1.55rem', fontWeight: 600 }}>
                      {brokerSession.full_name || brokerSession.username}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>
                      {brokerSession.role || 'Courtier Immobilier Himalaya'} • Session OACIQ active
                    </div>
                  </div>
                  <button type="button" onClick={handleBrokerLogout} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.76rem' }}>
                    <LogOut size={13} /> {tr(lang, 'Déconnexion', 'Sign Out', 'Salir', '退出')}
                  </button>
                </div>

                {liveDashboard && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '14px',
                      padding: '14px 0',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Contacts CRM accessibles
                        </div>
                        <div className="serif-title gold-gradient-text" style={{ fontSize: '1.75rem', fontWeight: 600 }}>
                          {liveDashboard.contacts.length}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Acheteurs Pipeline
                        </div>
                        <div className="serif-title" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fff' }}>
                          {liveDashboard.buyers.length}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                        <Users size={13} style={{ display: 'inline', marginRight: '6px' }} />
                        Derniers contacts synchronisés dans le CRM
                      </div>
                      {liveDashboard.contacts.slice(0, 6).map(c => (
                        <div
                          key={c.id}
                          style={{
                            padding: '8px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            fontSize: '0.82rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}
                        >
                          <div>
                            <strong style={{ color: '#fff' }}>{c.nom}</strong>
                            {c.role && <span style={{ color: 'var(--gold-light)', marginLeft: '6px', fontSize: '0.74rem' }}>({c.role})</span>}
                          </div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            {c.assigned_broker || 'Himalaya'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
