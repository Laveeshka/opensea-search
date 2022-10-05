//declare and initialise global variables here
const options = {method: 'GET', headers: {accept: 'application/json'}};
let limit = 50;
let page = 0;
let collection_slug = 'doodles-official';
let collectionsBaseUrl = `https://api.opensea.io/api/v1/collections?limit=${limit}&offset=${page*limit}`;
let collectionUrl = `https://api.opensea.io/api/v1/collection/${collection_slug}`;
const cardsContainer = document.getElementById("cards-container");
let previousBtn = document.getElementById("previous");



init(); //hoisting

function init(){
    getNFTCollections();
    nextPage();
    previousPage();
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
let card = document.createElement("div");
card.classList.add("card");

let imageContainer = document.createElement("div");
imageContainer.classList.add("image-container");

let bannerImg = document.createElement("img");
bannerImg.classList.add("banner-img");
let collectionImg = document.createElement("img");
collectionImg.classList.add("collection-img");

let textContainer = document.createElement("div");
textContainer.classList.add("text-container");

let leftContainer = document.createElement("div");
leftContainer.classList.add("left-container");
let collectionName = document.createElement("div");
collectionName.classList.add("collection-name");
let collectionItems = document.createElement("div");
collectionItems.classList.add("collection-items");

let rightContainer = document.createElement("div");
rightContainer.classList.add("right-container");
let totalVolume = document.createElement("div");
totalVolume.classList.add("total-volume");

let volumeContainer = document.createElement("div");
volumeContainer.classList.add("volume-container");
let ethImage = document.createElement("img");
ethImage.classList.add("eth-logo");
let volumeValue = document.createElement("div");
volumeValue.classList.add("volume-value");

    //build image container
    bannerImg.src = col.banner_image_url === null? "./images/banner_image_default.jpg" : col.banner_image_url;
    //bannerImg.src = col.banner_image_url;
    bannerImg.alt = "banner image";
    collectionImg.src = col.image_url === null? "./images/image_default.jpg" : col.image_url;

    //collectionImg.src = col.image_url;
    collectionImg.alt = "collection image";
    imageContainer.append(bannerImg, collectionImg);

    //build left container
    collectionName.textContent = col.name;
    collectionItems.textContent = col.stats.count;
    leftContainer.append(collectionName, collectionItems);

    //build right container
    totalVolume.textContent = "Total volume";
    ethImage.src = "./images/eth-logo.svg";
    ethImage.alt = "Ethereum logo";
    volumeValue.textContent = col.stats.total_volume;
    volumeContainer.append(ethImage, volumeValue);
    rightContainer.append(totalVolume, volumeContainer);

    //build text container
    textContainer.append(leftContainer, rightContainer);

    //build card container
    card.append(imageContainer, textContainer);

    //append card to cards container
    cardsContainer.append(card);

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

//park sorting for now
// const sortedData = Array.from(collectionsData).sort((a, b) =>
//              b.stats.one_day_volume - a.stats.one_day_volume