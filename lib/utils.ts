import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if the error is a unique violation
export const isUniqueViolation = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const err = error as Record<string, unknown>;

  if (err.code === '23505') {
    return true;
  }

  if (err.cause) {
    return isUniqueViolation(err.cause);
  }

  return false;
};
