/* 
var convertapi = require('convertapi')(process.env.CONVERT_API_KEY);
const formidable = require('formidable');
import fs from 'fs';
import { file } from 'jszip';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const form = new formidable.IncomingForm();

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      if (!files.file1 || !files.file2) {
        res.status(400).json({ error: 'Both files must be uploaded.' });
        return;
      }


      const filePath1 = files.file1.filepath;
      const filePath2 = files.file2.filepath;

      /*const tempDir = './temp';
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      try {
        fs.copyFileSync(files.file1.filepath, `${tempDir}/${files.file1.originalFilename}`);
      } catch (err) {
        console.error(`Error copying file1: ${err}`);
      }

      try {
        fs.copyFileSync(files.file2.filepath, `${tempDir}/${files.file2.originalFilename}`);
      } catch (err) {
        console.error(`Error copying file2: ${err}`);
      }*/

      

      /*console.log("🚀 ~ file: upload.js:50 ~ handler ~ files.file1.filepath", files.file1.filepath);
      console.log("🚀 ~ file: upload.js:50 ~ handler ~ files.file2.filepath", files.file2.filepath);

      console.log("🚀 ~ file: upload.js:50 ~ handler ~ files.file1.name", files.file1.originalFilename);
      console.log("🚀 ~ file: upload.js:50 ~ handler ~ files.file2.name", files.file2.originalFilename);
      convertapi.convert('compare', {
        File: filePath1,
        CompareFile: filePath2,
      }, 'docx').then(function (result) {
        result.saveFiles('./temp/');
      });

      // Save the result to a temporary file
      //const tempFilePath = './temp/' + result.fileInfo.name;
      //await result.saveFile(tempFilePath);

      // Read the file and convert it to a buffer
      const buffer = fs.readFileSync(tempFilePath);

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);

      // Send the buffer in the response
      res.status(200).send(buffer);
    } catch (err) {
      res.status(500).json({ error: 'Error handling the file upload.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }
}
 */

var convertapi = require('convertapi')(process.env.CONVERT_API_KEY);
const formidable = require('formidable');
import fs from 'fs';
import { file } from 'jszip';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const form = new formidable.IncomingForm();

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      if (!files.file1 || !files.file2) {
        res.status(400).json({ error: 'Both files must be uploaded.' });
        return;
      }

      // Upload the files to ConvertAPI
      const file1 = await convertapi.upload(files.file1.filepath);
      const file2 = await convertapi.upload(files.file2.filepath);

      // Convert the files
      const result = await convertapi.convert('compare', {
        File: file1,
        CompareFile: file2,
      }, 'docx');

      // Save the result to a temporary file
      const tempFilePath = './temp/' + result.fileInfo.name;
      await result.saveFile(tempFilePath);

      // Read the file and convert it to a buffer
      const buffer = fs.readFileSync(tempFilePath);

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);

      // Send the buffer in the response
      res.status(200).send(buffer);
    } catch (err) {
      res.status(500).json({ error: 'Error handling the file upload.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }
}
