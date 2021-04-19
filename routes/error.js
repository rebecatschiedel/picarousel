import express from "express";

const errorRouter = express.Router();

errorRouter.get('/problem', (req, res) => {
    res.render('error', {title: "OOOPS!!"})
});

export default errorRouter;