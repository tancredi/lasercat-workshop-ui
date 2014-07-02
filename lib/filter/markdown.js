var Vue = require('vue'),
    marked = require('marked');

var renderer = new marked.Renderer();

renderer.link = function (href, title, text) {
    var prot;

    if (this.options.sanitize) {
        try {
            prot = decodeURIComponent(window.unescape(href))
                .replace(/[^\w:]/g, '')
                .toLowerCase();
        } catch (e) {
            return '';
        }
    }

    var out = '<a href="javascript:openExternal(\'' + href + '\')" target="_blank"';

    if (title) {
        out += ' title="' + title + '"';
    }

    out += '>' + text + '</a>';

    return out;
};

Vue.filter('markdown', function (value) {
    return marked(value || '', { renderer: renderer });
});