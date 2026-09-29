export const VADODARA_CITY_NAME = 'Vadodara';

export const vadodaraAreaOptions = [
  { value: 'City Area', label: 'સીટી વિસ્તાર' },
  { value: 'Raopura', label: 'રાવપુરા' },
  { value: 'Warsiya Ring Road', label: 'વારસિયા રિંગ રોડ' },
  { value: 'Waghodia Road', label: 'વાઘોડિયા રોડ' },
  { value: 'Ajwa Road', label: 'આજવા રોડ' },
  { value: 'Karelibaug', label: 'કારેલીબાગ' },
  { value: 'Gorwa', label: 'ગોરવા' },
  { value: 'Gotri', label: 'ગોત્રી' },
  { value: 'Manjalpur', label: 'માંજલપુર' },
  { value: 'Tarsali', label: 'તરસાલી' },
];

export function isVadodaraCity(city?: string | null) {
  const normalized = String(city || '').trim().toLowerCase();
  return normalized === VADODARA_CITY_NAME.toLowerCase() || normalized.includes('vadodara') || normalized.includes('vadora') || normalized.includes('વડોદરા');
}

export function getDefaultVadodaraArea() {
  return vadodaraAreaOptions[0]?.value ?? '';
}

export function resolveVadodaraArea(city: string, currentArea?: string | null) {
  return isVadodaraCity(city) ? String(currentArea || '').trim() || getDefaultVadodaraArea() : '';
}
