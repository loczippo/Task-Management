import { Router } from "express";
import { Route } from "@core/interfaces";
import UserController from "./user.controller";
const userRoute = (): Route => {

    const path = process.env.PREFIX_API + "/users";
    let router = Router();
    router.post(path, UserController.register)
    return {path, router}

}

export default userRoute;