const CracoEsbuildPlugin = require('craco-esbuild');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = {
  plugins: [
    {
      plugin : CracoEsbuildPlugin,
      options: {
        esbuildMinimizerOptions: {
          target: 'es2020',
          css   : true,
        },
      },
    },
    {
      plugin: {
        /** @param {{ webpackConfig: import('webpack').Configuration}} config */
        overrideWebpackConfig: ({ webpackConfig: config }) => {
          config.resolve.plugins = config.resolve.plugins.filter(
            plugin => !(plugin instanceof ModuleScopePlugin)
          );

          const terserPlugin = config.optimization.minimizer.find(m => m instanceof TerserPlugin);
          if (terserPlugin) {
            terserPlugin.options.minimizer.implementation = TerserPlugin.swcMinify;
            delete terserPlugin.options.minimizer.options.warnings;
          }
          config.plugins.push(
            new CopyPlugin({
              patterns: [
                { from: 'src/net/message/EQMessage.proto', to: 'proto' },
              ],
            }),
          );
          config.module.rules.push({
            resourceQuery: /raw/,
            type         : 'asset/source',
          });
          return config;
        }
      }
    }
  ],
  webpack: {
    plugins: {
      add   : [],
      remove: []
    },
    configure: {
      resolve: {
        alias: {
          react      : path.resolve('./node_modules/react'),
          'react-dom': path.resolve('./node_modules/react-dom'),
        },
        fallback: {
          fs    : false,
          tls   : false,
          net   : false,
          path  : false,
          zlib  : false,
          http  : false,
          https : false,
          stream: false,
          crypto: false,
          buffer: require.resolve('buffer/'),
        },
      },
    },
  },
};
