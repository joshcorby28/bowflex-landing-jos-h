(function () {
  let postsSwiper;

  const initSlider = (section, slider) => {
    slider.classList.add("swiper");

    const wrapper = slider.querySelector(".blog-posts-grid");

    if (!wrapper) return;

    wrapper.classList.add("swiper-wrapper");

    const slides = slider.querySelectorAll(".blog-posts-card");

    if (!slides || !slides.length) return;

    slides.forEach((slide) => {
      slide.classList.add("swiper-slide");
    });

    const nextBtns = section.querySelectorAll(
      ".blog-posts__navigation-button-next"
    );
    const prevBtns = section.querySelectorAll(
      ".blog-posts__navigation-button-prev"
    );

    const columns = Number(slider.dataset.columns);
    const columnsConfig = {
      4: {
        750: { slidesPerView: 2 },
        1360: { slidesPerView: 4 },
      },
      3: {
        750: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
      2: {
        750: { slidesPerView: 2 },
      },
      1: {
        576: { slidesPerView: 1 },
      },
    };

    postsSwiper = new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 8,
      loop: false,
      speed: 800,
      mousewheel: {
        forceToAxis: true,
      },
      navigation: {
        nextEl: Array.from(nextBtns),
        prevEl: Array.from(prevBtns),
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: columnsConfig[columns],
    });
  };

  const initBlogPosts = (section) => {
    if (!section || !section?.classList.contains("section-blog-posts")) return;

    const slider = section.querySelector(".swiper--blog-posts");

    if (!slider) return;

    initSlider(section, slider);
  };

  initBlogPosts(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (e) {
    initBlogPosts(e.target);
  });
})();
