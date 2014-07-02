var Vue = require('vue'),
    layout = require('./layout'),
    mainController = require('./main-controller');

var view;

// Config
Vue.config({
    silent: false
});

// Filters
require('./filter/string');
require('./filter/markdown');

function init () {
    view = new Vue({
        el: document.getElementById('view'),
        data: mainController.data,
        methods: mainController.methods,
        ready: mainController.init
    });

    window.addEventListener('resize', layout.resize);
    layout.resize();
}

module.exports = {
    init: init
};