import type { ContentBlock } from "@/lib/guides";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

const toneStyles = {
  info: "border-blue/25 bg-blue/8 text-label",
  tip: "border-accent/30 bg-accent-soft text-label",
  warning: "border-warning/30 bg-warning/10 text-label",
};

const toneIcon = {
  info: <Info className="h-4 w-4 flex-shrink-0 text-blue" aria-hidden />,
  tip: <Lightbulb className="h-4 w-4 flex-shrink-0 text-accent" aria-hidden />,
  warning: <TriangleAlert className="h-4 w-4 flex-shrink-0 text-warning" aria-hidden />,
};

function Callout({ block }: { block: Extract<ContentBlock, { type: "callout" }> }) {
  const tone = block.tone ?? "info";
  return (
    <aside
      className={cn(
        "my-6 flex gap-3 rounded-ios-lg border px-4 py-3.5 sm:px-5",
        toneStyles[tone]
      )}
    >
      {toneIcon[tone]}
      <div className="flex flex-col gap-1">
        {block.title ? (
          <p className="text-sm font-semibold tracking-tight text-label">
            {block.title}
          </p>
        ) : null}
        {block.text ? (
          <p className="text-[15px] leading-relaxed text-label-secondary">
            {block.text}
          </p>
        ) : null}
      </div>
    </aside>
  );
}

function CodeBlock({ block }: { block: Extract<ContentBlock, { type: "code" }> }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-ios-lg border border-separator bg-surface p-4 text-sm leading-relaxed text-label">
      <code className={cn("font-mono")}>{block.code}</code>
    </pre>
  );
}

function Blockquote({ block }: { block: Extract<ContentBlock, { type: "blockquote" }> }) {
  return (
    <blockquote className="my-6 border-l-2 border-accent pl-4 text-base italic leading-relaxed text-label-secondary">
      {block.text}
    </blockquote>
  );
}

function ListBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "ul" | "ol" }>;
}) {
  const items = block.items ?? [];
  if (block.type === "ol") {
    return (
      <ol className="my-5 flex flex-col gap-2.5 pl-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-label">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-fill text-xs font-semibold text-accent">
              {i + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className="my-5 flex flex-col gap-2.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-label">
          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StepsBlock({ block }: { block: Extract<ContentBlock, { type: "steps" }> }) {
  const items = block.items ?? [];
  return (
    <ol className="my-6 flex flex-col gap-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-contrast">
            {i + 1}
          </span>
          <p className="pt-1 text-[15px] leading-relaxed text-label">{item}</p>
        </li>
      ))}
    </ol>
  );
}

function TableBlock({ block }: { block: Extract<ContentBlock, { type: "table" }> }) {
  return (
    <div className="my-6 overflow-x-auto rounded-ios-lg border border-separator">
      <table className="w-full border-collapse text-left text-sm">
        {block.header ? (
          <thead>
            <tr className="border-b border-separator bg-group">
              {block.header.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 font-semibold tracking-tight text-label"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {block.rows?.map((row, i) => (
            <tr
              key={i}
              className="border-b border-separator/60 last:border-0"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-4 py-3 align-top leading-relaxed text-label-secondary",
                    j === 0 && row.length > 1 && "font-medium text-label"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LinkListBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "link-list" }>;
}) {
  return (
    <ul className="my-5 flex flex-col gap-2.5">
      {block.links?.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="text-[15px] font-medium text-accent transition-opacity duration-200 hover:opacity-80 focus-visible:rounded-ios-sm focus-visible:ring-focused"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function GuideContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-content">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return (
              <p
                key={index}
                className="my-5 text-[16px] leading-[1.8] text-label"
              >
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={index}
                id={`guide-${index}`}
                className="mb-3 mt-10 flex scroll-mt-24 items-center gap-3 text-2xl font-semibold tracking-tight text-label first:mt-0"
              >
                <span aria-hidden className="h-5 w-1 rounded-full bg-accent" />
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={index}
                id={`guide-${index}`}
                className="mb-2 mt-8 scroll-mt-24 text-lg font-semibold tracking-tight text-label"
              >
                {block.text}
              </h3>
            );
          case "ul":
          case "ol":
            return <ListBlock key={index} block={block} />;
          case "callout":
            return <Callout key={index} block={block} />;
          case "steps":
            return <StepsBlock key={index} block={block} />;
          case "table":
            return <TableBlock key={index} block={block} />;
          case "code":
            return <CodeBlock key={index} block={block} />;
          case "blockquote":
            return <Blockquote key={index} block={block} />;
          case "link-list":
            return <LinkListBlock key={index} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}