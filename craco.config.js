const CracoEsbuildPlugin = require('craco-esbuild');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
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
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
            plugin => !(plugin instanceof ModuleScopePlugin)
          );
      
          return webpackConfig;
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
