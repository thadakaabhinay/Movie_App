const parentElement=document.querySelector(".main");
const searchInput=document.querySelector(".input");
const movieRatings=document.querySelector("#rating-select");
const movieGenres=document.querySelector("#genre-select");
const app=document.querySelector(".movieApp");


let searchValue="";
let ratings=0;
let genre_data="";
let filteredArrOfMovies=[];
const URL="https://api.themoviedb.org/3/discover/movie?api_key=a2bedef2985e12f013cdd9ce8b4a26b1";
const GENRES_URL="https://api.themoviedb.org/3/genre/movie/list?api_key=a2bedef2985e12f013cdd9ce8b4a26b1"

const getMovies=async (url)=>{
    try{
        const {data}=await axios.get(url)
        console.log(data)
        const res=data.results
        return res;
    }catch(err){
        console.log("error")
    }
}
const getGenres=async (url)=>{
    try{
        const {data}=await axios.get(url)
        const genre_res=data.genres;
        console.log(genre_res)
       
        return genre_res;
    }catch(err){
        console.log("error")
    }
}

let genres=await getGenres(GENRES_URL);


let movies= await getMovies(URL)
console.log(movies);


const createElement =(element)=> document.createElement(element);

const createMovieCard=(movies,genres)=>{
    for (let movie of movies){
        
        const cardContainer=createElement("div");
        cardContainer.classList.add("card","shadow");

        const imageContainer=createElement("div");
        imageContainer.classList.add("card-image-container");

        const imageEle=createElement("img");
        imageEle.classList.add("card-image");
        imageEle.setAttribute("src",`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
        imageEle.setAttribute("alt",movie.title);
        imageContainer.appendChild(imageEle);
        cardContainer.appendChild(imageContainer);

        const cardDetails=createElement("div");
        cardDetails.classList.add("movie-details");

        const titleEle=createElement("p");
        titleEle.classList.add("title");
        titleEle.innerText=movie.title;
        cardDetails.appendChild(titleEle);

        const genreEle=createElement("p");
        genreEle.classList.add("genre");
        const genre_list=genres.find(mode => mode.id === movie.genre_ids[0])
        genreEle.innerText=`Genre: ${genre_list.name}`;
        cardDetails.appendChild(genreEle);

        const movieRating=createElement("div");
        movieRating.classList.add("ratings");


        const ratings=createElement("div");
        ratings.classList.add("star-rating");

        const starIcon = createElement("span");
        starIcon.classList.add("material-symbols-outlined");
        starIcon.innerText="star";
        ratings.appendChild(starIcon);

        const ratingValue = createElement("span");
        ratingValue.innerText=movie.vote_average;
        ratings.appendChild(ratingValue);

        movieRating.appendChild(ratings);

        const length= createElement("p");
        length.innerText="120 mins";
       

        movieRating.appendChild(length);
        cardDetails.appendChild(movieRating);
        cardContainer.appendChild(cardDetails);
        parentElement.appendChild(cardContainer)

    }
};


function getFilteredData(){
    // const genreArr=genres.filter(genre=> searchValue ===genre.name.toLowerCase())

    
    filteredArrOfMovies=searchValue?.length >0 ? movies.filter(movie => searchValue === movie.title.toLowerCase()):movies;
    
    if(ratings>0){
        filteredArrOfMovies =searchValue?.length >0 ?filteredArrOfMovies :movies;
        filteredArrOfMovies =filteredArrOfMovies.filter(movie => movie.vote_average >= ratings);
    }
    if(genre_data?.length>0){
        filteredArrOfMovies=searchValue?.length >0 || ratings >= 6 ?filteredArrOfMovies :movies;
        filteredArrOfMovies =filteredArrOfMovies.filter(movie => {
            const genre_find = genres.find(mode => mode.id === movie.genre_ids[0]);
            return genre_find.name.includes(genre_data);
        })
    }

    return filteredArrOfMovies

}

const handleSearch=(event)=>{
    searchValue=event.target.value.toLowerCase();
    let filterBySearch=getFilteredData();
    parentElement.innerHTML="";
    createMovieCard(filterBySearch,genres);

}
function debounce(callback,delay){
    let timerId;
    return (...args)=>{
        clearTimeout(timerId);
        timerId=setTimeout(()=>callback(...args),delay);
    };
}
function handleRatingSelector(event){
    ratings=event.target.value;
    let filterByRating=getFilteredData();
    parentElement.innerHTML="";
    createMovieCard(ratings ? filterByRating : movies,genres);

}



const debounceInput=debounce(handleSearch,500);

searchInput.addEventListener("keyup",debounceInput);


movieRatings.addEventListener("change",handleRatingSelector);


for(let val of genres){
    const option=createElement("option")
    option.classList.add("option");
    option.setAttribute("value",val.name);
    option.innerHTML=val.name;
    movieGenres.appendChild(option);

}
function handleGenreSelect(event){
    genre_data=event.target.value;
   
    const filteredMoviesByGenre=getFilteredData();
    parentElement.innerHTML="";
    createMovieCard(genre_data ? filteredMoviesByGenre :movies,genres);

    
}

movieGenres.addEventListener("change",handleGenreSelect);

createMovieCard(movies,genres);

const handleApp=()=>{
    searchInput.value="";
    movieRatings.value="";
    movieGenres.value="";
    searchValue="";
    ratings=0;
    genre_data="";
    const filteredByMovieApp=getFilteredData();
    createMovieCard(filteredByMovieApp,genres);
    
}


app.addEventListener("click",handleApp);


