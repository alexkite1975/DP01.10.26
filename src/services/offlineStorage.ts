import { SiteRiskAssessment, OfflineQueueItem } from '../types';

const DB_NAME = 'SiteRiskOfflineDB';
const DB_VERSION = 1;
const STORE_SITES = 'cached_sites';
const STORE_QUEUE = 'offline_queue';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_SITES)) {
        db.createObjectStore(STORE_SITES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// --- Sites & RAMS Caching ---
export async function cacheSitesOffline(sites: SiteRiskAssessment[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SITES, 'readwrite');
    const store = tx.objectStore(STORE_SITES);
    sites.forEach((site) => store.put(site));
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[OfflineDB] Could not cache sites offline:', err);
  }
}

export async function getCachedSitesOffline(): Promise<SiteRiskAssessment[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SITES, 'readonly');
    const store = tx.objectStore(STORE_SITES);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[OfflineDB] Could not read cached sites:', err);
    return [];
  }
}

// --- Offline Action Queue ---
export async function enqueueOfflineAction(
  actionType: OfflineQueueItem['actionType'],
  payload: any
): Promise<OfflineQueueItem> {
  const item: OfflineQueueItem = {
    id: `queue-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actionType,
    payload,
    queuedAt: new Date().toISOString(),
    synced: false,
    syncAttempts: 0
  };

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    const store = tx.objectStore(STORE_QUEUE);
    store.put(item);
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
    console.log(`[OfflineQueue] Enqueued ${actionType} while offline (ID: ${item.id})`);
  } catch (err) {
    console.warn('[OfflineQueue] Failed to save offline item:', err);
  }

  return item;
}

export async function getPendingOfflineQueue(): Promise<OfflineQueueItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_QUEUE, 'readonly');
    const store = tx.objectStore(STORE_QUEUE);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return [];
  }
}

export async function syncPendingQueue(): Promise<number> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 0;
  }

  const items = await getPendingOfflineQueue();
  if (items.length === 0) return 0;

  try {
    const response = await fetch('/api/sync/offline-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    if (response.ok) {
      const data = await response.json();
      // Clear synced items
      const db = await openDB();
      const tx = db.transaction(STORE_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_QUEUE);
      store.clear();
      console.log(`[OfflineQueue] Successfully synced ${data.syncedCount} offline records`);
      return data.syncedCount || items.length;
    }
  } catch (err) {
    console.warn('[OfflineQueue] Background sync failed, will retry when network restores:', err);
  }

  return 0;
}
