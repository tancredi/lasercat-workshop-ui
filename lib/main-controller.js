var fs = require('fs'),
    touch = require('touch'),
    openFile = require('open'),
    workshop = require('./workshop');

var data = exports.data = {
    foo: 'bar',
    exercises: [],
    exercise: null,
    tab: 'problem',
    current: null
};

exports.init = function () {
    this.exercises = workshop.exercises;
    this.setExercise(this.exercises[0]);
};

exports.methods = {};

exports.methods.setExercise = function (exercise) {
    this.tab = 'problem';
    this.exercise = exercise;
};

exports.methods.edit = function () {
    var scriptPath = './user-solutions/' + data.exercise.id + '.js';

    if (!fs.existsSync(scriptPath)) {
        touch.sync(scriptPath);
    }

    openFile(scriptPath);
};