export default function makeFile (data) {
  // return new window.Blob([data], {name: 'foo'})
  let file
  if (typeof Blob !== 'undefined') {
    // for the browser
    file = new Blob([data], {name: 'foo'})
  } else {
    // for node
    file = {
      size: data.length,
      name: 'foo',
      buffer: new Buffer(data),
      slice: (start, end) => makeFile(data.substring(start, end))
    }
  }

  return file
}
