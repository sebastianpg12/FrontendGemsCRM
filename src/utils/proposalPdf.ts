import { jsPDF } from 'jspdf'
import type { Prospect } from '@/types/prospect'

const PAGE_MARGIN = 18
const LINE_HEIGHT = 5.2

interface PdfLine {
  text: string
  style: 'h1' | 'h2' | 'h3' | 'body' | 'bullet'
}

/** Convierte Markdown simple (el formato de las propuestas IA) a líneas tipadas */
function markdownToLines(md: string): PdfLine[] {
  const lines: PdfLine[] = []
  for (const raw of md.split('\n')) {
    let line = raw.trimEnd()
    if (!line.trim()) {
      lines.push({ text: '', style: 'body' })
      continue
    }
    // Tablas markdown: quitar separadores, convertir filas a texto plano
    if (/^\|?[\s:-]+\|[\s|:-]+$/.test(line)) continue
    if (line.includes('|')) {
      line = line.split('|').map(c => c.trim()).filter(Boolean).join('  ·  ')
    }

    const clean = (s: string) => s
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim()

    if (/^###\s+/.test(line)) lines.push({ text: clean(line.replace(/^###\s+/, '')), style: 'h3' })
    else if (/^##\s+/.test(line)) lines.push({ text: clean(line.replace(/^##\s+/, '')), style: 'h2' })
    else if (/^#\s+/.test(line)) lines.push({ text: clean(line.replace(/^#\s+/, '')), style: 'h1' })
    else if (/^\s*[-*•]\s+/.test(line)) lines.push({ text: clean(line.replace(/^\s*[-*•]\s+/, '')), style: 'bullet' })
    else if (/^\s*\d+\.\s+/.test(line)) lines.push({ text: clean(line), style: 'bullet' })
    else lines.push({ text: clean(line), style: 'body' })
  }
  return lines
}

/** Exporta la propuesta comercial de un prospecto como PDF descargable */
export function exportProposalPdf(prospect: Prospect, proposalMarkdown: string, accentHex = '#7c3aed') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - PAGE_MARGIN * 2
  const accent = hexToRgb(accentHex)

  // ── Encabezado de marca ──
  doc.setFillColor(...accent)
  doc.rect(0, 0, pageWidth, 26, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('Propuesta Comercial', PAGE_MARGIN, 12)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `${prospect.company || prospect.prospectName} · ${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    PAGE_MARGIN, 19
  )

  // ── Meta del prospecto ──
  let y = 36
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(8)
  const metaParts = [
    prospect.contactName && `Contacto: ${prospect.contactName}`,
    prospect.contactEmail && `Email: ${prospect.contactEmail}`,
    prospect.contactPhone && `Tel: ${prospect.contactPhone}`,
  ].filter(Boolean) as string[]
  if (metaParts.length) {
    doc.text(metaParts.join('   ·   '), PAGE_MARGIN, y)
    y += 8
  }

  // ── Contenido ──
  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - PAGE_MARGIN) {
      doc.addPage()
      y = PAGE_MARGIN
    }
  }

  for (const line of markdownToLines(proposalMarkdown)) {
    if (!line.text) { y += LINE_HEIGHT * 0.6; continue }

    let fontSize = 9.5
    let fontStyle: 'normal' | 'bold' = 'normal'
    let color: [number, number, number] = [30, 41, 59]
    let indent = 0
    let prefix = ''
    let spaceBefore = 0

    switch (line.style) {
      case 'h1': fontSize = 14; fontStyle = 'bold'; color = accent; spaceBefore = 4; break
      case 'h2': fontSize = 12; fontStyle = 'bold'; color = accent; spaceBefore = 3.5; break
      case 'h3': fontSize = 10.5; fontStyle = 'bold'; color = [51, 65, 85]; spaceBefore = 2.5; break
      case 'bullet': indent = 4; prefix = '•  '; break
    }

    doc.setFont('helvetica', fontStyle)
    doc.setFontSize(fontSize)
    doc.setTextColor(...color)

    const wrapped: string[] = doc.splitTextToSize(prefix + line.text, contentWidth - indent)
    y += spaceBefore
    for (const w of wrapped) {
      ensureSpace(LINE_HEIGHT)
      doc.text(w, PAGE_MARGIN + indent, y)
      y += LINE_HEIGHT
    }
  }

  // ── Pie de página en cada hoja ──
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text('Generado con GEMS Hub', PAGE_MARGIN, pageHeight - 8)
    doc.text(`${i} / ${pages}`, pageWidth - PAGE_MARGIN, pageHeight - 8, { align: 'right' })
  }

  const slug = (prospect.company || prospect.prospectName || 'prospecto')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  doc.save(`propuesta-${slug}.pdf`)
}

function hexToRgb(hex: string): [number, number, number] {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) hex = '#7c3aed'
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}
