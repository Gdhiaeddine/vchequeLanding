import prisma from '@/lib/prisma';
import signer, { Ed25519Signer } from './ed25519';

export class LicenseManager {
  private signer: Ed25519Signer;

  constructor(customSigner?: Ed25519Signer) {
    this.signer = customSigner || signer;
  }

  /**
   * Génère une clé de licence VCheque avec préfixe et segmentation 4x4.
   * Exemple: VCHQ-9F2B-7C4E-8A1D-3E5A
   */
  public static generateKey(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segments: string[] = [];
    for (let s = 0; s < 4; s++) {
      let segment = '';
      for (let i = 0; i < 4; i++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return `VCHQ-${segments.join('-')}`;
  }

  /**
   * Recherche une licence par sa clé normalisée.
   */
  public async findByKey(key: string) {
    const normalized = key.trim().toUpperCase();
    return prisma.license.findUnique({
      where: { license_key: normalized },
      include: {
        activations: {
          orderBy: { activated_at: 'desc' },
        },
      },
    });
  }

  /**
   * Crée une nouvelle licence commerciale.
   */
  public async createLicense(
    attributes: {
      license_key?: string;
      licensee_name: string;
      licensee_email: string;
      company?: string | null;
      edition?: string;
      max_activations?: number;
      notes?: string | null;
    },
    actor = 'ADMIN',
    ipAddress?: string
  ) {
    const key = attributes.license_key
      ? attributes.license_key.trim().toUpperCase()
      : LicenseManager.generateKey();

    return prisma.$transaction(async (tx) => {
      const license = await tx.license.create({
        data: {
          license_key: key,
          licensee_name: attributes.licensee_name || 'Client Commercial',
          licensee_email: attributes.licensee_email || 'client@example.com',
          company: attributes.company || null,
          edition: attributes.edition || 'COMMERCIAL',
          max_activations: Math.max(1, attributes.max_activations || 1),
          status: 'active',
          current_machine_id: null,
          notes: attributes.notes || null,
        },
      });

      await tx.licenseAuditLog.create({
        data: {
          license_id: license.id,
          action: 'KEY_GENERATED',
          actor,
          ip_address: ipAddress || null,
          details: JSON.stringify({
            licensee_name: license.licensee_name,
            licensee_email: license.licensee_email,
            edition: license.edition,
            max_activations: license.max_activations,
          }),
        },
      });

      return license;
    });
  }

  /**
   * Active une licence sur une machine cliente (1 activation par PC selon quota).
   */
  public async activate(params: {
    licenseKey: string;
    machineId: string;
    machineName?: string | null;
    osInfo?: string | null;
    ipAddress?: string | null;
    actor?: string;
  }) {
    const { licenseKey, machineId, machineName, osInfo, ipAddress, actor = 'CLIENT' } = params;
    const normalizedKey = licenseKey.trim().toUpperCase();
    const normalizedMachineId = machineId.trim().toLowerCase();

    if (!normalizedKey || !normalizedMachineId) {
      const error: any = new Error("La clé de licence et l'identifiant machine sont obligatoires.");
      error.status = 400;
      error.code = 'INVALID_ARGUMENTS';
      throw error;
    }

    const license = await this.findByKey(normalizedKey);
    if (!license) {
      const error: any = new Error('Clé de licence inconnue ou invalide.');
      error.status = 404;
      error.code = 'LICENSE_NOT_FOUND';
      throw error;
    }

    if (license.status === 'revoked') {
      await prisma.licenseAuditLog.create({
        data: {
          license_id: license.id,
          action: 'ACTIVATION_REJECTED_REVOKED',
          actor,
          ip_address: ipAddress || null,
          details: JSON.stringify({ attempted_machine_id: normalizedMachineId }),
        },
      });

      const error: any = new Error("Cette licence a été révoquée par l'administrateur.");
      error.status = 403;
      error.code = 'LICENSE_REVOKED';
      throw error;
    }

    const existingActivation = license.activations.find(
      (a) => a.machine_id === normalizedMachineId && a.status === 'active'
    );

    const maxAllowed = Math.max(1, license.max_activations || 1);
    const activeCount = license.activations.filter((a) => a.status === 'active').length;

    if (!existingActivation && activeCount >= maxAllowed) {
      await prisma.licenseAuditLog.create({
        data: {
          license_id: license.id,
          action: 'ACTIVATION_REJECTED_MACHINE_MISMATCH',
          actor,
          ip_address: ipAddress || null,
          details: JSON.stringify({
            current_machine_id: license.current_machine_id,
            attempted_machine_id: normalizedMachineId,
            machine_name: machineName,
            max_activations: maxAllowed,
            active_count: activeCount,
          }),
        },
      });

      const errorMsg =
        maxAllowed === 1
          ? "Cette licence est déjà activée sur un autre PC. Un transfert vers ce nouveau poste doit être autorisé par l'administrateur."
          : `Le quota de postes autorisés (${maxAllowed} PCs) pour cette licence a été atteint.`;

      const error: any = new Error(errorMsg);
      error.status = 409;
      error.code = 'ALREADY_ACTIVATED_ON_ANOTHER_PC';
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      if (!existingActivation) {
        await tx.license.update({
          where: { id: license.id },
          data: { current_machine_id: normalizedMachineId },
        });

        await tx.licenseActivation.create({
          data: {
            license_id: license.id,
            machine_id: normalizedMachineId,
            machine_name: machineName || null,
            os_info: osInfo || null,
            ip_address: ipAddress || null,
            status: 'active',
          },
        });

        await tx.licenseAuditLog.create({
          data: {
            license_id: license.id,
            action: 'ACTIVATION_SUCCESS',
            actor,
            ip_address: ipAddress || null,
            details: JSON.stringify({
              machine_id: normalizedMachineId,
              machine_name: machineName,
              os_info: osInfo,
              active_count: activeCount + 1,
              max_activations: maxAllowed,
            }),
          },
        });
      } else {
        await tx.licenseAuditLog.create({
          data: {
            license_id: license.id,
            action: 'ACTIVATION_IDEMPOTENT',
            actor,
            ip_address: ipAddress || null,
            details: JSON.stringify({
              machine_id: normalizedMachineId,
              machine_name: machineName,
            }),
          },
        });
      }

      const payload = {
        company: license.company || '',
        edition: 'COMMERCIAL',
        issued_at: Math.floor(Date.now() / 1000),
        license_key: license.license_key,
        licensee_email: license.licensee_email,
        licensee_name: license.licensee_name,
        machine_id: normalizedMachineId,
        type: 'PERMANENT',
        version: 1,
      };

      const signed = await this.signer.sign(payload);

      return {
        status: 'activated',
        license_key: license.license_key,
        edition: 'COMMERCIAL',
        licensee_name: license.licensee_name,
        machine_id: normalizedMachineId,
        payload: signed.payload,
        payload_b64: signed.payload_b64,
        signature: signed.signature,
        public_key: this.signer.getPublicKey(),
      };
    });
  }

  /**
   * Vérifie le statut d'une licence pour un contrôle périodique en ligne.
   */
  public async verify(licenseKey: string, machineId: string) {
    const normalizedKey = licenseKey.trim().toUpperCase();
    const normalizedMachineId = machineId.trim().toLowerCase();

    const license = await this.findByKey(normalizedKey);
    if (!license) {
      return { valid: false, code: 'LICENSE_NOT_FOUND', message: 'Licence inconnue.', statusCode: 404 };
    }

    if (license.status === 'revoked') {
      return { valid: false, code: 'LICENSE_REVOKED', message: "Licence révoquée par l'administrateur.", statusCode: 403 };
    }

    const isMatch = license.activations.some(
      (a) => a.machine_id === normalizedMachineId && a.status === 'active'
    ) || license.current_machine_id === normalizedMachineId;

    if (!isMatch) {
      return {
        valid: false,
        code: 'MACHINE_MISMATCH',
        message: 'Cette licence est attribuée à une autre machine.',
        statusCode: 409,
      };
    }

    return {
      valid: true,
      status: 'active',
      license_key: license.license_key,
      licensee_name: license.licensee_name,
      edition: license.edition,
      machine_id: normalizedMachineId,
      statusCode: 200,
    };
  }

  /**
   * Autorise le transfert d'une licence vers un nouveau PC.
   */
  public async authorizeTransfer(
    licenseIdOrKey: number | string,
    reason: string,
    actor = 'ADMIN',
    ip?: string
  ) {
    const license = typeof licenseIdOrKey === 'number'
      ? await prisma.license.findUnique({ where: { id: licenseIdOrKey } })
      : await this.findByKey(licenseIdOrKey);

    if (!license) throw new Error('Licence introuvable.');

    return prisma.$transaction(async (tx) => {
      const previousMachine = license.current_machine_id;

      await tx.licenseActivation.updateMany({
        where: { license_id: license.id, status: 'active' },
        data: { status: 'transferred', deactivated_at: new Date() },
      });

      const updated = await tx.license.update({
        where: { id: license.id },
        data: { current_machine_id: null },
      });

      await tx.licenseAuditLog.create({
        data: {
          license_id: license.id,
          action: 'TRANSFER_AUTHORIZED',
          actor,
          ip_address: ip || null,
          details: JSON.stringify({ previous_machine_id: previousMachine, reason }),
        },
      });

      return updated;
    });
  }

  /**
   * Révoque définitivement une licence.
   */
  public async revoke(licenseIdOrKey: number | string, reason: string, actor = 'ADMIN', ip?: string) {
    const license = typeof licenseIdOrKey === 'number'
      ? await prisma.license.findUnique({ where: { id: licenseIdOrKey } })
      : await this.findByKey(licenseIdOrKey);

    if (!license) throw new Error('Licence introuvable.');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.license.update({
        where: { id: license.id },
        data: { status: 'revoked', current_machine_id: null },
      });

      await tx.licenseActivation.updateMany({
        where: { license_id: license.id, status: 'active' },
        data: { status: 'revoked', deactivated_at: new Date() },
      });

      await tx.licenseAuditLog.create({
        data: {
          license_id: license.id,
          action: 'REVOKED',
          actor,
          ip_address: ip || null,
          details: JSON.stringify({ reason }),
        },
      });

      return updated;
    });
  }

  /**
   * Met à jour dynamiquement le quota de postes (PC autorisés) d'une licence.
   */
  public async updateQuota(
    licenseIdOrKey: number | string,
    newQuota: number,
    actor = 'ADMIN',
    reason?: string,
    ip?: string
  ) {
    const license = typeof licenseIdOrKey === 'number'
      ? await prisma.license.findUnique({ where: { id: licenseIdOrKey } })
      : await this.findByKey(licenseIdOrKey);

    if (!license) throw new Error('Licence introuvable.');

    const oldQuota = license.max_activations || 1;
    const cleanQuota = Math.max(1, newQuota);

    return prisma.$transaction(async (tx) => {
      const updated = await tx.license.update({
        where: { id: license.id },
        data: { max_activations: cleanQuota },
      });

      await tx.licenseAuditLog.create({
        data: {
          license_id: license.id,
          action: 'QUOTA_UPDATED',
          actor,
          ip_address: ip || null,
          details: JSON.stringify({ old_quota: oldQuota, new_quota: cleanQuota, reason }),
        },
      });

      return updated;
    });
  }

  /**
   * Détache ou libère un poste spécifique pour libérer un emplacement de quota.
   */
  public async deactivateMachine(
    licenseIdOrKey: number | string,
    activationId: number,
    actor = 'ADMIN',
    reason?: string,
    ip?: string
  ) {
    const license = typeof licenseIdOrKey === 'number'
      ? await prisma.license.findUnique({ where: { id: licenseIdOrKey } })
      : await this.findByKey(licenseIdOrKey);

    if (!license) throw new Error('Licence introuvable.');

    return prisma.$transaction(async (tx) => {
      const activation = await tx.licenseActivation.findFirst({
        where: { id: activationId, license_id: license.id },
      });

      if (!activation) throw new Error('Activation introuvable.');

      const updatedActivation = await tx.licenseActivation.update({
        where: { id: activationId },
        data: { status: 'deactivated', deactivated_at: new Date() },
      });

      if (license.current_machine_id === activation.machine_id) {
        const remaining = await tx.licenseActivation.findFirst({
          where: { license_id: license.id, status: 'active' },
          orderBy: { activated_at: 'desc' },
        });

        await tx.license.update({
          where: { id: license.id },
          data: { current_machine_id: remaining?.machine_id || null },
        });
      }

      await tx.licenseAuditLog.create({
        data: {
          license_id: license.id,
          action: 'MACHINE_DEACTIVATED',
          actor,
          ip_address: ip || null,
          details: JSON.stringify({
            activation_id: activation.id,
            machine_id: activation.machine_id,
            machine_name: activation.machine_name,
            reason,
          }),
        },
      });

      return updatedActivation;
    });
  }

  /**
   * Retourne l'historique complet d'une licence.
   * La résolution par ID numérique et l'accès aux commandes (PII) sont strictement réservés à l'administration.
   */
  public async getHistory(licenseIdOrKey: number | string, forAdmin = false) {
    const isNum = typeof licenseIdOrKey === 'number' || /^\d+$/.test(String(licenseIdOrKey).trim());
    const numId = isNum ? parseInt(String(licenseIdOrKey).trim(), 10) : null;

    let license = null;
    if (numId !== null && forAdmin) {
      license = await prisma.license.findUnique({
        where: { id: numId },
        include: {
          activations: { orderBy: { activated_at: 'desc' } },
          audit_logs: { orderBy: { created_at: 'desc' } },
          orders: true,
        },
      });
    }

    if (!license && typeof licenseIdOrKey === 'string') {
      license = await prisma.license.findUnique({
        where: { license_key: licenseIdOrKey.trim().toUpperCase() },
        include: {
          activations: { orderBy: { activated_at: 'desc' } },
          audit_logs: { orderBy: { created_at: 'desc' } },
          orders: forAdmin,
        },
      });
    }

    if (!license) throw new Error('Licence introuvable.');
    return license;
  }
}

export const licenseManager = new LicenseManager();
export default licenseManager;
