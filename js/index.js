// Armazenar o perfil ativo no localStorage quando clicar em um perfil
document.addEventListener('DOMContentLoaded', function() {
    const profiles = document.querySelectorAll('.profile');
    
    profiles.forEach(profile => {
        profile.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Evitar redirecionamento padrão por enquanto para capturar dados
            const img = this.querySelector('img');
            const name = this.querySelector('figcaption').textContent;
            const imageSrc = img.src;
            const href = this.href;
            
            // Armazenar perfil no localStorage
            const profileData = {
                name: name,
                image: imageSrc
            };
            
            localStorage.setItem('activeProfile', JSON.stringify(profileData));
            
            // Add exit animation
            document.body.classList.add('page-exit');
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
});
