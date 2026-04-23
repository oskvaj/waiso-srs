import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

type CourseCardProps = {
  id: string;
  name: string;
  modulesCount: number;
  Progress: number; // 0-1
  Mastery: number; // 0-1
};

export function StudentCourseCard({
  id,
  name,
  modulesCount,
  Progress,
  Mastery,
}: CourseCardProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <Link href={`/course/${id}`}>
      <Card
        variant="raised"
        className="hover:bg-theme-primary/5 group h-full p-6 transition-colors"
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div
            className={`font-theme-heading text-theme-text flex size-10 items-center justify-center rounded-md text-lg font-bold`}
          >
            {initial}
          </div>
        </CardHeader>

        <CardContent>
          <CardTitle className="font-theme-heading truncate text-lg">
            {name}
          </CardTitle>
          <p className="text-theme-muted mt-1 text-sm">
            {modulesCount} modules
          </p>

          <Separator className="my-4" />

          <p className="text-theme-muted mt-4 text-sm">
            {Math.round(Progress * 100)}% progress • {Math.round(Mastery * 100)}
            % mastery
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
