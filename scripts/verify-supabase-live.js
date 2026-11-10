const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 ========================================================');
  console.log('🔍 VERIFYING DATABASE CONNECTION & LIVE SUPABASE DATA');
  console.log('🔍 ========================================================\n');

  // 1. Query PostgreSQL Server metadata
  const serverInfo = await prisma.$queryRaw`
    SELECT 
      current_database() as database,
      current_user as user,
      inet_server_addr()::text as server_ip,
      version() as pg_version
  `;
  console.log('✅ PostgreSQL Server Details on Supabase:');
  console.log('   - Current Database:', serverInfo[0].database);
  console.log('   - Connected User  :', serverInfo[0].user);
  console.log('   - Server Address  :', serverInfo[0].server_ip);
  console.log('   - Engine Version  :', serverInfo[0].pg_version.split(' on ')[0]);
  console.log('');

  // 2. Query Row Counts across all Prisma models
  console.log('📊 Table Record Counts (Queried Live from Supabase):');
  const [
    userCount,
    licenseCount,
    activationCount,
    auditLogCount,
    orderCount,
    releaseCount,
    blogCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.license.count(),
    prisma.licenseActivation.count(),
    prisma.licenseAuditLog.count(),
    prisma.order.count(),
    prisma.appRelease.count(),
    prisma.blogPost.count(),
  ]);

  console.log(`   - Users               : ${userCount}`);
  console.log(`   - Licenses            : ${licenseCount}`);
  console.log(`   - License Activations : ${activationCount}`);
  console.log(`   - License Audit Logs  : ${auditLogCount}`);
  console.log(`   - Orders              : ${orderCount}`);
  console.log(`   - App Releases        : ${releaseCount}`);
  console.log(`   - Blog Posts          : ${blogCount}`);
  console.log('');

  // 3. Sample live data from Supabase
  const sampleBlogs = await prisma.blogPost.findMany({
    select: { id: true, title: true, status: true, cover_image_path: true, updated_at: true },
    orderBy: { id: 'asc' },
    take: 3
  });
  console.log('📰 Live Sample Blog Posts from Supabase:');
  sampleBlogs.forEach(b => {
    console.log(`   [ID ${b.id}] (${b.status}) ${b.title.substring(0, 50)}...`);
  });
  console.log('');

  const sampleLicenses = await prisma.license.findMany({
    select: { id: true, license_key: true, licensee_name: true, status: true },
    take: 3
  });
  console.log('🔑 Live Sample Licenses from Supabase:');
  sampleLicenses.forEach(l => {
    console.log(`   [ID ${l.id}] ${l.license_key} (${l.status}) - ${l.licensee_name}`);
  });
  console.log('');

  // 4. Test live write & read on Supabase
  const testRef = `VERIFY-${Date.now()}`;
  console.log(`🧪 Testing Live INSERT & SELECT on Supabase (Reference: ${testRef})...`);
  const created = await prisma.order.create({
    data: {
      reference: testRef,
      nom: 'Verification Supabase Bot',
      email: 'test-supabase@virtanis.com',
      amount: 100,
      currency: 'DZD',
      status: 'verified'
    }
  });
  console.log(`   ✓ Created temporary record ID: ${created.id}`);

  const fetched = await prisma.order.findUnique({ where: { id: created.id } });
  console.log(`   ✓ Read back from Supabase    : ${fetched.nom} (${fetched.reference})`);

  await prisma.order.delete({ where: { id: created.id } });
  console.log(`   ✓ Cleaned up test record from Supabase`);

  console.log('\n🎉 ALL DATA IS CONFIRMED 100% OPERATIONAL ON SUPABASE POSTGRESQL!\n');
}

verify()
  .catch(err => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
