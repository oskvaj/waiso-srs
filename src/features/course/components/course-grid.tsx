import { CourseCard } from "./course-card";
import { CreateCourseCard } from "./create-course-card";

const FAKE_COURSES = [
  {
    id: "1",
    name: "Basic computer technology",
    published: true,
    modulesCount: 24,
    questionsCount: 368,
    studentsCount: 18,
    avgProgress: 0.72,
    avgMastery: 0.43,
  },
  {
    id: "2",
    name: "Electrical circuits",
    published: true,
    modulesCount: 18,
    questionsCount: 211,
    studentsCount: 18,
    avgProgress: 0.72,
    avgMastery: 0.43,
  },
  {
    id: "3",
    name: "Programming",
    published: true,
    modulesCount: 20,
    questionsCount: 192,
    studentsCount: 18,
    avgProgress: 0.72,
    avgMastery: 0.43,
  },
  {
    id: "4",
    name: "Data structures",
    published: false,
    modulesCount: 8,
    questionsCount: 24,
    studentsCount: 0,
    avgProgress: 0,
    avgMastery: 0,
  },
  {
    id: "5",
    name: "Algorithms",
    published: false,
    modulesCount: 3,
    questionsCount: 7,
    studentsCount: 0,
    avgProgress: 0,
    avgMastery: 0,
  },
];

export function CourseGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {FAKE_COURSES.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
      <CreateCourseCard />
    </div>
  );
}
