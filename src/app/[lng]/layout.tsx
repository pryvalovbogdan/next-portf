import { dir } from 'i18next';

import { useTranslation } from '../i18n';
import { fallbackLng, languages } from '../i18n/settings';
import './globals.css';

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }));
}

export async function generateMetadata({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng);

  return {
    title: t('titleLayout'),
    description: t('descriptionLayout'),
    keywords: ['Design', '3d', 'JavaScript'],
    creator: 'Alex Rudenko',
    icons: {
      icon: '/images/AlexRudenko.jpg',
    },
  };
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
