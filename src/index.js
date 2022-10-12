//declare and initialise global variables here
const options = { method: 'GET', headers: { accept: 'application/json' } };
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
const favouriteCollectionContainer = document.getElementById("favourite-collections-container");
let colsDataArray;
let favCols;

init(); //hoisting

function init() {
    getFavouriteCollectionsFromDb();

    getNFTCollections();
    sortCollections();
    nextPage();
    previousPage();
    searchACollection();
    showFavouriteCollections();
}

//show modal
cardsContainer.addEventListener("click", (e) => {
    console.log(e.target.dataset.id);
    fetch(`https://api.opensea.io/api/v1/collection/${e.target.dataset.id}`, options)
        .then(res => res.json())
        .then(data => {
         console.log(data)
        })
})

//fetch all
function getNFTCollections() {
    fetch(`https://api.opensea.io/api/v1/collections?limit=${limit}&offset=${page * limit}`, options)
        .then(res => res.json())
        .then(colsData => {
            colsDataArray = colsData.collections;
            cardsContainer.innerHTML = '';

            colsDataArray.forEach(colData => renderCollection(colData));
            if (page < 1)
                previousBtn.disabled = true;
        })
        .catch(err => console.error(err))
}

function sortCollections() {
    //listen to change event here
    dropdown.addEventListener("change", e => {
        if (e.target.value === "name-ascending") {
            colsDataArray.sort((a, b) => a.name.localeCompare(b.name));
            cardsContainer.innerHTML = '';
            colsDataArray.forEach(colData => renderCollection(colData));

        }
        else if (e.target.value === "name-descending") {
            colsDataArray.sort((a, b) => b.name.localeCompare(a.name));
            cardsContainer.innerHTML = '';
            colsDataArray.forEach(colData => renderCollection(colData));

        }
        else if (e.target.value === "default") {
            getNFTCollections();
        }
    });
}


function renderCollection(col) {
    cardsContainer.innerHTML += `
        <div class="card" data-id="${col.slug}">
                <div class="image-container" data-id="${col.slug}">
                    <img data-id="${col.slug}" class="banner-img" src=${col.banner_image_url === null ? "./images/banner_image_default.jpg" : col.banner_image_url} alt="collection banner image">
                    <img data-id="${col.slug}" class="collection-img" src=${col.image_url === null ? "./images/image_default.jpg" : col.image_url} alt="collection image">
                </div>
                <div class="text-container" data-id="${col.slug}">
                    <div class="left-container" data-id="${col.slug}">
                        <div class="collection-name"  data-id="${col.slug}">${col.name}</div>
                        <div class="collection-items" data-id="${col.slug}">${col.stats.count} items</div>
                    </div>
                    <div class="right-container" data-id="${col.slug}">
                        <div class="total-volume" data-id="${col.slug}">Total volume</div>
                        <div class="volume-container" data-id="${col.slug}">
                            <img data-id="${col.slug}" class="eth-logo" src="./images/eth-logo.svg" alt="Ethereum logo">
                            <div data-id="${col.slug}" class="volume-value">${col.stats.total_volume}</div>
                        </div>
                    </div>
                </div>
            </div>
    `
}

function nextPage() {
    const nextBtn = document.getElementById("next");
    let pageText = document.getElementById("current-page");
    nextBtn.addEventListener("click", () => {
        page++;

        if (page > 0)
            previousBtn.disabled = false;

        pageText.textContent = `${page + 1}`;
        getNFTCollections();
    })
}

function previousPage() {
    let pageText = document.getElementById("current-page");

    previousBtn.addEventListener("click", () => {
        if (page > 0) {
            page--;
            previousBtn.disabled = false;
            pageText.textContent = `${page + 1}`;
            getNFTCollections();
        }
        else {
            previousBtn.disabled = true;
        }
    })
}

function searchACollection() {
    searchBtn.addEventListener("click", searchCollectionHander);
}

function searchCollectionHander(event) {
    if (searchBtn.innerHTML === `<i class="fa-solid fa-xmark fa-lg"></i>`) {
        restoreCollectionsList()
    }
    else {
        getFavouriteCollectionsFromDb();
        //hide cards and pagination
        cardsContainer.style.display = 'none';
        paginationSection.style.display = 'none';

        collection_slug = searchInput.value;

        fetch(`https://api.opensea.io/api/v1/collection/${collection_slug}`, options)
            .then(res => res.json())
            .then(colObj => {
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

function renderSingleCollection(col) {
    const { banner_image_url, name, slug, image_url, description, external_url, stats: { floor_price, count, total_volume } } = col;

    //build html element for collection details
    singleCollectionContainer.innerHTML = `        
    <div class="image-container">
    <img class="banner-img-single" src=${banner_image_url === null ? "./images/banner_image_default.jpg" : banner_image_url} alt="collection banner image">
    <img class="collection-img" src=${image_url === null ? "./images/image_default.jpg" : image_url} alt="collection image">
</div>
<div class="text-container-single wrapper-container">
    <h2 class="collection-name">${name}  <span class="favourite-span"><i class="fa-regular fa-heart"></i>
    </span></h2>
    <a class="link" href=${external_url === null ? "https://opensea.io/" : external_url} target="_blank">Go to collection</a>
    <p class="description">${description === null ? "This collection does not have a description" : description}</p>
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

    //check if searched collection exists in db
    let heartIcon = document.querySelector(".fa-heart");
    const doesColExist = favCols.some(col => col.slug === slug);
    if (doesColExist) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
    }

    //listen to click event on heart icon
    let favouriteSpan = document.querySelector(".favourite-span");
    favouriteSpan.addEventListener("click", (e) => {
        getFavouriteCollectionsFromDb();

        //change to solid heart from regular heart
        if (heartIcon.classList.contains("fa-regular")) {
            heartIcon.classList.remove("fa-regular");
            heartIcon.classList.add("fa-solid");

            addFavouriteCollectionToDb(col);
        }
        else if (heartIcon.classList.contains("fa-solid")) {
            heartIcon.classList.remove("fa-solid");
            heartIcon.classList.add("fa-regular");

            deleteFavouriteCollectionFromDb(col);
        }

    });
}

function renderEmptyState() {
    singleCollectionContainer.innerHTML = `<h2 class="wrapper-container collection-name">This collection does not exist!</h2>`;
    searchBtn.innerHTML = `<i class="fa-solid fa-xmark fa-lg"></i>`;
}

function restoreCollectionsList(event) {
    searchBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>`;
    //unhide cards and pagination
    cardsContainer.style.display = 'grid';
    paginationSection.style.display = 'flex';

    //empty single collection details
    singleCollectionContainer.innerHTML = '';

    //clear input field
    searchInput.value = '';

}

function addFavouriteCollectionToDb(col) {
    const { banner_image_url, slug, name, image_url, description, external_url } = col;
    const doesColExist = favCols.some(col => col.slug === slug);

    //ONLY post collection to db if it does not exist in db
    if (doesColExist !== true) {
        const favCol = {
            slug,
            name,
            banner_image_url: banner_image_url === null ? "./images/banner_image_default.jpg" : banner_image_url,
            image_url: image_url === null ? "./images/image_default.jpg" : image_url,
            description: description === null ? "This collection does not have a description" : description,
            external_url: external_url === null ? "https://opensea.io/" : external_url
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

    getFavouriteCollectionsFromDb();
}


function deleteFavouriteCollectionFromDb(col) {
    const { slug } = col;
    const colToBeDeleted = favCols.find(col => col.slug === slug);
    deleteCollection(colToBeDeleted.id);
}

function deleteCollection(id) {
    fetch(` http://localhost:3000/collections/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => console.log(data))

    getFavouriteCollectionsFromDb();

}

//GET all the favourites from db
function getFavouriteCollectionsFromDb() {
    fetch('http://localhost:3000/collections')
        .then(res => res.json())
        .then(data => {
            favCols = data;
            console.log(favCols); 
        })

}

function showFavouriteCollections() {
    const inputCheckbox = document.getElementById("saved");
    inputCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            //hide cards and pagination
            cardsContainer.style.display = 'none';
            paginationSection.style.display = 'none';
            singleCollectionContainer.style.display = 'none';

            //render favourite collections
            favCols.forEach(favCol => renderFavouriteCollection(favCol));
        }
        else {
            //unhide cards and pagination
            cardsContainer.style.display = 'grid';
            paginationSection.style.display = 'flex';
            singleCollectionContainer.style.display = 'block';
            favouriteCollectionContainer.innerHTML = '';
        }
    })
}

function renderFavouriteCollection(favCol) {
    const { banner_image_url, image_url, description, name, external_url } = favCol;
    favouriteCollectionContainer.innerHTML += `
    <div class="image-container">
    <img class="banner-img-single" src=${banner_image_url} alt="collection banner image">
    <img class="collection-img" src=${image_url} alt="collection image">
</div>
<div class="text-container-single wrapper-container">
    <h2 class="collection-name">${name}</h2>
    <a class="link" href=${external_url} target="_blank">Go to collection</a>
    <p class="description">${description}</p>`
}