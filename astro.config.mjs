// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import node from '@astrojs/node';

import auth from 'auth-astro';

import db from '@astrojs/db';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), auth(), db(), react()],
  output: "server",
  adapter: node({
    mode: 'standalone'
  })
});