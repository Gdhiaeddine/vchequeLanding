/**
 * Fonctions utilitaires de calcul et de formatage des prix et remises
 */

export function parseAndFormatPrice(val: string | number | undefined, fallback: string): string {
  if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
    return fallback;
  }
  const str = String(val).trim().replace(/\s/g, '').replace(',', '.');
  const num = Number(str);
  if (!isNaN(num)) {
    return num
      .toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .replace(/\u202F/g, ' ');
  }
  return String(val).trim();
}

/**
 * Calcule automatiquement le pourcentage de réduction à partir du prix actuel et du prix initial
 * Exemple : 8500 et 12000 -> "-29%"
 */
export function calculateDiscountBadge(
  price: string | number | undefined,
  priceBefore: string | number | undefined
): string | null {
  if (!price || !priceBefore) return null;
  const p = Number(String(price).trim().replace(/\s/g, '').replace(',', '.'));
  const b = Number(String(priceBefore).trim().replace(/\s/g, '').replace(',', '.'));

  if (!isNaN(p) && !isNaN(b) && b > p && b > 0) {
    const pct = Math.round(((b - p) / b) * 100);
    return `-${pct}%`;
  }

  return null;
}
