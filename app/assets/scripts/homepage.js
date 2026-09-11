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

    const initMarquee = () => {
        if (typeof marquee6k === 'undefined') {
            return;
        }

        marquee6k.init();

        // Pauses marquee animation for reduced motion and hidden tabs.
        const syncMotion = () => {
            const shouldPause = reducedMotion.matches || document.hidden;

            if (shouldPause) {
                marquee6k.pauseAll();
            } else {
                marquee6k.playAll();
            }
        };

        reducedMotion.addEventListener('change', syncMotion);

        document.addEventListener('visibilitychange', syncMotion);

        // Re-applies the current motion preference after the library hover handler.
        document.querySelectorAll('.marquee6k').forEach((marquee) => {
            marquee.addEventListener('mouseleave', syncMotion);
        });

        syncMotion();
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

        if (!section || isReady(section)) {
            return;
        }

        const visual = section.querySelector('[data-team-visual]');

        const heading = section.querySelector('[data-team-heading]');

        const button = section.querySelector('[data-team-button]');

        if (!visual || !heading || !button) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            return;
        }

        if (typeof section.animate !== 'function') {
            return;
        }

        markReady(section);

        // Runs the assembly animation only on desktop and when motion is allowed.
        const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');


        const members = [...visual.querySelectorAll('[data-team-member]')];

        const ribbons = [...visual.querySelectorAll('[data-team-ribbon]')];

        const track = visual.querySelector('[data-team-track]');

        const arrows = visual.querySelector('[data-team-arrows]');

        // Main portrait animation duration in milliseconds.
        const duration = 780;

        // Time the ribbons take to draw themselves in milliseconds.
        const drawDuration = 900;

        // Main easing curve for the assembly animation.
        const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';

        let hasStarted = false;
        let revealObserver = null;
        let flowObserver = null;
        let isVisible = false;
        let animations = [];

        // Starts/stops the looping dashed line and arrows.
        // The markup reacts with group-data-[flowing]:[animation-play-state:running].
        const setFlowing = (flowing) => {
            visual.toggleAttribute('data-flowing', flowing);
        };

        // Turns the flow on only when the section is on screen and the tab is active.
        const syncFlow = () => {
            setFlowing(
              hasStarted &&
              isVisible &&
              !document.hidden &&
              !reducedMotion.matches,
            );
        };

        // Cancels prepared animations and restores the final HTML/CSS state.
        const reset = () => {
            revealObserver?.disconnect();
            revealObserver = null;

            animations.forEach((animation) => animation.cancel());

            animations = [];
        };

        // Prepares an animation in a paused state so all animations can start together.
        const prepare = (element, keyframes, options = {}) => {
            const animation = element.animate(keyframes, {
                duration,
                easing,
                fill: 'backwards',
                ...options,
            });

            animation.pause();
            animation.currentTime = 0;

            animations.push(animation);
        };

        const configure = () => {
            reset();

            // Skip animation on smaller screens, reduced motion, or after the first run.
            if (!motion.matches || hasStarted) {
                syncFlow();

                return;
            }

            // Draws both ribbons from the centre of the loop outwards.
            ribbons.forEach((ribbon) => {
                const length = ribbon.getTotalLength();

                prepare(
                  ribbon,
                  [
                      {
                          strokeDasharray: `${length}`,
                          strokeDashoffset: length,
                      },
                      {
                          strokeDasharray: `${length}`,
                          strokeDashoffset: 0,
                      },
                  ],
                  {
                      duration: drawDuration,
                      easing: 'cubic-bezier(0.33, 0, 0.2, 1)',
                  },
                );
            });

            const bounds = visual.getBoundingClientRect();

            // Portraits converge towards the centre of the loop: "assemble your team".
            members.forEach((member, index) => {
                const box = member.getBoundingClientRect();

                // Distance from the member centre to the centre of the loop.
                const x = bounds.left + bounds.width / 2 - (box.left + box.width / 2);

                const y = bounds.top + bounds.height / 2 - (box.top + box.height / 2);

                // Travels at most 22% of the way towards the centre.
                const travel = 0.22;

                prepare(
                  member,
                  [
                      {
                          opacity: 0,
                          transform: `translate(${x * travel}px, ${y * travel}px) scale(0.92)`,
                      },
                      {
                          opacity: 1,
                          transform: 'translate(0, 0) scale(1)',
                      },
                  ],
                  {
                      // 180ms after the ribbons start + 90ms between portraits.
                      delay: 180 + index * 90,
                  },
                );
            });

            // Dashed line and arrows fade in once the ribbons are almost drawn.
            [track, arrows].forEach((element) => {
                if (!element) {
                    return;
                }

                prepare(
                  element,
                  [
                      {
                          opacity: 0,
                      },
                      {
                          opacity: 1,
                      },
                  ],
                  {
                      duration: 400,
                      delay: 700,
                      easing: 'linear',
                  },
                );
            });

            [heading, button].forEach((element, index) => {
                prepare(
                  element,
                  [
                      {
                          opacity: 0,
                          transform: 'translateY(16px)',
                      },
                      {
                          opacity: 1,
                          transform: 'translateY(0)',
                      },
                  ],
                  {
                      // Text animation duration in milliseconds.
                      duration: 480,

                      // 140ms initial delay + 100ms stagger between heading and button.
                      delay: 140 + index * 100,
                  },
                );
            });

            revealObserver = new IntersectionObserver(
              ([entry]) => {
                  if (!entry.isIntersecting || hasStarted) {
                      return;
                  }

                  hasStarted = true;

                  revealObserver?.disconnect();
                  revealObserver = null;

                  animations.forEach((animation) => animation.play());

                  // Starts the looping flow right after the reveal.
                  window.setTimeout(syncFlow, drawDuration + 200);
              },
              {
                  // Starts when 12% of the observed visual is visible.
                  threshold: 0.12,

                  // Moves the effective bottom edge 32px upward.
                  rootMargin: '0px 0px -32px 0px',
              },
            );

            revealObserver.observe(visual);
        };

        // Keyboard focus reveals the final state immediately instead of waiting for scroll.
        section.addEventListener('focusin', () => {
            hasStarted = true;
            reset();
            syncFlow();
        });

        // Keeps the loop animating only while it is actually on screen.
        flowObserver = new IntersectionObserver(
          ([entry]) => {
              isVisible = entry.isIntersecting;

              syncFlow();
          },
          {
              threshold: 0,
          },
        );

        flowObserver.observe(visual);

        document.addEventListener('visibilitychange', syncFlow);

        reducedMotion.addEventListener('change', syncFlow);

        motion.addEventListener('change', configure);

        configure();
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
        initMarquee();
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
