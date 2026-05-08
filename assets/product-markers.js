(function () {
  const initProductMarkers = (section) => {
    if (!section || !section?.classList.contains("product-markers-section")) {
      return;
    }

    const allMarkers = section.querySelectorAll(".product-markers__item");
    const edgePadding = 72;
    const extraOffset = 5;

    const calcNewCoord = (marker) => {
      const card = marker.closest(".product-markers__product");
      const cardInner = marker.querySelector(".product-markers__item-inner");

      const cardRect = card.getBoundingClientRect();
      const cardInnerRect = cardInner.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      const leftMarker = markerRect.left - cardRect.left;

      if (leftMarker < edgePadding) {
        cardInner.style.left = -1 * leftMarker + extraOffset + "px";
      } else if (
        leftMarker - edgePadding + cardInnerRect.width >
        cardRect.width
      ) {
        cardInner.style.left =
          -1 *
            (cardInnerRect.width -
              (cardRect.width - leftMarker + edgePadding) +
              edgePadding +
              extraOffset) +
          "px";
      } else {
        cardInner.style.left = "";
      }
    };

    allMarkers.forEach((marker) => {
      calcNewCoord(marker);

      if (marker.dataset.handlerAdded === "true") return;

      marker.dataset.handlerAdded = "true";

      marker.addEventListener("focusin", () => {
        marker.classList.add("active");
      });

      marker.addEventListener("focusout", (e) => {
        if (marker.contains(e.relatedTarget)) return;

        marker.classList.remove("active");
      });

      marker.addEventListener("keydown", (e) => {
        if (e.key === "Escape") marker.classList.remove("active");
      });
    });

    document.addEventListener("pointerdown", (e) => {
      const clickMarker = e.target.closest(".product-markers__item");

      allMarkers.forEach((marker) => {
        if (marker !== clickMarker) {
          marker.classList.remove("active");
        }
      });
    });

    const sectionResizeObserver = new ResizeObserver(() => {
      allMarkers.forEach((marker) => {
        calcNewCoord(marker);
      });
    });

    sectionResizeObserver.observe(section);
  };

  initProductMarkers(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initProductMarkers(event.target);
  });
})();
