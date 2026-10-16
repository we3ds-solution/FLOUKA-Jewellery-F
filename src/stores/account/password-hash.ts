// SRP: demo-grade password hashing. Passwords must never sit in plain text
// in the persisted store — compare hashes instead. This is NOT a substitute
// for server auth (see GitHub #2): a fixed app salt only stops casual
// localStorage reads, not offline brute force of weak passwords.
const SALT = "floukaa-demo-v1:";

const te = new TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", te.encode(`${SALT}${password}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
