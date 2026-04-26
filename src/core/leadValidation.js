export function isLeadNameValid(name = '') {
  return String(name).trim().length > 2;
}

export function isLeadEmailValid(email = '') {
  return /^\S+@\S+$/.test(String(email).trim());
}

export function isLeadWhatsappValid(whatsapp = '') {
  return String(whatsapp).trim().length >= 8;
}

export function isLeadDataValid(lead = {}) {
  return isLeadNameValid(lead.name)
    && isLeadEmailValid(lead.email)
    && isLeadWhatsappValid(lead.whatsapp);
}
