[Picarousel]((https://picarousel.herokuapp.com/)

# Introduction

This is a full-stack project written in JS and TS, using NodeJs in the backend, MongoDB for database and Pug as the templating engine. It uses a combination of custom CSS and bootstrap for styling. The app is powered by the Pixabay api and allows users to search for images with keywords. Users have the ability to create an account with email or use social logins (Google and Facebook) to save, mark as favorite or remove from favorites the photos they choose.

# Landing Page

The users are welcomed with a navbar at the top that has the links to homepage (picarousel logo), a photos page that shows the recently added photos and a login modal. The search bar under the navbar lets the users to type in tag words to search for specific photos. This fires an api call to the pixabay api to show related images. Below that, there is a three by two grid with hover effect to hotlink frequently used search terms. At the footer, there are links to social media sites and copyright to Pixabay.

# Authentication

Users are allowed to choose between using their own email/password combinations or Google/Facebook logins. As of now, there are no checks for password length, special character requirements or email verifications. However, flash messages appear when the passwords do not match or a required field is left empty. The authentication process is handled by the passport library. User passwords are encrpted using passport-local-mongoose module which uses the pbkdf2 algorithm to hash passwords and generate a salt value. The user accounts are saved in the MongoDB Atlas cloud database service. Authenticated users can favorite photos to add them in their profile to later access them. The users can also delete their accounts should they wish.

# API

The app uses Axios to make api calls to the pixabay servers.

# Future Development

Allowing users to upload their own images or grouping their favorited photos in different sections are two possible improvements.
