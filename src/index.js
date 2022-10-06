//declare and initialise global variables here
const options = {method: 'GET', headers: {accept: 'application/json'}};
let limit = 50;
let page = 0;
let collection_slug = '';
let collectionsBaseUrl = `https://api.opensea.io/api/v1/collections?limit=${limit}&offset=${page*limit}`;
let collectionUrl = `https://api.opensea.io/api/v1/collection/${collection_slug}`;
const cardsContainer = document.getElementById("cards-container");
let previousBtn = document.getElementById("previous");
const searchBtn = document.getElementById("search");
const searchInput = document.getElementById("search-name");
const singleCollectionContainer = document.getElementById("single-collection-container");
const paginationSection = document.getElementById("pagination");

init(); //hoisting

function init(){
    getNFTCollections();
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
            console.log(`url is: ${collectionsBaseUrl}`)
            console.log(colsData);
            const colsDataArray = colsData.collections;
            console.log(`first collection name: ${colsDataArray[0].name}`);
            cardsContainer.innerHTML = '';
            colsDataArray.forEach(colData => renderCollection(colData));
        })
        .catch(err => console.error(err))
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
    searchBtn.addEventListener("click", searchCollectionHander);
}

function searchCollectionHander(event){
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
    <h2 class="collection-name">${name}</h2>
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
}

function renderEmptyState(){
    singleCollectionContainer.innerHTML = `<h2 class="wrapper-container collection-name">This collection does not exist!</h2>`
}

//park sorting for now
// const sortedData = Array.from(collectionsData).sort((a, b) =>
//              b.stats.one_day_volume - a.stats.one_day_volume