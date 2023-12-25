const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();

// server.on("request", (req, res) => {
//   const dataString = "This is file system class";

//   console.log(req.method, " ", req.url);
//   if (req.method === "GET" && req.url === "/") {
//     return res.end("Home Page");
//   }

//   //write
//   else if (req.method === "GET" && req.url === "/writefile") {
//     fs.writeFile("demo.txt", dataString, (err) => {
//       if (err) throw err;
//       return res.end("Write successfull");
//     });
//   }
//   //append
//   else if (req.method === "GET" && req.url === "/appendfile") {
//     fs.appendFile("demo.txt", dataString, (err) => {
//       if (err) throw err;
//       return res.end("Append successfull");
//     });
//   }
//   //read
//   else if (req.method === "GET" && req.url === "/readfile") {
//     fs.readFile("test.html", (err, data) => {
//       if (err) throw err;
//       console.log(data);
//       return res.end(data);
//     });
//   }
//   //rename
//   else if (req.method === "GET" && req.url === "/renamefile") {
//     fs.rename("demo.txt", "newDemo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Rename successfull");
//     });
//   }
//   //delete
//   else if (req.method === "GET" && req.url === "/deletefile") {
//     fs.unlink("newDemo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Delete successfull");
//     });
//   }
//   //stream read
//   else if (req.method === "GET" && req.url === "/streamfile") {
//     const rStream = fs.createReadStream("demo.txt");

//     rStream.on("data", (char) => {
//       res.write(char);
//     });

//     rStream.on("end", () => {
//       return res.end();
//     });
//   } else {
//     return res.end("API Not found");
//   }
// });

server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/fileupload") {
    const form = new formidable.IncomingForm();
    // console.log(form);
    form.parse(req, (err, feilds, files) => {
      if (err) console.log(err);

      const oldPath = files.fileToUpload[0].filepath;
      const newPath =
        __dirname + "/uploads/" + files.fileToUpload[0].originalFilename;
      console.log(oldPath);
      console.log(newPath);

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        return res.end("File uploaded successfully");
      });
    });
  } else {
    fs.readFile("test.html", (err, data) => {
      if (err) throw err;
      return res.end(data);
    });
  }
});

server.listen(8000, () => {
  console.log("Server is running on PORT : 8000");
});

//https://pqina.nl/blog/upload-image-with-nodejs/
