import { categories } from './data.js';
import { createCarousel } from './components/Carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    const nomePerfil = localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('perfilAtivoImagem');

    if (nomePerfil && imagemPerfil) {
        const kidsLink = document.querySelector('.kids-link');
        const profileIcon = document.querySelector('.profile-icon');
        
        if (kidsLink) kidsLink.textContent = nomePerfil;
        if (profileIcon) profileIcon.src = imagemPerfil;
    }

    const allItems = categories.flatMap((category, categoryIndex) =>
        category.items.map((item, itemIndex) => ({
            ...item,
            categoryTitle: category.title,
            categoryIndex,
            itemIndex
        }))
    );

    let showcaseIndex = 0;
    const showcaseImg = document.getElementById('showcase-img');
    const showcaseTitle = document.getElementById('showcase-title');
    const showcaseDescription = document.getElementById('showcase-description');
    const showcasePrev = document.getElementById('showcase-prev');
    const showcaseNext = document.getElementById('showcase-next');

    const renderShowcase = (index) => {
        if (!allItems.length) return;
        showcaseIndex = ((index % allItems.length) + allItems.length) % allItems.length;

        const item = allItems[showcaseIndex];
        showcaseImg.src = item.img;
        showcaseImg.alt = `Conteúdo em destaque: ${item.nome}`;
        showcaseTitle.textContent = item.nome;
        showcaseDescription.textContent = item.descrição;
    };

    showcasePrev.addEventListener('click', () => renderShowcase(showcaseIndex - 1));
    showcaseNext.addEventListener('click', () => renderShowcase(showcaseIndex + 1));

    document.addEventListener('showcase-select', (event) => {
        const { categoryIndex, itemIndex } = event.detail;
        const newIndex = allItems.findIndex((item) => item.categoryIndex === Number(categoryIndex) && item.itemIndex === Number(itemIndex));
        if (newIndex >= 0) {
            renderShowcase(newIndex);
        }
    });

    renderShowcase(0);

    const container = document.getElementById('main-content');
    
    if (container) {
        categories.forEach((category, index) => {
            const carousel = createCarousel(category, index);
            container.appendChild(carousel);
        });
    }

    // Drag functionality for mobile/tablet sliders
    const initDragFunctionality = () => {
        const movieRows = document.querySelectorAll('.movie-row');
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

        if (!isMobile && !isTablet) return; // Only enable on mobile/tablet

        movieRows.forEach(row => {
            let isDragging = false;
            let startX;
            let scrollLeft;
            let velocity = 0;
            let lastX = 0;
            let lastTime = 0;
            let hasMoved = false;

            const startDrag = (e) => {
                isDragging = true;
                hasMoved = false;
                row.classList.add('dragging');
                startX = (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX) - row.offsetLeft;
                scrollLeft = row.scrollLeft;
                lastX = startX;
                lastTime = Date.now();
                velocity = 0;
                e.preventDefault(); // Prevent default touch behavior
            };

            const drag = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const walk = (x - startX) * 2; // Scroll speed multiplier
                row.scrollLeft = scrollLeft - walk;
                hasMoved = true;

                // Calculate velocity for momentum
                const now = Date.now();
                const deltaTime = now - lastTime;
                if (deltaTime > 0) {
                    velocity = (x - lastX) / deltaTime;
                }
                lastX = x;
                lastTime = now;
            };

            const endDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                row.classList.remove('dragging');

                // Apply momentum scrolling only if user actually dragged
                if (hasMoved && Math.abs(velocity) > 0.5) {
                    const momentumScroll = velocity * 100; // Adjust momentum strength
                    const finalScroll = row.scrollLeft - momentumScroll;
                    row.scrollTo({
                        left: finalScroll,
                        behavior: 'smooth'
                    });
                }
            };

            // Mouse events
            row.addEventListener('mousedown', startDrag);
            row.addEventListener('mousemove', drag);
            row.addEventListener('mouseup', endDrag);
            row.addEventListener('mouseleave', endDrag);

            // Touch events
            row.addEventListener('touchstart', startDrag, { passive: false });
            row.addEventListener('touchmove', drag, { passive: false });
            row.addEventListener('touchend', endDrag);
        });
    };

    // Initialize drag functionality
    initDragFunctionality();

    // Re-initialize on window resize
    window.addEventListener('resize', () => {
        setTimeout(initDragFunctionality, 100);
    });
});
