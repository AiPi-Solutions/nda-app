const formidable = require('formidable');
const fs = require('fs');
const mammoth = require('mammoth');

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
          console.log("🚀 ~ file: upload.js:18 ~ form.parse ~ files:", files)
          
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      if (!files.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }

      const filePath = files.file.filepath;
      console.log("🚀 ~ file: upload.js:29 ~ handler ~ filePath:", filePath)
      
      console.log(filePath);
      mammoth.extractRawText({ path: filePath })
        .then(result => {
          const text = result.value; // The raw text
          console.log("splitting text into sections...");
          const sections = text.split('\n'); // Split the text into sections

          console.log(sections); // print the sections to the console

          fs.unlinkSync(filePath); // delete the file after processing

          res.status(200).json(sections); // send the sections in the response
        })
        .catch(error => {
          console.error('An error occurred:', error);
          res.status(500).json({ error: 'Error parsing the file.' });
        });
    } catch (err) {
      res.status(500).json({ error: 'Error handling the file upload.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }
}
