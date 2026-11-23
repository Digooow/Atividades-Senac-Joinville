/* ==========================================================================
   RANDOM HELPER — Gerador CSPRNG em buffer para partículas visuais
   ========================================================================== */

const RANDOM_BUFFER_SIZE = 64;
const randomBuffer = new Uint32Array(RANDOM_BUFFER_SIZE);
let bufferOffset = RANDOM_BUFFER_SIZE;

/**
 * Retorna um número pseudoaleatório em [0, 1) usando Web Crypto API.
 */
export function randomUnit() {
  if (bufferOffset >= RANDOM_BUFFER_SIZE) {
    globalThis.crypto.getRandomValues(randomBuffer);
    bufferOffset = 0;
  }
  const value = randomBuffer[bufferOffset];
  bufferOffset += 1;
  return value / 0x100000000;
}
