(function () {
  const isRTL = document.documentElement.dir === "rtl";

  const getDistanceToNext = (element, nextElement) => {
    if (element && nextElement) {
      return nextElement.getBoundingClientRect().left - element.getBoundingClientRect().right;
    }
  };

  const getDistanceToPrev = (element, prevElement) => {
    if (element && prevElement) {
      return prevElement.getBoundingClientRect().right - element.getBoundingClientRect().left;
    }
  };

  const getDistanceToNextRTL = (element, nextElement) => {
    if (element && nextElement) {
      return nextElement.getBoundingClientRect().right - element.getBoundingClientRect().left;
    }
  };

  const getDistanceToPrevRTL = (element, prevElement) => {
    if (element && prevElement) {
      return prevElement.getBoundingClientRect().left - element.getBoundingClientRect().right;
    }
  };

  const footer = () => {
    const footerSections = document.querySelectorAll(".footer");

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.contentRect.width >= 1200) {
          const blockLogo = entry.target.querySelector(".footer-block--logo");
          const blockSubscribe = entry.target.querySelector(".footer-subscribe-block");
          const blocks = entry.target.querySelector('.footer-blocks').querySelectorAll('.footer-block');
          
          const calculatePaddingStart = (element) => {
            if (!element) return;

            const isFirst = isRTL ? element === blocks[blocks.length - 1] : element === blocks[0];
            const hasAdjacent = isRTL
              ? element.nextElementSibling?.nextElementSibling?.classList.contains("footer-menu-block")
              : element.previousElementSibling?.classList.contains("footer-menu-block");

            const distance = isRTL
              ? getDistanceToNextRTL(element, element.nextElementSibling?.nextElementSibling)
              : getDistanceToPrev(element, element.previousElementSibling);

            if (hasAdjacent) {
              const halfDistance = distance / 2;
              const varName = "--border-left-distance";
              element.style.setProperty(varName, `${halfDistance}px`);
            } else {
              const varName = "--border-left-distance";
              const marginProp = isRTL ? "marginRight" : "marginLeft"; 
              element.style.setProperty(varName, `-12px`);
              //element.style[marginProp] = 0;

              if (!isFirst) {
                if (entry.contentRect.width >= 1600) {
                  element.style.setProperty(varName, `-56px`);
                } else if (entry.contentRect.width >= 1360) {
                  element.style.setProperty(varName, `-32px`);
                }
              }
            }

            if (element && (!blockLogo || !blockSubscribe)) {
              const varName = "--border-left-distance";
              const marginProp = isRTL ? "marginRight" : "marginLeft"; 
              element.style.setProperty(varName, `-12px`);
              element.style[marginProp] = 0;

              if (!isFirst) {
                if (entry.contentRect.width >= 1600) {
                  element.style.setProperty(varName, `-56px`);
                } else if (entry.contentRect.width >= 1360) {
                  element.style.setProperty(varName, `-32px`);
                }
              }
            }
          };

          const calculatePaddingEnd = (element) => {
            if (!element) return;

            const isLast = isRTL ?  element === blocks[0] : element === blocks[blocks.length - 1];
            const hasAdjacent = isRTL
              ? element.previousElementSibling?.classList.contains("footer-menu-block")
              : element.nextElementSibling?.nextElementSibling?.classList.contains("footer-menu-block");

            const distance = isRTL
              ? getDistanceToPrevRTL(element, element.previousElementSibling)
              : getDistanceToNext(element, element.nextElementSibling?.nextElementSibling);

            if (hasAdjacent) {
              const halfDistance = (-1 / 2) * distance;
              const varName = "--border-right-distance";
              element.style.setProperty(varName, `${halfDistance}px`);
            } else {
              const varName = "--border-right-distance"; 
              const marginProp = isRTL ? "marginLeft" : "marginRight"; 
              element.style.setProperty(varName, `-12px`);
              //element.style[marginProp] = 0;

              if (!isLast) {
                if (entry.contentRect.width >= 1600) {
                  element.style.setProperty(varName, `-56px`);
                } else if (entry.contentRect.width >= 1360) {
                  element.style.setProperty(varName, `-32px`);
                }
              }
            }

            if (element && (!blockLogo || !blockSubscribe)) {
              const varName = "--border-right-distance"; 
              const marginProp = isRTL ? "marginLeft" : "marginRight"; 
              element.style.setProperty(varName, `-12px`);
              //element.style[marginProp] = 0;

              if (!isLast) {
                if (entry.contentRect.width >= 1600) {
                  element.style.setProperty(varName, `-56px`);
                } else if (entry.contentRect.width >= 1360) {
                  element.style.setProperty(varName, `-32px`);
                }
              }
            }
          };

          [blockLogo, blockSubscribe].forEach((el) => {
            calculatePaddingStart(el);
            calculatePaddingEnd(el);
          });
        }
      });
    });

    footerSections.forEach((section) => {
      resizeObserver.observe(section);
    });
  };

  footer();
  document.addEventListener("shopify:section:load", footer);
})();
