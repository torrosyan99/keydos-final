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
