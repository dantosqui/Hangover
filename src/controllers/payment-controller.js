import express from "express";
import {
  createOrder,
  receiveWebhook,
} from "../utils/paymentUtils.js";

const router = express.Router();

router.post("/create-order", createOrder);

router.post("/webhook", receiveWebhook);

router.get("/success", (req, res) => res.send("Success"));

export default router;