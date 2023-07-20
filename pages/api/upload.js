const formidable = require('formidable');
const fs = require('fs');
const mammoth = require('mammoth');
const { Configuration, OpenAIApi } = require("openai");
//const {encode, decode} = require('gpt-3-encoder')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runThroughModel(section, name) {
  //console.log(name);
  return new Promise(async (resolve) => {

    let keysinobj = Object.keys(section);
    if (keysinobj.length < 90) {
      resolve({
        processed: section
      });
    } else { //DONT CALL API TOO MUCH
      //section += "hola";
      section += "\n\n###->";

      const response = await openai.createCompletion({
        model: "davinci:ft-aipi-solutions-2023-06-27-21-17-21",
        prompt: section,
        max_tokens: 500,
        temperature: .8,
        top_p: 1,
        stop: ['###-›', '\n\n###->', '\n###->', '###']
      });
      let content = response.data.choices[0].text;
      console.log("🚀 ~ file: upload.js:37 ~ returnnewPromise ~ content:", content);

      resolve({
        processed: content
      });
    }

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
          const sections = text.split('\n')/*.filter(section => section.trim() !== '')*/;
          //console.log("🚀 ~ file: upload.js:50 ~ handler ~ sections:", sections)

          // Run each section through the model
          let processedSections = [];
          for (let i = 0; i < sections.length; i++) {
            const processedSection = await runThroughModel(sections[i]);
            processedSections.push(processedSection);
            //console.log("🚀 ~ file: upload.js:61 ~ handler ~ processedSection:", processedSection);

          }
          console.log("done");

          //fs.unlinkSync(filePath);

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