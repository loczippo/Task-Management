import { Router } from "express";
import { Route } from "@core/interfaces";
import UserController from "./user.controller";
import validationMiddleware from './../../core/middlewares/validation.middleware';
import RegisterDto from "./dtos/register.dto";
const userRoute = (): Route => {

    const path = process.env.PREFIX_API + "/users";
    let router = Router();
    router.post(path, validationMiddleware(RegisterDto, true), UserController.register)
    return {path, router}

}

export default userRoute;