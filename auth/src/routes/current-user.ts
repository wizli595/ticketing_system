import { Router } from "express";
import { currentUser } from "../middlewares/current-user";
// import { requireAuth } from "../middlewares/require-auth";

const router = Router()

router.get('/current', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null })

})

export { router as currentUserRouter }