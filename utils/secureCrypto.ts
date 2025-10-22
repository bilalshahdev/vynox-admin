// utils/secureCrypto.ts
// Simple WebCrypto helpers to encrypt/decrypt a string using AES-GCM.
// WARNING: storing both key and ciphertext on the client reduces security.
// This is better than plaintext, but not as secure as browser password managers.

const ENC = new TextEncoder();
const DEC = new TextDecoder();

function bufToBase64(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export async function generateAesKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // extractable so we can export & persist (note: reduces security)
    ["encrypt", "decrypt"]
  );
}

export async function exportRawKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key); // ArrayBuffer
  return bufToBase64(raw);
}

export async function importRawKey(base64Raw: string): Promise<CryptoKey> {
  const raw = base64ToBuf(base64Raw);
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptText(key: CryptoKey, plaintext: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM 96-bit IV
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    ENC.encode(plaintext)
  );
  return {
    iv: bufToBase64(iv.buffer),
    cipher: bufToBase64(encrypted),
  };
}

export async function decryptText(
  key: CryptoKey,
  ivB64: string,
  cipherB64: string
) {
  const iv = new Uint8Array(base64ToBuf(ivB64));
  const cipherBuf = base64ToBuf(cipherB64);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipherBuf
  );
  return DEC.decode(decrypted);
}
