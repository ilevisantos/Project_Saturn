// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
} else {
    themeToggle.textContent = '🌙';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

// Dropdown Menu Functionality
const configBtn = document.getElementById('config-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

// Toggle dropdown on button click
configBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    dropdownMenu.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!configBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Optional: Close dropdown on menu item click
dropdownMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        dropdownMenu.classList.remove('show');
        // Here you can add navigation logic if needed
        // e.g., window.location.href = e.target.href;
    }
});
