import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
    includePaths: [path.join(__dirname, 'src/styles')],
  },
};

export default nextConfig;
