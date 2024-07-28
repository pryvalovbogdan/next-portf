import dynamic from 'next/dynamic';
import Link from 'next/link';

import Button from 'src/app/components/Button/Button';
import { useTranslation } from 'src/app/i18n';
import { fallbackLng, languages } from 'src/app/i18n/settings';
import 'src/app/styles/style.css';

const PagePDFViewer = dynamic(() => import('src/app/components/PDFEditor'), {
  ssr: false,
});

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
      <PagePDFViewer />
      <Link href={`/${lng}`}>
        <Button colorBg='red'>{'main'}</Button>
      </Link>
    </div>
  );
}
