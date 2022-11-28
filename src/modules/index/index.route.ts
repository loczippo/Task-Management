import IndexController from "./index.controler";
import { Router } from "express";
import { Route } from "../../core/interfaces";

const IndexRoute = (): Route => {

    let path = '/';
    let router = Router();
    
    router.get(path, IndexController)
    return {path, router}
}

export default IndexRoute;