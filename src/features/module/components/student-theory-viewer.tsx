"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/trpc/react";
import type { JSONContent } from "@tiptap/core";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function TheoryViewer({
  contentList,
  courseId,
  courseName,
}: {
  contentList: { moduleId: string; content: unknown }[];
  courseId: string;
  courseName: string;
}) {
  const [index, setIndex] = useState(0);

  const utils = api.useUtils();
  const mutation = api.module.studentSetHasRead.useMutation({
    onSuccess: () => {
      void utils.review.getReviewsDue.invalidate();
    },
  });
  const mutationRef = useRef(mutation);
  mutationRef.current = mutation;

  useEffect(() => {
    mutationRef.current.mutate({
      courseId,
      moduleId: contentList[index]!.moduleId,
    });
  }, [index, courseId, contentList]);

  const handleNext = () => {
    if (index < contentList.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <p className="text-theme-text py-2 text-center text-sm">
        {index + 1} / {contentList.length}
      </p>

      <div className="flex min-h-0 flex-1">
        <Button
          onClick={handlePrev}
          disabled={index === 0}
          variant="ghost"
          size="icon"
          className="h-auto w-[3%] shrink-0 rounded-l-lg rounded-r-none px-0"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <div>
            <TipTapEditor
              key={index}
              content={contentList[index]!.content as JSONContent}
              onUpdate={() => {
                return;
              }}
              editable={false}
            />
          </div>
          {index === contentList.length - 1 && (
            <Link href={`/course/${courseId}`}>
              <Button
                size="lg"
                className="mx-auto flex w-full max-w-100 items-center justify-center py-6"
              >
                Back to {courseName}
              </Button>
            </Link>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={index === contentList.length - 1}
          variant="ghost"
          size="icon"
          className="h-auto w-[3%] shrink-0 rounded-l-none rounded-r-lg px-0"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
