import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/common/utils';

const prisma = new PrismaClient();

async function main() {
  const password = await hashPassword('123456');

  await prisma.user.create({
    data: {
      email: 'ola@danielgguerra.dev',
      password,
    },
  });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(() => console.log('seed completed'));
