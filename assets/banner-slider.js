(() => {
  const playVideo = (slider) => {
    if (slider.swiper) {
      const sliderSwiper = slider.swiper;
      
      if (sliderSwiper.slides[sliderSwiper.previousIndex]) {
        const videoPrev = sliderSwiper.slides[
          sliderSwiper.previousIndex
        ].querySelector(".slideshow__video video");
        if (videoPrev) {
          videoPrev.pause();
        }
      }

      if (sliderSwiper.slides[sliderSwiper.activeIndex]) {
        const videoActive = sliderSwiper.slides[
          sliderSwiper.activeIndex
        ].querySelector(".slideshow__video video");
        if (videoActive) {
          videoActive.play();
        }
      }
    }
  };

  const stopVideo = (slider) => {
    if (slider.swiper) {
      const sliderSwiper = slider.swiper;

      if (sliderSwiper.slides[sliderSwiper.activeIndex]) {
        const videoActive = sliderSwiper.slides[
          sliderSwiper.activeIndex
        ].querySelector(".slideshow__video video");
        if (videoActive) {
          videoActive.pause();
        }
      }
    }
  };

  const initSlider = (section) => {
    if (!section || !section?.classList.contains("section-banner-slider")) return;
    
    const slider = section.querySelector('.banner-slider__slider')

    const swiperParams = {
      spaceBetween: 8,
      speed: 700,
      autoHeight: false,
      allowTouchMove: true,
      watchSlidesProgress: true,
      preventInteractionOnTransition: true,
      mousewheel: {
        forceToAxis: true,
      },
    };

    const changeColorScheme = (swiper) => {
      const activeIndex = swiper.activeIndex;
      const activeSlide = swiper.slides[activeIndex];
      const colorScheme = activeSlide.dataset.colorScheme;

      const changeItems = [
        swiper.navigation.nextEl,
        swiper.navigation.prevEl,
        swiper.pagination.el
      ];

      changeItems.forEach((item) => {
        if (item) {
          let classNames = item.getAttribute("class");
          classNames = classNames.replace(/color-background-\d+/g, "");
          item.setAttribute("class", classNames);
          item.classList.add(colorScheme);
        }
      });
    };

    if (slider.getAttribute("data-autoplay") === "true") {
      swiperParams.autoplay = {
        delay: Number(section.querySelector('.banner-slider__slider').dataset.duration),
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      };
      swiperParams.on = {
        autoplayTimeLeft(s, time, progress) {
          if (isNaN(progress)) {
            return;
          }

          const invertedProgress = 1 - progress;
          const activeBullet = section.querySelector(
            ".swiper-pagination-bullet-active"
          );

          if (activeBullet) {
            activeBullet.style.setProperty(
              "--width-bg",
              `${invertedProgress * 100}%`
            );
          }
        }
      }
    }
    
    if (slider.getAttribute("data-loop") === "true") {
      swiperParams.loop = true;
      swiperParams.loopPreventsSliding = false;
    }

    if (slider.getAttribute("data-pagination") === "true") {
      const paginationEl = slider.querySelector(".swiper-pagination");

      swiperParams.pagination = {
        el: paginationEl,
        type: "bullets",
        clickable: true,
      };
    }

    if (slider.getAttribute("data-navigation") === "true") {
      const prevBtn = slider.querySelector(".banner-slider__navigation-button-prev");
      const nextBtn = slider.querySelector(".banner-slider__navigation-button-next");

      swiperParams.navigation = {
        nextEl: nextBtn,
        prevEl: prevBtn,
      };
    }

    const swiperSlider = new Swiper(slider, swiperParams);

    changeColorScheme(swiperSlider);
    swiperSlider.on("slideChange", function () {
      changeColorScheme(swiperSlider);
      playVideo(swiperSlider);

      if (slider.getAttribute("data-autoplay") === "true") {
        const bullets = section.querySelectorAll('.swiper-pagination-bullet');
        bullets.forEach((bullet) => {
          bullet.style.setProperty('--width-bg', '0%'); 
        });
      }
    });
  }

  const initSection = (section) => {
    if (!section || !section?.classList.contains("section-banner-slider")) return;
    
    const slider = section.querySelector(".banner-slider__slider");

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (slider) {
            playVideo(slider);
          }
        } else {
          if (slider) {
            stopVideo(slider);
          }
        }
      });
    });

    sectionObserver.observe(section);

    initSlider(section);
  };

  initSection(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initSection(event.target);
  });
})();