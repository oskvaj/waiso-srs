import { PrismaClient, QuestionType } from "@/../generated/prisma";

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

  const teacher = await prisma.user.create({
    data: { id: "teacher-1", name: "Dr. Anderson", email: "anderson@uni.edu" },
  });
  await prisma.teacher.create({ data: { userId: teacher.id } });

  const studentNames = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Erik",
    "Fatima",
    "Gustav",
    "Hannah",
    "Ivan",
    "Julia",
  ];
  const students = [];
  for (let i = 0; i < studentNames.length; i++) {
    const user = await prisma.user.create({
      data: {
        id: `student-${i}`,
        name: studentNames[i]!,
        email: `${studentNames[i]!.toLowerCase()}@student.edu`,
      },
    });
    await prisma.student.create({ data: { userId: user.id } });
    students.push(user);
  }

  const courses = [
    {
      name: "Basic computer technology",
      published: true,
      modules: 24,
      enrollStudents: 10,
    },
    {
      name: "Electrical circuits",
      published: true,
      modules: 18,
      enrollStudents: 8,
    },
    { name: "Programming", published: true, modules: 20, enrollStudents: 6 },
    {
      name: "Data structures",
      published: false,
      modules: 8,
      enrollStudents: 0,
    },
  ];

  for (const def of courses) {
    const course = await prisma.course.create({
      data: {
        name: def.name,
        published: def.published,
        teacherId: teacher.id,
      },
    });

    const modules = [];
    for (let i = 0; i < def.modules; i++) {
      const mod = await prisma.module.create({
        data: {
          name: `Module ${i + 1}`,
          courseId: course.id,
          content: { theory: `Theory for module ${i + 1}.` },
        },
      });
      for (let q = 0; q < 3; q++) {
        await prisma.question.create({
          data: {
            name: `M${i + 1} Q${q + 1}`,
            moduleId: mod.id,
            type: QuestionType.MULTIPLE_CHOICE,
            content: {
              question: `Question ${q + 1} about module ${i + 1}?`,
              answers: ["A", "B", "C", "D"],
              correctAnswer: 0,
            },
          },
        });
      }
      modules.push(mod);
    }

    for (let si = 0; si < def.enrollStudents; si++) {
      const student = students[si]!;
      await prisma.studentInCourse.create({
        data: { studentId: student.id, courseId: course.id },
      });

      const modulesWithProgress = Math.min((si + 1) * 2, modules.length);
      for (let mi = 0; mi < modulesWithProgress; mi++) {
        await prisma.moduleProgress.create({
          data: {
            studentId: student.id,
            courseId: course.id,
            moduleId: modules[mi]!.id,
            level: mi < modulesWithProgress / 2 ? 8 : 3,
          },
        });
      }
    }
  }

  console.log("Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
