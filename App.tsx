import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowUpRight, Languages, Sparkles, RotateCcw, Share2 } from 'lucide-react'
import QrGenerator from './components/QrGenerator'
type Lang = 'en' | 'ar' | 'ckb'
type TimelineItem = { date: string; title: string; text: string }
type Fact = { q: string; a: string }

export default function App() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'en') as Lang
  const [choice, setChoice] = useState<number | null>(null)
  const [fact, setFact] = useState<number | null>(null)
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl'
    document.title = t('meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
  }, [lang, t])
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: t('meta.title'), text: t('final.body'), url: location.href })
      else { await navigator.clipboard.writeText(location.href); alert(t('final.copied')) }
    } catch { /* Sharing was cancelled by the visitor. */ }
  }
  const timeline = t('history.timeline', { returnObjects: true }) as TimelineItem[]
  const choices = t('experiment.choices', { returnObjects: true }) as string[]
  const facts = t('facts.items', { returnObjects: true }) as Fact[]
  return <main className="site-shell">
    <div className="paper-frame">
      <header className="topbar">
        <a className="wordmark" href="#top">{t('brand')}</a>
        <div className="topbar-right">
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#opening">{t('nav.question')}</a><a href="#science">{t('nav.science')}</a>
            <a href="#history">{t('nav.history')}</a><a href="#experiment">{t('nav.experiment')}</a>
          </nav>
          <div className="language-switch" aria-label={t('language.label')}>
            <Languages size={15}/>
            {(['ckb', 'ar', 'en'] as Lang[]).map(code => <button key={code}
              onClick={() => void i18n.changeLanguage(code)}
              className={lang === code ? 'language-active' : ''} aria-pressed={lang === code}>
              {t('language.' + code)}
            </button>)}
          </div>
        </div>
      </header>
      <section className="hero" id="top">
        <div className="hero-index"><span/>{t('intro.eyebrow')}</div>
        <div className="hero-content">
          <div className="hero-copy"><p className="overline">FIELD NOTES — 001</p>
            <h1>{t('intro.title')}</h1><p className="hero-description">{t('intro.description')}</p>
            <button className="discover-button" onClick={() => jump('opening')}>{t('intro.button')} <ArrowUpRight size={17}/></button>
          </div>
          <div className="orbit-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><Sparkles size={35}/></div><span className="orbit-label">CURIOSITY / 01</span></div>
        </div>
        <div className="hero-bottom"><span>{t('intro.note')}</span><button onClick={() => jump('opening')} aria-label="Scroll down"><ArrowDown size={18}/></button></div>
      </section>
      <section className="content-section" id="opening"><p className="section-meta">{t('opening.number')}</p><div className="section-copy"><h2>{t('opening.title')}</h2><p>{t('opening.body')}</p><div className="question-line"><span>?</span>{t('opening.prompt')}</div></div></section>
      <section className="content-section tinted" id="science"><p className="section-meta">{t('science.number')}</p><div className="section-copy"><h2>{t('science.title')}</h2><p>{t('science.body')}</p><div className="science-note"><strong>{t('science.label')}</strong><p>{t('science.detail')}</p></div></div></section>
      <section className="content-section" id="history"><p className="section-meta">{t('history.number')}</p><div className="section-copy"><h2>{t('history.title')}</h2><p>{t('history.body')}</p><div className="timeline">{timeline.map(item => <article className="timeline-item" key={item.date}><span>{item.date}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div></section>
      <section className="content-section tinted" id="experiment"><p className="section-meta">{t('experiment.number')}</p><div className="section-copy"><h2>{t('experiment.title')}</h2><p>{t('experiment.body')}</p><h3 className="experiment-question">{t('experiment.question')}</h3><div className="choice-list">{choices.map((item, i) => <button key={item} className={choice === i ? 'choice selected' : 'choice'} onClick={() => setChoice(i)}><span>{String(i + 1).padStart(2, '0')}</span><span>{item}</span><ArrowUpRight size={16}/></button>)}</div>{choice !== null && <div className="reveal" aria-live="polite"><strong>{t('experiment.selected')}</strong><p>{t('experiment.reveal')}</p><button onClick={() => setChoice(null)}>{t('experiment.again')}</button></div>}</div></section>
      <section className="content-section" id="facts"><p className="section-meta">{t('facts.number')}</p><div className="section-copy"><h2>{t('facts.title')}</h2><div className="fact-list">{facts.map((item, i) => <article key={item.q} className="fact-item"><button onClick={() => setFact(fact === i ? null : i)} aria-expanded={fact === i}><span>0{i + 1}</span>{item.q}<span>{fact === i ? '−' : '+'}</span></button>{fact === i && <p>{item.a}</p>}</article>)}</div></div></section>
      <QrGenerator/>
      <section className="final-section"><p className="overline">THE END IS ANOTHER BEGINNING</p><h2>{t('final.title')}</h2><p>{t('final.body')}</p><div className="final-actions"><button onClick={() => { setChoice(null); setFact(null); jump('top') }}><RotateCcw size={15}/>{t('final.restart')}</button><button onClick={() => void share()}><Share2 size={15}/>{t('final.share')}</button></div></section>
      <footer className="paper-footer"><span>{t('footer')}</span><span>EST. 2026</span></footer>
    </div>
    <div className="creator-signature"><span className="signature-rule"/><span>Created by: Matinmhe</span><span className="signature-rule"/></div>
  </main>
}