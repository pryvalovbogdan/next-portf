import { Advent_Pro } from 'next/font/google';

import Dashboard from 'src/app/components/Dashboard/Dashboard';
import { NavBar } from 'src/app/components/Navbar/NavBar';

import { fallbackLng, languages } from '../i18n/settings';
import { Footer } from 'src/app/components/Footer/client';
import { ModelWrapper } from 'src/app/components/Model/CanvasWrapper';

// If loading a variable font, you don't need to specify the font weight
const font = Advent_Pro({ subsets: ['latin'], variable: '--font-advent-pro' });

export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  return (
    <div className={font.className}>
      <div className='snap-y snap-mandatory overflow-y-auto h-screen flex-grow z-0 overflow-x-hidden'>
        <main className='snap-always snap-center'>
          <ModelWrapper />
        </main>
        <NavBar lng={lng} />
        <div className='snap-always snap-center'>
          <Dashboard />
          <Footer lng={lng} path={''} />
        </div>
      </div>
    </div>
  );
}
