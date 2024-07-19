import { useTranslation } from 'src/app/i18n';

import { FooterBase } from './FooterBase';

export const Footer = async ({ lng, path }: { lng: string; path?: string }) => {
  const { i18n } = await useTranslation(lng, 'footer');

  return <FooterBase i18n={i18n} lng={lng} path={path} />;
};
