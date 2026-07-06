export function formatCurrency(amount, currency = "USD", locale = "en-US") {
  if (amount == null || Number.isNaN(amount)) return "-";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

export function formatDateTime(isoString, locale = "en-US") {
  if (!isoString) return "-";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
}

export function formatDate(isoString, locale = "en-US") {
  if (!isoString) return "-";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(isoString));
}

export function formatNumber(value, locale = "en-US") {
  if (value == null || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat(locale).format(value);
}
