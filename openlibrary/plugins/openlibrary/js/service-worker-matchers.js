/*
// Contains all the matchers we use to decide wat to cache with the service workers.

It is in a is a separate file to avoid this error when writing tests:
    SyntaxError: Cannot use import statement outside a module
    > 1 | import { ExpirationPlugin } from 'workbox-expiration';
*/


/**
 * Checks if a given URL includes a small or medium cover.
 *
 * @param {Object} params - The parameters object.
 * @param {URL} params.url - The URL to check.
 * @returns {boolean} - Returns true if the URL indicates a small or medium cover size, otherwise false.
 */
export function matchMiscFiles({ url }) {
    // https://openlibrary.org/static/css/ajax-loader.gif // TODO: we should move these to the static/images
    const miscFiles = ['/static/favicon.ico', '/static/manifest.json',
        '/static/css/ajax-loader.gif', '/cdn/archive.org/analytics.js',
        '/cdn/archive.org/donate.js', '/static/css/fonts/slick.woff']
    return miscFiles.includes(url.pathname);
}

export function matchSmallMediumCovers({ url }) {
    const regex = /-[SM].jpg$/;
    return regex.test(url.pathname);
}

export function matchLargeCovers({ url }) {
    const regex = /-L.jpg$/;
    return regex.test(url.pathname);
}

export function matchStaticImages({ url }) {
    const regex = /^\/images\/|^\/static\/images\//;
    return regex.test(url.pathname);
}

export function matchStaticBuild({ url }) {
    const regex = /^\/static\/build\/.*(\.js|\.css)/;
    const localhost = url.origin.includes('localhost')
    const gitpod = url.origin.includes('gitpod')
    return !localhost && !gitpod && regex.test(url.pathname);
}

export function matchArchiveOrgImage({ url }) {
    // most importantly, to cache your profile picture from loading every time
    // also caches some covers
    return url.href.startsWith('https://archive.org/services/img/');
}

export function matchAuthorEditPage({url}){
    const regex = /\/authors\/OL\d+A\/.*\/edit/
    return regex.test(url.pathname);
}

export function matchEditionEditPage({url}){
    const regex = /\/books\/OL\d+M\/.*\/edit/
    return regex.test(url.pathname);
}

