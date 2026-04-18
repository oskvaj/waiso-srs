"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StudentListItem } from "@/server/services/student";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const VISIBLE_COUNT = 5;

type SortKey = "name" | "modulesCompleted" | "mastery";
type SortDir = "asc" | "desc";

export function StudentsSection({ students }: { students: StudentListItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...students].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortKey === "name") {
      return mul * a.name.localeCompare(b.name);
    }
    return mul * (a[sortKey] - b[sortKey]);
  });

  const hasMore = sorted.length > VISIBLE_COUNT;
  const visible = expanded ? sorted : sorted.slice(0, VISIBLE_COUNT);

  if (students.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-theme-heading text-xl font-semibold">Students</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead
              label="Name"
              sortKey="name"
              currentKey={sortKey}
              currentDir={sortDir}
              onToggle={toggleSort}
            />
            <SortableHead
              label="Modules completed"
              sortKey="modulesCompleted"
              currentKey={sortKey}
              currentDir={sortDir}
              onToggle={toggleSort}
            />
            <SortableHead
              label="Mastery"
              sortKey="mastery"
              currentKey={sortKey}
              currentDir={sortDir}
              onToggle={toggleSort}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>
                {s.modulesCompleted}/{s.totalModules}
              </TableCell>
              <TableCell>{Math.round(s.mastery * 100)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-theme-primary hover:text-theme-primary/80 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              Show more
              <ChevronDown className="size-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function SortableHead({
  label,
  sortKey,
  currentKey,
  currentDir,
  onToggle,
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onToggle: (key: SortKey) => void;
}) {
  const isActive = currentKey === sortKey;

  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onToggle(sortKey)}
        className="flex items-center gap-1 hover:cursor-pointer"
      >
        {label}
        {isActive ? (
          currentDir === "asc" ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )
        ) : (
          <ArrowUpDown className="text-theme-muted size-3.5" />
        )}
      </button>
    </TableHead>
  );
}
