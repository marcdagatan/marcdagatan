import Link from "next/link";

interface TagListProps {
  tags: string[];
  baseUrl?: string;
}

export function TagList({ tags, baseUrl = "/blog/tag" }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`${baseUrl}/${encodeURIComponent(tag)}`}
          className="text-xs text-foreground/50 hover:text-foreground/80 hover:underline transition-colors"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
