import { useSyncExternalStore } from "react";

let avatarUrl: string | null = null;
const listeners = new Set<() => void>();

export function setAvatarUrl(url: string | null) {
  avatarUrl = url;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return avatarUrl;
}

export function useAvatarUrl() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
