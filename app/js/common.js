(function () {
  const menuButton = document.querySelector(".header-page__hamburger");
  const mobileOpen = document.querySelector(".header-page__content");
  const navOverlay = document.querySelector(".nav-overlay");
  const closeBtn = document.getElementById("close-btn");
  const topMenuItem = document.querySelectorAll(".top-menu__item");

  menuButton.onclick = function () {
    mobileOpen.classList.add("open");
    navOverlay.style = "display: block";
  };
  navOverlay.onclick = function () {
    mobileOpen.classList.remove("open");
    navOverlay.style = "display: none";
  };
  closeBtn.onclick = function () {
    mobileOpen.classList.remove("open");
    navOverlay.style = "display: none";
  };

  topMenuItem.forEach(function (item) {
    item.addEventListener("click", function () {
      topMenuItem.forEach(function (item) {
        item.classList.remove("active")
      });
      item.classList.add("active")
    });
  });
})();

  // Swiper slider

  ( function () {
    let swiper = new Swiper(".swiper", {
      loop: true,
      slidesPerView: "auto",
      centeredSlides: false,
      spaceBetween: 30,
      grabCursor: true,
      breakpoints: {
        1200: {
          slidesPerView: 6,
          slidesPerGroup: 6,
        },
        769: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
      },
      scrollbar: {
        el: ".swiper-scrollbar",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }
)();

(function () {
  var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    slidesPerView: 1,
    slidesPerGroup: 1,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
  });
})();

$(document).ready(function () {
  $(".nav-tabs a").click(function () {
    $(this).tab("show");
  });
  $(".nav-tabs a").on("shown.bs.tab", function (event) {
    var x = $(event.target).text(); // active tab
    var y = $(event.relatedTarget).text(); // previous tab
    $(".act span").text(x);
    $(".prev span").text(y);
  });
});
