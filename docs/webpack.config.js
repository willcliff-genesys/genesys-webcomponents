const path = require('path');
const fs = require('fs');
const stencil = require('@stencil/webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const CDN_URL = process.env.DOCS_CDN_URL || '';

module.exports = {
  entry: {
    componentListing: './src/component-listing/app.js',
    componentViewer: './src/component-viewer/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: CDN_URL,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader' // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'genesys-webcomponents': path.resolve(
        __dirname,
        '../dist/genesys-webcomponents'
      )
    }
  },
  plugins: [
    new MonacoWebpackPlugin(),
    new CopyPlugin([
      {
        from: 'src/index.html',
        flatten: true,
        transform: injectCdnUrl
      },
      { from: '../dist/genesys-webcomponents/**/*' },
      {
        from: '../src/components/**/example.html',
        transformPath(targetPath) {
          const segments = targetPath.split(path.sep);
          const component = segments[segments.length - 2];
          return `${component}.html`;
        },
        transform: generateComponentPage
      },
      {
        from: '../src/style/examples/*.html',
        transformPath(targetPath) {
          return path.basename(targetPath);
        },
        transform: generateComponentPage
      }
    ])
  ],
  devServer: {
    compress: true,
    port: 8080,
    serveIndex: true,
    disableHostCheck: true
  }
};

const componentPageTemplate = fs
  .readFileSync('src/viewer-template.html')
  .toString();

function generateComponentPage(exampleMarkup) {
  const withCdn = injectCdnUrl(componentPageTemplate);
  const sanitizedMarkup = exampleMarkup.toString().replace(/`/g, '\\`');
  return withCdn.replace('${EXAMPLE_HTML}', sanitizedMarkup);
}

function injectCdnUrl(content) {
  let htmlCdnUrl = CDN_URL;
  if (htmlCdnUrl.length > 0 && !htmlCdnUrl.endsWith('/')) {
    htmlCdnUrl = htmlCdnUrl + '/';
  }
  return content.toString().replace(/\$\{CDN_URL\}/g, htmlCdnUrl);
}
