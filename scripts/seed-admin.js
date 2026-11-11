const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@virtanis.net';
  const password = 'Admin@Vcheque2026!';
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Administrateur VCheque',
      password: hashedPassword,
      two_factor_secret: null,
      two_factor_confirmed_at: null,
      two_factor_recovery_codes: null,
    },
    create: {
      name: 'Administrateur VCheque',
      email,
      password: hashedPassword,
      two_factor_secret: null,
      two_factor_confirmed_at: null,
      two_factor_recovery_codes: null,
    },
  });

  console.log('Admin user seeded successfully:');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
