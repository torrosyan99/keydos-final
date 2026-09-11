(() => {
    'use strict';


// Tracks the OS-level reduced-motion preference for the looping flow.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Returns 0 when the user prefers reduced motion.
    const getMotionSpeed = (speed) => (reducedMotion.matches ? 0 : speed);

    // Prevents the same component from being initialized more than once.
    const isReady = (element) => element?.dataset.uiReady === 'true';

    const markReady = (element) => {
        element.dataset.uiReady = 'true';
    };

    // Shared Swiper behavior used by all carousels.
    const getBaseSwiperOptions = (speed) => ({
        // Transition duration between slides in milliseconds.
        speed: getMotionSpeed(speed),

        // Shows a grab cursor on desktop.
        grabCursor: true,

        // Allows mouse dragging to behave like touch dragging.
        simulateTouch: true,

        // Enables dragging/swiping between slides.
        allowTouchMove: true,

        // Minimum drag distance before Swiper starts moving.
        threshold: 6,

        // Controls resistance when dragging past the first/last slide.
        resistanceRatio: 0.85,

        // Disables unnecessary controls when there are not enough slides.
        watchOverflow: true,

        // Watches Swiper itself for DOM/layout changes.
        observer: true,

        // Watches parent elements for DOM/layout changes.
        observeParents: true,

        // Recalculates Swiper when the viewport size changes.
        updateOnWindowResize: true,

        // Enables arrow-key navigation while the carousel is in the viewport.
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },

        // Enables Swiper accessibility helpers.
        a11y: {
            enabled: true,
        },
    });

    // Creates a Swiper instance only when both the root and slider element exist.
    const createSwiper = ({ root, sliderSelector, options }) => {
        if (!root || typeof Swiper === 'undefined') {
            return null;
        }

        const slider = root.querySelector(sliderSelector);

        if (!slider) {
            return null;
        }

        return new Swiper(slider, options);
    };


    const initFeaturedSlider = () => {
        const root = document.querySelector('#featured-slider');

        if (!root || isReady(root)) {
            return;
        }

        const instance = createSwiper({
            root,
            sliderSelector: '[data-swiper-slider]',

            options: {
                ...getBaseSwiperOptions(650),

                // Number of visible slides.
                slidesPerView: 1,

                // Number of slides moved per navigation action.
                slidesPerGroup: 1,

                // Gap between slides in pixels.
                spaceBetween: 0,

                // Repeats slides infinitely.
                loop: true,

                // Disables autoplay when reduced motion is enabled.
                autoplay: reducedMotion.matches
                    ? false
                    : {
                          // Time between automatic slide changes in milliseconds.
                          delay: 4000,

                          // Keeps autoplay running after manual interaction.
                          disableOnInteraction: false,

                          // Pauses autoplay while the pointer is over the slider.
                          pauseOnMouseEnter: true,
                      },

                // Connects custom previous/next buttons.
                navigation: {
                    prevEl: root.querySelector('[data-featured-prev]'),
                    nextEl: root.querySelector('[data-featured-next]'),
                },

                // Enables clickable pagination bullets.
                pagination: {
                    el: root.querySelector('[data-featured-pagination]'),
                    clickable: true,
                },

                // Custom screen-reader messages for this carousel.
                a11y: {
                    enabled: true,
                    prevSlideMessage: 'Previous featured slide',
                    nextSlideMessage: 'Next featured slide',
                },
            },
        });

        if (instance) {
            markReady(root);
        }
    };

    const initTestimonialsSlider = () => {
        const root = document.querySelector('[data-testimonials-carousel]');

        if (!root || isReady(root)) {
            return;
        }

        const instance = createSwiper({
            root,
            sliderSelector: '[data-testimonials-swiper]',

            options: {
                ...getBaseSwiperOptions(650),

                // Uses each slide's natural CSS width.
                slidesPerView: 'auto',

                // Moves one testimonial at a time.
                slidesPerGroup: 1,

                // Default gap between testimonial cards.
                spaceBetween: 32,
                autoplay: {
                    delay:4000,
                    disableOnInteraction: false,

                    // Pauses autoplay while the pointer is over the slider.
                    pauseOnMouseEnter: true,
                },

                // Stops at the last slide instead of creating duplicated loop slides.
                loop: false,

                // Keeps the slider at the end instead of jumping back to the first slide.
                rewind: false,

                // Tracks slide visibility/progress for Swiper state classes and calculations.
                watchSlidesProgress: true,

                // Connects custom previous/next buttons.
                navigation: {
                    prevEl: root.querySelector('[data-testimonials-prev]'),
                    nextEl: root.querySelector('[data-testimonials-next]'),
                },

                // Custom screen-reader messages for testimonials.
                a11y: {
                    enabled: true,
                    prevSlideMessage: 'Previous testimonial',
                    nextSlideMessage: 'Next testimonial',
                },

                // Changes only the options that differ on wider screens.
                breakpoints: {
                    834: {
                        spaceBetween: 65,
                    },
                },
            },
        });

        if (instance) {
            markReady(root);
        }
    };

    const initTeamAssembly = () => {
        const section = document.querySelector('[data-team-assembly]');
        if (!section || section.__keydosTeamAssemblyV3) return;

        const visual = section.querySelector('[data-team-visual]');
        if (!visual || !('IntersectionObserver' in window) || !visual.animate) return;

        const order = ['project', 'ux', 'software', 'qa', 'data'];
        const members = order.map((slot) =>
          visual.querySelector(`[data-team-member][data-team-slot="${slot}"]`),
        ).filter(Boolean);
        const tracks = [...visual.querySelectorAll('[data-team-track]')];
        if (members.length !== 5 || !tracks.length) return;

        const settings = {
            rowHold: 700,
            assembly: 2600,
            stagger: 250,
            lap: 40000,
            // A brief acceleration connects the stationary assembly to linear orbit.
            acceleration: 1200,
            samples: 480,
        };
        const media = window.matchMedia(
          '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        );

        // Disable the old paint-heavy dash and arrow animations, not just the JS.
        // Portraits and logo-coloured backgrounds are kept intact.
        const styleId = 'keydos-team-motion-v3-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
            [data-team-performance="v3"] [data-team-arrows] {
                display: none !important;
            }
            [data-team-performance="v3"] [data-team-track],
            [data-team-performance="v3"] [data-team-arrows] * {
                animation: none !important;
            }
            [data-team-performance="v3"] [data-team-track] { opacity: .5; }
            [data-team-performance="v3"] [data-team-member] {
                transition: none !important;
            }
            @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
                [data-team-performance="v3"] [data-team-member] {
                    will-change: transform;
                }
            }
            [data-team-motion-toggle] {
                position: absolute; bottom: 0; left: 50%;
                transform: translateX(-50%); z-index: 5;
                border: 1px solid #0f7d8033; border-radius: 999px;
                background: #fff; color: #0F7D80;
                padding: 8px 16px; font: inherit; font-size: 13px;
                line-height: 1.3; cursor: pointer; white-space: nowrap;
            }
            [data-team-motion-toggle]:focus-visible {
                outline: 2px solid #0F7D80; outline-offset: 3px;
            }
            [data-team-motion-toggle][hidden] { display: none !important; }
        `;
            document.head.append(style);
        }
        section.dataset.teamPerformance = 'v3';
        visual.removeAttribute('data-flowing');

        // Moving content can be paused without relying on hover or browser settings.
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.setAttribute('data-team-motion-toggle', '');
        toggle.hidden = true;
        toggle.textContent = 'Pause animation';
        toggle.setAttribute('aria-pressed', 'false');
        visual.append(toggle);

        const pathCache = new WeakMap();
        let active = [];
        let stage = 'static'; // static, ready, assembly, launch, orbit
        let started = false;
        let activated = false;
        let visible = false;
        let userPaused = false;
        let destroyed = false;
        let generation = 0;
        let geometry = null;
        let observedWidth = 0;
        let observedHeight = 0;
        let resizeTimer = 0;
        let resume = null;

        const cancelActive = () => {
            generation += 1;
            active.forEach(({ animation }) => {
                animation.onfinish = null;
                animation.cancel();
            });
            active = [];
        };

        const elapsed = () => Math.max(
          0, ...active.map(({ animation }) => Number(animation.currentTime) || 0),
        );

        const samplePath = (path) => {
            const d = path.getAttribute('d');
            const cached = pathCache.get(path);
            if (cached?.d === d) return cached.points;
            const length = path.getTotalLength();
            if (!(length > 0)) throw new Error('Infinity path has zero length.');
            const points = Array.from({ length: settings.samples }, (_, index) => {
                const p = path.getPointAtLength(length * index / settings.samples);
                return { x: p.x, y: p.y };
            });
            pathCache.set(path, { d, points });
            return points;
        };

        const measure = () => {
            const path = tracks.find((item) =>
              getComputedStyle(item.ownerSVGElement).display !== 'none',
            );
            if (!path) return null;
            const svg = path.ownerSVGElement;
            const vb = svg.viewBox.baseVal;
            const width = visual.clientWidth;
            const height = visual.clientHeight;
            if (!width || !height || !vb.width || !vb.height) return null;

            // Matches the supplied SVG: inset:0; width/height:100%; xMidYMid meet.
            // Coordinates remain local, so scrolling does not invalidate the path.
            const scale = Math.min(width / vb.width, height / vb.height);
            const dx = (width - vb.width * scale) / 2 - vb.x * scale;
            const dy = (height - vb.height * scale) / 2 - vb.y * scale;
            const points = samplePath(path).map((p) => ({
                x: p.x * scale + dx,
                y: p.y * scale + dy,
            }));
            const bases = members.map((member) => {
                const css = getComputedStyle(member);
                const x = Number.parseFloat(css.left);
                const y = Number.parseFloat(css.top);
                return {
                    x: Number.isFinite(x) ? x : member.offsetLeft,
                    y: Number.isFinite(y) ? y : member.offsetTop,
                };
            });
            return { svg, width, height, points, bases };
        };

        const position = (phase) => {
            const count = geometry.points.length;
            const value = ((phase % 1 + 1) % 1) * count;
            const index = Math.floor(value);
            const a = geometry.points[index % count];
            const b = geometry.points[(index + 1) % count];
            const blend = value - index;
            return { x: a.x + (b.x - a.x) * blend, y: a.y + (b.y - a.y) * blend };
        };
        const transform = (point, base) =>
          `translate3d(${(point.x - base.x).toFixed(3)}px, ${(point.y - base.y).toFixed(3)}px, 0px)`;

        const makeAnimation = (element, frames, options, time) => {
            const animation = element.animate(frames, { fill: 'both', ...options });
            animation.pause();
            animation.currentTime = time;
            const end = options.iterations === Infinity
              ? Infinity : (options.delay || 0) + options.duration;
            active.push({ animation, end });
            return animation;
        };

        const sync = () => {
            if (destroyed) return;
            if (stage === 'ready' && activated && visible && !document.hidden && media.matches) {
                stage = 'assembly';
                started = true;
            }
            const running = started && visible && !document.hidden && media.matches && !userPaused;
            toggle.hidden = !media.matches || !started || stage === 'static';
            toggle.textContent = userPaused ? 'Resume animation' : 'Pause animation';
            toggle.setAttribute('aria-pressed', String(userPaused));
            const now = document.timeline.currentTime;
            active.forEach(({ animation, end }) => {
                const time = Number(animation.currentTime) || 0;
                if (running && stage !== 'ready' && time < end) {
                    if (animation.playState !== 'running') {
                        animation.play();
                        // Every participant shares the same time origin, without timers.
                        if (now !== null) animation.startTime = now - time;
                    }
                } else if (animation.playState === 'running') {
                    animation.pause();
                }
            });
        };

        const install = (nextStage, time = 0) => {
            cancelActive();
            stage = nextStage;
            const token = generation;
            const launchAdvance = settings.acceleration / (2 * settings.lap);
            let lastCard;

            members.forEach((member, index) => {
                const base = geometry.bases[index];
                // Equal arc spacing avoids pairs being exactly half a lap apart
                // and repeatedly arriving at the central crossing simultaneously.
                const startPhase = index / members.length;
                let frames;
                let options;

                if (stage === 'ready' || stage === 'assembly') {
                    const rowPoint = {
                        x: geometry.width * (.1 + .8 * index / (members.length - 1)),
                        y: geometry.height * .5,
                    };
                    frames = [
                        { transform: transform(rowPoint, base) },
                        { transform: transform(position(startPhase), base) },
                    ];
                    options = {
                        duration: settings.assembly,
                        delay: settings.rowHold + index * settings.stagger,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    };
                } else {
                    const isLaunch = stage === 'launch';
                    const count = isLaunch ? 48 : settings.samples;
                    frames = Array.from({ length: count + 1 }, (_, step) => {
                        const t = step / count;
                        const phase = isLaunch
                          ? startPhase + launchAdvance * t * t
                          : startPhase + launchAdvance + t;
                        return { offset: t, transform: transform(position(phase), base) };
                    });
                    if (!isLaunch) {
                        // Close the cycle exactly, including floating-point rounding.
                        frames[count].transform = frames[0].transform;
                    }
                    options = {
                        duration: isLaunch ? settings.acceleration : settings.lap,
                        iterations: isLaunch ? 1 : Infinity,
                        easing: 'linear',
                    };
                }
                lastCard = makeAnimation(member, frames, options, time);
            });

            if (stage === 'ready' || stage === 'assembly') {
                // Fade the complete SVG as a layer. No animated stroke-dashoffset,
                // and no animations on the hidden mobile SVG.
                makeAnimation(geometry.svg, [{ opacity: 0 }, { opacity: 1 }], {
                    duration: 2700, delay: 900, easing: 'ease-in-out',
                }, time);
            }
            if (stage !== 'orbit') {
                lastCard.onfinish = () => {
                    if (destroyed || token !== generation) return;
                    // Last assembly frame == first launch frame;
                    // last launch frame == first orbit frame. No snap to CSS slots.
                    install(stage === 'launch' ? 'orbit' : 'launch');
                };
            }
            sync();
        };

        const rebuild = () => {
            if (destroyed) return;
            try {
                if (!media.matches) {
                    if (stage !== 'static') resume = { stage, time: elapsed() };
                    cancelActive();
                    stage = 'static';
                    toggle.hidden = true;
                    return;
                }
                const nextGeometry = measure();
                if (!nextGeometry) {
                    cancelActive();
                    stage = 'static';
                    toggle.hidden = true;
                    return;
                }
                const previous = stage === 'static'
                  ? (resume || { stage: 'ready', time: 0 })
                  : { stage, time: elapsed() };
                resume = null;
                geometry = nextGeometry;
                observedWidth = geometry.width;
                observedHeight = geometry.height;
                let nextStage = previous.stage;
                let time = previous.time;
                const assemblyEnd = settings.rowHold + settings.assembly +
                  (members.length - 1) * settings.stagger;
                if (nextStage === 'assembly' && time >= assemblyEnd) {
                    nextStage = 'launch'; time = 0;
                } else if (nextStage === 'launch' && time >= settings.acceleration) {
                    nextStage = 'orbit'; time = 0;
                }
                install(nextStage, time);
            } catch (error) {
                // Fail open: the supplied static HTML must remain visible.
                cancelActive();
                stage = 'static';
                toggle.hidden = true;
                console.warn('KEYDOS team animation: using static layout.', error);
            }
        };

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (entry.isIntersecting && entry.intersectionRatio >= .15) activated = true;
            sync();
        }, { threshold: [0, .15], rootMargin: '0px 0px -24px 0px' });

        const scheduleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                if (Math.abs(visual.clientWidth - observedWidth) > .5 ||
                  Math.abs(visual.clientHeight - observedHeight) > .5) rebuild();
            }, 120);
        };
        const resizer = 'ResizeObserver' in window ? new ResizeObserver(scheduleResize) : null;
        const togglePause = () => { userPaused = !userPaused; sync(); };
        const mediaChange = () => rebuild();

        toggle.addEventListener('click', togglePause);
        document.addEventListener('visibilitychange', sync);
        media.addEventListener('change', mediaChange);
        if (resizer) resizer.observe(visual);
        else window.addEventListener('resize', scheduleResize);

        section.__keydosTeamAssemblyV3 = {
            destroy() {
                destroyed = true;
                clearTimeout(resizeTimer);
                observer.disconnect();
                resizer?.disconnect();
                document.removeEventListener('visibilitychange', sync);
                media.removeEventListener('change', mediaChange);
                window.removeEventListener('resize', scheduleResize);
                cancelActive();
                toggle.remove();
                delete section.dataset.teamPerformance;
                delete section.__keydosTeamAssemblyV3;
            },
        };
        rebuild();
        observer.observe(visual);
    };
    const initInsightsSlider = () => {
        const root = document.querySelector('[data-insights-carousel]');

        if (!root || isReady(root)) {
            return;
        }

        const instance = createSwiper({
            root,
            sliderSelector: '[data-insights-swiper]',

            options: {
                ...getBaseSwiperOptions(500),

                // Shows one full card plus part of the next card on small screens.
                slidesPerView: 1.12,

                // Moves one insight at a time.
                slidesPerGroup: 1,

                // Default mobile gap in pixels.
                spaceBetween: 20,

                // Connects custom previous/next buttons.
                navigation: {
                    prevEl: root.querySelector('[data-insights-prev]'),
                    nextEl: root.querySelector('[data-insights-next]'),
                },

                // Custom screen-reader messages for insights.
                a11y: {
                    enabled: true,
                    prevSlideMessage: 'Previous insight',
                    nextSlideMessage: 'Next insight',
                },

                // Responsive slide count and spacing.
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },

                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 32,
                    },
                },
            },
        });

        if (instance) {
            markReady(root);
        }
    };

    const initEngagementModels = () => {
        const grid = document.querySelector('[data-engagement-cards]');

        if (!grid || isReady(grid)) {
            return;
        }

        // Mobile uses click/tap state; desktop can use hover/focus state.
        const mobile = window.matchMedia('(max-width: 833px)');

        const hover = window.matchMedia('(hover: hover) and (pointer: fine)');

        const cards = [...grid.querySelectorAll('.engagement-card')]
            .map((card) => ({
                card,

                button: card.querySelector('.engagement-card__toggle'),

                panel: card.querySelector('.engagement-card__panel'),

                description: card.querySelector(
                    '.engagement-card__description',
                ),
            }))

            // Ignores incomplete cards instead of throwing a runtime error.
            .filter(
                ({ button, panel, description }) =>
                    button && panel && description,
            );

        if (!cards.length) {
            return;
        }

        markReady(grid);

        // The first card starts open on mobile.
        const openMobileCards = new Set([0]);

        const setOpen = (item, open) => {
            const isMobile = mobile.matches;

            item.card.classList.toggle('is-open', open);

            item.button.setAttribute('aria-expanded', String(open));

            // Prevents keyboard interaction with hidden mobile content.
            item.panel.inert = isMobile && !open;

            item.panel.setAttribute('aria-hidden', String(isMobile && !open));

            item.description.setAttribute('aria-hidden', String(!open));
        };

        const syncLayout = () => {
            cards.forEach((item, index) => {
                setOpen(item, mobile.matches && openMobileCards.has(index));
            });
        };

        cards.forEach((item, index) => {
            item.button.addEventListener('click', (event) => {
                const isOpen =
                    item.button.getAttribute('aria-expanded') === 'true';

                const nextOpen = !isOpen;

                if (mobile.matches) {
                    if (nextOpen) {
                        openMobileCards.add(index);
                    } else {
                        openMobileCards.delete(index);
                    }

                    setOpen(item, nextOpen);

                    return;
                }

                // Pointer click on a hover device keeps the card open until pointerleave.
                // Keyboard-generated click behaves as a regular toggle.
                const isPointerClick = event.detail > 0 && hover.matches;

                setOpen(item, isPointerClick ? true : nextOpen);
            });

            item.card.addEventListener('pointerenter', () => {
                if (!mobile.matches && hover.matches) {
                    setOpen(item, true);
                }
            });

            item.card.addEventListener('pointerleave', () => {
                const keepOpenForKeyboard =
                    item.button.matches(':focus-visible');

                if (!mobile.matches && hover.matches && !keepOpenForKeyboard) {
                    setOpen(item, false);
                }
            });

            item.button.addEventListener('focus', () => {
                if (!mobile.matches && item.button.matches(':focus-visible')) {
                    setOpen(item, true);
                }
            });

            item.button.addEventListener('blur', () => {
                if (!mobile.matches) {
                    setOpen(item, false);
                }
            });

            item.button.addEventListener('keydown', (event) => {
                if (event.key !== 'Escape') {
                    return;
                }

                openMobileCards.delete(index);

                setOpen(item, false);
            });
        });

        mobile.addEventListener('change', syncLayout);

        syncLayout();
    };


    // Initializes all independent UI components.
    const initUI = () => {


        initFeaturedSlider();
        initTestimonialsSlider();
        initTeamAssembly();
        initInsightsSlider();
        initEngagementModels();
    };

    // Supports both deferred/body scripts and scripts loaded before the HTML is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI, {
            once: true,
        });
    } else {
        initUI();
    }
})();


const element = document.querySelector('.clients-marquee');

new marquee(element, {
    duplicated: true,
    gap: 12,
    speed: 40,
    pauseOnHover: true,
    startVisible: true
});
const leftMarquee = document.querySelector('.tech-marquee-left')
new marquee(leftMarquee, {
    duplicated: true,
    gap: 12,
    speed: 40,
    pauseOnHover: true,
    startVisible: true
});
const rightMarquee = document.querySelector('.tech-marquee-right')
new marquee(rightMarquee, {
    direction:'right',
    duplicated: true,
    gap: 12,
    speed: 40,
    pauseOnHover: true,
    startVisible: true
});