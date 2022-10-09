//declare and initialise global variables here
const options = {method: 'GET', headers: {accept: 'application/json'}};
let limit = 50;
let page = 0;
let collection_slug = '';
const cardsContainer = document.getElementById("cards-container");
let previousBtn = document.getElementById("previous");
const searchBtn = document.getElementById("search");
const searchInput = document.getElementById("search-name");
const singleCollectionContainer = document.getElementById("single-collection-container");
const paginationSection = document.getElementById("pagination");
const dropdown = document.getElementById("name-filter");
let colsDataArray;

init(); //hoisting

function init(){
    getNFTCollections();
    sortCollections();
    nextPage();
    previousPage();
    searchACollection();
}

//fetch all
function getNFTCollections(){
    console.log(`page is: ${page}`);
    fetch(`https://api.opensea.io/api/v1/collections?limit=${limit}&offset=${page*limit}`, options)
        .then(res => res.json())
        .then(colsData => {
            console.log(colsData);
            colsDataArray = colsData.collections;
            console.log(`first collection name before sorting: ${colsDataArray[0].name}`);
            cardsContainer.innerHTML = '';
            
            //as usual below
            colsDataArray.forEach(colData => renderCollection(colData));
            if (page < 1)
                previousBtn.disabled = true;
        })
        .catch(err => console.error(err))
}

function sortCollections(){
    //listen to change event here
    dropdown.addEventListener("change", e => {
        if (e.target.value === "name-ascending"){
            colsDataArray.sort((a, b) => a.name.localeCompare(b.name));
            console.log(colsDataArray);
            cardsContainer.innerHTML = '';
            colsDataArray.forEach(colData => renderCollection(colData));

        }
        else if (e.target.value === "name-descending"){
            colsDataArray.sort((a, b) => b.name.localeCompare(a.name));
            console.log(colsDataArray);
            cardsContainer.innerHTML = '';
            colsDataArray.forEach(colData => renderCollection(colData));

        }
        else if (e.target.value === "default"){
            getNFTCollections();
        }
    });
}
        

function renderCollection(col){
    cardsContainer.innerHTML += `
        <div class="card">
                <div class="image-container">
                    <img class="banner-img" src=${col.banner_image_url === null? "./images/banner_image_default.jpg" : col.banner_image_url} alt="collection banner image">
                    <img class="collection-img" src=${col.image_url === null? "./images/image_default.jpg" : col.image_url} alt="collection image">
                </div>
                <div class="text-container">
                    <div class="left-container">
                        <div class="collection-name">${col.name}</div>
                        <div class="collection-items">${col.stats.count} items</div>
                    </div>
                    <div class="right-container">
                        <div class="total-volume">Total volume</div>
                        <div class="volume-container">
                            <img class="eth-logo" src="./images/eth-logo.svg" alt="Ethereum logo">
                            <div class="volume-value">${col.stats.total_volume}</div>
                        </div>
                    </div>
                </div>
            </div>
    `
}

function nextPage(){
    const nextBtn = document.getElementById("next");
    let pageText = document.getElementById("current-page");
    nextBtn.addEventListener("click", () => {
        page++;

        if (page > 0)
            previousBtn.disabled = false;

        console.log(`page after next: ${page}`);
        pageText.textContent = `${page+1}`;
        getNFTCollections();
    })
}

function previousPage(){
    let pageText = document.getElementById("current-page");

    previousBtn.addEventListener("click", () => {
        if (page > 0){
            page--;
            previousBtn.disabled = false;
            pageText.textContent = `${page+1}`;
            getNFTCollections();
        }
        else {
            previousBtn.disabled = true;
        }
        console.log(`page after previous: ${page}`);
    })
}

function searchACollection(){
    //console.log(searchBtn.innerHTML);
    searchBtn.addEventListener("click", searchCollectionHander);
}

function searchCollectionHander(event){
    if (searchBtn.innerHTML === `<i class="fa-solid fa-xmark fa-lg"></i>`){
        restoreCollectionsList()
    }
    else {
         //hide cards and pagination
    cardsContainer.style.display = 'none';
    paginationSection.style.display = 'none';

    collection_slug = searchInput.value;

    fetch(`https://api.opensea.io/api/v1/collection/${collection_slug}`, options)
        .then(res => res.json())
        .then(colObj => {
            console.log(`colObj with a non-existing collection slug: ${colObj.collection}`);
            if (colObj.collection !== undefined)
                renderSingleCollection(colObj.collection);
            else
                renderEmptyState();
        })
        .catch(err => {
            console.log(err);
        });

    }
   
    
}

function renderSingleCollection(col){
    //console.log(col);
    const {banner_image_url, name, image_url, description, external_url, stats: {floor_price, count, total_volume}} = col;
    console.log(banner_image_url, name, image_url, description, external_url, floor_price, count, total_volume);

    //build html elements for collection details
    singleCollectionContainer.innerHTML = `        
    <div class="image-container">
    <img class="banner-img-single" src=${banner_image_url === null? "./images/banner_image_default.jpg" : banner_image_url} alt="collection banner image">
    <img class="collection-img" src=${image_url === null? "./images/image_default.jpg" : image_url} alt="collection image">
</div>
<div class="text-container-single wrapper-container">
    <h2 class="collection-name">${name}  <span class="favourite-span"><i class="fa-regular fa-heart"></i>
    </span></h2>
    <a class="link" href=${external_url === null? "https://opensea.io/" : external_url} target="_blank">Go to collection</a>
    <p class="description">${description === null? "This collection does not have a description" : description}</p>
    <div class="stats-container">
        <div class="stats">
            <div class="collection-items">Items</div>
            <div class="collection-count">${count}</div>
        </div>
        <div class="stats">
            <div class="total-volume">Total volume</div>
            <div class="volume-container">
                <img class="eth-logo" src="./images/eth-logo.svg" alt="Ethereum logo">
                <div class="volume-value">${total_volume === null ? "-" : parseInt(total_volume)}</div>
            </div>
        </div>
        <div class="stats">
            <div class="floor-price">Floor price</div>
            <div class="floor-container">
                <img class="eth-logo" src="./images/eth-logo.svg" alt="Ethereum logo">
                <div class="floor-value">${floor_price === null ? "-" : parseInt(floor_price)}</div>
            </div>
        </div>
    </div>
</div>
`
searchBtn.innerHTML = `<i class="fa-solid fa-xmark fa-lg"></i>`;

//listen to click event on heart icon
let favouriteSpan = document.querySelector(".favourite-span");
favouriteSpan.addEventListener("click", (e) => {
    console.log("heart was clicked!");
    console.log(e.target); //<i class="fa-regular fa-heart"></i>

    addFavouriteCollectionToDb(col);
});
}

function renderEmptyState(){
    singleCollectionContainer.innerHTML = `<h2 class="wrapper-container collection-name">This collection does not exist!</h2>`;
    searchBtn.innerHTML = `<i class="fa-solid fa-xmark fa-lg"></i>`;
}

function restoreCollectionsList(event){
    searchBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>`;
     //unhide cards and pagination
     cardsContainer.style.display = 'grid';
     paginationSection.style.display = 'flex';

     //empty single collection details
     singleCollectionContainer.innerHTML = '';

     //clear input field
     searchInput.value = '';

}

function addFavouriteCollectionToDb(col){
    const {banner_image_url, slug, name, image_url, description, external_url} = col;
    const favCol = {
        slug,
        name,
        banner_image_url: banner_image_url === null? "./images/banner_image_default.jpg" : banner_image_url,
        image_url: image_url === null? "./images/image_default.jpg" : image_url,
        description: description === null? "This collection does not have a description" : description,
        external_url: external_url === null? "https://opensea.io/" : external_url
    }
    fetch('http://localhost:3000/collections', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(favCol)
    })
        .then(res => res.json())
        .then(data => console.log(data))
}

