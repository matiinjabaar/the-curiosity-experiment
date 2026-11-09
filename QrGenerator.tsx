import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useTranslation } from 'react-i18next'

const siteUrl = import.meta.env.VITE_SITE_URL?.trim() || ''
function isValidUrl(value: string) {
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' }
  catch { return false }
}
export default function QrGenerator() {
  const { t } = useTranslation()
  const [svg, setSvg] = useState('')
  const [png, setPng] = useState('')
  const [error, setError] = useState('')
  const configured = isValidUrl(siteUrl)
  useEffect(() => {
    if (!configured) return
    void QRCode.toString(siteUrl, { type: 'svg', errorCorrectionLevel: 'H', margin: 4, width: 900 })
      .then(setSvg).catch(() => setError('QR generation failed.'))
    void QRCode.toDataURL(siteUrl, { errorCorrectionLevel: 'H', margin: 4, width: 1200 })
      .then(setPng).catch(() => setError('QR generation failed.'))
  }, [configured])
  function save(content: string, type: string, name: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = name; a.click()
    URL.revokeObjectURL(url)
  }
  return <section className="qr-panel" id="qr">
    <p className="overline">{t('nav.qr')}</p><h2>{t('qr.title')}</h2><p>{t('qr.body')}</p>
    {configured ? <>
      <div className="qr-preview">{png ? <img src={png} alt="QR code for the production website"/> : 'Generating…'}</div>
      <p className="qr-status">{t('qr.configured')}: {siteUrl}</p>
      <div className="qr-actions">
        <button disabled={!svg} onClick={() => save(svg, 'image/svg+xml', 'curiosity-experiment-qr.svg')}>{t('qr.downloadSvg')}</button>
        <button disabled={!png} onClick={() => save(png, 'image/png', 'curiosity-experiment-qr.png')}>{t('qr.downloadPng')}</button>
      </div>
    </> : <p className="qr-warning">{t('qr.missing')}</p>}
    {error && <p role="alert">{error}</p>}
  </section>
}