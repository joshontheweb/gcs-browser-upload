'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var safePut = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var _args4 = arguments;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _axios.put.apply(null, _args4);

          case 3:
            return _context4.abrupt('return', _context4.sent);

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4['catch'](0);

            if (!(_context4.t0 instanceof Error)) {
              _context4.next = 12;
              break;
            }

            throw _context4.t0;

          case 12:
            return _context4.abrupt('return', _context4.t0);

          case 13:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 6]]);
  }));

  return function safePut() {
    return _ref4.apply(this, arguments);
  };
}();

var _axios = require('axios');

var _FileMeta = require('./FileMeta');

var _FileMeta2 = _interopRequireDefault(_FileMeta);

var _FileProcessor = require('./FileProcessor');

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _sparkMd = require('spark-md5');

var _sparkMd2 = _interopRequireDefault(_sparkMd);

var _asyncRetry = require('async-retry');

var _asyncRetry2 = _interopRequireDefault(_asyncRetry);

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MIN_CHUNK_SIZE = 262144;

var Upload = function () {
  function Upload(args, allowSmallChunks) {
    (0, _classCallCheck3.default)(this, Upload);

    this.paused = false;
    this.unpauseHandlers = [];
    this.spark = new _sparkMd2.default.ArrayBuffer();

    var opts = (0, _extends3.default)({
      chunkSize: MIN_CHUNK_SIZE,
      storage: window.localStorage,
      contentType: 'text/plain',
      onChunkUpload: function onChunkUpload() {},
      onProgress: function onProgress() {},
      id: null,
      url: null,
      backoffMillis: 1000,
      backoffRetryLimit: 5
    }, args);

    if ((opts.chunkSize % MIN_CHUNK_SIZE !== 0 || opts.chunkSize === 0) && !allowSmallChunks) {
      throw new _errors.InvalidChunkSizeError(opts.chunkSize);
    }

    if (!opts.id) {
      throw new _errors.MissingOptionsError('The \'id\' option is required');
    }

    if (!opts.url) {
      throw new _errors.MissingOptionsError('The \'url\' option is required');
    }

    (0, _debug2.default)('Creating new upload stream instance:');
    (0, _debug2.default)(' - Url: ' + opts.url);
    (0, _debug2.default)(' - Id: ' + opts.id);
    (0, _debug2.default)(' - File size: Unknown / Streaming');
    (0, _debug2.default)(' - Chunk size: ' + opts.chunkSize);

    this.opts = opts;
    this.meta = new _FileMeta2.default(opts.id, 0, opts.chunkSize, opts.storage);
  }

  (0, _createClass3.default)(Upload, [{
    key: 'uploadChunk',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(index, chunk) {
        var _this = this;

        var backoff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var opts, meta, start, end, checksum, headers;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                opts = this.opts, meta = this.meta;
                start = index * opts.chunkSize;
                end = index * opts.chunkSize + chunk.byteLength - 1;

                if (!this.paused) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 6;
                return this.waitForUnpause();

              case 6:
                checksum = (0, _FileProcessor.getChecksum)(this.spark, chunk);
                headers = {
                  'Content-Type': opts.contentType,
                  'Content-Range': 'bytes ' + start + '-' + end + '/*'
                };


                (0, _debug2.default)('Uploading chunk ' + index + ':');
                (0, _debug2.default)(' - Chunk length: ' + chunk.byteLength);
                (0, _debug2.default)(' - Start: ' + start);
                (0, _debug2.default)(' - End: ' + end);

                // if (backoff >= opts.backoffRetryLimit) {
                //   throw new UploadUnableToRecoverError()
                // }

                _context2.prev = 12;
                _context2.next = 15;
                return (0, _asyncRetry2.default)(function () {
                  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(bail, num) {
                    var res;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return safePut(opts.url, chunk, {
                              headers: headers, onUploadProgress: function onUploadProgress(progressEvent) {
                                opts.onProgress({
                                  totalBytes: start + chunk.byteLength,
                                  uploadedBytes: start + progressEvent.loaded,
                                  chunkIndex: index,
                                  chunkLength: chunk.byteLength
                                });
                              }
                            });

                          case 2:
                            res = _context.sent;


                            checkResponseStatus(res, opts, [200, 201, 308]);

                          case 4:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this);
                  }));

                  return function (_x4, _x5) {
                    return _ref2.apply(this, arguments);
                  };
                }(), { retries: opts.backoffRetryLimit, minTimeout: opts.backoffMillis });

              case 15:
                _context2.next = 20;
                break;

              case 17:
                _context2.prev = 17;
                _context2.t0 = _context2['catch'](12);
                throw new _errors.UploadUnableToRecoverError();

              case 20:

                (0, _debug2.default)('Chunk upload succeeded, adding checksum ' + checksum);
                meta.addChecksum(index, checksum);

                opts.onChunkUpload({
                  uploadedBytes: end + 1,
                  chunkIndex: index,
                  chunkLength: chunk.byteLength
                });

              case 23:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[12, 17]]);
      }));

      function uploadChunk(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return uploadChunk;
    }()
  }, {
    key: 'getRemoteResumeIndex',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var opts, headers, res, header, range, bytesReceived;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                opts = this.opts;
                headers = {
                  'Content-Range': 'bytes */*'
                };

                (0, _debug2.default)('Retrieving upload status from GCS');
                _context3.next = 5;
                return safePut(opts.url, null, { headers: headers });

              case 5:
                res = _context3.sent;


                (0, _debug2.default)(res);

                checkResponseStatus(res, opts, [308]);
                header = res.headers['range'];

                (0, _debug2.default)('Received upload status from GCS: ' + header);
                range = header.match(/(\d+?)-(\d+?)$/);
                bytesReceived = parseInt(range[2]) + 1;
                return _context3.abrupt('return', Math.floor(bytesReceived / opts.chunkSize));

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getRemoteResumeIndex() {
        return _ref3.apply(this, arguments);
      }

      return getRemoteResumeIndex;
    }()
  }, {
    key: 'pause',
    value: function pause() {
      (0, _debug2.default)('Upload Stream paused');
      this.paused = true;
    }
  }, {
    key: 'unpause',
    value: function unpause() {
      (0, _debug2.default)('Upload Stream unpaused');
      this.paused = false;
      this.unpauseHandlers.forEach(function (fn) {
        return fn();
      });
      this.unpauseHandlers = [];
    }
  }, {
    key: 'waitForUnpause',
    value: function waitForUnpause() {
      var _this2 = this;

      return new _promise2.default(function (resolve) {
        _this2.unpauseHandlers.push(resolve);
      });
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.meta.reset();
      (0, _debug2.default)('Upload cancelled');
    }
  }]);
  return Upload;
}();

Upload.errors = errors;
exports.default = Upload;


function checkResponseStatus(res, opts) {
  var allowed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var status = res.status;

  if (allowed.indexOf(status) > -1) {
    return true;
  }

  switch (status) {
    case 308:
      throw new _errors.UploadIncompleteError();

    case 201:
    case 200:
      throw new _errors.FileAlreadyUploadedError(opts.id, opts.url);

    case 404:
      throw new _errors.UrlNotFoundError(opts.url);

    case 500:
    case 502:
    case 503:
    case 504:
      throw new _errors.UploadFailedError(status);

    default:
      throw new _errors.UnknownResponseError(res);
  }
}