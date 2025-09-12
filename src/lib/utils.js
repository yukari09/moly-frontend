import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getTermValue(userMeta, termKey) {
  const meta = userMeta?.find(meta => meta.termKey === termKey);
  return meta ? meta.termValue : null;
}

export function getMetaValue(userMeta, metaKey) {
  const meta = userMeta?.find(meta => meta.metaKey === metaKey);
  return meta ? meta.metaValue : null;
}
