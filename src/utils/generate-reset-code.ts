/**
 * Generates a random 6-character alphanumeric code for password reset
 * Uses uppercase letters and numbers to avoid confusion between similar characters
 */
export function generateResetCode(): string {
  // Using characters that are easy to distinguish (avoiding 0/O, 1/I/l)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}