import express from "express";
import { photosArray } from "../app";
import "dotenv/config";
import axios from "axios";

const photosRouter = express.Router();

// User Model
import User from "../models/User";

//photos selection route
photosRouter.get('/', (req, res) => {
    const API_KEY = process.env.PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/?key=${API_KEY}`;

    const getData = async url => {
        try {
            const response = await axios.get(url);
            const data = response.data;

            // eslint-disable-next-line
            photosArray = data['hits'];

            const photos = photosArray;
            if(req.isAuthenticated()) {
                const userId = req.user.id;
                const userObject = await User.find({_id: userId});

                const favoritedPhotos = [];
                photos.forEach(photo => {
                    userObject[0].favoritePhotos.forEach(favoritedPhoto => {
                        if (favoritedPhoto == photo.id) {
                            favoritedPhotos.push(photo.id);
                        }
                    })
                })

                return res.render('photos', { title: 'Gallery', photos: photos, favoritedPhotos: favoritedPhotos });
            } else {
                return res.render('photos', { title: 'Gallery', photos: data['hits'] });
            }

        } catch (error) {
            console.log(error);
        }
    };

    getData(url)
});

//photos cards route
photosRouter.get('/:id', (req, res) => {
    const query = req.params.id;

    const API_KEY = process.env.PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}`;

    const getData = async url => {
        try {
            const response = await axios.get(url);
            const data = response.data;
            // eslint-disable-next-line
            photosArray = data['hits'];
            
            
            const photos = photosArray;
            
            if(req.isAuthenticated()) {
                const userId = req.user.id;
                const userObject = await User.find({_id: userId});

                const favoritedPhotos = [];
                photos.forEach(photo => {
                    userObject[0].favoritePhotos.forEach(favoritedPhoto => {
                        if (favoritedPhoto == photo.id) {
                            favoritedPhotos.push(photo.id);
                        }
                    })
                })
    
                return res.render('photos', { title: query.toUpperCase(), photos: photos, favoritedPhotos: favoritedPhotos });
            } else {
                return res.render('photos', { title: query.toUpperCase(), photos: data['hits'] });
            }

        } catch (error) {
            console.log(error);
        }
    };

    getData(url)
});

export default photosRouter;