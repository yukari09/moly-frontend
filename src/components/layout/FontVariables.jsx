'use client';

import { Lora, Montserrat } from 'next/font/google';

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export default function FontVariables() {
  return (
    <style jsx global>{`
      :root {
        --font-lora: ${lora.style.fontFamily};
        --font-montserrat: ${montserrat.style.fontFamily};
      }
    `}</style>
  );
}
