/* eslint-disable @typescript-eslint/no-explicit-any */
// Minimal rehype plugin that converts inline <code> to <span class="inline-code">…</span>
// so single-backtick code renders as styled inline text, not a code block.
// We intentionally avoid extra deps and use loose typing.

export default function rehypeInlineCodeToPre() {
  return function transformer(tree: any) {
    visit(tree, (node: any, index: number | null, parent: any) => {
      if (!parent || index == null) return;
      if (node?.type === "element" && node.tagName === "code") {
        // Skip real code blocks that are already inside <pre>
        if (parent.type === "element" && parent.tagName === "pre") return;

        const spanNode = {
          type: "element",
          tagName: "span",
          properties: { className: ["inline-code"] },
          children: node.children || [],
        };

        parent.children[index] = spanNode;
      }
    });
  };
}

// Tiny inlined visitor to avoid bringing unist-util-visit as a dependency
function visit(
  node: any,
  cb: (n: any, i: number | null, p: any) => void,
  index: number | null = null,
  parent: any = null
) {
  cb(node, index, parent);
  const children = node && node.children;
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      visit(children[i], cb, i, node);
    }
  }
}
