import { categories } from './data.js';
import { createCarousel } from './components/Carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    // Load active profile from localStorage
    const activeProfileData = localStorage.getItem('activeProfile');
    function resolveProfileImagePath(imagePath) {
        if (!imagePath || typeof imagePath !== 'string') return imagePath;
        if (imagePath.startsWith('../') || imagePath.startsWith('/')) {
            return imagePath;
        }
        if (imagePath.startsWith('img/')) {
            return `../${imagePath}`;
        }
        if (imagePath.startsWith('./img/')) {
            return imagePath.replace(/^\.\/img\//, '../img/');
        }
        return imagePath;
    }

    if (activeProfileData) {
        try {
            const activeProfile = JSON.parse(activeProfileData);
            const kidsLink = document.querySelector('.kids-link');
            const profileIcon = document.querySelector('.profile-icon');
            
            if (kidsLink && activeProfile.name) {
                kidsLink.textContent = activeProfile.name;
            }
            if (profileIcon && activeProfile.image) {
                profileIcon.src = resolveProfileImagePath(activeProfile.image);
                profileIcon.alt = activeProfile.name || 'Perfil';
            }
        } catch (error) {
            console.error('Error parsing active profile data:', error);
        }
    }

    // Notification dropdown functionality
    const notificationIcon = document.querySelector('.nav-notification');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const miniNavbar = document.querySelector('.mini-navbar');

    if (notificationIcon && notificationDropdown) {
        notificationIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
            
            // Move mini navbar when notification is open
            if (miniNavbar) {
                if (notificationDropdown.classList.contains('show')) {
                    miniNavbar.style.transform = 'translateX(-50px)';
                } else {
                    miniNavbar.style.transform = 'translateX(0)';
                }
            }
        });

        // Close notification dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationIcon.contains(e.target)) {
                notificationDropdown.classList.remove('show');
                if (miniNavbar) {
                    miniNavbar.style.transform = 'translateX(0)';
                }
            }
        });
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

    // Search functionality
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container');
    const navbarRight = document.querySelector('.navbar-right');
    const mainContent = document.getElementById('main-content');

    // Toggle search input
    searchIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        searchContainer.classList.toggle('active');
        navbarRight.classList.toggle('search-active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            mainContent.innerHTML = '';
            categories.forEach((category, index) => {
                const carousel = createCarousel(category, index);
                mainContent.appendChild(carousel);
            });
        }
    });

    // Handle search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            mainContent.innerHTML = '';
            categories.forEach((category, index) => {
                const carousel = createCarousel(category, index);
                mainContent.appendChild(carousel);
            });
            return;
        }

        // Filter items by search term
        const filteredCategories = categories.map(category => ({
            ...category,
            items: category.items.filter(item =>
                item.nome.toLowerCase().includes(searchTerm)
            )
        })).filter(category => category.items.length > 0);

        // Render filtered results
        mainContent.innerHTML = '';
        if (filteredCategories.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.cssText = `
                padding: 40px 20px;
                text-align: center;
                color: rgba(255, 255, 255, 0.7);
                font-size: 18px;
            `;
            emptyMessage.textContent = 'Nenhum resultado encontrado para: ' + e.target.value;
            mainContent.appendChild(emptyMessage);
        } else {
            filteredCategories.forEach((category, index) => {
                const carousel = createCarousel(category, index);
                mainContent.appendChild(carousel);
            });
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && !mainContent.contains(e.target)) {
            if (searchContainer.classList.contains('active')) {
                searchContainer.classList.remove('active');
                navbarRight.classList.remove('search-active');
                searchInput.value = '';
                mainContent.innerHTML = '';
                categories.forEach((category, index) => {
                    const carousel = createCarousel(category, index);
                    mainContent.appendChild(carousel);
                });
            }
        }
    });

    // Close search with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
            searchContainer.classList.remove('active');
            navbarRight.classList.remove('search-active');
            searchInput.value = '';
            mainContent.innerHTML = '';
            categories.forEach((category, index) => {
                const carousel = createCarousel(category, index);
                mainContent.appendChild(carousel);
            });
        }
    });

});
