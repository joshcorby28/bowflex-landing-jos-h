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
    if (!section || !section?.classList.contains("section-slideshow")) return;

    const box = section.querySelector(".slideshow");

    if (box) {
      const swiperParams = {
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
      

      if (box.getAttribute("data-autoplay") === "true") {
        swiperParams.autoplay = {
          delay: Number(section.querySelector('.slideshow').dataset.duration),
          disableOnInteraction: false,
          pauseOnMouseEnter: box.getAttribute("data-pause-autoplay-hover") === "true",
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

      if (box.getAttribute("data-loop") === "true") {
        swiperParams.loop = true;
        //swiperParams.loopPreventsSliding = false;
      }

      if (box.getAttribute("data-pagination") === "true") {
        const paginationEl = box.querySelector(".swiper-pagination");

        swiperParams.pagination = {
          el: paginationEl,
          type: "bullets",
          clickable: true,
        };
      }

      if (box.getAttribute("data-navigation") === "true") {
        const prevBtn = box.querySelector(".slideshow__navigation-button-prev");
        const nextBtn = box.querySelector(".slideshow__navigation-button-next");

        swiperParams.navigation = {
          nextEl: nextBtn,
          prevEl: prevBtn,
        };
      }

      if (box.getAttribute("data-parallax") === "true") {
        swiperParams.parallax = true;
      }

      if (box.getAttribute("data-animation-type") === "fade") {
        swiperParams.effect = "fade";
      } else {
        swiperParams.effect = "slide";
      }

      swiperParams.breakpoints = {
        990: {
          spaceBetween: 8,
        },
      };
      

      const sliderOverlay = box.querySelector(".slideshow__swiper--overlay");

      if (sliderOverlay) {
        const swiperOverlay = new Swiper(sliderOverlay, swiperParams);

        changeColorScheme(swiperOverlay);
        swiperOverlay.on("slideChange", function () {
          changeColorScheme(swiperOverlay);
          playVideo(sliderOverlay);

          if (box.getAttribute("data-autoplay") === "true") {
            const bullets = section.querySelectorAll('.swiper-pagination-bullet');
            bullets.forEach((bullet) => {
              bullet.style.setProperty('--width-bg', '0%'); 
            });
          }
        });

        if (box.getAttribute("data-pagination") === "true" || box.getAttribute("data-navigation") === "true") {
          if (sliderOverlay.querySelector('.slideshow__controls-wrapper')) {
            const widthControls = sliderOverlay.querySelector('.slideshow__controls-wrapper').offsetWidth + 'px';
            section.querySelector('.slideshow--with-controls').style.setProperty('--width-controls', `${widthControls}`);
          }
        }
      }
      
    }
  };

  const initSection = (section) => {
    if (!section || !section?.classList.contains("section-slideshow")) return;

    const slider = section.querySelector(".slideshow__swiper");

    if (!slider) return;

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
