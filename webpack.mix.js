const mix = require('laravel-mix');
var LiveReloadPlugin = require('webpack-livereload-plugin');


/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.webpackConfig({
    plugins: [new LiveReloadPlugin()]
});

mix.setPublicPath('public');

mix.
    sass('resources/sass/frontend/app.scss', 'css/frontend.css')
    .sass('resources/sass/backend/app.scss', 'css/backend.css')
    .js([
        'resources/js/frontend/app.js'
    ], 'js/frontend.js')
    .js([
        'resources/js/backend/before.js',
        'resources/js/backend/app.js',
        'resources/js/backend/after.js',
    ], 'js/backend.js')

    .js([
        'resources/js/backend/before.js',
        'resources/js/backend/app.js',
        'resources/js/backend/after.js',
        'resources/js/backend/zone.js',
    ], 'js/backendZone.js')
    .js([
        'resources/js/backend/before.js',
        'resources/js/backend/app.js',
        'resources/js/backend/after.js',
        'resources/js/backend/refresh.js',
    ], 'js/backendRefresh.js')
    .extract([
        'jquery',
        'bootstrap',
        'popper.js/dist/umd/popper',
        'axios',
        'sweetalert2',
        'lodash',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-brands-svg-icons',
        '@fortawesome/free-regular-svg-icons',
        '@fortawesome/free-solid-svg-icons'
    ]);

if (mix.inProduction() || process.env.npm_lifecycle_event !== 'hot') {
    mix.version();
}
