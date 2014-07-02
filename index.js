// Global declarations polyfill
global.document = window.document;
global.navigator = window.navigator;
global.window = window;

window.requestAnimationFrame = function (fn) {
    setTimeout(fn, 1000 / 30);
};

var gui = require('nw.gui'),
    app = require('./lib/app');

window.addEventListener('keydown', function (e) {
    if (e.keyCode === 82 && e.metaKey) {
        gui.Window.get().reload(3);
    } else if (e.keyCode === 68 && e.metaKey) {
        gui.Window.get().showDevTools();
    }
});

window.openExternal = function (url) {
    gui.Shell.openExternal(url);
};

app.init();