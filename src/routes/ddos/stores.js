import { writable } from 'svelte/store';

export const processedPackets = writable(0);
export const queueLength = writable(0);
export const droppedPackets = writable(0);
export const serverStatus = writable(0);
