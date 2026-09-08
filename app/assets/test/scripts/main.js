(() => {
    'use strict';

    const header = document.querySelector('#site-header');

    const desktopToggles = [...document.querySelectorAll('[data-menu-toggle]')];
    const desktopPanels = [...document.querySelectorAll('[data-menu-panel]')];
    const mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
    const mobileMenu = document.querySelector('#mobile-menu');
    const mobileToggles = [...document.querySelectorAll('[data-mobile-toggle]')];

    // Header state is split between desktop mega-menu panels and the mobile accordion.
    let activeDesktopMenu = null;
    let desktopCloseTimer = null;
    let scrollAnchorY = window.scrollY;
    let scrollFrame = null;
    const scrollThreshold = 10;
    const panelHideTimers = new WeakMap();

    // Delay desktop closing so the pointer can move between a trigger and its panel.
    const cancelScheduledDesktopClose = () => {
        window.clearTimeout(desktopCloseTimer);
        desktopCloseTimer = null;
    };

    const hideDesktopPanel = (panel) => {
        window.clearTimeout(panelHideTimers.get(panel));
        panel.dataset.open = 'false';
        panel.setAttribute('aria-hidden', 'true');
        panel.inert = true;
        panel.classList.remove('is-open');

        const timer = window.setTimeout(() => {
            if (panel.dataset.open === 'false') panel.classList.remove('is-visible');
        }, 200);

        panelHideTimers.set(panel, timer);
    };

    const showDesktopPanel = (panel) => {
        window.clearTimeout(panelHideTimers.get(panel));
        panel.dataset.open = 'true';
        panel.setAttribute('aria-hidden', 'false');
        panel.inert = false;
        panel.classList.add('is-visible');

        window.requestAnimationFrame(() => {
            if (panel.dataset.open !== 'true') return;
            panel.classList.add('is-open');
        });
    };

    // Keep only one desktop menu active and synchronize its ARIA state with the UI.
    const closeDesktopMenus = () => {
        cancelScheduledDesktopClose();

        desktopToggles.forEach((toggle) => {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.dataset.active = 'false';
        });

        desktopPanels.forEach(hideDesktopPanel);
        activeDesktopMenu = null;
        header.dataset.menuOpen = 'false';
    };

    const openDesktopMenu = (menuId) => {
        if (window.innerWidth < 1024) return;
        cancelScheduledDesktopClose();

        desktopToggles.forEach((toggle) => {
            const isActive = toggle.dataset.menuToggle === menuId;
            toggle.setAttribute('aria-expanded', String(isActive));
            toggle.dataset.active = String(isActive);
        });

        desktopPanels.forEach((panel) => {
            panel.id === menuId ? showDesktopPanel(panel) : hideDesktopPanel(panel);
        });

        activeDesktopMenu = menuId;
        header.dataset.menuOpen = 'true';
        header.classList.remove('-translate-y-full');
    };

    const scheduleDesktopClose = () => {
        if (window.innerWidth < 1024 || !activeDesktopMenu) return;
        cancelScheduledDesktopClose();
        // Allow the pointer to cross the small gap between a link and its panel.
        desktopCloseTimer = window.setTimeout(closeDesktopMenus, 120);
    };

    // Mouse and keyboard interactions use the same desktop menu state transitions.
    desktopToggles.forEach((toggle) => {
        const menuId = toggle.dataset.menuToggle;

        toggle.addEventListener('mouseenter', () => openDesktopMenu(menuId));
        toggle.addEventListener('mouseleave', scheduleDesktopClose);
        toggle.addEventListener('focus', () => openDesktopMenu(menuId));
    });

    desktopPanels.forEach((panel) => {
        panel.addEventListener('mouseenter', () => {
            if (panel.id === activeDesktopMenu) cancelScheduledDesktopClose();
        });
        panel.addEventListener('mouseleave', scheduleDesktopClose);
    });

    header.addEventListener('mouseleave', scheduleDesktopClose);

    header.addEventListener('focusout', () => {
        window.requestAnimationFrame(() => {
            if (window.innerWidth >= 1024 && !header.contains(document.activeElement))
                closeDesktopMenus();
        });
    });

    // Clicking outside the header closes any open desktop or mobile navigation layer.
    document.addEventListener('click', (event) => {
        if (header.contains(event.target)) return;

        closeDesktopMenus();
        if (mobileMenuToggle.getAttribute('aria-expanded') === 'true') closeMobileMenu();
    });

    // Mobile navigation keeps one accordion section open at a time.
    const setMobileAccordion = (toggle, isOpen) => {
        const panel = document.querySelector(`#${toggle.dataset.mobileToggle}`);
        toggle.dataset.open = String(isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        panel.dataset.open = String(isOpen);
        panel.setAttribute('aria-hidden', String(!isOpen));
        panel.inert = !isOpen;
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.inert = true;
        mobileMenuToggle.dataset.open = 'false';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open navigation');
        mobileToggles.forEach((toggle) => setMobileAccordion(toggle, false));
        document.body.classList.remove('overflow-hidden');
    };

    // Lock page scrolling while the mobile navigation overlay is open.
    const openMobileMenu = () => {
        closeDesktopMenus();
        mobileMenu.classList.remove('hidden');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenu.inert = false;
        mobileMenuToggle.dataset.open = 'true';
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', 'Close navigation');
        header.classList.remove('-translate-y-full');
        document.body.classList.add('overflow-hidden');
    };

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        isOpen ? closeMobileMenu() : openMobileMenu();
    });

    mobileToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const wasOpen = toggle.getAttribute('aria-expanded') === 'true';

            mobileToggles.forEach((item) => setMobileAccordion(item, false));

            if (!wasOpen) setMobileAccordion(toggle, true);
        });
    });

    // Hide the header on downward scroll and reveal it on upward scroll.
    // A small threshold prevents flickering on trackpads.
    const updateHeaderOnScroll = () => {
        const currentScrollY = Math.max(window.scrollY, 0);
        const mobileMenuIsOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        const scrollDistance = currentScrollY - scrollAnchorY;

        if (mobileMenuIsOpen || currentScrollY <= 20) {
            header.classList.remove('-translate-y-full');
            scrollAnchorY = currentScrollY;
        } else if (scrollDistance >= scrollThreshold) {
            closeDesktopMenus();
            header.classList.add('-translate-y-full');
            scrollAnchorY = currentScrollY;
        } else if (scrollDistance <= -scrollThreshold) {
            header.classList.remove('-translate-y-full');
            scrollAnchorY = currentScrollY;
        }

        scrollFrame = null;
    };

    window.addEventListener(
        'scroll',
        () => {
            if (scrollFrame !== null) return;
            scrollFrame = window.requestAnimationFrame(updateHeaderOnScroll);
        },
        { passive: true },
    );

    window.addEventListener('resize', () => {
        // Reset the inactive navigation mode when crossing the responsive breakpoint.
        if (window.innerWidth >= 1024) closeMobileMenu();
        if (window.innerWidth < 1024) closeDesktopMenus();
    });

    // Escape closes the active menu and returns focus to its trigger.
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        if (mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
            closeMobileMenu();
            mobileMenuToggle.focus();
            return;
        }

        const activeToggle = desktopToggles.find(
            (toggle) => toggle.dataset.menuToggle === activeDesktopMenu,
        );
        activeToggle?.focus({ preventScroll: true });
        closeDesktopMenus();
    });
})();
