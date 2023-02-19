import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import axios from "axios";
import cors from "cors";
import http from "http";
import https from "https";
import expressStaticGzip from "express-static-gzip";
import bodyParser from "body-parser";
import * as url from "url";
import ejs from "ejs";
import Spotify from "./api/spotify.js";
import config from "../config/config.js";
import compression from "compression";
import logger from "morgan";
dotenv.config();
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

const setupServer = async () => {
  // Get the app config
  const port = process.env.PORT ? process.env.PORT : config.port;

  // Setup our Express pipeline
  let app = express();

  app.use(cors());
  // Finish with the body parser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger("dev"));
  // app.engine("pug", require("pug").__express);
  // app.set("views", path.join(__dirname, "dist"));
  app.engine("html", ejs.renderFile);

  app.use(express.static(path.join(__dirname, "dist")));

  app.use(compression());
  const frontend = path.join(__dirname, "dist");

  // Import our routes
  Spotify(app);
  // Map the requests to the static React build directory
  app.get("*", (req, res) => {
    res.type("application/javascript");
    res.render(path.join(frontend, "index.html"));
  });
  // // Give them the SPA base page
  // app.get("*", (req, res) => {

  //   res.render("../public/index.html");
  // });

  // Run the server itself
  let server;
  if (env === "production") {
    const options = {
      // key: fs.readFileSync(conf.security.keyPath),
      // cert: fs.readFileSync(conf.security.certPath),
      // ca: fs.readFileSync(conf.security.caPath),
    };
    // Listen for HTTPS requests
    server = https.createServer(options, app).listen(port, () => {
      console.log(
        `Secure Cloud Spotify Player listening on: ${server.address().port}`
      );
    });
    // Redirect HTTP to HTTPS
    http
      .createServer((req, res) => {
        const location = `https://${req.headers.host}${req.url}`;
        console.log(`Redirect to: ${location}`);
        res.writeHead(302, { Location: location });
        res.end();
      })
      .listen(80, () => {
        console.log(`Cloud Spotify Player listening on 80 for HTTPS redirect`);
      });
  } else {
    server = app.listen(port, () => {
      console.log(
        `Cloud Spotify Player ${env} listening on: ${server.address().port}`
      );
    });
  }
};

// Run the server
setupServer();
