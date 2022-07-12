import express from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import { Routers } from "./routers/index.js";
import { handleError } from "./middlewares/errorhandler.js";
dotenv.config();
var App = express();
App.use(express.json());
App.use(cors());
App.use(Routers);
App.use(handleError);
var port = +process.env.PORT || 4000;
App.listen(port, function () {
    console.log("Server online and listening on port ".concat(port));
});
