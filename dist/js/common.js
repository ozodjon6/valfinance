(function () {

    const menuButton = document.querySelector('.header-page__hamburger');
    const mobileOpen = document.querySelector('.header-page__content');
    const navOverlay = document.querySelector('.nav-overlay');

    menuButton.onclick = function () {
        mobileOpen.classList.add('open');
        navOverlay.style = 'display: block';
    };
    navOverlay.onclick = function () {
        mobileOpen.classList.remove('open');
        navOverlay.style = 'display: none';
    }
})();