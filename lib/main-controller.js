var fs = require('fs'),
    touch = require('touch'),
    openFile = require('open'),
    Termio = require('termio'),
    watchr = require('watchr'),
    workshop = require('./workshop');

var DEFAULT_TAB = 'script',
    LOADING_TEXT = '...',
    data = exports.data = {
        exercises    : [],
        exercise     : null,
        tab          : 'problem',
        current      : null,
        loading      : false,
        verification : { output: '' },
        monitor      : null
    };

exports.init = function () {
    this.exercises = workshop.exercises;

    this.$watch('exercise', function (exercise) {
        if (exercise.watching) { return; }
        this.watchExercise();
    });

    this.setExercise(this.exercises[0]);
};

exports.methods = {};

exports.methods.setExercise = function (exercise) {
    this.tab = DEFAULT_TAB;
    this.exercise = exercise;
};

exports.methods.watchExercise = function () {
    var scriptPath = this.getScriptPath(),
        exercise = this.exercise;

    this.ensureScript();

    function updateScript () {
        exercise.script = fs.readFileSync(scriptPath, 'utf8');
    }

    var foo = watchr.watch({
        path: scriptPath,
        interval: 10
    });

    foo.on('change', updateScript);
};

exports.methods.edit = function () {
    var scriptPath = this.getScriptPath();

    this.ensureScript();
    openFile(scriptPath);
};

exports.methods.verify = function () {
    var view = this;

    if (view.loading) { return; }

    view.loading = true;

    workshop.verify(this.exercise.name, this.getScriptPath(), function (err, process) {

        view.verification.output = LOADING_TEXT;

        var foo = process.stdout.pipe(new Termio(), { end: false });

        foo.on('data', outputVerification.bind(view));
        process.stdin.on('data', outputVerification.bind(view));
        process.stderr.on('data', outputVerification.bind(view));

        process.stdout.on('end', function () {
            view.loading = false;
            view.verification.output += '\n\n<span class="end"># DONE</span>';
        });
    });
};

exports.methods.ensureScript = function () {
    var scriptPath = this.getScriptPath();

    if (!fs.existsSync(scriptPath)) {
        touch.sync(scriptPath);
    }
};

exports.methods.getScriptPath = function () {
    return './user-solutions/' + data.exercise.id + '.js';
};

function outputVerification (l) {
    if (this.verification.output === LOADING_TEXT) {
        this.verification.output = '';
    }

    this.verification.output += l;
}