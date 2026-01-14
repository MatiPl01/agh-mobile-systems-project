module.exports = {
  presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-nullish-coalescing-operator'],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@assets': './assets'
        }
      }
    ],
    'react-native-worklets/plugin',
    [
      'react-native-unistyles/plugin',
      {
        root: 'src'
      }
    ]
  ]
};
