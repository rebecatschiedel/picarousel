const express = require('express');
const passport = require('passport');
const router = express.Router();

// User Model
const User = require('../models/User');

router.get('/:id', (req, res) => {
    const selectedIndex = req.params.id;
    
    try {
        const photos = photosArray;
        if(req.isAuthenticated()) {
            const favoritedPhotos = [];
            photos.forEach(photo => {
                favoritedPhotosArray.forEach(favoritedPhoto => {
                    if (favoritedPhoto[0].id == photo.id) {
                        favoritedPhotos.push(photo.id);
                    }
                })
            })
            
            return res.render('photoCarousel', { title: "Photo Carousel", selectedIndex: selectedIndex, photos: photos, favoritedPhotos: favoritedPhotos });
        } else {
            return res.render('photoCarousel', { title: "Photo Carousel", selectedIndex: selectedIndex, photos: photos });
        }
    } catch(e) {
        console.log(e);
        return res.redirect('/error/problem');
    };

})
 
module.exports = router;