'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var getData = exports.getData = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(blob) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', new _es6Promise.Promise(function (resolve, reject) {
              var reader = new window.FileReader();
              reader.onload = function () {
                return resolve(reader.result.buffer ? reader.result.buffer : reader.result);
              };
              reader.onerror = reject;
              reader.readAsArrayBuffer(blob);
            }));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getData(_x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getChecksum = getChecksum;
exports.mergeArrayBuffers = mergeArrayBuffers;

var _es6Promise = require('es6-promise');

var _sparkMd = require('spark-md5');

var _sparkMd2 = _interopRequireDefault(_sparkMd);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _inlineWorker = require('inline-worker');

var _inlineWorker2 = _interopRequireDefault(_inlineWorker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileSliceWorker = new _inlineWorker2.default(function (self) {
  self.onmessage = function (e) {
    var start = e.data.start;
    var end = e.data.end;
    var file = e.data.file;
    self.postMessage(file.slice(start, end));
  };
}, {});

var FileProcessor = function () {
  function FileProcessor(file, chunkSize) {
    (0, _classCallCheck3.default)(this, FileProcessor);

    this.paused = false;
    this.file = file;
    this.chunkSize = chunkSize;
    this.unpauseHandlers = [];
  }

  (0, _createClass3.default)(FileProcessor, [{
    key: 'sliceFile',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(file, start, end) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fileSliceWorker.postMessage({ file: file, start: start, end: end }, [file]);
                (0, _debug2.default)('awaiting slice');
                return _context.abrupt('return', new _es6Promise.Promise(function (resolve) {
                  fileSliceWorker.onmessage = function (e) {
                    return resolve(e.data);
                  };
                }));

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sliceFile(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return sliceFile;
    }()
  }, {
    key: 'run',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(fn) {
        var _this = this;

        var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var endIndex = arguments[2];
        var file, chunkSize, totalChunks, spark, processIndex, waitForUnpause;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                file = this.file, chunkSize = this.chunkSize;
                totalChunks = Math.ceil(file.size / chunkSize);
                spark = new _sparkMd2.default.ArrayBuffer();


                (0, _debug2.default)('Starting run on file:');
                (0, _debug2.default)(' - Total chunks: ' + totalChunks);
                (0, _debug2.default)(' - Start index: ' + startIndex);
                (0, _debug2.default)(' - End index: ' + (endIndex || totalChunks));

                processIndex = function () {
                  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(index) {
                    var start, section, chunk, checksum, shouldContinue;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (!(index === totalChunks || index === endIndex)) {
                              _context2.next = 3;
                              break;
                            }

                            (0, _debug2.default)('File process complete');
                            return _context2.abrupt('return');

                          case 3:
                            if (!_this.paused) {
                              _context2.next = 6;
                              break;
                            }

                            _context2.next = 6;
                            return waitForUnpause();

                          case 6:
                            start = index * chunkSize;

                            console.time('processIndex:file.slice');
                            _context2.next = 10;
                            return _this.sliceFile(file, start, start + chunkSize);

                          case 10:
                            section = _context2.sent;

                            console.timeEnd('processIndex:file.slice');

                            console.time('processIndex:getData');
                            _context2.next = 15;
                            return getData(section);

                          case 15:
                            chunk = _context2.sent;

                            console.timeEnd('processIndex:getData');

                            console.time('processIndex:getChecksum');
                            checksum = getChecksum(spark, chunk);

                            console.timeEnd('processIndex:getChecksum');

                            _context2.next = 22;
                            return fn(checksum, index, chunk);

                          case 22:
                            shouldContinue = _context2.sent;

                            if (!(shouldContinue !== false)) {
                              _context2.next = 26;
                              break;
                            }

                            _context2.next = 26;
                            return processIndex(index + 1);

                          case 26:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this);
                  }));

                  return function processIndex(_x6) {
                    return _ref3.apply(this, arguments);
                  };
                }();

                waitForUnpause = function waitForUnpause() {
                  return new _es6Promise.Promise(function (resolve) {
                    _this.unpauseHandlers.push(resolve);
                  });
                };

                _context3.next = 11;
                return processIndex(startIndex);

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function run(_x4) {
        return _ref2.apply(this, arguments);
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
  // just grab the ends of the chunk for comparison.  Was running into major performance issues with big wav files
  var endsBuffer = mergeArrayBuffers(chunk.slice(0, 20), chunk.slice(chunk.byteLength - 20, chunk.byteLength));
  spark.append(endsBuffer);
  // spark.append(chunk)
  var state = spark.getState();
  var checksum = spark.end();
  spark.setState(state);
  return checksum;
}

function mergeArrayBuffers(a, b) {
  var tmp = new Uint8Array(a.byteLength + b.byteLength);
  tmp.set(new Uint8Array(a), 0);
  tmp.set(new Uint8Array(b), a.byteLength);
  return tmp.buffer;
}

exports.default = FileProcessor;