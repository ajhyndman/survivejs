const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');


const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};


const common = {
    // Entry accepts a path or an object of entries.
    // The build chapter contains an example of the latter.
    entry: PATHS.app,
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
                // Test expects a RegExp! Note the slashes!
                test: /\.css$/,
                loaders: ['style', 'css'],
                // Include accepts either a path or an array of paths.
                include: PATHS.app
            }
        ]
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'node_modules/html-webpack-template/index.html',
            title: 'Kanban app',
            appMountId: 'app'
        })
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
        devtool: 'cheap-source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if (TARGET === 'build') {
    module.exports = merge(common, {});
}