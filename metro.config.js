const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

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
    }
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
