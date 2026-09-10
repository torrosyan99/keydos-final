const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const carouselSpeed = reducedMotion.matches ? 0 : 650;

marquee6k.init();
const updateMarqueeMotion = () => {
    if (reducedMotion.matches || document.hidden) marquee6k.pauseAll();
    else marquee6k.playAll();
};
reducedMotion.addEventListener('change', updateMarqueeMotion);
document.addEventListener('visibilitychange', updateMarqueeMotion);
document.querySelectorAll('.marquee6k').forEach((marquee) => {
    // Apply the user's motion preference after the library's hover handler.
    marquee.addEventListener('mouseleave', updateMarqueeMotion);
});
updateMarqueeMotion();

const featuredSlider = document.querySelector('#featured-slider');

if (featuredSlider) {
    const slider = featuredSlider.querySelector('[data-swiper-slider]');
    const previousButton = featuredSlider.querySelector('[data-featured-prev]');
    const nextButton = featuredSlider.querySelector('[data-featured-next]');
    const pagination = featuredSlider.querySelector(
        '[data-featured-pagination]',
    );

    new Swiper(slider, {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 0,
        speed: carouselSpeed,
        loop: true,
        autoplay: reducedMotion.matches
            ? false
            : {
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
              },
        grabCursor: true,
        simulateTouch: true,
        allowTouchMove: true,
        threshold: 6,
        resistanceRatio: 0.85,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        updateOnWindowResize: true,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        navigation: {
            prevEl: previousButton,
            nextEl: nextButton,
        },
        pagination: {
            el: pagination,
            clickable: true,
        },
    });
}

const testimonialsSlider = document.querySelector(
    '[data-testimonials-carousel]',
);

if (testimonialsSlider) {
    const testimonialsSwiper = testimonialsSlider.querySelector(
        '[data-testimonials-swiper]',
    );

    new Swiper(testimonialsSwiper, {
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        spaceBetween: 32,
        speed: carouselSpeed,
        loop: false,
        rewind: false,
        grabCursor: true,
        simulateTouch: true,
        allowTouchMove: true,
        threshold: 6,
        resistanceRatio: 0.85,
        watchOverflow: true,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
        updateOnWindowResize: true,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        a11y: {
            enabled: true,
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
        },
        navigation: {
            prevEl: testimonialsSlider.querySelector(
                '[data-testimonials-prev]',
            ),
            nextEl: testimonialsSlider.querySelector(
                '[data-testimonials-next]',
            ),
        },
        breakpoints: {
            834: { spaceBetween: 65 },
        },
    });
}

// Team assembly has its own scope; all layout and final states are in the HTML.
(function initTeamAssembly() {
    const section = document.querySelector('[data-team-assembly]');
    if (!section || section.dataset.uiReady === 'true') return;

    const visual = section.querySelector('[data-team-visual]');
    const heading = section.querySelector('[data-team-heading]');
    const button = section.querySelector('[data-team-button]');
    if (!visual || !heading || !button) return;
    if (!('IntersectionObserver' in window) || !section.animate) return;
    section.dataset.uiReady = 'true';

    const motion = window.matchMedia(
        '(min-width: 1280px) and (prefers-reduced-motion: no-preference)',
    );
    const members = [...visual.querySelectorAll('[data-team-member]')];
    const backdrops = [...visual.querySelectorAll('[data-team-backdrop]')];
    const duration = 780;
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
    let hasStarted = false;
    let observer;
    let animations = [];

    // Canceling restores the Tailwind defaults, including on a breakpoint change.
    function reset() {
        observer?.disconnect();
        animations.forEach((animation) => animation.cancel());
        animations = [];
    }

    function prepare(element, keyframes, options = {}) {
        const animation = element.animate(keyframes, {
            duration,
            easing,
            fill: 'backwards',
            ...options,
        });
        animation.pause();
        animation.currentTime = 0;
        animations.push(animation);
    }

    function configure() {
        reset();
        if (!motion.matches || hasStarted) return;

        // Read colors before animating. The browser handles every animation frame.
        const colors = backdrops.map((backdrop) => {
            const style = getComputedStyle(backdrop);
            return [style.getPropertyValue('--team-color').trim(), style.fill];
        });
        // Larger spread makes the portraits travel farther into their final row.
        const spread = Math.min(window.innerWidth * 0.04, 64);
        members.forEach((member) => {
            const x = Number(member.dataset.teamX) * spread;
            const y = Number(member.dataset.teamY);
            if (x === 0 && y === 0) return;
            prepare(member, [
                { transform: `translate(${x}px, ${y}px)` },
                { transform: 'translate(0, 0)' },
            ]);
        });
        backdrops.forEach((backdrop, index) => {
            const [from, to] = colors[index];
            prepare(backdrop, [{ fill: from }, { fill: to }]);
        });
        [heading, button].forEach((element, index) => {
            prepare(
                element,
                [
                    { opacity: 0, transform: 'translateY(16px)' },
                    { opacity: 1, transform: 'translateY(0)' },
                ],
                { duration: 480, delay: 140 + index * 100 },
            );
        });

        // Play once on entry; scrolling back never restarts or scrubs the effect.
        observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || hasStarted) return;
                hasStarted = true;
                observer.disconnect();
                animations.forEach((animation) => animation.play());
            },
            { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
        );
        observer.observe(visual);
    }

    // Keyboard navigation reveals the CTA immediately, even before entry.
    section.addEventListener('focusin', () => {
        hasStarted = true;
        reset();
    });
    motion.addEventListener('change', configure);
    configure();
})();

const insightsCarousel = document.querySelector('[data-insights-carousel]');

if (insightsCarousel) {
    new Swiper(insightsCarousel.querySelector('[data-insights-swiper]'), {
        slidesPerView: 1.12,
        spaceBetween: 20,
        speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 0
            : 500,
        grabCursor: true,
        watchOverflow: true,
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: {
            prevSlideMessage: 'Previous insight',
            nextSlideMessage: 'Next insight',
        },
        navigation: {
            prevEl: insightsCarousel.querySelector('[data-insights-prev]'),
            nextEl: insightsCarousel.querySelector('[data-insights-next]'),
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
        },
    });
}

const initEngagementModels = (grid) => {
    if (!grid || grid.dataset.uiReady) return;
    grid.dataset.uiReady = 'true';

    const mobile = window.matchMedia('(max-width: 833px)');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const cards = [...grid.querySelectorAll('.engagement-card')].map(
        (card) => ({
            card,
            button: card.querySelector('.engagement-card__toggle'),
            panel: card.querySelector('.engagement-card__panel'),
            description: card.querySelector('.engagement-card__description'),
        }),
    );
    const openMobileCards = new Set([0]);

    function setOpen(item, open) {
        item.card.classList.toggle('is-open', open);
        item.button.setAttribute('aria-expanded', String(open));
        item.panel.inert = mobile.matches && !open;
        item.panel.setAttribute('aria-hidden', String(mobile.matches && !open));
        item.description.setAttribute('aria-hidden', String(!open));
    }

    cards.forEach((item, index) => {
        item.button.addEventListener('click', (event) => {
            const open = item.button.getAttribute('aria-expanded') !== 'true';
            if (mobile.matches) {
                if (open) openMobileCards.add(index);
                else openMobileCards.delete(index);
                setOpen(item, open);
            } else {
                setOpen(item, event.detail > 0 && hover.matches ? true : open);
            }
        });
        item.card.addEventListener('pointerenter', () => {
            if (!mobile.matches && hover.matches) setOpen(item, true);
        });
        item.card.addEventListener('pointerleave', () => {
            if (
                !mobile.matches &&
                hover.matches &&
                !item.button.matches(':focus-visible')
            ) {
                setOpen(item, false);
            }
        });
        item.button.addEventListener('focus', () => {
            if (!mobile.matches && item.button.matches(':focus-visible')) {
                setOpen(item, true);
            }
        });
        item.button.addEventListener('blur', () => {
            if (!mobile.matches) setOpen(item, false);
        });
        item.button.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (mobile.matches) {
                openMobileCards.delete(index);
                setOpen(item, false);
            } else {
                setOpen(item, false);
            }
        });
    });

    const syncLayout = () =>
        cards.forEach((item, index) => {
            setOpen(item, mobile.matches && openMobileCards.has(index));
        });
    mobile.addEventListener('change', syncLayout);
    syncLayout();
};

initEngagementModels(document.querySelector('[data-engagement-cards]'));
