export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validateProjectId(id) {
  // Format: MPLAD-YYYY-XXXXX or MPLAD-XXXXX
  return /^MPLAD(-[0-9]{4})?-[0-9]{3,6}$/i.test(id.trim());
}

export function validateRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}
