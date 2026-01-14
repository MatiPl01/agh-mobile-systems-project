const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [path.resolve(__dirname, 'assets')],
  resolver: {
    alias: {
      '@assets': path.resolve(__dirname, 'assets')
    },
    assetExts: ['tflite', ...defaultConfig?.resolver?.assetExts]
  }
};

module.exports = mergeConfig(defaultConfig, config);
