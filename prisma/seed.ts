import { PrismaClient } from "@/../generated/prisma";

const prisma = new PrismaClient();

async function clearDatabase() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename === "_prisma_migrations") continue;
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."${tablename}" CASCADE`,
    );
  }
}

async function main() {
  await clearDatabase();

  const user1 = await prisma.user.create({
    data: {
      id: "cmnso327o00008394bg3lnrfq",
      name: "tea cher",
      email: "teacheremail@gmail.com",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "cmnso327v00018394aqpjylpz",
      name: "stu dent",
      email: "studnetemail@gmail.com",
    },
  });

  const teacher = await prisma.teacher.create({
    data: {
      userId: user1.id,
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: user2.id,
    },
  });

  const course = await prisma.course.create({
    data: {
      name: "Course name",
      teacherId: teacher.userId,
      published: true,
    },
  });

  const module1 = await prisma.module.create({
    data: {
      name: "module 1",
      courseId: course.id,
      content: {
        theory: "A very cool fact!",
      },
    },
  });

  const module2 = await prisma.module.create({
    data: {
      name: "module 2",
      courseId: course.id,
      content: {
        theory: "Another very cool fact",
      },
    },
  });

  const module3 = await prisma.module.create({
    data: {
      name: "module 3",
      courseId: course.id,
      prerequisites: {
        connect: [{ id: module2.id }],
      },
      content: {
        theory: "A THIRD very cool fact!?!?!?!?",
      },
    },
  });

  const module4 = await prisma.module.create({
    data: {
      name: "module 4",
      courseId: course.id,
      prerequisites: {
        connect: [{ id: module1.id }, { id: module2.id }],
      },
      content: {
        theory: "Ain't no way there are FOUR cool facts??",
      },
    },
  });

  const question1 = await prisma.question.create({
    data: {
      name: "question 1",
      content: {
        questions: ["a + b", "c + d"],
        answers: ["a + b", "c + d"],
      },
      moduleId: module1.id,
    },
  });

  const question2 = await prisma.question.create({
    data: {
      name: "question 2",
      content: {
        questions: ["p + q", "p + q"],
        answers: ["p + q", "p + q"],
      },
      moduleId: module2.id,
    },
  });

  const question3 = await prisma.question.create({
    data: {
      name: "question 3",
      content: {
        questions: ["u + v", "u + v"],
        answers: ["u + v", "u + v"],
      },
      moduleId: module3.id,
    },
  });

  const question4 = await prisma.question.create({
    data: {
      name: "question4",
      content: {
        questions: ["x + y", "x + y"],
        answers: ["x + y", "x + y"],
      },
      moduleId: module4.id,
    },
  });

  const studentInCourse = await prisma.studentInCourse.create({
    data: {
      studentId: student.userId,
      courseId: course.id,
    },
  });

  const moduleProgress1 = await prisma.moduleProgress.create({
    data: {
      studentId: student.userId,
      courseId: course.id,
      moduleId: module1.id,
      level: 1,
    },
  });

  const moduleProgress2 = await prisma.moduleProgress.create({
    data: {
      studentId: student.userId,
      courseId: course.id,
      moduleId: module2.id,
      level: 2,
    },
  });

  const moduleProgress3 = await prisma.moduleProgress.create({
    data: {
      studentId: student.userId,
      courseId: course.id,
      moduleId: module3.id,
      level: 3,
    },
  });

  const moduleProgress4 = await prisma.moduleProgress.create({
    data: {
      studentId: student.userId,
      courseId: course.id,
      moduleId: module4.id,
      level: 4,
    },
  });

  console.log("Finished seeding database to bare minimum!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
