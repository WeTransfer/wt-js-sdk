const fs = jest.genMockFromModule('fs');

function readFile(filePath, cb) {
  cb(null, new ArrayBuffer(8));
}

fs.readFile = readFile;

module.exports = fs;
