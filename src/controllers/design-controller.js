import  express from "express";
import { AuthMiddleware } from "../auth/authMiddleware.js";
import DesignService from "../services/design-service.js"

const router = express.Router()
const designService = new DesignService()

router.get("/:id", AuthMiddleware, async (req, res) => {

});