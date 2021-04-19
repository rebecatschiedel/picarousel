import express from "express";

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
    res.render('index', {title: 'Homepage'})
});

indexRouter.post("/", (req, res) => {
    res.redirect(`/photos/${req.body.search}`);
});

export default indexRouter;