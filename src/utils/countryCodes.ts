// Prefijos telefónicos internacionales para selects de teléfono.
// Lista curada (no exhaustiva) priorizando Latinoamérica + mercados frecuentes.
export interface CountryCode {
  iso: string
  name: string
  dial: string
  flag: string
}

export const COUNTRY_CODES: CountryCode[] = [
  { iso: 'CR', name: 'Costa Rica', dial: '+506', flag: '🇨🇷' },
  { iso: 'PA', name: 'Panamá', dial: '+507', flag: '🇵🇦' },
  { iso: 'NI', name: 'Nicaragua', dial: '+505', flag: '🇳🇮' },
  { iso: 'HN', name: 'Honduras', dial: '+504', flag: '🇭🇳' },
  { iso: 'SV', name: 'El Salvador', dial: '+503', flag: '🇸🇻' },
  { iso: 'GT', name: 'Guatemala', dial: '+502', flag: '🇬🇹' },
  { iso: 'BZ', name: 'Belice', dial: '+501', flag: '🇧🇿' },
  { iso: 'MX', name: 'México', dial: '+52', flag: '🇲🇽' },
  { iso: 'US', name: 'Estados Unidos', dial: '+1', flag: '🇺🇸' },
  { iso: 'CA', name: 'Canadá', dial: '+1', flag: '🇨🇦' },
  { iso: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { iso: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪' },
  { iso: 'EC', name: 'Ecuador', dial: '+593', flag: '🇪🇨' },
  { iso: 'PE', name: 'Perú', dial: '+51', flag: '🇵🇪' },
  { iso: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴' },
  { iso: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { iso: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { iso: 'PY', name: 'Paraguay', dial: '+595', flag: '🇵🇾' },
  { iso: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾' },
  { iso: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷' },
  { iso: 'DO', name: 'República Dominicana', dial: '+1', flag: '🇩🇴' },
  { iso: 'CU', name: 'Cuba', dial: '+53', flag: '🇨🇺' },
  { iso: 'PR', name: 'Puerto Rico', dial: '+1', flag: '🇵🇷' },
  { iso: 'ES', name: 'España', dial: '+34', flag: '🇪🇸' },
  { iso: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { iso: 'GB', name: 'Reino Unido', dial: '+44', flag: '🇬🇧' },
  { iso: 'FR', name: 'Francia', dial: '+33', flag: '🇫🇷' },
  { iso: 'DE', name: 'Alemania', dial: '+49', flag: '🇩🇪' },
  { iso: 'IT', name: 'Italia', dial: '+39', flag: '🇮🇹' },
]

export const DEFAULT_COUNTRY_DIAL = '+506' // Costa Rica — sede de GEMS Innovations
