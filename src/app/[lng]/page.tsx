import Link from 'next/link';

import { useTranslation } from '../i18n';
import { fallbackLng, languages } from '../i18n/settings';
import { Footer } from './components/Footer';
import { ModelWrapper } from './components/Model/CanvasWrapper';

export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const { t } = await useTranslation(lng);

  return (
    <div>
      <main>
        <ModelWrapper />
        <div>
          <Link href={`/${lng}/second-page`}>
            <button type='button'>{t('to-second-page')}</button>
          </Link>
          <Link href={`/${lng}/client-page`}>
            <button type='button'>{t('to-client-page')}</button>
          </Link>
        </div>
      </main>
      <Footer lng={lng} />
    </div>
  );
}
