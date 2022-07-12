import { Router } from "express";
import { cardRouter } from "./cardRouter.js";
import { paymentRouter } from "./paymentRouter.js";
import { virtualCardRouter } from "./virtualCardRouter.js";
var Routers = Router();
Routers.use(cardRouter);
Routers.use(paymentRouter);
Routers.use(virtualCardRouter);
export { Routers };
