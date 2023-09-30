// toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let body = document.body;

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');

    if (navbar.classList.contains('active')) {
        // Open the navbar with a smooth animation
        navbar.style.maxHeight = navbar.scrollHeight + 'px';
        navbar.style.opacity = 1;
    } else {
        // Close the navbar with a smooth animation
        navbar.style.maxHeight = '0';
        navbar.style.opacity = 0;
    }
};

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navbar.style.maxHeight = ''; 
        navbar.style.opacity = ''; 
    }
});
function closeNavbar() {
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
    navbar.style.maxHeight = '0';
    navbar.style.opacity = '0';
}

body.addEventListener('click', (event) => {
    if (navbar.classList.contains('active') && event.target !== menuIcon && !navbar.contains(event.target)) {
        closeNavbar();
    }
});

 // JavaScript to control video playback
 const video = document.getElementById("myVideo");

 // Add an event listener to restart the video when it ends
 video.addEventListener("ended", function () {
     video.currentTime = 0;
     video.play();
 });
 

 
