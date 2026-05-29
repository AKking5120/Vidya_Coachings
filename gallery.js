/* Vidya Coachings - Gallery Page */

(function () {
    let currentSection = 'all-photos';
    let currentIndex = 0;
    let allPhotos = [];

    function loadSectionPhotos(sectionId) {
        var section = document.getElementById(sectionId);
        if (!section) return;
        var photos = section.querySelectorAll('.photo-item');
        allPhotos = [];
        photos.forEach(function (photo) {
            var img = photo.querySelector('img');
            if (img) {
                allPhotos.push({ src: img.src, alt: img.alt });
            }
        });
        var totalEl = document.getElementById('total-num');
        if (totalEl) totalEl.textContent = allPhotos.length;
    }

    window.showSection = function (sectionId, btn) {
        currentSection = sectionId;
        document.querySelectorAll('.section-block').forEach(function (section) {
            section.classList.remove('active');
        });
        var target = document.getElementById(sectionId);
        if (target) target.classList.add('active');

        document.querySelectorAll('.tab-btn').forEach(function (tab) {
            tab.classList.remove('active');
        });
        if (btn) btn.classList.add('active');

        loadSectionPhotos(sectionId);
        window.scrollTo({ top: document.querySelector('.gallery-tabs-bar').offsetTop - 72, behavior: 'smooth' });
    };

    window.openLightbox = function (element) {
        var section = document.getElementById(currentSection);
        var photos = Array.from(section.querySelectorAll('.photo-item'));
        currentIndex = photos.indexOf(element);
        loadSectionPhotos(currentSection);

        document.getElementById('lightbox-img').src = element.querySelector('img').src;
        document.getElementById('lightbox-img').alt = element.querySelector('img').alt;
        document.getElementById('current-num').textContent = currentIndex + 1;
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    };

    window.prevPhoto = function () {
        currentIndex = (currentIndex - 1 + allPhotos.length) % allPhotos.length;
        showPhoto(currentIndex);
    };

    window.nextPhoto = function () {
        currentIndex = (currentIndex + 1) % allPhotos.length;
        showPhoto(currentIndex);
    };

    function showPhoto(index) {
        var photo = allPhotos[index];
        document.getElementById('lightbox-img').src = photo.src;
        document.getElementById('lightbox-img').alt = photo.alt;
        document.getElementById('current-num').textContent = index + 1;
        currentIndex = index;
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.photo-item img').forEach(function (img) {
            img.loading = 'lazy';
        });

        document.querySelectorAll('.tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                showSection(this.getAttribute('data-section'), this);
            });
        });

        var menuToggle = document.getElementById('menuToggle');
        var mobileMenu = document.getElementById('mobileMenu');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function () {
                mobileMenu.classList.toggle('active');
                var icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });
            mobileMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    mobileMenu.classList.remove('active');
                });
            });
        }

        document.addEventListener('keydown', function (e) {
            if (!document.getElementById('lightbox').classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
        });

        document.getElementById('lightbox').addEventListener('click', function (e) {
            if (e.target === this) closeLightbox();
        });

        loadSectionPhotos('all-photos');
    });

    window.refreshGalleryCounts = function () {
        var sections = {
            'all-photos': document.querySelector('.tab-btn[data-section="all-photos"] .tab-count'),
            students: document.querySelector('.tab-btn[data-section="students"] .tab-count'),
            alumni: document.querySelector('.tab-btn[data-section="alumni"] .tab-count'),
            achievements: document.querySelector('.tab-btn[data-section="achievements"] .tab-count')
        };

        Object.keys(sections).forEach(function (id) {
            var section = document.getElementById(id);
            var countEl = sections[id];
            if (!section || !countEl) return;
            var n = section.querySelectorAll('.photo-item').length;
            countEl.textContent = n;
        });

        var stats = document.querySelectorAll('.gallery-stat strong');
        if (stats[0]) {
            var total = document.querySelectorAll('#all-photos .photo-item').length;
            stats[0].textContent = total + '+';
        }
    };
})();
