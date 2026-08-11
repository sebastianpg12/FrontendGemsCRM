// Reglas de adjuntos de tickets — deben espejar exactamente lo que el backend
// acepta (routes/tickets.js ALLOWED_MIMES + límites de multer), para que el
// usuario se entere del problema al elegir el archivo y no después de enviar
// el formulario y recibir un error técnico del servidor.
export const MAX_TICKET_FILES = 5
export const MAX_TICKET_FILE_SIZE = 10 * 1024 * 1024 // 10MB, igual que el backend

export const ALLOWED_TICKET_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf', 'application/zip',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
])

// Para el atributo `accept` del <input type="file"> — filtra en el selector
// del sistema operativo antes de que el usuario llegue a elegir algo inválido.
export const TICKET_FILE_ACCEPT = Array.from(ALLOWED_TICKET_MIMES).join(',')

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Filtra `newFiles` contra los ya seleccionados (`existing`), aplicando
 * límite de cantidad, tipo permitido y tamaño máximo por archivo.
 * Devuelve los archivos válidos a agregar + un mensaje de error (si algo
 * se rechazó) listo para mostrar al usuario.
 */
export function validateTicketFiles(existing: File[], newFiles: File[]): { accepted: File[]; error: string | null } {
  const errors: string[] = []
  const accepted: File[] = []
  let count = existing.length

  for (const file of newFiles) {
    if (count >= MAX_TICKET_FILES) {
      errors.push(`Máximo ${MAX_TICKET_FILES} archivos permitidos`)
      break
    }
    if (!ALLOWED_TICKET_MIMES.has(file.type)) {
      errors.push(`"${file.name}": tipo de archivo no permitido (sólo JPG, PNG, GIF, WEBP, PDF, ZIP, Word, Excel o texto plano)`)
      continue
    }
    if (file.size > MAX_TICKET_FILE_SIZE) {
      errors.push(`"${file.name}": supera el máximo de ${formatFileSize(MAX_TICKET_FILE_SIZE)} (pesa ${formatFileSize(file.size)})`)
      continue
    }
    accepted.push(file)
    count++
  }

  return { accepted, error: errors.length ? errors.join(' · ') : null }
}
