'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTranslation } from 'src/app/i18n/client';

export function NavBar({ lng }: { lng: string }) {
  const { t } = useTranslation(lng);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');

    if (!storedMode) {
      setIsDarkMode(false);
      localStorage.setItem('themeMode', 'light');
    } else {
      setIsDarkMode(storedMode === 'dark');

      if (storedMode === 'dark') {
        document.body.classList.add('dark');
      }
    }
  }, []);

  const darkModeHandler = () => {
    localStorage.setItem('themeMode', isDarkMode ? 'light' : 'dark');
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  const scrollUpHome = () => {
    const element = document.querySelector('main');

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='flex justify-between py-12 px-12 bg-white dark:bg-gradient-to-r from-gray-400 to-50% to-black dark:text-white'>
      <div className='flex align-middle justify-center'>
        <p className='text-3xl mr-28 cursor-pointer' onClick={scrollUpHome}>
          {t('name')}
        </p>
        <div className='flex align-middle items-center  gap-2'>
          <a target='_blank' href='https://www.instagram.com/jingle_helz' rel='noopener noreferrer'>
            <img
              height={30}
              width={25}
              src={isDarkMode ? '/images/instagram-colored.svg' : '/images/instagram.svg'}
              alt='instagram link'
            />
          </a>
          <a target='_blank' href='https://www.instagram.com/jingle_helz' rel='noopener noreferrer'>
            <img
              height={30}
              width={20}
              src={isDarkMode ? '/images/vimeo-colored.svg' : '/images/vimeo.svg'}
              alt='vimeo link'
            />
          </a>
          <a target='_blank' href='https://www.instagram.com/jingle_helz' rel='noopener noreferrer'>
            <img
              height={20}
              width={20}
              src={isDarkMode ? '/images/facebook-colored.svg' : '/images/facebook.svg'}
              alt='facebook link'
            />
          </a>
        </div>
      </div>
      <div className='flex justify-center items-center gap-5 text-xl'>
        <p className='cursor-pointer' onClick={scrollUpHome}>
          {t('home')}
        </p>
        <span className='cursor-pointer'>{t('portfolio')}</span>
        <p className='cursor-pointer' onClick={() => router.push(`${lng}/about`)}>
          {t('about')}
        </p>

        <img
          height={30}
          width={30}
          src={isDarkMode ? '/images/moon.svg' : '/images/sun.svg'}
          alt='theme mode switch'
          onClick={darkModeHandler}
        />
      </div>
    </div>
  );
}
