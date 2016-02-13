const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
var autoprefixer = require('autoprefixer');

const pkg = require('./package.json');


const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};


const common = {
    devtool: 'cheap-module-source-map',
    // Entry accepts a path or an object of entries.
    // The build chapter contains an example of the latter.
    entry: { app: PATHS.app },
    module: {
        loaders: [
            // Set up jsx. This accepts js too thanks to RegExp
            {
                test: /\.jsx?$/,
                // Enable caching for improved performance during development
                // It uses default OS directory by default. If you need something
                // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
                loaders: ['babel?cacheDirectory'],
                include: PATHS.app
            },
            {
                test: /(\.woff$)|(\.woff2$)|(\.eot$)|(\.ttf$)|(\.svg$)/,
                loader: 'url?limit=100000'
            }
        ]
    },
    postcss: function () {
        return [autoprefixer({ browsers: ["last 5 versions"] })];
    },
    output: {
        path: PATHS.build,
        // Output using entry name
        filename: '[name].js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'node_modules/html-webpack-template/index.html',
            title: 'Kanban app',
            appMountId: 'app'
        }),
        new webpack.optimize.DedupePlugin()
    ],
    resolve: {
        // Add resolve.extensions. '' is needed to allow imports
        // without an extension. Note the .'s before extensions!!!
        // The matching will fail without!
        extensions: ['', '.js', '.jsx'],
        // Match modules in app directories without requiring paths.
        modulesDirectories: ["node_modules", "components", "app"]
    }
};

// Dev configuration
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            // Parse host and port from env so this is easy to customize.
            host: process.env.HOST,
            port: process.env.PORT
        },
        module: {
            loaders: [
                {
                    // Test expects a RegExp! Note the slashes!
                    test: /\.css$/,
                    loaders: ['style', 'css', 'postcss'],
                    // Include accepts either a path or an array of paths.
                    include: [PATHS.app, path.join(__dirname, 'node_modules')]
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if (TARGET === 'build' || TARGET === 'stats') {
    module.exports = merge(common, {
        entry: {
            vendor: Object.keys(pkg.dependencies).filter(function(v) {
                // Exclude alt-utils as it won't work with this setup
                // due to the way the package has been designed
                // (no package.json main).
                return v !== 'alt-utils';
            })
        },
        module: {
            loaders: [
                {
                    // Test expects a RegExp! Note the slashes!
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css!postcss'),
                    // Include accepts either a path or an array of paths.
                    include: [PATHS.app, path.join(__dirname, 'node_modules')]
                }
            ]
        },
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),

            // Setting DefinePlugin affects React library size!
            // DefinePlugin replaces content "as is" so we need some extra quotes
            // for the generated code to make sense
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'

            // You can set this to JSON.stringify('development') for your
            // development target to force NODE_ENV to development mode
            // no matter what
            }),

            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),

            new CleanPlugin([PATHS.build]),

            // Output extracted CSS to a file
            new ExtractTextPlugin('[name].[chunkhash].css')

        ]
    });
}