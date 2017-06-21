'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var getData = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(file, blob) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', new _es6Promise.Promise(function (resolve, reject) {
              var reader = new window.FileReader();
              reader.onload = function () {
                return resolve(reader.result);
              };
              reader.onerror = reject;
              reader.readAsArrayBuffer(blob);
            }));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getData(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var _es6Promise = require('es6-promise');

var _sparkMd = require('spark-md5');

var _sparkMd2 = _interopRequireDefault(_sparkMd);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FileProcessor = function () {
  function FileProcessor(file, chunkSize) {
    (0, _classCallCheck3.default)(this, FileProcessor);

    this.paused = false;
    this.file = file;
    this.chunkSize = chunkSize;
    this.unpauseHandlers = [];
  }

  (0, _createClass3.default)(FileProcessor, [{
    key: 'run',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(fn) {
        var _this = this;

        var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var endIndex = arguments[2];
        var file, chunkSize, totalChunks, spark, processIndex, waitForUnpause;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                file = this.file, chunkSize = this.chunkSize;
                totalChunks = Math.ceil(file.size / chunkSize);
                spark = new _sparkMd2.default.ArrayBuffer();


                (0, _debug2.default)('Starting run on file:');
                (0, _debug2.default)(' - Total chunks: ' + totalChunks);
                (0, _debug2.default)(' - Start index: ' + startIndex);
                (0, _debug2.default)(' - End index: ' + (endIndex || totalChunks));

                processIndex = function () {
                  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(index) {
                    var start, section, chunk, checksum, shouldContinue;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!(index === totalChunks || index === endIndex)) {
                              _context.next = 3;
                              break;
                            }

                            (0, _debug2.default)('File process complete');
                            return _context.abrupt('return');

                          case 3:
                            if (!_this.paused) {
                              _context.next = 6;
                              break;
                            }

                            _context.next = 6;
                            return waitForUnpause();

                          case 6:
                            start = index * chunkSize;
                            section = file.slice(start, start + chunkSize);
                            _context.next = 10;
                            return getData(file, section);

                          case 10:
                            chunk = _context.sent;
                            checksum = getChecksum(spark, chunk);
                            _context.next = 14;
                            return fn(checksum, index, chunk);

                          case 14:
                            shouldContinue = _context.sent;

                            if (!(shouldContinue !== false)) {
                              _context.next = 18;
                              break;
                            }

                            _context.next = 18;
                            return processIndex(index + 1);

                          case 18:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this);
                  }));

                  return function processIndex(_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }();

                waitForUnpause = function waitForUnpause() {
                  return new _es6Promise.Promise(function (resolve) {
                    _this.unpauseHandlers.push(resolve);
                  });
                };

                _context2.next = 11;
                return processIndex(startIndex);

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function run(_x) {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'pause',
    value: function pause() {
      this.paused = true;
    }
  }, {
    key: 'unpause',
    value: function unpause() {
      this.paused = false;
      this.unpauseHandlers.forEach(function (fn) {
        return fn();
      });
      this.unpauseHandlers = [];
    }
  }]);
  return FileProcessor;
}();

function getChecksum(spark, chunk) {
  spark.append(chunk);
  var state = spark.getState();
  var checksum = spark.end();
  spark.setState(state);
  return checksum;
}

exports.default = FileProcessor;