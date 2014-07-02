var Vue = require('vue'),
    S = require('string');

Vue.filter('upper-first', function (str) {
    return typeof str === 'string' ? str.substr(0, 1).toUpperCase() + str.substr(1) : str;
});

Vue.filter('humanize', function (str) {
    return S(str).humanize().s;
});