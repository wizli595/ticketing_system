import { Router, Request, Response } from "express";
import { ValidationChain, body } from "express-validator";
import jwt from 'jsonwebtoken';
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user-model";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";

const router = Router()
const userValidationBody: ValidationChain[] = [
    body('email').isEmail().withMessage("Email must be valid"),
    body('password').trim().notEmpty().withMessage("password must be supplied")
];

router.post('/signin', userValidationBody, validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new BadRequestError('Invalide credintial !!');

    const passwordMatch = await Password.compare(existingUser.password, password);

    if (!passwordMatch) throw new BadRequestError('Invalide credintial !!');

    // set JWT
    const signedJWT = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!)

    // store JWT
    req.session = {
        jwt: signedJWT
    }
    return res.status(200).send(existingUser);

}
)

export { router as signInRouter }