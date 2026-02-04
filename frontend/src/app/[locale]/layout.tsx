import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DirProvider from '@/components/DirProvider';
import GlobalProviders from '@/components/providers/GlobalProviders';

const locales = ['en', 'ar'];

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DirProvider>
        <GlobalProviders>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </GlobalProviders>
      </DirProvider>
    </NextIntlClientProvider>
  );
}