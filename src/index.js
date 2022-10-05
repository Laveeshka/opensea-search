//declare and initialise global variables here
let limit = 50;
let page = 0;
let collectionsBaseUrl = `https://api.opensea.io/api/v1/collections?offset=${page}&limit=${limit}`;

const cardsContainer = document.getElementById("cards-container");



init(); //hoisting

function init(){
    getNFTCollections();
    
}

//fetch all
function getNFTCollections(){
    fetch(collectionsBaseUrl)
        .then(res => res.json())
        .then(colsData => {
            console.log(colsData);
            //console.log(colsData.collections);
            const colsDataArray = colsData.collections;
            //console.log(Array.from(colsData)); // empty array
            //console.log(colsDataArr);
            const colsDataWithImage = colsDataArray.filter(colData => colData.banner_image_url !== null && colData.image_url !== null) 
            console.log(colsDataWithImage);
            colsDataWithImage.forEach(colDataWithImage => 
                {
                    console.log("hey");
                    renderCollection(colDataWithImage);
                }
                );
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
    bannerImg.src = col.banner_image_url;
    bannerImg.alt = "banner image";
    collectionImg.src = col.image_url;
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
//park sorting for now
// const sortedData = Array.from(collectionsData).sort((a, b) =>
//              b.stats.one_day_volume - a.stats.one_day_volume