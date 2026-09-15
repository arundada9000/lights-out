import {
  cloneElement,
  isValidElement,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

interface SlotProps {
  children?: ReactNode;
  [key: string]: unknown;
}

function SlotImpl({ children, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    return null;
  }

  const child = children as ReactElement<Record<string, unknown>>;
  const childProps = { ...slotProps, ...child.props } as Record<string, unknown>;
  const mergedRef = mergeRefs(child.props.ref, slotProps.ref);

  return cloneElement(child, { ...childProps, ref: mergedRef });
}

export function Slot({ children, ...props }: SlotProps) {
  return <SlotImpl {...props}>{children}</SlotImpl>;
}

function mergeRefs(...refs: unknown[]) {
  const filtered = refs.filter(Boolean);
  if (filtered.length <= 1) return filtered[0];
  return (node: ElementType) => {
    for (const ref of filtered) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as { current: unknown }).current = node;
      }
    }
  };
}