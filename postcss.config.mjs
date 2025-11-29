const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Production'da CSS minification
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: true,
                minifyFontValues: true,
                minifySelectors: true,
              },
            ],
          },
        }
      : {}),
  },
};

export default config;
