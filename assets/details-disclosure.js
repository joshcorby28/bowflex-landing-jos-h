class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector("details");
    this.detailsType = this.dataset.detailsType;
    this.closestOverlay = this.closest(".header-row").querySelector(
      ".header-row__overlay"
    );

    document.addEventListener("keyup", this.onKeyUp.bind(this));
    document.addEventListener("click", this.onFocusOut.bind(this));

    this.mainDetailsToggle?.addEventListener(
      "toggle",
      this.onToggle.bind(this)
    );
  }

  onKeyUp(event) {
    if (event.code === "Escape") {
      this.close();
    }
  }

  onFocusOut(e) {
    const withBoundaries = e.composedPath().includes(this.mainDetailsToggle);

    if (!withBoundaries) {
      this.close();
    }
  }

  onToggle() {
    if (this.mainDetailsToggle.open) {
      this.closestOverlay?.classList.add(
        `opened-by-details-${this.detailsType}`
      );
      this.preventScroll();
    } else {
      this.closestOverlay?.classList.remove(
        `opened-by-details-${this.detailsType}`
      );
      this.allowScroll();
    }
  }

  preventScroll() {
    document.body.classList.add(`opened-details-${this.detailsType}`);
  }

  allowScroll() {
    document.body.classList.remove(`opened-details-${this.detailsType}`);
  }

  close() {
    this.mainDetailsToggle?.removeAttribute("open");
    this.closestOverlay?.classList.remove(
      `opened-by-details-${this.detailsType}`
    );
    this.allowScroll();
  }
}

customElements.define("details-disclosure", DetailsDisclosure);
