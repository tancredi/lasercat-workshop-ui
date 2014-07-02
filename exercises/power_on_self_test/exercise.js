var proxyquire = require('proxyquire')
var five = require('../../stubs/five')
var expect = require('chai').expect

var exercise = require('workshopper-exercise')()
var filecheck = require('workshopper-exercise/filecheck')
var execute = require('workshopper-exercise/execute')
var wrappedexec = require('workshopper-wrappedexec')
var path = require('path')
var hardwareFinder = require('../../lib/hardware-finder')

var notifier = {
  notify: function() {}
}

try {
  var Notification = require('node-notifier');
  notifier = new Notification();
} catch(e) {}

// checks that the submission file actually exists
exercise = filecheck(exercise)

// execute the solution and submission in parallel with spawn()
exercise = execute(exercise)

// wrap up the child process in a phantom wrapper that can
// mess with the global environment and inspect execution
exercise = wrappedexec(exercise)

// this actually runs the solution
exercise.addProcessor(function (mode, callback) {
  // includes the solution to run it
  proxyquire(path.join(process.cwd(), exercise.args[0]), {'johnny-five': five.spyOn('Led')})

  setTimeout(function() {
    console.log('Please wait while your solution is tested...')
  }, 1000)

  // need a better way of detecting when we are done..
  setTimeout(function() {
    callback(null)
  }, 1000)
})

// add a processor only for 'verify' calls
exercise.addVerifyProcessor(function (callback) {
  var result, error

  try {
    var io = five.stubs.firmata.singleton

    if (!io) {
      // yikes, board was never created
      return callback(null, false)
    }

    var led = hardwareFinder(five, 'Led', 13)

    expect(led, 'led expected to be connected to pin 13').to.exist

    // should have set pin 13 into digital output mode
    expect(io.pinMode.calledWith(13, io.MODES.OUTPUT)).to.be.true

    // should have turned pin 13 on
    expect(io.digitalWrite.calledWith(13, io.HIGH)).to.be.true

    result = true
  } catch(e) {
    result = false
    error = e
  }

  try {
    notifier.notify({
        title: 'lasercat-workshop',
        message: 'Power on self test ' + (result ? 'passed :)' : 'failed :('),
        appIcon: __dirname + '/../../assets/nodebots.png',
        contentImage: __dirname + '/../../assets/' + (result ? 'happy' : 'sad') + '_cat1.jpg'
    })
  } catch(e) {}

  // needs enough time to show the notification
  setTimeout(function() {
    callback(error, result)
  }, 1000)
})

module.exports = exercise
