const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importToSupabase() {
  const backupPath = path.resolve(process.cwd(), 'data/sqlite-backup.json');
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found at ${backupPath}. Run 'node scripts/export-sqlite.js' first.`);
  }

  const raw = fs.readFileSync(backupPath, 'utf-8');
  const backup = JSON.parse(raw);
  const { data } = backup;

  console.log('🚀 Starting import to Supabase PostgreSQL...');

  // 1. Users
  console.log(`👤 Importing ${data.users.length} users...`);
  for (const u of data.users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        email: u.email,
        password: u.password,
        email_verified_at: u.email_verified_at ? new Date(u.email_verified_at) : null,
        two_factor_secret: u.two_factor_secret,
        two_factor_recovery_codes: u.two_factor_recovery_codes,
        two_factor_confirmed_at: u.two_factor_confirmed_at ? new Date(u.two_factor_confirmed_at) : null,
        remember_token: u.remember_token,
        created_at: u.created_at ? new Date(u.created_at) : new Date(),
        updated_at: u.updated_at ? new Date(u.updated_at) : new Date(),
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        email_verified_at: u.email_verified_at ? new Date(u.email_verified_at) : null,
        two_factor_secret: u.two_factor_secret,
        two_factor_recovery_codes: u.two_factor_recovery_codes,
        two_factor_confirmed_at: u.two_factor_confirmed_at ? new Date(u.two_factor_confirmed_at) : null,
        remember_token: u.remember_token,
        created_at: u.created_at ? new Date(u.created_at) : new Date(),
        updated_at: u.updated_at ? new Date(u.updated_at) : new Date(),
      },
    });
  }

  // 2. Licenses
  console.log(`🔑 Importing ${data.licenses.length} licenses...`);
  for (const l of data.licenses) {
    await prisma.license.upsert({
      where: { id: l.id },
      update: {
        license_key: l.license_key,
        licensee_name: l.licensee_name,
        licensee_email: l.licensee_email,
        company: l.company,
        edition: l.edition,
        max_activations: l.max_activations,
        status: l.status,
        current_machine_id: l.current_machine_id,
        notes: l.notes,
        created_at: l.created_at ? new Date(l.created_at) : new Date(),
        updated_at: l.updated_at ? new Date(l.updated_at) : new Date(),
      },
      create: {
        id: l.id,
        license_key: l.license_key,
        licensee_name: l.licensee_name,
        licensee_email: l.licensee_email,
        company: l.company,
        edition: l.edition,
        max_activations: l.max_activations,
        status: l.status,
        current_machine_id: l.current_machine_id,
        notes: l.notes,
        created_at: l.created_at ? new Date(l.created_at) : new Date(),
        updated_at: l.updated_at ? new Date(l.updated_at) : new Date(),
      },
    });
  }

  // 3. License Activations
  console.log(`💻 Importing ${data.licenseActivations.length} license activations...`);
  for (const a of data.licenseActivations) {
    await prisma.licenseActivation.upsert({
      where: { id: a.id },
      update: {
        license_id: a.license_id,
        machine_id: a.machine_id,
        machine_name: a.machine_name,
        os_info: a.os_info,
        ip_address: a.ip_address,
        status: a.status,
        activated_at: a.activated_at ? new Date(a.activated_at) : new Date(),
        deactivated_at: a.deactivated_at ? new Date(a.deactivated_at) : null,
        created_at: a.created_at ? new Date(a.created_at) : new Date(),
        updated_at: a.updated_at ? new Date(a.updated_at) : new Date(),
      },
      create: {
        id: a.id,
        license_id: a.license_id,
        machine_id: a.machine_id,
        machine_name: a.machine_name,
        os_info: a.os_info,
        ip_address: a.ip_address,
        status: a.status,
        activated_at: a.activated_at ? new Date(a.activated_at) : new Date(),
        deactivated_at: a.deactivated_at ? new Date(a.deactivated_at) : null,
        created_at: a.created_at ? new Date(a.created_at) : new Date(),
        updated_at: a.updated_at ? new Date(a.updated_at) : new Date(),
      },
    });
  }

  // 4. License Audit Logs
  console.log(`📋 Importing ${data.licenseAuditLogs.length} license audit logs...`);
  for (const log of data.licenseAuditLogs) {
    await prisma.licenseAuditLog.upsert({
      where: { id: log.id },
      update: {
        license_id: log.license_id,
        action: log.action,
        actor: log.actor,
        ip_address: log.ip_address,
        details: log.details,
        created_at: log.created_at ? new Date(log.created_at) : new Date(),
      },
      create: {
        id: log.id,
        license_id: log.license_id,
        action: log.action,
        actor: log.actor,
        ip_address: log.ip_address,
        details: log.details,
        created_at: log.created_at ? new Date(log.created_at) : new Date(),
      },
    });
  }

  // 5. Orders
  console.log(`📦 Importing ${data.orders.length} orders...`);
  const validLicenseKeys = new Set(data.licenses.map(l => l.license_key));
  for (const o of data.orders) {
    const licenseKeyValid = o.license_key && validLicenseKeys.has(o.license_key);
    const licenseKey = licenseKeyValid ? o.license_key : null;
    let metadata = o.metadata;
    if (o.license_key && !licenseKeyValid) {
      let metaObj = {};
      try {
        if (metadata) metaObj = JSON.parse(metadata);
      } catch (_) {}
      metaObj.orphaned_license_key = o.license_key;
      metadata = JSON.stringify(metaObj);
    }

    await prisma.order.upsert({
      where: { id: o.id },
      update: {
        reference: o.reference,
        nom: o.nom,
        email: o.email,
        entreprise: o.entreprise,
        telephone: o.telephone,
        adresse: o.adresse,
        code_postal: o.code_postal,
        ville: o.ville,
        wilaya: o.wilaya,
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        slickpay_invoice_id: o.slickpay_invoice_id,
        slickpay_payment_url: o.slickpay_payment_url,
        license_key: licenseKey,
        paid_at: o.paid_at ? new Date(o.paid_at) : null,
        metadata: metadata,
        created_at: o.created_at ? new Date(o.created_at) : new Date(),
        updated_at: o.updated_at ? new Date(o.updated_at) : new Date(),
      },
      create: {
        id: o.id,
        reference: o.reference,
        nom: o.nom,
        email: o.email,
        entreprise: o.entreprise,
        telephone: o.telephone,
        adresse: o.adresse,
        code_postal: o.code_postal,
        ville: o.ville,
        wilaya: o.wilaya,
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        slickpay_invoice_id: o.slickpay_invoice_id,
        slickpay_payment_url: o.slickpay_payment_url,
        license_key: licenseKey,
        paid_at: o.paid_at ? new Date(o.paid_at) : null,
        metadata: metadata,
        created_at: o.created_at ? new Date(o.created_at) : new Date(),
        updated_at: o.updated_at ? new Date(o.updated_at) : new Date(),
      },
    });
  }

  // 6. App Releases
  console.log(`🚀 Importing ${data.appReleases.length} app releases...`);
  for (const r of data.appReleases) {
    await prisma.appRelease.upsert({
      where: { id: r.id },
      update: {
        version: r.version,
        filename: r.filename,
        storage_path: r.storage_path,
        file_size: r.file_size,
        mime_type: r.mime_type,
        sha256: r.sha256,
        download_count: r.download_count,
        is_active: r.is_active,
        release_notes: r.release_notes,
        uploaded_by: r.uploaded_by,
        created_at: r.created_at ? new Date(r.created_at) : new Date(),
        updated_at: r.updated_at ? new Date(r.updated_at) : new Date(),
      },
      create: {
        id: r.id,
        version: r.version,
        filename: r.filename,
        storage_path: r.storage_path,
        file_size: r.file_size,
        mime_type: r.mime_type,
        sha256: r.sha256,
        download_count: r.download_count,
        is_active: r.is_active,
        release_notes: r.release_notes,
        uploaded_by: r.uploaded_by,
        created_at: r.created_at ? new Date(r.created_at) : new Date(),
        updated_at: r.updated_at ? new Date(r.updated_at) : new Date(),
      },
    });
  }

  // 7. Blog Posts
  console.log(`📰 Importing ${data.blogPosts.length} blog posts...`);
  for (const bp of data.blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: bp.id },
      update: {
        title: bp.title,
        slug: bp.slug,
        excerpt: bp.excerpt,
        content: bp.content,
        cover_image_path: bp.cover_image_path,
        category: bp.category,
        reading_time: bp.reading_time,
        status: bp.status,
        published_at: bp.published_at ? new Date(bp.published_at) : null,
        views_count: bp.views_count,
        author_id: bp.author_id,
        created_at: bp.created_at ? new Date(bp.created_at) : new Date(),
        updated_at: bp.updated_at ? new Date(bp.updated_at) : new Date(),
      },
      create: {
        id: bp.id,
        title: bp.title,
        slug: bp.slug,
        excerpt: bp.excerpt,
        content: bp.content,
        cover_image_path: bp.cover_image_path,
        category: bp.category,
        reading_time: bp.reading_time,
        status: bp.status,
        published_at: bp.published_at ? new Date(bp.published_at) : null,
        views_count: bp.views_count,
        author_id: bp.author_id,
        created_at: bp.created_at ? new Date(bp.created_at) : new Date(),
        updated_at: bp.updated_at ? new Date(bp.updated_at) : new Date(),
      },
    });
  }

  // 8. Reset PostgreSQL sequences so autoincrement doesn't conflict
  console.log('🔢 Synchronizing PostgreSQL sequences (setval)...');
  const tables = [
    'users',
    'licenses',
    'license_activations',
    'license_audit_logs',
    'orders',
    'app_releases',
    'contact_messages',
    'demo_videos',
    'blog_posts',
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`
        SELECT setval(
          pg_get_serial_sequence('"${table}"', 'id'),
          COALESCE((SELECT MAX(id) FROM "${table}"), 1),
          true
        );
      `);
      console.log(`  ✓ Sequence synced for table: "${table}"`);
    } catch (e) {
      console.warn(`  ⚠️ Could not sync sequence for table "${table}" (may be empty or not serial)`);
    }
  }

  console.log('🎉 Data migration to Supabase PostgreSQL completed successfully!');
}

importToSupabase()
  .catch((err) => {
    console.error('❌ Import failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
