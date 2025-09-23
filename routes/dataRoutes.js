import express from "express";
import { getHistorical, getLive } from "../controllers/dataController.js";

const router = express.Router();

router.get("/historical/:symbol", getHistorical);
router.get("/live/:symbol", getLive);

export default router;
