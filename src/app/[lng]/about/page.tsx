import Link from 'next/link';

import Button from 'src/app/[lng]/components/Button/Button';

import { useTranslation } from '../../i18n';
import { fallbackLng, languages } from '../../i18n/settings';

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
      <Link href={`/${lng}`}>
        <Button colorBg='red'>{'main'}</Button>
      </Link>
      <Link href={`/${lng}/client-page`}>
        <Button>{t('to-client-page')}</Button>
      </Link>
    </div>
  );
}
