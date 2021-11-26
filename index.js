const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
  // build file path

  let fileName;

  if (req.url === "/") {
    fileName = "index.html";
  } else if (req.url === "/about" || req.url === "/contact-me") {
    fileName = `${req.url}.html`;
  } else {
    fileName = req.url;
  }

  let filePath = path.join(__dirname, "public", fileName);

  // extension of file

  let extname = path.extname(filePath);

  // initial content type
  let contentType = "text/html";

  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    default:
      break;
  }

  // read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (error, content) => {
            if (error) console.log(error);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content, "utf-8");
          }
        );
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
