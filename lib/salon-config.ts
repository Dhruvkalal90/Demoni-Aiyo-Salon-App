export type SalonServiceCategory = 'haircut' | 'beard' | 'texture' | 'combo'

export const salonConfig = {
  name: process.env.NEXT_PUBLIC_SALON_NAME || 'Demoni Aiyo Salon',
  location: process.env.NEXT_PUBLIC_SALON_LOCATION || '',
  phone: process.env.NEXT_PUBLIC_SALON_PHONE || '',
  email: process.env.NEXT_PUBLIC_SALON_EMAIL || '',
  currency: process.env.NEXT_PUBLIC_SALON_CURRENCY || 'INR',
  locale: process.env.NEXT_PUBLIC_SALON_LOCALE || 'en-IN',
  timeZone: process.env.NEXT_PUBLIC_SALON_TIMEZONE || 'Asia/Kolkata',
  openingTime: process.env.NEXT_PUBLIC_SALON_OPENING_TIME || '9:00 AM',
  closingTime: process.env.NEXT_PUBLIC_SALON_CLOSING_TIME || '8:00 PM',
  lastTokenTime: process.env.NEXT_PUBLIC_SALON_LAST_TOKEN_TIME || '7:15 PM',
  cancellationWindowMinutes: 15,
  lateArrivalGraceMinutes: 10,
  minimumServiceMinutes: 15,
}

export const salonServices = [
  { id: 'signature-cut', category: 'haircut', name: 'Signature haircut', description: 'Classic, tailored to you', price: 1200, durationMinutes: 35 },
  { id: 'low-taper', category: 'haircut', name: 'Low taper fade', description: 'Clean edges, easy living', price: 1400, durationMinutes: 40 },
  { id: 'classic-cut', category: 'haircut', name: 'Classic cut', description: 'A timeless shape and finish', price: 900, durationMinutes: 30 },
  { id: 'shape-up', category: 'haircut', name: 'Shape-up detail', description: 'Add a crisp line-up', price: 350, durationMinutes: 10 },
  { id: 'beard-shaping', category: 'beard', name: 'Beard styling', description: 'Shape and define your beard', price: 700, durationMinutes: 20 },
  { id: 'hot-towel', category: 'beard', name: 'Hot towel beard trim', description: 'A close trim with a warm finish', price: 900, durationMinutes: 25 },
  { id: 'line-up', category: 'beard', name: 'Clean line-up', description: 'A quick, precise outline', price: 500, durationMinutes: 15 },
  { id: 'texture-style', category: 'texture', name: 'Texture & style', description: 'Bring your natural texture to life', price: 1500, durationMinutes: 45 },
  { id: 'curl-definition', category: 'texture', name: 'Curl definition', description: 'Define and shape your curls', price: 1200, durationMinutes: 25 },
  { id: 'deep-condition', category: 'texture', name: 'Deep conditioning', description: 'A restorative care treatment', price: 1800, durationMinutes: 30 },
  { id: 'fade-beard', category: 'combo', name: 'Fade + beard', description: 'A coordinated cut and beard finish', price: 1900, durationMinutes: 55 },
  { id: 'cut-texture', category: 'combo', name: 'Cut + texture finish', description: 'A tailored cut with styled texture', price: 2100, durationMinutes: 70 },
] satisfies Array<{
  id: string
  category: SalonServiceCategory
  name: string
  description: string
  price: number
  durationMinutes: number
}>

export const salonPolicies = {
  cancellationWindowMinutes: salonConfig.cancellationWindowMinutes,
  lateArrivalGraceMinutes: salonConfig.lateArrivalGraceMinutes,
  minimumServiceMinutes: salonConfig.minimumServiceMinutes,
}

export const salonSampleMetrics = {
  revenueToday: 128400,
  revenueThisWeek: 186000,
  pendingPayments: 12600,
}

export function formatSalonCurrency(amount: number) {
  return new Intl.NumberFormat(salonConfig.locale, {
    style: 'currency',
    currency: salonConfig.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatSalonTime(value: Date | number) {
  return new Intl.DateTimeFormat(salonConfig.locale, {
    timeZone: salonConfig.timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(value)
}

export function formatSalonDate(value: Date | number, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(salonConfig.locale, {
    timeZone: salonConfig.timeZone,
    ...(options ?? { dateStyle: 'medium' }),
  }).format(value)
}

export function formatSalonDateTime(value: Date | number) {
  return new Intl.DateTimeFormat(salonConfig.locale, {
    timeZone: salonConfig.timeZone,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value)
}

export function getSalonService(id: string) {
  return salonServices.find((service) => service.id === id)
}

export function getStartingServicePrice(ids: string[]) {
  const prices = salonServices
    .filter((service) => ids.includes(service.id))
    .map((service) => service.price)

  return prices.length ? Math.min(...prices) : 0
}
