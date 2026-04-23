"use client";

import { CourseName } from "@/features/course/components/course-name";
import type { ModuleDetail } from "@/server/services/module";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ModuleEditor({ module }: { module: ModuleDetail }) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/courses/${module.courseId}`}
          className="text-theme-muted hover:text-theme-text mb-4 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="text-theme-primary size-4" />
          {module.courseName}
        </Link>
      </div>
      <CourseName
        value={module.name}
        onSaveAction={(name) => console.log(`new name: ${name}`)}
      />

      <div className="text-theme-muted">Theory editor placeholder</div>
      <div className="text-theme-muted">Questions list placeholder</div>
      <div className="text-theme-muted">Dependencies placeholder</div>
    </div>
  );
}
