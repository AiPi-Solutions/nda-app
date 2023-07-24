const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runThroughModel(section, model) {
  console.log(model);
  return new Promise(async (resolve) => {
    let keysinobj = Object.keys(section);
     if (keysinobj.length < 90) {
      resolve({
        processed: section
      });
    } else {
        section += "\n\n###->";

        const response = await openai.createCompletion({
          model: "davinci:ft-aipi-solutions-2023-07-04-20-55-59",
          prompt: section,
          max_tokens: 500,
          temperature: .2,
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

export default async function handler(req, res) {
  // console.log("hi??");

  if (req.method === 'POST') {
    try {
      const { text, model } = req.body;
      console.log("WHY ARE THESE CONSOLE LOGS NOT SHOWING UP? (only on terminal, not localhost inspect element).");
      // console.log(model);

      const sections = text.split('\n');

      // Run each section through the model
      let processedSections = [];
      for (let i = 0; i < sections.length; i++) { //, model_name
        const processedSection = await runThroughModel(sections[i], model);
        processedSections.push(processedSection);
      }
      console.log("done");

      res.status(200).json(processedSections);
    } catch (err) {
      res.status(500).json({ error: 'Error handling the text processing.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }
}
