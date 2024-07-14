'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.push('/en');
  }, [router]);
}

export default Custom404;
