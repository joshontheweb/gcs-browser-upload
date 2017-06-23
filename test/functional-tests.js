import localStorage from 'localStorage'
import { expect } from 'chai'
import randomString from 'random-string'
import { getData } from '../src/FileProcessor'
import Upload from '../src/Upload'
import UploadStream from '../src/UploadStream'
import { start, resetServer, stop, getRequests } from './lib/server'
import makeFile from './lib/makeFile'
import waitFor from './lib/waitFor'

describe('Functional', () => {
  before(start)
  after(stop)

  let upload = null
  let file = null
  let requests = []
  let chunkSize = 256

  async function doUpload (length, url) {
    if (length !== null) {
      file = randomString({ length })
    }
    upload = new Upload({
      id: 'foo',
      url: url || '/file',
      chunkSize: chunkSize,
      file: makeFile(file)
    }, true)
    await upload.start()
    requests = getRequests()
    return upload
  }

  async function doStreamUpload (length, url, pauseOnChunk) {
    if (length !== null) {
      file = randomString({ length })
    }

    const fileBlob = makeFile(file)

    upload = new UploadStream({
      id: 'foo',
      url: url || '/file',
      chunkSize: chunkSize,
      backoffMillis: 100,
      backoffRetryLimit: 5
    }, true)

    let i
    let byteOffset = 0
    for (i = 0; byteOffset < fileBlob.size; i++) {
      if (pauseOnChunk && i === pauseOnChunk) upload.pause()
      let chunk = await getData(fileBlob.slice(byteOffset, byteOffset + chunkSize))
      await upload.uploadChunk(i, chunk)
      byteOffset += chunkSize
    }

    requests = getRequests()
    return upload
  }

  function reset () {
    localStorage.clear()
    resetServer()
    if (upload) {
      upload.cancel()
      upload = null
    }
  }

  describe('a single-chunk upload', () => {
    before(() => doUpload(256))
    after(reset)

    it('should only upload one chunk', () => {
      expect(requests).to.have.length(1)
    })

    it('should make a PUT request to the right URL', () => {
      expect(requests[0].method).to.equal('PUT')
      expect(requests[0].url).to.equal('/file')
    })

    it('should send the correct headers', () => {
      expect(requests[0].headers).to.containSubset({
        'content-length': '256',
        'content-range': 'bytes 0-255/256'
      })
    })

    it('should send the file in the body', () => {
      expect(requests[0].body).to.equal(file)
    })
  })

  describe('a multi-chunk upload', () => {
    before(() => doUpload(700))
    after(reset)

    it('should upload multiple chunks', () => {
      expect(requests).to.have.length(3)
    })

    it('should make multiple PUT requests to the right URL', () => {
      requests.forEach((request) => {
        expect(request.method).to.equal('PUT')
        expect(request.url).to.equal('/file')
      })
    })

    it('should send the correct headers', () => {
      expect(requests[0].headers).to.containSubset({
        'content-length': '256',
        'content-range': 'bytes 0-255/700'
      })
      expect(requests[1].headers).to.containSubset({
        'content-length': '256',
        'content-range': 'bytes 256-511/700'
      })
      expect(requests[2].headers).to.containSubset({
        'content-length': '188',
        'content-range': 'bytes 512-699/700'
      })
    })

    it('should send a total content length identical to the upload file size', () => {
      const totalSize = requests.reduce((result, request) => {
        return result + parseInt(request.headers['content-length'])
      }, 0)
      expect(totalSize).to.equal(700)
    })

    it('should send the file in the body', () => {
      expect(requests[0].body).to.equal(file.substring(0, 256))
      expect(requests[1].body).to.equal(file.substring(256, 512))
      expect(requests[2].body).to.equal(file.substring(512, 700))
    })
  })

  describe('a streamed multi-chunk upload', () => {
    before(() => doStreamUpload(700))
    after(reset)

    it('should upload multiple chunks', () => {
      expect(requests).to.have.length(3)
    })

    it('should make multiple PUT requests to the right URL', () => {
      requests.forEach((request) => {
        expect(request.method).to.equal('PUT')
        expect(request.url).to.equal('/file')
      })
    })

    it('should send the correct headers', () => {
      expect(requests[0].headers).to.containSubset({
        'content-length': '256',
        'content-range': 'bytes 0-255/*'
      })
      expect(requests[1].headers).to.containSubset({
        'content-length': '256',
        'content-range': 'bytes 256-511/*'
      })
      expect(requests[2].headers).to.containSubset({
        'content-length': '188',
        'content-range': 'bytes 512-699/*'
      })
    })

    it('should send a total content length identical to the upload file size', () => {
      const totalSize = requests.reduce((result, request) => {
        return result + parseInt(request.headers['content-length'])
      }, 0)
      expect(totalSize).to.equal(700)
    })

    it('should send the file in the body', () => {
      expect(requests[0].body).to.equal(file.substring(0, 256))
      expect(requests[1].body).to.equal(file.substring(256, 512))
      expect(requests[2].body).to.equal(file.substring(512, 700))
    })
  })

  describe('a paused and then resumed streaming upload', () => {
    after(reset)
    const fileSize = chunkSize * 10
    const pauseOnChunk = 5
    it('should stop uploading after being paused', async () => {
      doStreamUpload(fileSize, null, pauseOnChunk)
      await waitFor(() => {
        requests = getRequests()
        return requests.length > pauseOnChunk - 1
      })
      expect(requests).to.have.length(pauseOnChunk)
      requests.forEach((request, i) => {
        expect(requests[i].body).to.equal(file.substring(i * chunkSize, i * chunkSize + chunkSize))
      })
    })

    it('should send the rest of the chunks after being resumed', async () => {
      upload.unpause()
      await waitFor(() => {
        requests = getRequests()
        return requests.length >= fileSize / chunkSize
      })
      expect(requests).to.have.length(fileSize / chunkSize)
      requests.forEach((request, i) => {
        expect(requests[i].body).to.equal(file.substring(i * chunkSize, i * chunkSize + chunkSize))
      })
    })
  })

  describe('a paused then resumed upload', () => {
    after(reset)

    it('should stop uploading after being paused', async () => {
      doUpload(500)
      upload.pause()
      await waitFor(() => {
        requests = getRequests()
        return requests.length > 0
      })
      expect(requests).to.have.length(1)
      expect(requests[0].body).to.equal(file.substring(0, 256))
    })

    it('should check the server for status before resuming', async () => {
      await doUpload(null)
      expect(requests[1].body).to.deep.equal({})
    })

    it('should send the rest of the chunks after being resumed', () => {
      expect(requests).to.have.length(3)
      expect(requests[2].body).to.equal(file.substring(256, 501))
    })
  })

  describe('a paused upload that is resumed with a different file', () => {
    let firstFile = null

    before(async () => {
      doUpload(500)
      firstFile = file
      upload.pause()
      await waitFor(() => getRequests().length > 0)
    })
    after(reset)

    it('should check the server for status before resuming', async () => {
      await doUpload(500)
      expect(requests[1].body).to.deep.equal({})
    })

    it('should upload part of the first file', () => {
      expect(firstFile).to.not.equal(file)
      expect(requests[0].body).to.equal(firstFile.substring(0, 256))
    })

    it('should upload the entire new file', () => {
      expect(requests).to.have.length(4)
      expect(requests[2].body).to.equal(file.substring(0, 256))
      expect(requests[3].body).to.equal(file.substring(256, 501))
    })
  })

  describe('a failed streaming upload that is resumed as a standard multi-chunk upload', () => {
    after(reset)

    it('should fail stream uploading after two chunks', async () => {
      doStreamUpload(700, null, 2)
      await waitFor(() => {
        requests = getRequests()
        return requests.length >= 2
      })

      expect(requests).to.have.length(2)
      expect(requests[0].body).to.equal(file.substring(0, 256))
      expect(requests[1].body).to.equal(file.substring(256, 512))
    })

    it('should start standard multi-chunk upload and check the server for status before resuming', async () => {
      await doUpload(null)
      expect(requests[2].body).to.deep.equal({})
    })

    it('should send the rest of the chunks after being resumed', () => {
      expect(requests).to.have.length(4)
      expect(requests[3].body).to.equal(file.substring(512, 700))
    })
  })

  describe('an upload to a url that doesn\'t exist', () => {
    after(reset)
    it('should throw a UrlNotFoundError', () => {
      return expect(doUpload(200, '/notfound')).to.be.rejectedWith(Upload.errors.UrlNotFoundError)
    })
  })

  describe('an upload that results in a server error', () => {
    after(reset)
    it('should throw an UploadFailedError', () => {
      return expect(doUpload(200, '/file/fail')).to.be.rejectedWith(Upload.errors.UploadFailedError)
    })
  })

  describe('a streaming upload that results in a temporary server error', () => {
    after(reset)

    it('should retry until successful', async () => {
      doStreamUpload(256, '/file/fail')
      await waitFor(() => {
        requests = getRequests()
        // console.log(requests)
        return requests.length > 2
      })
      // fix url so it completes
      upload.opts.url = '/file'
      await waitFor(() => {
        requests = getRequests()
        // console.log(requests)
        return requests.length > 3
      })
      expect(requests).to.have.length(4)
      expect(requests[3].body).to.equal(file.substring(0, 256))
    })
  })

  describe('a streaming upload that results in long-lived server error', () => {
    after(reset)

    it('should retry until hitting backoff limit and fail with error', async () => {
      let error
      try {
        await doStreamUpload(256, '/file/fail')
      } catch (err) {
        error = err
      }

      expect(error).to.be.instanceof(UploadStream.errors.UploadUnableToRecoverError)
    })
  })
})
