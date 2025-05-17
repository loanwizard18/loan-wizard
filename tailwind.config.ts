
import withMT from '@material-tailwind/react/utils/withMT';

const config: any = withMT({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});

export default config;