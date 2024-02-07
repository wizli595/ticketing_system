import { Router, Request, Response } from "express";
import { ValidationChain, body } from "express-validator";
import jwt from 'jsonwebtoken';
import { User } from "../models/user-model";
import { BadRequestError, validateRequest } from "@wizlitickets/common";


const router = Router()

const userSignupValidation: ValidationChain[] = [
    body('email').isEmail().withMessage("email must be valid "),
    body('password').trim().isLength({ min: 4, max: 20 })
        .withMessage('password must be at least 4 charcters')
];

router.post('/signup',
    userSignupValidation,
    validateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) throw new BadRequestError("Email in use");

        const user = User.build({ email, password });
        await user.save()

        // set JWT
        const signedJWT = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!)

        // store JWT
        req.session = {
            jwt: signedJWT
        }

        return res.status(201).send(user)
    })

export { router as signUpRouter }