import dynamic from 'next/dynamic';
import Link from 'next/link';

import Button from 'src/app/[lng]/components/Button/Button';

import { useTranslation } from '../../i18n';
import { fallbackLng, languages } from '../../i18n/settings';
import './style.css';

const PagePDFViewer = dynamic(() => import('../components/PDFEditor/pdfEditorPdfjs'), {
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
      {/*<PdfEditor />*/}
      <PagePDFViewer />
      <Link href={`/${lng}`}>
        <Button colorBg='red'>{'main'}</Button>
      </Link>
      <Link href={`/${lng}/client-page`}>
        <Button>to-client-page</Button>
      </Link>
    </div>
  );
}
