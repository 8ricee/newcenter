import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("password123", 10);

  // Tạo hoặc cập nhật tài khoản admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@kasumi.com" },
    update: {},
    create: {
      email: "admin@kasumi.com",
      name: "Kasumi Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log({ admin });

  // Tạo 3 tài khoản student
  const student1 = await prisma.user.create({
    data: {
      email: "student1@kasumi.com",
      name: "Student One",
      password: hashedPassword,
      role: "STUDENT",
    },
  });
  console.log({ student1 });

  const student2 = await prisma.user.create({
    data: {
      email: "student2@kasumi.com",
      name: "Student Two",
      password: hashedPassword,
      role: "STUDENT",
    },
  });
  console.log({ student2 });

  const student3 = await prisma.user.create({
    data: {
      email: "student3@kasumi.com",
      name: "Student Three",
      password: hashedPassword,
      role: "STUDENT",
    },
  });
  console.log({ student3 });

  // Tạo 2 tài khoản teacher
  const teacher1 = await prisma.user.create({
    data: {
      email: "teacher1@kasumi.com",
      name: "Teacher One",
      password: hashedPassword,
      role: "TEACHER",
    },
  });
  console.log({ teacher1 });

  const teacher2 = await prisma.user.create({
    data: {
      email: "teacher2@kasumi.com",
      name: "Teacher Two",
      password: hashedPassword,
      role: "TEACHER",
    },
  });
  console.log({ teacher2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
