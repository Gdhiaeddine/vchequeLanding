const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportData() {
  console.log('🔄 Exporting SQLite data from data/vcheque.db...');

  const users = await prisma.user.findMany();
  const licenses = await prisma.license.findMany();
  const licenseActivations = await prisma.licenseActivation.findMany();
  const licenseAuditLogs = await prisma.licenseAuditLog.findMany();
  const orders = await prisma.order.findMany();
  const appReleases = await prisma.appRelease.findMany();
  const contactMessages = await prisma.contactMessage.findMany();
  const demoVideos = await prisma.demoVideo.findMany();
  const blogPosts = await prisma.blogPost.findMany();

  const backup = {
    exportedAt: new Date().toISOString(),
    counts: {
      users: users.length,
      licenses: licenses.length,
      licenseActivations: licenseActivations.length,
      licenseAuditLogs: licenseAuditLogs.length,
      orders: orders.length,
      appReleases: appReleases.length,
      contactMessages: contactMessages.length,
      demoVideos: demoVideos.length,
      blogPosts: blogPosts.length,
    },
    data: {
      users,
      licenses,
      licenseActivations,
      licenseAuditLogs,
      orders,
      appReleases,
      contactMessages,
      demoVideos,
      blogPosts,
    },
  };

  const backupDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const backupPath = path.join(backupDir, 'sqlite-backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf-8');

  console.log('✅ Export complete! Summary:');
  console.table(backup.counts);
  console.log(`📁 File saved to: ${backupPath}`);
}

exportData()
  .catch((err) => {
    console.error('❌ Export failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
