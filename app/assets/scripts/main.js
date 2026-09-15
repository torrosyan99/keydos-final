(() => {
    const header = document.querySelector('#site-header');

    if (!header) return;

    /* =========================================================
     ELEMENTS
  ========================================================== */

    const mobileMenuButton = header.querySelector('#mobile-menu-button');

    const mobileMenu = header.querySelector('#mobile-menu');

    const mobileToggles = [...header.querySelectorAll('.mobile-menu-toggle')];

    if (!mobileMenuButton || !mobileMenu) return;

    /* =========================================================
     SETTINGS
  ========================================================== */

    const desktopLayout = window.matchMedia('(min-width: 1024px)');

    const pageContent = [...document.querySelectorAll('main, body > footer')];

    /* =========================================================
     SCROLL STATE
  ========================================================== */

    let scrollAnchorY = Math.max(window.scrollY, 0);

    let scrollFrame = null;

    const scrollThreshold = 10;

    /* =========================================================
     MOBILE ACCORDION
  ========================================================== */

    const setMobileAccordion = (toggle, isOpen) => {
        const panel = toggle.nextElementSibling;

        if (!panel?.classList.contains('mobile-menu-item')) {
            return;
        }

        /*
         * Единственный UI state кнопки.
         */
        toggle.setAttribute('aria-expanded', String(isOpen));

        /*
         * Accessibility панели.
         */
        panel.setAttribute('aria-hidden', String(!isOpen));

        panel.inert = !isOpen;
    };

    /* =========================================================
     CLOSE ALL ACCORDIONS
  ========================================================== */

    const closeMobileAccordions = () => {
        mobileToggles.forEach((toggle) => {
            setMobileAccordion(toggle, false);
        });
    };

    /* =========================================================
     CLOSE MOBILE MENU
  ========================================================== */

    const closeMobileMenu = () => {
        mobileMenu.classList.add('hidden');

        mobileMenu.setAttribute('aria-hidden', 'true');

        mobileMenu.inert = true;

        mobileMenuButton.setAttribute('aria-expanded', 'false');

        mobileMenuButton.setAttribute('aria-label', 'Open navigation');

        closeMobileAccordions();

        document.body.classList.remove('overflow-hidden');

        pageContent.forEach((element) => {
            element.inert = false;
        });
    };

    /* =========================================================
     OPEN MOBILE MENU
  ========================================================== */

    const openMobileMenu = () => {
        mobileMenu.classList.remove('hidden');

        mobileMenu.setAttribute('aria-hidden', 'false');

        mobileMenu.inert = false;

        mobileMenuButton.setAttribute('aria-expanded', 'true');

        mobileMenuButton.setAttribute('aria-label', 'Close navigation');

        /*
         * Если header был спрятан scroll-логикой,
         * возвращаем его.
         */
        header.classList.remove('-translate-y-full');

        /*
         * Запрещаем скролл body.
         */
        document.body.classList.add('overflow-hidden');

        /*
         * Контент за открытым mobile menu
         * не должен получать focus.
         */
        pageContent.forEach((element) => {
            element.inert = true;
        });
    };

    /* =========================================================
     BURGER
  ========================================================== */

    mobileMenuButton.addEventListener('click', () => {
        const isOpen =
            mobileMenuButton.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    /* =========================================================
     MOBILE ACCORDION BUTTONS
  ========================================================== */

    mobileToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const wasOpen = toggle.getAttribute('aria-expanded') === 'true';

            /*
             * Сначала закрываем все.
             */
            closeMobileAccordions();

            /*
             * Если текущий был закрыт —
             * открываем его.
             */
            if (!wasOpen) {
                setMobileAccordion(toggle, true);
            }
        });
    });

    /* =========================================================
     CLOSE MOBILE MENU AFTER LINK CLICK
  ========================================================== */

    mobileMenu.addEventListener('click', (event) => {
        if (!event.target.closest('a')) {
            return;
        }

        closeMobileMenu();
    });

    /* =========================================================
     KEEP HEADER VISIBLE ON FOCUS
  ========================================================== */

    header.addEventListener('focusin', () => {
        header.classList.remove('-translate-y-full');
    });

    /* =========================================================
     HEADER SCROLL
  ========================================================== */

    const updateHeaderOnScroll = () => {
        const currentScrollY = Math.max(window.scrollY, 0);

        const mobileMenuIsOpen =
            mobileMenuButton.getAttribute('aria-expanded') === 'true';

        const scrollDistance = currentScrollY - scrollAnchorY;

        /*
         * Всегда показываем header:
         *
         * - наверху страницы
         * - когда mobile menu открыт
         * - когда внутри header находится focus
         */
        if (
            currentScrollY <= 20 ||
            mobileMenuIsOpen ||
            header.contains(document.activeElement)
        ) {
            header.classList.remove('-translate-y-full');

            scrollAnchorY = currentScrollY;
        }

        /*
         * Скроллим вниз.
         */
        else if (scrollDistance >= scrollThreshold) {
            header.classList.add('-translate-y-full');

            scrollAnchorY = currentScrollY;
        }

        /*
         * Скроллим вверх.
         */
        else if (scrollDistance <= -scrollThreshold) {
            header.classList.remove('-translate-y-full');

            scrollAnchorY = currentScrollY;
        }

        scrollFrame = null;
    };

    window.addEventListener(
        'scroll',
        () => {
            if (scrollFrame !== null) {
                return;
            }

            scrollFrame = window.requestAnimationFrame(updateHeaderOnScroll);
        },
        {
            passive: true,
        },
    );

    /* =========================================================
     RESPONSIVE BREAKPOINT
  ========================================================== */

    desktopLayout.addEventListener('change', (event) => {
        /*
         * Перешли на desktop.
         */
        if (event.matches) {
            closeMobileMenu();
        }
    });

    /* =========================================================
     KEYBOARD
  ========================================================== */

    document.addEventListener('keydown', (event) => {
        const mobileIsOpen =
            mobileMenuButton.getAttribute('aria-expanded') === 'true';

        /* -------------------------------------------------
         MOBILE FOCUS TRAP
      -------------------------------------------------- */

        if (event.key === 'Tab' && mobileIsOpen) {
            const focusable = [
                ...header.querySelectorAll(
                    `
                        a[href],
                        button,
                        input,
                        select,
                        textarea,
                        [tabindex]:not([tabindex="-1"])
                        `,
                ),
            ].filter(
                (element) =>
                    !element.closest('[inert]') &&
                    element.getClientRects().length,
            );

            const first = focusable[0];

            const last = focusable.at(-1);

            if (!first || !last) {
                return;
            }

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();

                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();

                first.focus();
            }
        }

        /* -------------------------------------------------
         ESCAPE
      -------------------------------------------------- */

        if (event.key !== 'Escape') {
            return;
        }

        /*
         * Mobile menu.
         */
        if (mobileIsOpen) {
            closeMobileMenu();

            mobileMenuButton.focus();

            return;
        }

        /*
         * Desktop dropdown открывается через
         * :focus-within.
         *
         * Если открыли клавиатурой —
         * Escape снимает focus.
         */
        if (desktopLayout.matches) {
            const focusedMenuItem = header.querySelector(
                '.menu-item:focus-within',
            );

            if (!focusedMenuItem) {
                return;
            }

            const activeElement = document.activeElement;

            if (activeElement instanceof HTMLElement) {
                activeElement.blur();
            }
        }
    });

    /* =========================================================
     NEWSLETTER
     Можешь удалить, если формы нет.
  ========================================================== */

    const newsletter = document.querySelector('[data-newsletter-form]');

    newsletter?.addEventListener('submit', (event) => {
        event.preventDefault();

        const status = newsletter.querySelector('[data-newsletter-status]');

        if (!status) return;

        status.textContent =
            'Newsletter signup is coming soon. Please check back later.';

        status.classList.remove('hidden');
    });
})();
