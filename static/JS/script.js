const buttonToggleFavorite = document.querySelectorAll('.toggle-favorite');

const toggleFavorite = (e) => {
    const id = e.currentTarget.name;
    const favorite = document.querySelector(`[name="${id}"]`);

    if(favorite.classList.contains('favorite')) {
        favorite.classList.remove('favorite');
        favorite.classList.add('profile-favorite');
    } else {
        favorite.classList.add('favorite');
        favorite.classList.remove('profile-favorite');
    }
   
    fetch('/profile', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({id: id})
    }).then(function(response) {
        if(response.ok) {
            return
        }
        throw new Error('Request Failed');
    }).catch(function(error) {
        console.log(error);     
    });
};


buttonToggleFavorite.forEach(button => {
    button.addEventListener('click', toggleFavorite);
});
