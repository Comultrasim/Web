/**
 * Comultrasim Web Application Main Core
 * Handles dynamic component loading (HTML & CSS) for multi-page shells,
 * page routing headers highlighting, and informative routes/gallery filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
    // List of components and their targets
    const components = [
        { id: 'header', url: './components/header/header.html', css: './components/header/header.css', init: initHeader },
        { id: 'hero', url: './components/hero/hero.html', css: './components/hero/hero.css' },
        { id: 'services', url: './components/services/services.html', css: './components/services/services.css' },
        { id: 'about', url: './components/about/about.html', css: './components/about/about.css' },
        { id: 'routes', url: './components/routes/routes.html', css: './components/routes/routes.css', init: initRoutes },
        { id: 'personal', url: './components/personal/personal.html', css: './components/personal/personal.css', init: initPersonal },
        { id: 'contact', url: './components/contact/contact.html', css: './components/contact/contact.css' },
        { id: 'footer', url: './components/footer/footer.html', css: './components/footer/footer.css' }
    ];

    // Load only the components whose placeholder divs exist on the current page
    loadPageComponents(components);
});

/**
 * Loads header, footer, and page-specific components dynamically.
 * @param {Array} list list of component objects
 */
async function loadPageComponents(list) {
    for (const comp of list) {
        const container = document.getElementById(comp.id);
        
        // Only load if the placeholder exists on this page
        if (container) {
            try {
                // 1. Inject CSS
                if (comp.css) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = comp.css;
                    document.head.appendChild(link);
                }

                // 2. Fetch and Inject HTML
                const response = await fetch(comp.url);
                if (!response.ok) {
                    throw new Error(`Fallo al cargar html para ${comp.id}: ${response.statusText}`);
                }
                const html = await response.text();
                container.innerHTML = html;

                // 3. Initialize interactive JS logic for this component
                if (comp.init && typeof comp.init === 'function') {
                    comp.init();
                }
            } catch (error) {
                console.error(`Error loading component [${comp.id}]:`, error);
                container.innerHTML = `<div class="container text-center py-4"><p style="color: var(--color-accent)">Error al cargar la sección ${comp.id}. Por favor, recargue la página.</p></div>`;
            }
        }
    }
}

/**
 * 1. Header Component Initializer
 * Establishes mobile menu drawers and sets active menu states based on page file paths.
 */
function initHeader() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const headerEl = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle Mobile Menu
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Set Active Link based on pathname
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    
    let matched = false;
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        
        if (linkPage === pageName || (pageName === 'Index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
            matched = true;
        }
    });

    // Fallback to active index if none matched
    if (!matched && navLinks.length > 0) {
        const homeLink = Array.from(navLinks).find(l => l.getAttribute('data-page') === 'index');
        if (homeLink) homeLink.classList.add('active');
    }

    // Handle scroll events (sticky header styling)
    window.addEventListener('scroll', () => {
        if (headerEl) {
            if (window.scrollY > 50) {
                headerEl.classList.add('scrolled');
            } else {
                headerEl.classList.remove('scrolled');
            }
        }
    });
}

/**
 * 2. Routes Component Initializer
 * Filters route cards dynamically on user dropdown choices.
 */
function initRoutes() {
    const originFilter = document.getElementById('filter-origin');
    const destFilter = document.getElementById('filter-destination');
    const resetBtn = document.getElementById('btn-reset-filters');

    const handleFilterChange = () => {
        const origin = originFilter ? originFilter.value : 'todos';
        const dest = destFilter ? destFilter.value : 'todos';
        filterRoutes(origin, dest);
    };

    if (originFilter) originFilter.addEventListener('change', handleFilterChange);
    if (destFilter) destFilter.addEventListener('change', handleFilterChange);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (originFilter) originFilter.value = 'todos';
            if (destFilter) destFilter.value = 'todos';
            filterRoutes('todos', 'todos');
        });
    }
}

/**
 * Filters the cards in the Routes Grid based on criteria
 * @param {string} origin Origin filter option
 * @param {string} destination Destination filter option
 */
function filterRoutes(origin, destination) {
    const cards = document.querySelectorAll('.route-card');
    const emptyState = document.getElementById('routes-empty-state');
    let visibleCount = 0;

    cards.forEach(card => {
        const cardOrigin = card.getAttribute('data-origin');
        const cardDest = card.getAttribute('data-destination');

        const matchesOrigin = (origin === 'todos' || cardOrigin === origin);
        const matchesDest = (destination === 'todos' || cardDest === destination);

        if (matchesOrigin && matchesDest) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Toggle Empty state view
    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }
}

/**
 * 3. Personal & Fleet Component Initializer
 * Filters gallery photos dynamically on user category clicks.
 */
function initPersonal() {
    const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to this one
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Show/Hide items based on filter choice
            galleryItems.forEach(item => {
                const itemVehicle = item.getAttribute('data-vehicle');
                if (filterValue === 'all' || itemVehicle === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}
