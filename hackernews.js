// ==UserScript==
// @name         Hackernews Modern
// @namespace    sagiegurari
// @version      1.0
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
        'a:link, .subtext a[href^="item"] { color: #eee; }',
        '.commtext, .comment-tree a[rel="nofollow"], .comment-tree .reply a { color: #eee; }'
    ];

    // if mobile or emulator
    if(navigator.userAgent.toLowerCase('android') !== -1 || navigator.userAgentData.mobile) {
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
}());
