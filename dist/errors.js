'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadAlreadyFinishedError = exports.InvalidChunkSizeError = exports.UploadIncompleteError = exports.MissingOptionsError = exports.UnknownResponseError = exports.UploadFailedError = exports.UrlNotFoundError = exports.FileAlreadyUploadedError = exports.DifferentChunkError = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DifferentChunkError = exports.DifferentChunkError = function (_ExtendableError) {
  (0, _inherits3.default)(DifferentChunkError, _ExtendableError);

  function DifferentChunkError(chunkIndex, originalChecksum, newChecksum) {
    (0, _classCallCheck3.default)(this, DifferentChunkError);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DifferentChunkError.__proto__ || (0, _getPrototypeOf2.default)(DifferentChunkError)).call(this, 'Chunk at index \'' + chunkIndex + '\' is different to original'));

    _this.chunkIndex = chunkIndex;
    _this.originalChecksum = originalChecksum;
    _this.newChecksum = newChecksum;
    return _this;
  }

  return DifferentChunkError;
}(_es6Error2.default);

var FileAlreadyUploadedError = exports.FileAlreadyUploadedError = function (_ExtendableError2) {
  (0, _inherits3.default)(FileAlreadyUploadedError, _ExtendableError2);

  function FileAlreadyUploadedError(id, url) {
    (0, _classCallCheck3.default)(this, FileAlreadyUploadedError);
    return (0, _possibleConstructorReturn3.default)(this, (FileAlreadyUploadedError.__proto__ || (0, _getPrototypeOf2.default)(FileAlreadyUploadedError)).call(this, 'File \'' + id + '\' has already been uploaded to unique url \'' + url + '\''));
  }

  return FileAlreadyUploadedError;
}(_es6Error2.default);

var UrlNotFoundError = exports.UrlNotFoundError = function (_ExtendableError3) {
  (0, _inherits3.default)(UrlNotFoundError, _ExtendableError3);

  function UrlNotFoundError(url) {
    (0, _classCallCheck3.default)(this, UrlNotFoundError);
    return (0, _possibleConstructorReturn3.default)(this, (UrlNotFoundError.__proto__ || (0, _getPrototypeOf2.default)(UrlNotFoundError)).call(this, 'Upload URL \'' + url + '\' has either expired or is invalid'));
  }

  return UrlNotFoundError;
}(_es6Error2.default);

var UploadFailedError = exports.UploadFailedError = function (_ExtendableError4) {
  (0, _inherits3.default)(UploadFailedError, _ExtendableError4);

  function UploadFailedError(status) {
    (0, _classCallCheck3.default)(this, UploadFailedError);
    return (0, _possibleConstructorReturn3.default)(this, (UploadFailedError.__proto__ || (0, _getPrototypeOf2.default)(UploadFailedError)).call(this, 'HTTP status ' + status + ' received from GCS, consider retrying'));
  }

  return UploadFailedError;
}(_es6Error2.default);

var UnknownResponseError = exports.UnknownResponseError = function (_ExtendableError5) {
  (0, _inherits3.default)(UnknownResponseError, _ExtendableError5);

  function UnknownResponseError(res) {
    (0, _classCallCheck3.default)(this, UnknownResponseError);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (UnknownResponseError.__proto__ || (0, _getPrototypeOf2.default)(UnknownResponseError)).call(this, 'Unknown response received from GCS'));

    _this5.res = res;
    return _this5;
  }

  return UnknownResponseError;
}(_es6Error2.default);

var MissingOptionsError = exports.MissingOptionsError = function (_ExtendableError6) {
  (0, _inherits3.default)(MissingOptionsError, _ExtendableError6);

  function MissingOptionsError() {
    (0, _classCallCheck3.default)(this, MissingOptionsError);
    return (0, _possibleConstructorReturn3.default)(this, (MissingOptionsError.__proto__ || (0, _getPrototypeOf2.default)(MissingOptionsError)).call(this, 'Missing options for Upload'));
  }

  return MissingOptionsError;
}(_es6Error2.default);

var UploadIncompleteError = exports.UploadIncompleteError = function (_ExtendableError7) {
  (0, _inherits3.default)(UploadIncompleteError, _ExtendableError7);

  function UploadIncompleteError() {
    (0, _classCallCheck3.default)(this, UploadIncompleteError);
    return (0, _possibleConstructorReturn3.default)(this, (UploadIncompleteError.__proto__ || (0, _getPrototypeOf2.default)(UploadIncompleteError)).call(this, 'Upload is not complete'));
  }

  return UploadIncompleteError;
}(_es6Error2.default);

var InvalidChunkSizeError = exports.InvalidChunkSizeError = function (_ExtendableError8) {
  (0, _inherits3.default)(InvalidChunkSizeError, _ExtendableError8);

  function InvalidChunkSizeError(chunkSize) {
    (0, _classCallCheck3.default)(this, InvalidChunkSizeError);
    return (0, _possibleConstructorReturn3.default)(this, (InvalidChunkSizeError.__proto__ || (0, _getPrototypeOf2.default)(InvalidChunkSizeError)).call(this, 'Invalid chunk size ' + chunkSize + ', must be a multiple of 262144'));
  }

  return InvalidChunkSizeError;
}(_es6Error2.default);

var UploadAlreadyFinishedError = exports.UploadAlreadyFinishedError = function (_ExtendableError9) {
  (0, _inherits3.default)(UploadAlreadyFinishedError, _ExtendableError9);

  function UploadAlreadyFinishedError() {
    (0, _classCallCheck3.default)(this, UploadAlreadyFinishedError);
    return (0, _possibleConstructorReturn3.default)(this, (UploadAlreadyFinishedError.__proto__ || (0, _getPrototypeOf2.default)(UploadAlreadyFinishedError)).call(this, 'Upload instance has already finished'));
  }

  return UploadAlreadyFinishedError;
}(_es6Error2.default);