"use client";

import { useState } from "react";
import { Linkedin, Facebook, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom X (Twitter) icon since Lucide doesn't have it yet
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface SocialShareProps {
  title: string;
  slug: string;
}

export function SocialShare({ title, slug }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" 
    ? `${window.location.origin}/blog/${slug}`
    : `https://marcuyyy.com/blog/${slug}`;
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Label */}
          <span className="text-sm text-muted-foreground hidden sm:block">
            Share this article
          </span>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("twitter")}
              className="gap-2 hover:bg-white/10 hover:text-white hover:border-white/30"
            >
              <XIcon size={16} />
              <span className="hidden sm:inline">X</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("linkedin")}
              className="gap-2 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30"
            >
              <Linkedin size={16} />
              <span className="hidden sm:inline">LinkedIn</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("facebook")}
              className="gap-2 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30"
            >
              <Facebook size={16} />
              <span className="hidden sm:inline">Facebook</span>
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className={`gap-2 transition-all ${
                copied 
                  ? "bg-green-500/10 text-green-500 border-green-500/30" 
                  : "hover:bg-accent/10 hover:text-accent hover:border-accent/30"
              }`}
            >
              {copied ? <Check size={16} /> : <Link2 size={16} />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
