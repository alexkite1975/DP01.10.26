/**
 * W3C Web Cryptography API - AES-GCM 256-bit On-Device Vault
 * Strictly stores driver documents, licence details, and credentials locally on the device.
 * Zero PII or card images are sent to the cloud.
 */

export interface DriverComplianceVault {
  driverName: string;
  driverNumber: string;
  dateOfBirth: string;
  licenceExpiry: string;
  highestCategory: 'CAT_CE' | 'CAT_C';
  categories: string[];
  cpcExpiryDate: string;
  cpcStatus: 'ACTIVE' | 'EXPIRED';
  tachoCardNumber: string;
  penaltyPoints: number;
  homeDepot: string;
  contactPhone: string;
  contactEmail: string;
  authProvider: 'GOOGLE' | 'APPLE' | 'PASSKEY';
  preferredNavApp?: string;
  measurementUnits?: 'IMPERIAL' | 'METRIC';
  distanceUnits?: 'MILES' | 'KILOMETERS';
  appLanguage?: 'EN' | 'PL' | 'RO' | 'LT' | 'ES';
  paymentStructure?: 'PAYE' | 'LTD' | 'UMBRELLA';
  vehicleCategory?: string;
  avoidLowBridges?: boolean;
  avoidWeightRestrictions?: boolean;
  avoidNarrowLanes?: boolean;
  reliefHgvRegistered?: boolean;
  reliefHourlyRate?: number;
  documentsEncrypted: {
    licenceFront?: string; // Encrypted base64 thumbnail
    licenceBack?: string;  // Encrypted base64 thumbnail
    tachoFront?: string;   // Encrypted base64 thumbnail
    tachoBack?: string;    // Encrypted base64 thumbnail
    cpcFront?: string;     // Encrypted base64 thumbnail
    cpcBack?: string;      // Encrypted base64 thumbnail
    cpcCard?: string;      // Legacy fallback
    tachoCard?: string;    // Legacy fallback
  };
  storedLocallyAt: string;
}

const STORAGE_KEY_VAULT = 'dp_encrypted_driver_dossier_v1';
const STORAGE_KEY_KEY = 'dp_vault_master_key_v1';

// Generate or retrieve device-specific AES-GCM 256-bit master key
async function getDeviceEncryptionKey(): Promise<CryptoKey> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const rawKey = localStorage.getItem(STORAGE_KEY_KEY);
      if (rawKey) {
        const keyData = Uint8Array.from(atob(rawKey), (c) => c.charCodeAt(0));
        return await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
      }
      const newKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const exported = await crypto.subtle.exportKey('raw', newKey);
      const base64Key = btoa(String.fromCharCode(...new Uint8Array(exported)));
      localStorage.setItem(STORAGE_KEY_KEY, base64Key);
      return newKey;
    }
  } catch (err) {
    console.warn('Web Crypto not available, using fallback storage:', err);
  }
  // Return dummy key placeholder if crypto not supported
  return {} as CryptoKey;
}

// Encrypt and persist 100% locally on device
export async function saveDriverVaultLocally(vault: DriverComplianceVault): Promise<void> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const key = await getDeviceEncryptionKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(JSON.stringify(vault));

      const cipherBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded
      );

      const payload = {
        iv: Array.from(iv),
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(payload));
      return;
    }
  } catch (err) {
    console.warn('Local encryption failed, saving plaintext to local storage:', err);
  }

  // Fallback to simple localStorage if Web Crypto API is unavailable
  localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(vault));
}

// Retrieve and decrypt driver vault from device
export async function getDriverVaultFromDevice(): Promise<DriverComplianceVault | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VAULT);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed.ciphertext && parsed.iv && window.crypto && window.crypto.subtle) {
      const key = await getDeviceEncryptionKey();
      const iv = new Uint8Array(parsed.iv);
      const cipherData = Uint8Array.from(atob(parsed.ciphertext), (c) => c.charCodeAt(0));

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        cipherData
      );

      const decoded = new TextDecoder().decode(decrypted);
      return JSON.parse(decoded);
    }

    return parsed;
  } catch (err) {
    console.warn('Failed decrypting local vault:', err);
    return null;
  }
}

// Purge 100% of data from device (GDPR Article 17 Right to Erasure)
export function purgeDeviceVault(): void {
  localStorage.removeItem(STORAGE_KEY_VAULT);
  localStorage.removeItem(STORAGE_KEY_KEY);
}
