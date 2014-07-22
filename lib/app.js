var Vue = require('vue'),
    layout = require('./layout'),
    ensureDir = require('ensureDir'),
    mainController = require('./main-controller'),
    workshop = require('./workshop');

var EXERCISES_DIR = './user-solutions',
    view;

// Config
Vue.config({
    silent: false
});

// Filters
require('./filter/string');
require('./filter/markdown');

function init () {
    workshop.load('nodebot-workshop')
    .then(function () {
        ensureDir(EXERCISES_DIR, function (err) {
            if (err) { throw err; }

            view = new Vue({
                el      : document.getElementById('view'),
                data    : mainController.data,
                methods : mainController.methods,
                ready   : mainController.init
            });

            window.addEventListener('resize', layout.resize);
            layout.resize();
        });
    });
}

module.exports = {
    init: init
};