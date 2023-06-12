const formidable = require('formidable');
const fs = require('fs');
const mammoth = require('mammoth');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runThroughModel(section, index) {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      let keysinobj = Object.keys(section);
      if (section == '') {
        resolve({
          processed: ''
        });
      } else if (keysinobj.length < 20) {
        resolve({
          processed: section
        });
      } else { //currently working on this - DONT CALL API TOO MUCH
        /*const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: "Say this is a test",
          temperature: 0,
          max_tokens: 7,
        });
        let content = response.choices[0].message.content;*/
        resolve({
          processed: section//content
        });
      }
    }, 100);
  });
}


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

      if (!files.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }

      const filePath = files.file.filepath;

      mammoth.extractRawText({ path: filePath })
        .then(async result => {
          const text = result.value;
          const sections = text.split('\n');
          //console.log("🚀 ~ file: upload.js:50 ~ handler ~ sections:", sections)

          // Run each section through the model
          let processedSections = [];
          for (let i = 0; i < sections.length; i++) {
            const processedSection = await runThroughModel(sections[i], i);
            processedSections.push(processedSection);
            //console.log("🚀 ~ file: upload.js:61 ~ handler ~ processedSection:", processedSection)

          }
          console.log("done");

          fs.unlinkSync(filePath);

          res.status(200).json(processedSections);
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
