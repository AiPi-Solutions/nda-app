var convertapi = require("convertapi")(process.env.CONVERT_API_KEY);
const formidable = require("formidable");
var fs = require("fs");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm();

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      if (!files.file1 || !files.file2) {
        res.status(400).json({ error: "Both files must be uploaded." });
        return;
      }

      // Upload the files to ConvertAPI
      convertapi
        .upload(files.file1.filepath, files.file1.originalFilename)
        .then(function (file1Result) {
          const file1Url = `https://v2.convertapi.com/d/${file1Result.fileId}`;
          console.log("Done uploading");
          convertapi
            .upload(files.file2.filepath, files.file2.originalFilename)
            .then(function (file2Result) {
              const file2Url = `https://v2.convertapi.com/d/${file2Result.fileId}`;

              // Convert the files
              convertapi
                .convert(
                  "compare",
                  {
                    File: file1Url,
                    CompareFile: file2Url,
                    CompareFormatting: "false",
                    CompareWhitespace: "false"
                  },
                  "docx"
                )
                .then(function (result) {
                  // Save the result to a temporary file
                  //console.log(result);
                  if (
                    result.response.Files &&
                    result.response.Files[0] &&
                    result.response.Files[0].FileName
                  ) {
                    // Create a path for the temp file using the FileName from the result
                    const tempFilePath =
                      "./temp/" + result.response.Files[0].FileName;

                    result.saveFiles("./temp/").then(() => {
                      // Notice the change here
                      // Read the file and convert it to a buffer
                      const buffer = fs.readFileSync(tempFilePath);

                      // Delete the temporary file
                      fs.unlinkSync(tempFilePath);

                      // Send the buffer in the response
                      res.status(200).send(buffer);
                    });
                  } else {
                    console.error("Could not find FileName in result");
                  }
                });
            });
        });
    } catch (err) {
      res.status(500).json({ error: "Error handling the file upload." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed. Please use POST." });
  }
}
