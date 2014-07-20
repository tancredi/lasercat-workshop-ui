var fs = require('fs'),
    Q = require('q'),
    async = require('async'),
    slug = require('slug');

var workshop = {
    load: load,
    exercises: []
};

function readToObject (obj, key, path) {
    return function (callback) {
        fs.exists(path, function (exists) {
            if (!exists) { return callback(); }

            fs.readFile(path, 'utf8', function (err, content) {
                if (err) { return callback(err); }
                obj[key] = content;
                callback();
            });
        });
    };
}

function load (name) {
    var deferred = Q.defer(),
        workshopDir = './node_modules/' + name,
        exercisesDir = workshopDir + '/exercises',
        menuPath = exercisesDir +'/menu.json';

    fs.readFile(menuPath, 'utf8', function (err, menu) {
        if (err) { throw err; }

        menu = JSON.parse(menu);

        async.map(menu, function (name, callback) {
            var id = slug(name, { replacement: '_' }).toLowerCase(),
                files = {};

            async.parallel([
                readToObject(files, 'problem', exercisesDir + '/' + id + '/problem.md'),
                readToObject(files, 'solution', exercisesDir + '/' + id + '/solution/solution.js'),
            ], function (err) {
                callback(err, {
                    name: name,
                    id: id,
                    problem: files.problem,
                    solution: files.solution
                });
            });

        }, function (err, results) {
            if (err) { throw err; }

            workshop.exercises = results;
            deferred.resolve(workshop);
        });
    });

    return deferred.promise;
}

module.exports = workshop;