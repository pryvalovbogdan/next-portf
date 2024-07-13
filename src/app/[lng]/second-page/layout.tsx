import { useTranslation } from '../../i18n';
import { fallbackLng, languages } from '../../i18n/settings';

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }));
}

export async function generateMetadata({ params: { lng } }) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const { t } = await useTranslation(lng, 'second-page');

  return {
    title: t('title'),
  };
}

export default async function Layout({ children }) {
  return children;
}
