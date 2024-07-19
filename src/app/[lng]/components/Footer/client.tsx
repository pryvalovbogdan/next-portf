'use client';

import { useTranslation } from 'src/app/i18n/client';

import { FooterBase } from './FooterBase';

export function Footer({ lng, path }: { lng: string; path: string }) {
  const { i18n } = useTranslation(lng, 'footer');

  return <FooterBase i18n={i18n} lng={lng} path={path} />;
}
