import Link from 'next/link';

import { useTranslation } from '../i18n';
import { fallbackLng, languages } from '../i18n/settings';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

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
    <>
      <main>
        {/*<Header heading={t('h1')} />*/}
        <div
          style={{ height: 500 }}
          dangerouslySetInnerHTML={{
            __html:
              '<div class="sketchfab-embed-wrapper" > <iframe style="height: 100vh; width: 100vw" title="Faceless" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/08c64ab77c7b4479ad2142605783beb5/embed?autostart=1"> </iframe> <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;"> <a href="https://sketchfab.com/3d-models/faceless-08c64ab77c7b4479ad2142605783beb5?utm_medium=embed&utm_campaign=share-popup&utm_content=08c64ab77c7b4479ad2142605783beb5" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> Faceless </a> by <a href="https://sketchfab.com/Free-Radical-666?utm_medium=embed&utm_campaign=share-popup&utm_content=08c64ab77c7b4479ad2142605783beb5" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> Ali Rahimi </a> on <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=08c64ab77c7b4479ad2142605783beb5" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a></p></div>',
          }}
        />

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
    </>
  );
}
