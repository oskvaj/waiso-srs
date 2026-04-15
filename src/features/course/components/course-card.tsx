import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type CourseCardProps = {
  id: string;
  name: string;
  published: boolean;
  modulesCount: number;
  questionsCount: number;
  studentsCount: number;
  avgProgress: number; // 0-1
  avgMastery: number; // 0-1
};

export function CourseCard({
  id,
  name,
  published,
  modulesCount,
  questionsCount,
  studentsCount,
  avgProgress,
  avgMastery,
}: CourseCardProps) {
  const initial = name.charAt(0).toUpperCase();
  const accent = published
    ? "bg-theme-success/15 text-theme-success"
    : "bg-theme-action/15 text-theme-action";

  return (
    <Link href={`/courses/${id}`}>
      <Card
        variant="raised"
        className="hover:border-theme-primary/40 group h-full p-6 transition-colors"
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div
            className={`font-theme-heading flex size-10 items-center justify-center rounded-md text-lg font-bold ${accent}`}
          >
            {initial}
          </div>
          <Badge variant={published ? "published" : "draft"}>
            {published ? "published" : "draft"}
          </Badge>
        </CardHeader>

        <CardContent>
          <CardTitle className="font-theme-heading text-lg">{name}</CardTitle>
          <p className="text-theme-muted mt-1 text-sm">
            {modulesCount} modules • {questionsCount} questions
          </p>

          {studentsCount > 0 ? (
            <p className="text-theme-muted mt-4 text-sm">
              {studentsCount} students • {Math.round(avgProgress * 100)}% avg
              progress • {Math.round(avgMastery * 100)}% avg mastery
            </p>
          ) : (
            <p className="text-theme-muted mt-4 text-sm">0 students</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
