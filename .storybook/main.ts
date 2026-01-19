import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    return {
      ...config,
      css: {
        postcss: {
          plugins: [
            tailwindcss,
            autoprefixer,
          ],
        },
      },
    };
  },
};
export default config;