const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      console.log(`User with email ${email} already exists:`, user);
    } else {
      console.log(`User with email ${email} does not exist.`);
    }
  } catch (error) {
    console.error('Error querying the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Replace with the email you want to check
checkUser('jkdatman@gmail.com');
