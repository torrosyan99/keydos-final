import { marquee } from '../libs/vanilla-marquee/vanilla-marquee.js';
import '../libs/text-rotator/text-rotator.js';

const initHeader = () => {
    const header = document.querySelector('#site-header');

    if (!header) return;

    const mobileMenuButton = header.querySelector('#mobile-menu-button');
    const mobileMenu = header.querySelector('#mobile-menu');

    const mobileToggles = [...header.querySelectorAll('.mobile-menu-toggle')];

    if (!mobileMenuButton || !mobileMenu) return;

    const desktopLayout = window.matchMedia('(min-width: 1024px)');

    let scrollAnchorY = Math.max(window.scrollY, 0);
    let scrollFrame = null;

    const scrollThreshold = 10;

    const setMobileAccordion = (toggle, isOpen) => {
        const panel = toggle.nextElementSibling;

        if (!panel?.classList.contains('mobile-menu-item')) {
            return;
        }

        toggle.setAttribute('aria-expanded', String(isOpen));

        panel.setAttribute('aria-hidden', String(!isOpen));
    };

    const closeMobileAccordions = () => {
        mobileToggles.forEach((toggle) => {
            setMobileAccordion(toggle, false);
        });
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.add('hidden');

        mobileMenu.setAttribute('aria-hidden', 'true');

        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-label', 'Open navigation');

        closeMobileAccordions();

        document.body.classList.remove('overflow-hidden');
    };

    const openMobileMenu = () => {
        mobileMenu.classList.remove('hidden');

        mobileMenu.setAttribute('aria-hidden', 'false');

        mobileMenuButton.setAttribute('aria-expanded', 'true');
        mobileMenuButton.setAttribute('aria-label', 'Close navigation');

        // Restore the header if the scroll handler previously hid it.
        header.classList.remove('-translate-y-full');

        document.body.classList.add('overflow-hidden');
    };

    mobileMenuButton.addEventListener('click', () => {
        const isOpen =
            mobileMenuButton.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const wasOpen = toggle.getAttribute('aria-expanded') === 'true';

            // Keep only one mobile accordion panel open at a time.
            closeMobileAccordions();

            if (!wasOpen) {
                setMobileAccordion(toggle, true);
            }
        });
    });

    header.addEventListener('focusin', () => {
        header.classList.remove('-translate-y-full');
    });

    const updateHeaderOnScroll = () => {
        const currentScrollY = Math.max(window.scrollY, 0);

        const mobileMenuIsOpen =
            mobileMenuButton.getAttribute('aria-expanded') === 'true';

        const scrollDistance = currentScrollY - scrollAnchorY;

        // Keep the header visible at the top, while the menu is open, or while it contains focus.
        if (
            currentScrollY <= 20 ||
            mobileMenuIsOpen ||
            header.contains(document.activeElement)
        ) {
            header.classList.remove('-translate-y-full');

            scrollAnchorY = currentScrollY;
        } else if (scrollDistance >= scrollThreshold) {
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
            if (scrollFrame !== null) {
                return;
            }

            scrollFrame = window.requestAnimationFrame(updateHeaderOnScroll);
        },
        {
            passive: true,
        },
    );

    desktopLayout.addEventListener('change', (event) => {
        if (event.matches) {
            closeMobileMenu();
        }
    });

    closeMobileAccordions();
};

const initMarquees = () => {
    document.querySelectorAll('[data-marquee]').forEach((element) => {
        const gap = Number(element.dataset.marqueeGap);
        const speed = Number(element.dataset.marqueeSpeed);

        new marquee(element, {
            direction: element.dataset.marqueeDirection || 'left',

            duplicated:
                element.dataset.marqueeDuplicated === undefined
                    ? true
                    : element.dataset.marqueeDuplicated === 'true' ||
                      element.dataset.marqueeDuplicated === '',

            gap: Number.isFinite(gap) ? gap : 12,
            speed: Number.isFinite(speed) ? speed : 40,

            pauseOnHover:
                element.dataset.marqueePauseOnHover === undefined
                    ? true
                    : element.dataset.marqueePauseOnHover === 'true' ||
                      element.dataset.marqueePauseOnHover === '',

            startVisible:
                element.dataset.marqueeStartVisible === undefined
                    ? true
                    : element.dataset.marqueeStartVisible === 'true' ||
                      element.dataset.marqueeStartVisible === '',
        });

        [...element.querySelectorAll('.js-marquee')]
            .slice(1)
            .forEach((copy) => {
                copy.setAttribute('aria-hidden', 'true');
            });
    });
};

function initUI() {
    initHeader();
    initMarquees();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI, {
        once: true,
    });
} else {
    initUI();
}
