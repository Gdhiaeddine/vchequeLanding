interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Nettoyage périodique pour éviter toute fuite mémoire
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (entry.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

/**
 * Vérifie si une action est autorisée selon une fenêtre de limitation (Rate Limiting).
 * @param key Identifiant unique (ex: IP ou IP:action)
 * @param maxAttempts Nombre maximum de requêtes autorisées dans la fenêtre
 * @param windowMs Durée de la fenêtre en millisecondes (défaut : 15 min)
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetInSec: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetInSec: Math.ceil((entry.resetAt - now) / 1000),
  };
}

/**
 * Réinitialise le compteur de limitation pour une clé donnée (ex: après un login réussi)
 */
export function resetRateLimit(key: string): void {
  memoryStore.delete(key);
}
