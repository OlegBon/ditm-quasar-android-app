export function getCurrentDate(locale = 'en-US') {
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    // month: 'long',
    month: 'numeric',
    day: 'numeric',
  })
}
