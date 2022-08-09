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
        'html, body, #hnmain { background-color: #333; }',
        '#hnmain tr:first-child td { background-color: #333; }',
        'a:link { color: #ddd; }',
        '.pagetop { font-size: 16pt; }',
        '.title { font-size: 14pt; }',
        '.comhead { font-size: 12pt; }',
        '.subtext { font-size: 0; padding: 5px 0; }',
        '.subtext span { padding: 0 2px; }',
        '.subtext span, .subtext a:not([href^="item"]), .subtext .age a[href^="item"] { font-size: 12pt; }',
        '.subtext a[href^="item"] { color: #ddd; font-size: 14pt; text-decoration: underline; }',
        '.subtext a[href^="hide"] { display: none; }',
    ];

    cssRules.forEach(cssRule => {
        styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
    });
}());

