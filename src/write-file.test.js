/**
 * @license
 * Copyright Robin Buckley. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
'use strict';

const fs = require('fs');
const writeFile = require('./index');
const expect = require('chai').expect

const expectedContent = 'Hey';
const testFilePath = './write-file-promise-test-file.js';

const getFile = function (filePath) {
  const promise = new Promise((resolve, reject) =>{
    fs.readFile(filePath, 'utf8', (err, contents) => {
      if (!err) {
        resolve(contents);
      } else {
        resolve({});
      }
    });
  });
  return promise;
};


const cleanup = () => {
  const promise = new Promise((resolve, reject) => {
    fs.stat(testFilePath, (err, stats) => {
      if (!err) {
        if (stats.isFile() === true) {
          fs.unlink(testFilePath, (err) => {
            resolve();
          });
        }
      } else {
        resolve();
      }
    });
  });
  return promise;
};


describe('Write File Promise', () => {

  it('should export a function', () => {
    expect(writeFile).to.be.a('function');
  });

  it('should return a promise', () => {
    expect(writeFile(testFilePath, expectedContent).then).to.be.a('function');
  });

  it('should handle an error', () => {
    writeFile('/this.file.doesnt.exist', {})
      .then(() => getFile(resultFilePath),
        (err) => {
          expect(true).to.be.equal(true);
        }
      );
  });

  it('should write a file', () => {
    let writtenContent;
    writeFile(testFilePath, expectedContent)
      .then((content) => {
        writtenContent = content;
      })
      .then(() => getFile(testFilePath))
      .then((result) => {
        expect(result).to.equal(expectedContent);
        cleanup();
      });
  });

});
