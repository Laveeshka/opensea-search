//global variables here
const header = document.getElementById("header");
const sticky = header.offsetTop; //get the top offset position of the header

//listen to scroll event on window
window.addEventListener("scroll", windowScrollHandler);

function windowScrollHandler(e){
    if (window.pageYOffset >= sticky){
        header.classList.add("sticky");
    }
    else {
        header.classList.remove("sticky");
    }
}