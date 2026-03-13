import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://djmaster.academy',
  integrations: [
    starlight({
      title: 'DJMaster Academy',
      defaultLocale: 'he',
      locales: {
        he: { label: 'עברית', dir: 'rtl' },
        en: { label: 'English', dir: 'ltr' },
      },
      sidebar: [
        {
          label: 'קורסים',
          items: [
            { label: 'עולם הדי-ג\'יי', link: '/courses/01-world-of-dj/' },
            { label: 'ציוד DDJ-FLX4', link: '/courses/02-flx4-equipment/' },
            { label: 'Rekordbox', link: '/courses/03-rekordbox/' },
            { label: 'מבנה מוזיקלי', link: '/courses/04-music-structure/' },
            { label: 'ביטמאצ\'ינג ידני', link: '/courses/05-manual-beatmatching/' },
          ],
        },
        {
          label: 'כלים אינטראקטיביים',
          items: [
            { label: 'BPM Calculator', link: '/tools/bpm-calculator/' },
            { label: 'Harmonic Wheel', link: '/tools/harmonic-wheel/' },
            { label: 'EQ Trainer', link: '/tools/eq-trainer/' },
            { label: 'Beatmatch Trainer', link: '/tools/beatmatch-trainer/' },
            { label: 'Set Planner', link: '/tools/set-planner/' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    ssr: {
      noExternal: ['wavesurfer.js'],
    },
  },
});
