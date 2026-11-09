import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import signer from '@/lib/licensing/ed25519';
import { getSession } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const licenseId = parseInt(id, 10);
  if (isNaN(licenseId)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  const license = await prisma.license.findUnique({
    where: { id: licenseId },
  });

  if (!license) {
    return NextResponse.json({ error: 'Licence introuvable' }, { status: 404 });
  }

  const payload = {
    company: license.company || '',
    edition: license.edition,
    issued_at: Math.floor(Date.now() / 1000),
    license_key: license.license_key,
    licensee_email: license.licensee_email,
    licensee_name: license.licensee_name,
    machine_id: license.current_machine_id || 'OFFLINE_PORTABLE',
    type: 'PERMANENT',
    version: 1,
  };

  const signed = await signer.sign(payload);

  const fileContent = JSON.stringify(
    {
      license_key: license.license_key,
      licensee: license.licensee_name,
      edition: license.edition,
      signature: signed.signature,
      payload_b64: signed.payload_b64,
      public_key: signed.public_key,
      issued_at: new Date().toISOString(),
    },
    null,
    2
  );

  const headers = new Headers();
  headers.set('Content-Disposition', `attachment; filename="vcheque-${license.license_key}.lic"`);
  headers.set('Content-Type', 'application/json');

  return new NextResponse(fileContent, { headers });
}
