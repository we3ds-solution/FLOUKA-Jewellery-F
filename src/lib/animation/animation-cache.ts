// SRP: animation fetching + promise cache. No transformation here.
import type { AnimationData } from "./transform";

const cache = new Map<string, Promise<AnimationData>>();
export function loadAnimationData(url: string) {
  const existing = cache.get(url);
  if (existing) return existing;
  const request = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Animation unavailable");
      return response.json() as Promise<AnimationData>;
    })
    .catch((error) => {
      cache.delete(url);
      throw error;
    });
  cache.set(url, request);
  return request;
}
