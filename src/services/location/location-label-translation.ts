import type { AppLanguage } from '@/src/types/app';

const GUJARATI_LOCATION_LABELS: Record<string, string> = {
  India: 'ભારત',
  Ahmedabad: 'અમદાવાદ',
  Anand: 'આણંદ',
  Amreli: 'અમરેલી',
  Ankleshwar: 'અંકલેશ્વર',
  'Andhra Pradesh': 'આંધ્ર પ્રદેશ',
  'Arunachal Pradesh': 'અરુણાચલ પ્રદેશ',
  Assam: 'આસામ',
  Bhavnagar: 'ભાવનગર',
  Bengaluru: 'બેંગલુરુ',
  Bihar: 'બિહાર',
  Bharuch: 'ભરૂચ',
  Bhuj: 'ભુજ',
  Botad: 'બોટાદ',
  Chennai: 'ચેન્નાઈ',
  Chhattisgarh: 'છત્તીસગઢ',
  Dahod: 'દાહોદ',
  Goa: 'ગોવા',
  Gandhidham: 'ગાંધીધામ',
  Gandhinagar: 'ગાંધીનગર',
  Godhra: 'ગોધરા',
  Gondal: 'ગોંડલ',
  Gujarat: 'ગુજરાત',
  Himmatnagar: 'હિંમતનગર',
  Jaipur: 'જયપુર',
  Jamnagar: 'જામનગર',
  Jetpur: 'જેટપુર',
  Jodhpur: 'જોધપુર',
  Junagadh: 'જૂનાગઢ',
  Haryana: 'હરિયાણા',
  'Himachal Pradesh': 'હિમાચલ પ્રદેશ',
  Jharkhand: 'ઝારખંડ',
  Kadi: 'કડી',
  Karnataka: 'કર્ણાટક',
  Kerala: 'કેરળ',
  Khambhat: 'ખંભાત',
  Kutch: 'કચ્છ',
  'Madhya Pradesh': 'મધ્ય પ્રદેશ',
  Maharashtra: 'મહારાષ્ટ્ર',
  Mahuva: 'મહુવા',
  Mehsana: 'મહેસાણા',
  Manipur: 'મણિપુર',
  Meghalaya: 'મેઘાલય',
  Modasa: 'મોડાસા',
  Morbi: 'મોરબી',
  Mizoram: 'મિઝોરમ',
  Mumbai: 'મુંબઈ',
  Nadiad: 'નડિયાદ',
  Nagaland: 'નાગાલેન્ડ',
  Navsari: 'નવસારી',
  Odisha: 'ઓડિશા',
  Palanpur: 'પાલનપુર',
  Patan: 'પાટણ',
  Porbandar: 'પોરબંદર',
  Punjab: 'પંજાબ',
  Rajasthan: 'રાજસ્થાન',
  Rajkot: 'રાજકોટ',
  Surat: 'સુરત',
  Surendranagar: 'સુરેન્દ્રનગર',
  Sikkim: 'સિક્કિમ',
  'Tamil Nadu': 'તમિલનાડુ',
  Telangana: 'તેલંગાણા',
  Thane: 'ઠાણે',
  Tripura: 'ત્રિપુરા',
  Unjha: 'ઉંઝા',
  'Uttar Pradesh': 'ઉત્તર પ્રદેશ',
  Uttarakhand: 'ઉત્તરાખંડ',
  Vadodara: 'વડોદરા',
  Valsad: 'વલસાડ',
  Veraval: 'વેરાવળ',
  Vyara: 'વ્યારા',
  Wankaner: 'વાંકાનેર',
  'West Bengal': 'પશ્ચિમ બંગાળ',
  'Andaman and Nicobar Islands': 'અંડમાન અને નિકોબાર ટાપુઓ',
  Chandigarh: 'ચંડીગઢ',
  'Dadra and Nagar Haveli and Daman and Diu': 'દાદરા અને નગર હવેલી અને દમણ અને દીવ',
  Delhi: 'દિલ્હી',
  'Jammu and Kashmir': 'જમ્મુ અને કાશ્મીર',
  Ladakh: 'લદ્દાખ',
  Lakshadweep: 'લક્ષદ્વીપ',
  Puducherry: 'પુડુચેરી',
};

export function translateLocationLabel(label: string, language: AppLanguage) {
  if (language !== 'gu') {
    return label;
  }

  return GUJARATI_LOCATION_LABELS[label] ?? label;
}

export function translateLocationText(text: string, language: AppLanguage) {
  if (language !== 'gu') {
    return text;
  }

  return text
    .split(',')
    .map((part) => translateLocationLabel(part.trim(), language))
    .join(', ');
}
