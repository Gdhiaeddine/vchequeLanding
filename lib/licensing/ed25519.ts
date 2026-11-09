import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);
const sodium = req('libsodium-wrappers');

export class Ed25519Signer {
  private publicKeyHex: string;
  private privateKeyHex: string;

  constructor(publicKeyHex?: string, privateKeyHex?: string) {
    this.publicKeyHex = publicKeyHex || process.env.ED25519_PUBLIC_KEY || '';
    this.privateKeyHex = privateKeyHex || process.env.ED25519_PRIVATE_KEY || '';
  }

  /**
   * Produit un JSON canonique (clés triées alphabétiquement, sans espaces, UTF-8 non échappé)
   * Correspond exactement à ksort($data) + json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
   */
  public canonicalize(data: any): string {
    if (data === null || typeof data !== 'object') {
      return JSON.stringify(data);
    }

    if (Array.isArray(data)) {
      return '[' + data.map((item) => this.canonicalize(item)).join(',') + ']';
    }

    const keys = Object.keys(data).sort();
    const parts = keys.map((key) => {
      return JSON.stringify(key) + ':' + this.canonicalize(data[key]);
    });

    return '{' + parts.join(',') + '}';
  }

  /**
   * Signe cryptographiquement un payload de licence avec Ed25519.
   */
  public async sign(payload: Record<string, any>, customPrivateKeyHex?: string): Promise<{
    payload: Record<string, any>;
    payload_b64: string;
    signature: string;
    public_key: string;
  }> {
    await sodium.ready;
    const privHex = customPrivateKeyHex || this.privateKeyHex;
    if (!privHex) {
      throw new Error('Clé privée Ed25519 non configurée.');
    }

    const canonicalJson = this.canonicalize(payload);
    const secretKeyBin = sodium.from_hex(privHex);
    const signatureBin = sodium.crypto_sign_detached(canonicalJson, secretKeyBin);
    const signatureHex = sodium.to_hex(signatureBin);

    return {
      payload,
      payload_b64: Buffer.from(canonicalJson, 'utf8').toString('base64'),
      signature: signatureHex,
      public_key: this.publicKeyHex,
    };
  }

  /**
   * Vérifie la validité d'une signature Ed25519 sur un payload base64.
   */
  public async verify(payloadB64: string, signatureHex: string, customPublicKeyHex?: string): Promise<boolean> {
    await sodium.ready;
    const pubHex = customPublicKeyHex || this.publicKeyHex;
    if (!pubHex) {
      return false;
    }

    try {
      const canonicalJson = Buffer.from(payloadB64, 'base64').toString('utf8');
      const sigBin = sodium.from_hex(signatureHex);
      const pubBin = sodium.from_hex(pubHex);

      return sodium.crypto_sign_verify_detached(sigBin, canonicalJson, pubBin);
    } catch {
      return false;
    }
  }

  public getPublicKey(): string {
    return this.publicKeyHex;
  }
}

export const signer = new Ed25519Signer();
export default signer;
