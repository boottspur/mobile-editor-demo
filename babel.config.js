module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@utils': './src/utils',
            '@contexts': './src/contexts',
            '@types': './src/types',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};