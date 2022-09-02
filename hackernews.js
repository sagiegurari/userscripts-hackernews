// ==UserScript==
// @name         Hackernews Modern
// @namespace    sagiegurari
// @version      1.7
// @author       Sagie Gur-Ari
// @description  Improved mobile usability and modern styling for Hackernews
// @homepage     https://github.com/sagiegurari/userscripts-hackernews
// @supportURL   https://github.com/sagiegurari/userscripts-hackernews/issues
// @match        https://news.ycombinator.com/*
// @grant        none
// @license      MIT License
// ==/UserScript==

(function run() {
    'use strict';

    const element = document.createElement('style');
    element.type = 'text/css';
    document.head.appendChild(element);
    const styleSheet = element.sheet;

    const cssRules = [
        // defaults
        '.subtext .age a[href^="item"] { color: #828282; }',

        // colors
        '#hnmain tr:first-child td, .comment-tree { background-color: #333; }',
        'html, body, #hnmain, #hnmain table.itemList tr:first-child td { background-color: #222; }',
        'a:link, .subtext a[href^="item"]:not(:visited), a:link.togg.clicky, .commtext, .comment-tree a[rel="nofollow"], .comment-tree .reply a { color: #eee; }',
        '.visited a.titlelink, .visited a:link, .visited .subtext a[href^="item"] { color: #888; }',
        '.morelink { text-align: center; display: block; margin: 10px 40px 10px 0; background-color: #af4000; font-weight: bold; padding: 10px; }',
    ];

    // if mobile or emulator
    if (navigator.userAgent.toLowerCase('android') !== -1 || navigator.userAgentData.mobile) {
        cssRules.push(...[
            // styles
            '.pagetop { font-size: 16pt; }',
            '.title { font-size: 14pt; }',
            '.comhead { font-size: 12pt; }',
            '.subtext { font-size: 0; padding: 5px 0; }',
            '.subtext span { padding: 0 2px; }',
            '.subtext span, .subtext a:not([href^="item"]), .subtext .age a[href^="item"] { font-size: 12pt; text-decoration: none; }',
            '.subtext a[href^="item"] { font-size: 14pt; text-decoration: underline; }',
            '.subtext a[href^="hide"] { display: none; }',
            '.default { font-size: 12pt }',
        ]);
    }

    cssRules.forEach(cssRule => {
        styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
    });

    const articlePage = window.location.search.indexOf('id=') !== -1;

    if (articlePage) {
        // collapse non top comments
        document.querySelectorAll('.ind:not([indent="0"])').forEach(topCommentIndent => {
            topCommentIndent.parentElement.querySelectorAll('.togg.clicky').forEach(toggle => toggle.click());
        });

        // remove root/next/prev links
        document.querySelectorAll('.navs').forEach(element => element.style.display = 'none');
    } else {
        const storage = window.localStorage;
        if (storage && typeof storage.getItem === 'function') {
            const KEY = 'hn-cache-visited';
            const CACHE_LIMIT = 1000;

            const readFromCache = () => {
                const listStr = storage.getItem(KEY);

                if (!listStr) {
                    return [];
                }

                return listStr.split(',');
            };
            const writeToCache = (ids) => {
                if (!ids || !Array.isArray(ids) || !ids.length) {
                    return;
                }

                // add to start
                cache.unshift(...ids);

                // remove duplicates
                const seen = {};
                cache = cache.filter(function (item) {
                    if (seen[item]) {
                        return false;
                    }

                    seen[item] = true;
                    return true;
                });

                // trim
                const extraCount = cache.length - CACHE_LIMIT;
                if (extraCount) {
                    cache.splice(cache.length - extraCount, extraCount);
                }

                storage.setItem(KEY, cache.join(','));
            };

            let cache = readFromCache();

            // mark visited
            const markVisited = () => {
                document.querySelectorAll('tr.athing').forEach(element => {
                    if (cache.indexOf(element.id) !== -1) {
                        element.classList.add('visited');
                    }
                });

                document.querySelectorAll('tr.visited + tr').forEach(element => {
                    element.classList.add('visited');
                });
            };
            markVisited();

            // listen to scroll and add to cache
            const markVisibleAsVisited = () => {
                const elements = document.querySelectorAll('tr.athing:not(.visited)');

                let started = false;
                const ids = [];
                for (let index = 0; index < elements.length; index++) {
                    const element = elements[index];
                    const bounding = element.getBoundingClientRect();
                    if (bounding.top >= 0 &&
                        bounding.bottom <= window.innerHeight) {
                        started = true;
                        ids.push(element.id);
                    } else if (started) {
                        break;
                    }
                }

                if (ids.length) {
                    writeToCache(ids);
                }
            };
            let timeoutID = null;
            document.addEventListener('scroll', () => {
                clearTimeout(timeoutID);
                timeoutID = setTimeout(markVisibleAsVisited, 25);
            }, {
                passive: true
            });

            markVisibleAsVisited();
        }
    }
}());
