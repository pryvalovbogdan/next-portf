'use client';

import { Advent_Pro } from 'next/font/google';
import { useEffect, useState } from 'react';

import { useTranslation } from 'src/app/i18n/client';

import { FooterBase } from './FooterBase';

// If loading a variable font, you don't need to specify the font weight
const inter = Advent_Pro({ subsets: ['latin'] });

export function Footer({ lng, path }: { lng: string; path: string }) {
  const { i18n } = useTranslation(lng, 'footer');

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');

    if (!storedMode) {
      setIsDarkMode(false);
      localStorage.setItem('themeMode', 'light');
    } else {
      setIsDarkMode(storedMode === 'dark');
    }
  }, []);

  const darkModeHandler = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <div className={inter.className}>
      <div className='bg-yellow-100 dark:bg-blue-900'>
        {/*<button className='bg-yellow-100 dark:bg-blue-900' onClick={darkModeHandler}>*/}
        {/*  {isDarkMode ? 'dark' : 'light'}*/}
        {/*</button>*/}
        <FooterBase i18n={i18n} lng={lng} path={path} />
      </div>
    </div>
  );
}
