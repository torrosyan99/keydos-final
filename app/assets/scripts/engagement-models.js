const initEngagementModels = (grid) => {
    if (!grid || grid.dataset.accordionReady) return;
    grid.dataset.accordionReady = 'true';

    const stackedLayout = window.matchMedia('(max-width: 1023px)');
    const element = (tag, className, text) => {
        const node = document.createElement(tag);
        node.className = className;
        if (text) node.textContent = text.trim().replace(/\s+/g, ' ');
        return node;
    };

    // Build the native disclosures from the existing cards, keeping one source
    // for their content and retaining the original desktop links and hover effect.
    const cards = Array.from(grid.children, (desktop, index) => {
        const disclosure = element('details', 'engagement-disclosure');
        disclosure.name = 'engagement-models';
        disclosure.open = index === 0;

        const summary = element('summary', 'engagement-disclosure__summary');
        const title = element(
            'h3',
            'engagement-disclosure__title',
            desktop.querySelector('h3').textContent,
        );
        const icon = element('span', 'engagement-disclosure__icon');
        icon.setAttribute('aria-hidden', 'true');
        summary.append(title, icon);

        const panel = element('div', 'engagement-disclosure__panel');
        const category = element(
            'a',
            'engagement-disclosure__category',
            desktop.querySelector('span').textContent,
        );
        category.setAttribute('href', desktop.getAttribute('href') || '#');
        const description = element(
            'p',
            'engagement-disclosure__description',
            desktop.querySelector('p').textContent,
        );
        panel.append(category, description);
        disclosure.append(summary, panel);

        return { desktop, disclosure };
    });

    const updateLayout = () => {
        cards.forEach(({ desktop, disclosure }) => {
            if (stackedLayout.matches) {
                desktop.replaceWith(disclosure);
            } else {
                disclosure.replaceWith(desktop);
            }
        });
    };

    stackedLayout.addEventListener('change', updateLayout);
    updateLayout();
};

initEngagementModels(document.querySelector('[data-engagement-cards]'));
