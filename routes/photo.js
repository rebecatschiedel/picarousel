import express from "express";
import { photosArray, favoritedPhotosArray } from "../app";

const photoRouter = express.Router();

photoRouter.get('/:id', (req, res) => {
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
        return res.redirect('/error/problem');
    }

})
 
export default photoRouter;