document.addEventListener('DOMContentLoaded', function() {
    const profilesKey = 'disneyProfiles';
    const profilesNav = document.getElementById('profiles-list');
    const profileModal = document.getElementById('profile-modal');
    const modalTitle = document.getElementById('modal-title');
    const profileForm = document.getElementById('profile-form');
    const profileNameInput = document.getElementById('profile-name');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const modalClose = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-btn');
    const editProfilesLink = document.getElementById('edit-profiles');
    const body = document.body;

    const defaultProfiles = [
        { id: 1, name: 'Caio', image: 'img/perfil1.jpg' },
        { id: 2, name: 'Ana', image: 'img/perfil2.jpg' },
        { id: 3, name: 'Edson', image: 'img/perfil3.jpg' }
    ];

    let profiles = JSON.parse(localStorage.getItem(profilesKey)) || defaultProfiles;
    let currentMode = 'edit';
    let editingProfileId = null;
    let selectedImage = defaultProfiles[0].image;

    function saveProfiles() {
        localStorage.setItem(profilesKey, JSON.stringify(profiles));
    }

    function getNextId() {
        return profiles.reduce((maxId, profile) => Math.max(maxId, profile.id), 0) + 1;
    }

    function findProfileById(id) {
        return profiles.find(profile => profile.id === id);
    }

    function normalizeProfileImagePath(imagePath) {
        if (!imagePath || typeof imagePath !== 'string') return imagePath;
        if (imagePath.startsWith('../img/')) {
            return imagePath.replace('../img/', 'img/');
        }
        if (imagePath.startsWith('/img/')) {
            return imagePath.replace('/img/', 'img/');
        }
        return imagePath;
    }

    function setSelectedAvatar(image) {
        selectedImage = normalizeProfileImagePath(image);
        avatarOptions.forEach(option => {
            option.classList.toggle('selected', option.dataset.image === selectedImage);
        });
    }

    function renderProfiles() {
        profilesNav.innerHTML = '';

        if (profiles.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Nenhum perfil disponível. Adicione um perfil para continuar.';
            emptyMessage.style.color = '#fff';
            profilesNav.appendChild(emptyMessage);
        }

        profiles.forEach(profile => {
            const profileLink = document.createElement('a');
            profileLink.className = 'profile';
            profileLink.href = 'catalogo/catalogo.html';
            profileLink.dataset.profileId = profile.id;
            profileLink.innerHTML = `
                <figure>
                    <img src="${profile.image}" alt="${profile.name}">
                    <figcaption>${profile.name}</figcaption>
                </figure>
                <button type="button" class="edit-profile-btn" ${currentMode !== 'none' ? '' : 'hidden'}>✎</button>
            `;
            profilesNav.appendChild(profileLink);
        });

        const addProfileButton = document.createElement('button');
        addProfileButton.className = 'profile add-profile';
        addProfileButton.type = 'button';
        addProfileButton.id = 'add-profile-btn';
        addProfileButton.innerHTML = `
            <figure>
                <div class="add-icon">+</div>
                <figcaption>Criar novo perfil</figcaption>
            </figure>
        `;

        profilesNav.appendChild(addProfileButton);
    }

    function updateEditButtons() {
        document.querySelectorAll('.edit-profile-btn').forEach(button => {
            button.hidden = currentMode === 'none';
            if (currentMode === 'edit') {
                button.textContent = '✎';
                button.style.color = '#fff';
                button.setAttribute('aria-label', `Editar perfil ${button.closest('.profile').querySelector('figcaption').textContent}`);
            } else if (currentMode === 'delete') {
                button.textContent = '❌';
                button.style.color = 'white';
                button.setAttribute('aria-label', `Excluir perfil ${button.closest('.profile').querySelector('figcaption').textContent}`);
            }
        });

        if (currentMode === 'edit') {
            editProfilesLink.textContent = 'Excluir Perfil';
        } else {
            editProfilesLink.textContent = 'Editar Perfis';
        }
    }

    function openModal(mode, profileId = null) {
        editingProfileId = profileId;

        if (mode === 'edit' && profileId !== null) {
            const profile = findProfileById(profileId);
            if (!profile) {
                return;
            }
            modalTitle.textContent = 'Editar perfil';
            profileNameInput.value = profile.name;
            setSelectedAvatar(profile.image);
        } else {
            modalTitle.textContent = 'Adicionar perfil';
            profileNameInput.value = '';
            setSelectedAvatar(defaultProfiles[0].image);
        }

        profileModal.classList.remove('hidden');
        profileModal.setAttribute('aria-hidden', 'false');
        body.classList.add('modal-open');
        profileNameInput.focus();
    }

    function closeModal() {
        profileModal.classList.add('hidden');
        profileModal.setAttribute('aria-hidden', 'true');
        body.classList.remove('modal-open');
        editingProfileId = null;
        currentMode = 'edit';
        updateEditButtons();
    }

    profilesNav.addEventListener('click', function(event) {
        const editButton = event.target.closest('.edit-profile-btn');
        if (editButton) {
            event.preventDefault();
            const profileCard = editButton.closest('.profile');
            const profileId = Number(profileCard.dataset.profileId);
            if (currentMode === 'edit') {
                openModal('edit', profileId);
            } else if (currentMode === 'delete') {
                profiles = profiles.filter(p => p.id !== profileId);
                saveProfiles();
                renderProfiles();
                updateEditButtons();
            }
            return;
        }

        const addButton = event.target.closest('.add-profile');
        if (addButton) {
            openModal('add');
            return;
        }

        const profileLink = event.target.closest('a.profile');
        if (profileLink) {
            event.preventDefault();
            const profileId = Number(profileLink.dataset.profileId);
            const profile = findProfileById(profileId);
            if (!profile) {
                return;
            }

            profile.image = normalizeProfileImagePath(profile.image);
            localStorage.setItem('activeProfile', JSON.stringify(profile));
            body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = profileLink.href;
            }, 400);
        }
    });

    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            setSelectedAvatar(this.dataset.image);
        });
    });

    editProfilesLink.addEventListener('click', function(event) {
        event.preventDefault();
        currentMode = currentMode === 'edit' ? 'delete' : 'edit';
        updateEditButtons();
    });

    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    profileModal.addEventListener('click', function(event) {
        if (event.target === profileModal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !profileModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = profileNameInput.value.trim();
        if (name.length === 0) {
            return;
        }

        if (editingProfileId !== null) {
            const profile = findProfileById(editingProfileId);
            if (profile) {
                profile.name = name;
                profile.image = selectedImage;
            }
        } else {
            profiles.push({
                id: getNextId(),
                name: name,
                image: selectedImage
            });
        }

        saveProfiles();
        renderProfiles();
        closeModal();
    });

    renderProfiles();
    setSelectedAvatar(selectedImage);
    updateEditButtons();
});
