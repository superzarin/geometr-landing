'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ContactForm from '@/components/ContactForm';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<string>('');

  return (
    <main className="min-h-screen">
      <section className="h-screen w-full">
        <Map onPlaceSelect={setSelectedPlace} />
      </section>
      <section className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
        <ContactForm selectedPlace={selectedPlace} />
      </section>
    </main>
  );
} 