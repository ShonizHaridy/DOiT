// src/common/decorators/transform.decorator.ts
import { Transform } from 'class-transformer';

/**
 * Converts Prisma null values to undefined so they 
 * play nicely with optional DTO fields and React props.
 */
export function OptionalField() {
  return Transform(({ value }) => value ?? undefined);
}

/**
 * Specifically for Prisma Decimal fields.
 * Handles Prisma Decimal objects, strings, and null/undefined.
 */
export function ToNumber() {
  return Transform(({ value }) => {
    // If value is undefined, null, or an empty string, stop immediately.
    // Do NOT pass it to any other function.
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    // If it's a Decimal object from Prisma, convert to number
    if (typeof value === 'object' && value.toNumber) {
      return value.toNumber();
    }

    // Force conversion and check for NaN
    const result = Number(value);
    return isNaN(result) ? undefined : result;
  }, { toClassOnly: true }); // Only run when converting DB -> DTO
}

export function TransformUrl() {
  return Transform(({ value }) => {
    if (!value) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value; // Already full URL
    }
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:4000';
    return `${baseUrl}${value}`;
  });
}
