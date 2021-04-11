const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// User Model
const User = require('../models/User');

//photos selection route
router.get('/', (req, res) => {
    const API_KEY = process.env.PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/?key=${API_KEY}`;

    const getData = async url => {
        try {
            const response = await axios.get(url);
            const data = response.data;

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
router.get('/:id', (req, res) => {
    const query = req.params.id;

    const API_KEY = process.env.PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}`;

    const getData = async url => {
        try {
            const response = await axios.get(url);
            const data = response.data;
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

module.exports = router;