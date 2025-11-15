const path = require('path');

module.exports = [
  // main process
  {
    mode: 'development',
    entry: './src/main/index.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
    externalsType: 'module',
    externals: ['better-sqlite3', 'electron'],
  },
  // Preload script
  {
    mode: 'development',
    entry: './src/main/preload.ts',
    target: 'electron-preload',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'preload.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
];
