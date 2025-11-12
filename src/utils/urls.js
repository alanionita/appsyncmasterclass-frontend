import linkifyHtml from "linkify-html";
import 'linkify-plugin-hashtag';
import 'linkify-plugin-mention';

export function generateHtmlLinks(text) {
    const rootURL = window.location.origin;
    const linkOptions = {
        formatHref: {
            hashtag: (href) => {
                const branch = 'hashtag'
                const q = `q=${encodeURIComponent('#')}${href.substr(1)}`;
                const m = 'm=Latest';
                const h = `h=${Date.now()}`;
                const newUrl = new URL(`${rootURL}/${branch}?${q}&${m}&${h}`)
                return newUrl.toString()
            },
            mention: (href) => {
                const newUrl = new URL(`${rootURL}/${href.substr(1)}`)
                return newUrl.toString()
            },
        },
        target: (href, type) => (type == 'mention' || type == 'hashtag') ? undefined : '_blank',
        truncate: 25,
        ignoreTags: ['script', 'style']
    }
    return linkifyHtml(text, linkOptions)
}