var fs = require('fs'),
    touch = require('touch'),
    openFile = require('open');

function isNotHidden (filename) {
    return filename.substr(0, 1) !== '.';
}

var data = exports.data = {
    foo: 'bar',
    exercises: fs.readdirSync('./exercises').filter(isNotHidden),
    exercise: null,
    tab: 'problem'
};

exports.init = function () {
    this.setExercise(this.exercises[0]);
};

exports.methods = {};

exports.methods.setExercise = function (id) {
    var problem = fs.readFileSync('./exercises/' + id + '/problem.md', 'utf8');

    data.tab = 'problem';

    data.exercise = {
        id: id,
        problem: problem
    };
};

exports.methods.edit = function () {
    var scriptPath = './exercises/' + data.exercise.id + '/user.js';

    if (!fs.existsSync(scriptPath)) {
        touch.sync(scriptPath);
    }

    openFile(scriptPath);
};