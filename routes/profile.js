import express from "express";
import { favoritedPhotosArray } from "../app";
import "dotenv/config";
import axios from "axios";

const profileRouter = express.Router();

// User Model
import User from "../models/User";

profileRouter.get('/', async (req, res) => {
    if(req.isAuthenticated()) {
        const userId = req.user.id;
        const userObject = await User.find({_id: userId});

        const API_KEY = process.env.PIXABAY_API_KEY;
        
       const photos =  userObject[0].favoritePhotos.map( async favoritePhoto => {
           const url = `https://pixabay.com/api/?key=${API_KEY}&id=${favoritePhoto}`;
               
           const response = await axios.get(url);
           const data = response.data;

            return data['hits'];
       })

       // eslint-disable-next-line
       favoritedPhotosArray = await Promise.all(photos);

       res.render('profile', {title: "Profile", username: userObject[0].name, photos: favoritedPhotosArray, userId: userObject[0]._id});

    } else {
        res.redirect('/users/login');
    }
});

profileRouter.get('/:id', (req, res) => {
    const selectedIndex = req.params.id;
    
    try {
        return res.render('profileCarousel', { title: "Photo Carousel", selectedIndex: selectedIndex, photos: favoritedPhotosArray });
    } catch(e) {
        return res.redirect('/error/problem');
    }

})

// eslint-disable-next-line
profileRouter.post('/', async (req, res) => {       
    try {
        const photoId = req.body.id;
        const userId = req.user.id;
    
        User.findById(userId, (err, foundUser) => {
            if(err) {
                console.log(err);
            } else {
                if (foundUser.favoritePhotos.includes(photoId)) {
                    const newFavoritePhotos = foundUser.favoritePhotos.filter(photo => photo !== photoId);
                    foundUser.favoritePhotos = newFavoritePhotos;
                
                    foundUser.save(()=> {
                        console.log('successfully erased');
                    })
                } else {
                    foundUser.favoritePhotos.push(photoId);

                    foundUser.save(()=> {
                        console.log('successfully added');
                    })
                }
                    
            }
        });
    } catch(e) {
        console.log('id error');
    }
    
});

profileRouter.post('/delete/:id', (req, res) => {
    if(req.isAuthenticated()) {
        // eslint-disable-next-line
        User.findByIdAndRemove({_id: req.params.id}, (err, result) => {
            if (err) {
                console.log(err);
                return res.redirect('/error/problem');
            } else {
                return res.redirect('/');
            }
        });
    } else {
        res.redirect('/users/login');
    }
})

profileRouter.get('/delete/instructions', (req, res) => {
    res.send("Click on 'delete profile' button at the bottom of your profile page to delete your account")
});

export default profileRouter;