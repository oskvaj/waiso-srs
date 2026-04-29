import { PrismaClient, QuestionType } from "@/../generated/prisma";

const prisma = new PrismaClient();

function doc(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

function mcAnswer(text: string, correct: boolean) {
  return { text: doc(text), correct };
}

function pair(left: string, right: string) {
  return { left: doc(left), right: doc(right) };
}

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
      description:
        "An introduction to computer architecture, logic gates, and digital systems.",
    },
    {
      name: "Electrical circuits",
      published: true,
      modules: 18,
      enrollStudents: 8,
      description:
        "Fundamentals of circuit analysis, components, and signal processing.",
    },
    {
      name: "Programming",
      published: true,
      modules: 20,
      enrollStudents: 6,
      description:
        "Learn programming concepts from variables and control flow to data structures and algorithms.",
    },
    {
      name: "Data structures",
      published: false,
      modules: 8,
      enrollStudents: 0,
      description:
        "Advanced data structures including trees, graphs, and hash tables.",
    },
  ];
  for (const def of courses) {
    const course = await prisma.course.create({
      data: {
        name: def.name,
        published: def.published,
        teacherId: teacher.id,
        description: def.description,
      },
    });

    const modules = [];
    for (let i = 0; i < def.modules; i++) {
      const mod = await prisma.module.create({
        data: {
          name: `Module ${i + 1}`,
          courseId: course.id,
          content: doc(`Theory content for module ${i + 1}.`),
        },
      });

      await prisma.question.create({
        data: {
          name: `Module ${i + 1} MC`,
          moduleId: mod.id,
          type: QuestionType.MULTIPLE_CHOICE,
          content: {
            question: doc(`What is the answer for module ${i + 1}?`),
            answers: [
              mcAnswer("Correct answer", true),
              mcAnswer("Wrong answer A", false),
              mcAnswer("Wrong answer B", false),
              mcAnswer("Wrong answer C", false),
            ],
            explanation: doc(`The correct answer is the first one.`),
          },
        },
      });

      await prisma.question.create({
        data: {
          name: `Module ${i + 1} FT`,
          moduleId: mod.id,
          type: QuestionType.FREE_TEXT,
          content: {
            question: doc(`Name a key concept from module ${i + 1}.`),
            answers: [
              { text: `concept ${i + 1}`, fuzzy: true },
              { text: `Concept ${i + 1}`, fuzzy: false },
            ],
            explanation: doc(`The answer is "concept ${i + 1}".`),
          },
        },
      });

      await prisma.question.create({
        data: {
          name: `Module ${i + 1} Pair`,
          moduleId: mod.id,
          type: QuestionType.PAIR,
          content: {
            question: doc(`Match the terms for module ${i + 1}.`),
            pairs: [
              pair(`Term A${i + 1}`, `Definition A${i + 1}`),
              pair(`Term B${i + 1}`, `Definition B${i + 1}`),
              pair(`Term C${i + 1}`, `Definition C${i + 1}`),
            ],
          },
        },
      });

      modules.push(mod);
    }

    if (modules.length >= 6) {
      await prisma.module.update({
        where: { id: modules[2]!.id },
        data: {
          prerequisites: {
            connect: [{ id: modules[1]!.id }],
          },
        },
      });

      await prisma.module.update({
        where: { id: modules[3]!.id },
        data: {
          prerequisites: {
            connect: [{ id: modules[1]!.id }],
          },
        },
      });

      await prisma.module.update({
        where: { id: modules[4]!.id },
        data: {
          prerequisites: {
            connect: [{ id: modules[2]!.id }, { id: modules[3]!.id }],
          },
        },
      });

      await prisma.module.update({
        where: { id: modules[5]!.id },
        data: {
          prerequisites: {
            connect: [{ id: modules[4]!.id }, { id: modules[0]!.id }],
          },
        },
      });
    }

    for (let i = 6; i < modules.length; i++) {
      await prisma.module.update({
        where: { id: modules[i]!.id },
        data: {
          prerequisites: {
            connect: [{ id: modules[5]!.id }],
          },
        },
      });
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
