// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // ⚠️ Path depends on where your messages folder is:
    // If messages is at ROOT: use '../../messages/${locale}.json'
    // If messages is in src: use '../messages/${locale}.json'
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});