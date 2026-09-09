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
        loop: false,
        rewind: false,
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
        spaceBetween: 20,
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
            768: { spaceBetween: 28 },
            1280: { spaceBetween: 40 },
            1536: { spaceBetween: 48 },
            1800: { spaceBetween: 52 },
        },
    });
}
const initTeamAssembly = (section) => {
    if (!section || section.dataset.uiReady === 'true') return;
    section.dataset.uiReady = 'true';

    const motion = window.matchMedia(
        '(min-width: 1280px) and (prefers-reduced-motion: no-preference)',
    );
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const ease = (value) => value * value * (3 - 2 * value);
    let hasStarted = false;
    let stopAnimation = () => {};

    const configure = () => {
        stopAnimation();
        [
            '--team-progress',
            '--team-heading-progress',
            '--team-button-progress',
            '--team-button-events',
        ].forEach((property) => section.style.removeProperty(property));

        // Mobile, reduced motion and no JS all keep the colorful, visible layout.
        if (!motion.matches) return;

        let frame = 0;

        const render = (progress) => {
            const assembly = ease(clamp(progress / 0.75));
            const heading = ease(clamp((progress - 0.55) / 0.3));
            const button = ease(clamp((progress - 0.75) / 0.25));

            section.style.setProperty('--team-progress', assembly.toFixed(4));
            section.style.setProperty(
                '--team-heading-progress',
                heading.toFixed(4),
            );
            section.style.setProperty(
                '--team-button-progress',
                button.toFixed(4),
            );
            section.style.setProperty(
                '--team-button-events',
                button > 0.05 ? 'auto' : 'none',
            );
        };

        // Keep the completed state when returning from mobile or reduced motion.
        if (hasStarted) {
            render(1);
            return;
        }

        render(0);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || hasStarted) return;
                hasStarted = true;
                observer.disconnect();

                // Visibility starts one timed sequence; scrolling never drives it.
                let startTime;
                const animate = (timestamp) => {
                    startTime ??= timestamp;
                    const progress = clamp((timestamp - startTime) / 1800);
                    render(progress);
                    frame = progress < 1 ? requestAnimationFrame(animate) : 0;
                };
                frame = requestAnimationFrame(animate);
            },
            { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
        );
        observer.observe(
            section.querySelector('.team-assembly__visual') || section,
        );

        stopAnimation = () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    };

    motion.addEventListener('change', configure);
    configure();
};

initTeamAssembly(document.querySelector('[data-team-assembly]'));

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
