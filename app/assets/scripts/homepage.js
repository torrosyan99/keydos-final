marquee6k.init()

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
        speed: 650,
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


const initTestimonialsSwiper = (swiperElement) => {
    if (swiperElement.dataset.uiReady === 'true' || typeof window.Swiper !== 'function') {
        return;
    }

    const carousel = swiperElement.closest('[data-testimonials-carousel]');
    if (!carousel) return;

    const swiper = new window.Swiper(swiperElement, {
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        spaceBetween: 20,
        speed: 650,
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
            prevEl: carousel.querySelector('[data-testimonials-prev]'),
            nextEl: carousel.querySelector('[data-testimonials-next]'),
        },
        breakpoints: {
            768: { spaceBetween: 28 },
            1280: { spaceBetween: 40 },
            1536: { spaceBetween: 48 },
            1800: { spaceBetween: 52 },
        },
    });

    swiperElement.dataset.uiReady = 'true';
    swiperElement.testimonialsSwiper = swiper;
};

const initInsightsSwiper = (swiperElement) => {
    if (swiperElement.dataset.uiReady === 'true' || typeof window.Swiper !== 'function') {
        return;
    }

    const carousel = swiperElement.closest('[data-insights-carousel]');
    if (!carousel) return;

    const swiper = new window.Swiper(swiperElement, {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 18,
        speed: 620,
        grabCursor: true,
        watchOverflow: true,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        navigation: {
            prevEl: carousel.querySelector('[data-insights-prev]'),
            nextEl: carousel.querySelector('[data-insights-next]'),
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 22 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
        },
    });

    swiperElement.dataset.uiReady = 'true';
    swiperElement.insightsSwiper = swiper;
};

initTestimonialsSwiper( document.querySelector('[data-testimonials-swiper]'))
initInsightsSwiper(document.querySelector('[data-insights-swiper]'))