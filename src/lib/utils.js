import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a specific value from a userMeta array based on a metaKey.
 * @param {Array<{metaKey: string, metaValue: any}>} metaArray The userMeta array.
 * @param {string} key The metaKey to find.
 * @returns {any | null} The corresponding metaValue, or null if not found.
 */
export function getMetaValue(metaArray, key) {
  if (!Array.isArray(metaArray)) {
    return null;
  }
  const metaItem = metaArray.find(item => item.metaKey === key);
  return metaItem ? metaItem.metaValue : null;
}