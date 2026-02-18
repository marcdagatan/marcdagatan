"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TagListProps {
  tags: string[];
  baseUrl?: string;
}

export function TagList({ tags, baseUrl = "/blog/tag" }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`${baseUrl}/${encodeURIComponent(tag)}`}
          className="inline-flex"
        >
          <Badge variant="outline" className="cursor-pointer hover:bg-accent/10 hover:border-accent/50 hover:text-accent transition-all">
            #{tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
