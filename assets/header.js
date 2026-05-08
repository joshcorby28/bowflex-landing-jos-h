(function () {
  const initSubmenusOverlay = (header) => {
    const submenuLinks = header.querySelectorAll(
      ".list-menu--submenu .header-inline-menu__item-link, .list-menu--megamenu-cards .header-inline-menu__item-link, .list-menu--megamenu-tabs .header-inline-menu__item-link"
    );

    if (!submenuLinks || !submenuLinks.length) return;

    const menuRow = header.querySelector(".header-row--menu");
    const overlay = submenuLinks[0]
      .closest(".header-row")
      .querySelector(".header-row__overlay");

    const handleMouseEnter = (link) => {
      if (!link.closest(".list-menu--megamenu-cards")) {
        menuRow?.classList.add("header-row--menu--active");
      }
      overlay.classList.add("opened-by-menu");
      link.classList.add("header-inline-menu__item-link--active");
      //document.body.style.overflow = "hidden";
      //document.body.style.paddingRight = `var(--scrollbar-width)`;
    };

    const handleMouseLeave = (link) => {
      menuRow?.classList.remove("header-row--menu--active");
      overlay.classList.remove("opened-by-menu");
      link.classList.remove("header-inline-menu__item-link--active");
      //document.body.style.overflow = "";
      //document.body.style.paddingRight = "";
    };

    submenuLinks.forEach((link) => {
      const linkParentItem = link.closest(".header-inline-menu__item");

      link.addEventListener("mouseenter", () => handleMouseEnter(link));
      linkParentItem.addEventListener("mouseleave", () =>
        handleMouseLeave(link)
      );
    });
  };

  const initRegionSelectors = (header) => {
    const regionSelectors = header.querySelectorAll(
      "#header-language-region-modal, #menu-drawer-localization"
    );

    if (!regionSelectors || !regionSelectors.length > 0) return;

    regionSelectors.forEach((regionSelector) => {
      const buttons = regionSelector.querySelectorAll(".header-region-button");
      const tabs = regionSelector.querySelectorAll(".header-region-tab");

      if (buttons.length < 2 || tabs.length < 2) return;

      const handleClick = (e) => {
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });

        buttons.forEach((button) => {
          button.classList.remove("active");
        });

        const tabId = e.currentTarget.dataset.tab;
        const tab = regionSelector.querySelector(`#${tabId}`);

        tab.classList.add("active");
        e.currentTarget.classList.add("active");
      };

      buttons.forEach((button) => {
        button.addEventListener("click", handleClick);
      });
    });
  };

  const initShopMegaMenu = (header) => {
    const megaMenuRoot = header.querySelector("#header-mega-menu-root");
    const megaMenuTemplate = document.querySelector("#mega-menu-template");

    if (!megaMenuRoot || !megaMenuTemplate) return;

    const megaMenu = megaMenuTemplate.content.firstElementChild.cloneNode(true);

    if (!megaMenu) return;

    const oldMegaMenus = megaMenuRoot.querySelectorAll("mega-menu");

    oldMegaMenus.forEach((oldMegaMenu) => {
      oldMegaMenu.closestOverlay?.classList.remove(`opened-by-mega-menu`);
      oldMegaMenu.remove();
    });

    const megaMenuBtn = megaMenuRoot.querySelector("#mega-menu-btn");

    if (megaMenuBtn && megaMenuBtn.parentNode) {
      megaMenuBtn.parentNode.insertBefore(megaMenu, megaMenuBtn.nextSibling);
    } else {
      megaMenuRoot.appendChild(megaMenu);
    }
  };

  const checkShopAllButton = (header) => {
    const shopAllBtn = header.querySelector(".header-shop-all-button");

    if (
      shopAllBtn &&
      shopAllBtn.tagName === "BUTTON" &&
      !header.querySelector("mega-menu")
    ) {
      const replaceLink = document.createElement("a");

      if (!shopAllBtn.dataset.buttonLink) {
        replaceLink.ariaDisabled = true;
      } else {
        replaceLink.href = shopAllBtn.dataset.buttonLink;
        if (shopAllBtn.querySelector(".button__label")) {
          replaceLink.ariaLabel =
            shopAllBtn.querySelector(".button__label").textContent;
        }
      }
      replaceLink.classList = shopAllBtn.classList;
      replaceLink.innerHTML = shopAllBtn.innerHTML;

      shopAllBtn.replaceWith(replaceLink);
    }
  };

  const initAnimationMegaMenuCards = (header) => {
    const megaMenuCards = header.querySelectorAll(".list-menu--megamenu-cards");

    megaMenuCards.forEach((menuItem) => {
      const cards = menuItem.querySelectorAll(".mega-menu-cards__item");

      cards.forEach((card) => {
        card.addEventListener("mouseenter", (e) => {
          cards.forEach((el) => {
            el.classList.add("mega-menu-cards__item--inactive");
          });
          card.classList.remove("mega-menu-cards__item--inactive");
        });

        card.addEventListener("mouseleave", (e) => {
          cards.forEach((el) => {
            el.classList.remove("mega-menu-cards__item--inactive");
          });
        });
      });
    });
  };

  const initAnimationMegaMenuTabs = (header) => {
    const megaMenuTabs = header.querySelectorAll(".list-menu--megamenu-tabs");

    megaMenuTabs.forEach((menuItem) => {
      const tabButtons = menuItem.querySelectorAll(".mega-menu-nav-list__tab");
      const tabSubmenus = menuItem.querySelectorAll(
        ".mega-menu-tab__nav-container"
      );

      const onTabClick = (e) => {
        const tabId = e.currentTarget.dataset.tabId;

        tabButtons.forEach((button) => {
          button.classList.remove("active");
        });

        tabSubmenus.forEach((submenu) => {
          submenu.classList.remove("active");
          const submenuId = submenu.id;
          if (submenuId === tabId) {
            submenu.classList.add("active");
          }
        });

        e.currentTarget.classList.add("active");
      };

      tabButtons.forEach((tabBtn) => {
        tabBtn.addEventListener("click", onTabClick);
        tabBtn.addEventListener("focus", onTabClick);
        tabBtn.addEventListener("mouseenter", onTabClick);
      });
    });
  };

  // calc variables and checks with resize observer
  const initObserver = (header) => {
    const calcMobileSearchBarHeight = () => {
      const mobileSearchBar =
        header.querySelector(".header-shop-all-search-wrapper") ||
        header.querySelector(".header-shop-all-menu-search-wrapper");
      const mobileSearchBarHeight =
        mobileSearchBar.getBoundingClientRect().height;
      header.style.setProperty(
        "--mobile-search-bar-height",
        `${mobileSearchBarHeight}px`
      );
    };

    const calcTabletMediumRowHeight = () => {
      if (
        header
          .querySelector(".header")
          .classList.contains("header--layout-medium")
      ) {
        header.style.setProperty(
          "--search-row-height",
          `${
            header.querySelector(".header-row--medium-secondary")?.offsetHeight
          }px`
        );
      }
    };

    const calcSearchModalTop = () => {
      const predictiveSearchContainer =
        header.querySelector(".predictive-search");

      if (!predictiveSearchContainer) return;

      const modalTop = predictiveSearchContainer.getBoundingClientRect().top;

      predictiveSearchContainer.style.setProperty(
        "--search-modal-top",
        `${modalTop}px`
      );
    };

    const checkInlineSubmenus = () => {
      const inlineMenu = header.querySelector(".header-inline-menu");

      if (!inlineMenu) return;
      const headerRect = header.getBoundingClientRect();

      const itemsWithSubmenu = inlineMenu.querySelectorAll(
        ".list-menu--submenu"
      );
      itemsWithSubmenu.forEach((item) => {
        const firstSubmenu = item.querySelector(".header-submenu");
        if (!firstSubmenu) return;
        firstSubmenu.style.removeProperty("left");
        const firstSubmenuRect = firstSubmenu.getBoundingClientRect();
        if (firstSubmenuRect.right > headerRect.right) {
          const difWidth = headerRect.right - firstSubmenuRect.right;
          firstSubmenu.style.left = `${difWidth}px`;
        }

        const secondSubmenus = firstSubmenu.querySelectorAll(".header-submenu");
        secondSubmenus.forEach((secondSubmenu) => {
          secondSubmenu.style.removeProperty("left");
          secondSubmenu.style.removeProperty("transform");
          firstSubmenu.classList.remove("header-submenu--arrow-left");
          const secondSubmenuRect = secondSubmenu.getBoundingClientRect();
          if (secondSubmenuRect.right > headerRect.right) {
            secondSubmenu.style.left = `-100%`;
            secondSubmenu.style.transform = `translate(-2px)`;
            firstSubmenu.classList.add("header-submenu--arrow-left");
          }
        });
      });
    };

    const checkMegaMenuCardsPosition = () => {
      const isMediumHeaderType = Boolean(
        header.querySelector(".header--layout-medium")
      );
      const isSmallHeaderType = Boolean(
        header.querySelector(".header--layout-small")
      );
      const headerWrapper =
        isMediumHeaderType && header.querySelector(".header-row--medium-main")
          ? header.querySelector(".header-row--medium-main")
          : header;
      const megaMenuCards = header.querySelectorAll(".mega-menu--cards");
      const headerRect = headerWrapper.getBoundingClientRect();

      megaMenuCards.forEach((block) => {
        const parentLi = block.closest("li.header-inline-menu__item");
        block.style.removeProperty("top");
        const parentLiRect = parentLi.getBoundingClientRect();
        if (headerRect.bottom - parentLiRect.bottom > 16) {
          block.style.top = `calc(100% - ${
            headerRect.bottom - parentLiRect.bottom
          }px + 16px)`;
        }

        if (isSmallHeaderType) {
          block.style.removeProperty("left");
          const blockRect = block.getBoundingClientRect();
          const diffLeft = headerRect.left - blockRect.left;

          block.style.left = `${diffLeft}px`;
        }
      });
    };

    const checkMegaMenuTabsPosition = () => {
      const megaMenuTabs = header.querySelectorAll(".mega-menu--tabs");
      const headerRect = header.getBoundingClientRect();

      megaMenuTabs.forEach((block) => {
        block.style.removeProperty("left");
        const blockRect = block.getBoundingClientRect();
        if (blockRect.right > headerRect.right) {
          const difWidth = headerRect.right - blockRect.right - 16;
          block.style.left = `${difWidth}px`;
        }
      });
    };

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        calcMobileSearchBarHeight();
        calcTabletMediumRowHeight();
        calcSearchModalTop();
        checkInlineSubmenus();
        checkMegaMenuCardsPosition();
        checkMegaMenuTabsPosition();
      });
    });

    observer.observe(header);
  };

  const initHeader = () => {
    const header = document.querySelector(".shopify-section-header");
    if (!header) return;

    initShopMegaMenu(header);
    initRegionSelectors(header);
    initSubmenusOverlay(header);
    checkShopAllButton(header);
    initAnimationMegaMenuCards(header);
    initAnimationMegaMenuTabs(header);
    initObserver(header);
  };

  initHeader();

  document.addEventListener("shopify:section:load", initHeader);
  document.addEventListener("shopify:section:unload", initHeader);
  document.addEventListener("shopify:section:reorder", initHeader);
})();

// HEADER SEARCH COMPONENT
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class HeaderSearch extends HTMLElement {
  constructor() {
    super();

    this.header = document.querySelector(".header-wrapper");
    this.searchInput = this.querySelector("#Search-In-Header");
    this.overlayEl = this.closest(".header-row").querySelector(
      ".header-row__overlay"
    );
    this.predictiveSearchContainer = this.querySelector(".predictive-search");
    this.closeBtn = this.querySelector(".header-search__close-btn");

    this.isOpen = false;

    this.open = this.onOpen.bind(this);
    this.close = this.onClose.bind(this);
    this.focusOut = this.onFocusOut.bind(this);
    this.handleKeyUp = this.onKeyUp.bind(this);

    this.searchInput?.addEventListener("focus", (e) => {
      this.open(e);

      document.querySelectorAll("mega-menu").forEach((menu) => {
        if (typeof menu.close === "function") {
          menu.close();
        }
      });

      document.querySelectorAll("details-disclosure").forEach((disclosure) => {
        if (typeof disclosure.close === "function") {
          disclosure.close();
        }
      });
    });

    this.header?.addEventListener("keydown", this.handleKeyDown);

    this.closeBtn?.addEventListener("click", () => {
      this.close();
    });

    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("click", this.focusOut);
    this.addEventListener("focusout", this.focusOut);
  }

  onOpen(event) {
    event.preventDefault();

    if (this.header) this.header.preventHide = true;

    this.setAttribute("open", true);
    this.isOpen = true;
    this.overlayEl?.classList.add("opened-by-search");
    this.preventScroll();
  }

  onClose() {
    this.removeAttribute("open");

    if (this.header && this.isOpen) {
      this.header.preventHide = false;
    }

    this.isOpen = false;

    removeTrapFocus();
    this.overlayEl?.classList.remove("opened-by-search");
    this.allowScroll();
  }

  onFocus() {
    this.searchInput?.focus();
  }

  onFocusOut(e) {
    const withBoundaries = e.composedPath().includes(this);

    if (!withBoundaries) {
      this.close();
    }

    if (e.type === "focusout") {
      const target = e.relatedTarget;
      if (target && !target.closest("header-search")) {
        this.close();
      }
    }
  }

  onKeyUp(event) {
    if (event.code === "Escape") {
      this.close();
    }
  }

  preventScroll() {
    document.body.classList.add("opened-search");
  }

  allowScroll() {
    document.body.classList.remove("opened-search");
  }

  disconnectedCallback() {
    this.header.removeEventListener("keydown", this.handleKeyDown);
  }
}

if (!customElements.get("header-search")) {
  customElements.define("header-search", HeaderSearch);
}

// MEGA MENU COMPONENT
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class MegaMenu extends HTMLElement {
  constructor() {
    super();

    this.tabs = {};
    this.tabButtons = [];
    this.isOpen = false;
    this.button = document.querySelector("#mega-menu-btn");
    this.banner = this.querySelector(".mega-menu-banner");
    this.closestOverlay = this.closest(".header-row").querySelector(
      ".header-row__overlay"
    );
    this.promoCode = this.querySelector(".promo-code");
    this.calcModalTop = this.calcMegaMenuTop.bind(this);
    this.calcPromoHeight = this.calcPromoCodeHeight.bind(this);

    this.header = document.querySelector(".header-wrapper");
    if (this.header) this.header.preventHide = false;

    this.setListeners();
    this.initTabs();

    this.promoCodeButton = this.querySelector(".promocode-button-copy");

    if (this.promoCodeButton) {
      this.initPromoCodeButtonFocus();
    }
  }

  open() {
    if (this.header) this.header.preventHide = true;

    this.setAttribute("opened", "true");

    this.closestOverlay?.classList.add(`opened-by-mega-menu`);

    this.preventScroll();

    this.isOpen = true;

    this.calcModalTop();

    if (this.promoCode) this.calcPromoHeight();

    // for mobile hamburger icon
    if (window.matchMedia("(max-width: 750px)").matches) {
      const hamburgerIcon = this.header.querySelector(".hamburger-icon");
      const hamburgerSummary = hamburgerIcon?.closest("summary.header__icon");
      if (hamburgerSummary) {
        hamburgerSummary.classList.add("opened-by-mega-menu");

        hamburgerSummary.addEventListener("click", (event) => {
          if (hamburgerSummary.classList.contains("opened-by-mega-menu")) {
            event.preventDefault();
            this.close();
          }
        });
      }
    }
  }

  close() {
    this.removeAttribute("opened");

    this.closestOverlay?.classList.remove(`opened-by-mega-menu`);

    this.allowScroll();

    if (this.header && this.isOpen) this.header.preventHide = false;

    this.isOpen = false;

    // for mobile hamburger icon
    const hamburgerIcon = this.header.querySelector(".hamburger-icon");
    const hamburgerSummary = hamburgerIcon?.closest("summary.header__icon");
    if (hamburgerSummary) {
      hamburgerSummary.classList.remove("opened-by-mega-menu");
    }
  }

  preventScroll() {
    document.body.classList.add(`opened-mega-menu`);
  }

  allowScroll() {
    document.body.classList.remove(`opened-mega-menu`);
  }

  onKeyUp(event) {
    if (event.code === "Escape" && this.isOpen) {
      this.close();
    }
  }

  onFocusOut(e) {
    const withBoundaries =
      e.composedPath().includes(this) || e.composedPath().includes(this.button);

    if (!withBoundaries && this.isOpen) {
      this.close();
    }
  }

  setListeners() {
    this.button?.addEventListener("click", () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });

    document.addEventListener("keyup", this.onKeyUp.bind(this));
    document.addEventListener("click", this.onFocusOut.bind(this));

    // for mobile mega menu
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    );
  }

  initTabs() {
    this.tabButtons = this.querySelectorAll(".mega-menu-nav-list__tab");
    this.tabSubmenus = this.querySelectorAll(".mega-menu-tab__nav-container");

    const tabButtonsArr = Array.from(this.tabButtons);
    const tabSubmenusArr = Array.from(this.tabSubmenus);

    const onTabClick = (e) => {
      const tabId = e.currentTarget.dataset.tabId;

      this.tabButtons.forEach((button) => {
        button.classList.remove("active");
      });

      this.tabSubmenus.forEach((submenu) => {
        submenu.classList.remove("active");
        const submenuId = submenu.id;
        if (submenuId === tabId) {
          submenu.classList.add("active");
        }
      });

      e.currentTarget.classList.add("active");
    };

    this.tabButtons.forEach((tabBtn) => {
      tabBtn.addEventListener("click", onTabClick);
      tabBtn.addEventListener("focus", onTabClick);
      tabBtn.addEventListener("mouseenter", onTabClick);
    });

    this.tabButtons.forEach((btn, idx) => {
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Tab" && !e.shiftKey) {
          e.preventDefault();

          const panel = tabSubmenusArr.find(
            (panel) => panel.id === btn.dataset.tabId
          );

          const first = panel?.querySelector(
            "a, button, input, select, textarea"
          );

          const nextFocus =
            first ||
            this.tabButtons[idx + 1] ||
            this.promoCodeButton ||
            this.button;

          nextFocus.focus();
        }
      });
    });

    const getNextButtonToFocus = (submenuId) => {
      const currentBtn = tabButtonsArr.find(
        (btn) => btn.dataset.tabId === submenuId
      );

      const nextItem = currentBtn?.closest(
        ".mega-menu-nav-list__item"
      )?.nextElementSibling;

      const nextTab = nextItem?.querySelector(".mega-menu-nav-list__tab");

      return nextTab || this.promoCodeButton || this.button;
    };

    this.tabSubmenus.forEach((panel, idx) => {
      const focusables = Array.from(
        panel.querySelectorAll(
          "a:not([aria-disabled]), button:not([aria-disabled]), input, select, textarea"
        )
      ).filter((el) => !el.disabled);

      if (!focusables.length) return;

      const last = focusables[focusables.length - 1];

      last.addEventListener("keydown", (e) => {
        if (e.key === "Tab" && !e.shiftKey) {
          e.preventDefault();

          const nextBtn = getNextButtonToFocus(panel.id);

          if (this.banner) {
            this.bannerFocus(nextBtn);
          } else {
            nextBtn.focus();
          }
        }
      });
    });
  }

  bannerFocus(nextBtn) {
    const focusables = Array.from(
      this.banner.querySelectorAll(
        "a:not([aria-disabled]), button:not([aria-disabled]), input, select, textarea"
      )
    ).filter((el) => !el.disabled);

    if (!focusables.length) {
      nextBtn.focus();
      return;
    }

    focusables[0].focus();

    const last = focusables[focusables.length - 1];

    last.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();

        nextBtn.focus();
      }
    });
  }

  initPromoCodeButtonFocus() {
    this.promoCodeButton.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();

        this.button.focus();
      }
    });
  }

  calcMegaMenuTop() {
    const clientY = this.getBoundingClientRect().top;

    this.style.setProperty("--mega-menu-top", `${clientY}px`);
  }

  calcPromoCodeHeight() {
    const promoCodeHeight = this.promoCode.offsetHeight;

    this.style.setProperty("--promo-code-height", `${promoCodeHeight}px`);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.closest("details");
    const isOpen = detailsElement.hasAttribute("open");

    if (isOpen) {
      detailsElement.classList.remove("menu-opening");
      return;
    }

    setTimeout(() => {
      detailsElement.classList.add("menu-opening");
    });
  }
}

if (!customElements.get("mega-menu")) {
  customElements.define("mega-menu", MegaMenu);
}
