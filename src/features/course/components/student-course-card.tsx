import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type CourseCardProps = {
  id: string;
  name: string;
  modulesCount: number;
  modulesUnlocked: number;
  Progress: number; // 0-1
  Mastery: number; // 0-1
};

export function StudentCourseCard({
  id,
  name,
  modulesCount,
  modulesUnlocked,
  Progress,
  Mastery,
}: CourseCardProps) {
  return (
    <Link href={`/course/${id}`}>
      <Card
        variant="raised"
        className="hover:bg-theme-primary/5 group h-full p-6 transition-colors"
      >
        <CardContent className="w-full self-stretch">
          <CardTitle className="font-theme-heading truncate text-lg font-bold">
            {name}
          </CardTitle>
          <p className="text-theme-primary mt-1 text-sm">
            {modulesUnlocked}/{modulesCount} Unlocked
          </p>

          <div className="flex w-full items-center gap-2">
            <div className="bg-theme-subtle h-3 flex-1 rounded-full">
              <div
                className="bg-theme-primary text-theme-primary h-full rounded-full"
                style={{ width: `${Math.round(Progress * 100)}%` }}
              />
            </div>
            <span className="font-theme-heading w-9 shrink-0 text-right text-sm">
              {Math.round(Progress * 100)}%
            </span>
          </div>

          <div className="flex w-full items-center gap-2">
            <div className="bg-theme-subtle h-3 flex-1 rounded-full">
              <div
                className="bg-theme-secondary text-theme-secondary h-full rounded-full"
                style={{ width: `${Math.round(Mastery * 100)}%` }}
              />
            </div>
            <span className="font-theme-heading w-9 shrink-0 text-right text-sm">
              {Math.round(Mastery * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
