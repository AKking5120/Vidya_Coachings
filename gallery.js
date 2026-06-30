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

    function injectDataPhotos() {
        var CAT_SECTION = { general: 'all-photos', students: 'students', alumni: 'alumni', achievements: 'achievements' };
        var photos = window.VIDYA_GALLERY || [];
        if (!photos.length) return;

        function escAttr(s) {
            return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        }

        photos.forEach(function (item) {
            var sectionId = CAT_SECTION[item.cat] || 'all-photos';
            var section = document.getElementById(sectionId);
            if (!section) return;
            var grid = section.querySelector('.photo-grid');
            if (grid) {
                grid.insertAdjacentHTML('afterbegin',
                    '<div class="photo-item" onclick="openLightbox(this)">' +
                    '<img src="' + escAttr(item.src) + '" alt="' + escAttr(item.alt) + '" loading="lazy"></div>');
            }
        });

        document.querySelectorAll('.tab-btn').forEach(function (btn) {
            var id = btn.getAttribute('data-section');
            var sec = document.getElementById(id);
            var countEl = btn.querySelector('.tab-count');
            if (sec && countEl) countEl.textContent = sec.querySelectorAll('.photo-item').length;
        });
        var stat = document.querySelector('.gallery-stat strong');
        var allGrid = document.getElementById('all-photos');
        if (stat && allGrid) stat.textContent = allGrid.querySelectorAll('.photo-item').length + '+';
    }

    document.addEventListener('DOMContentLoaded', function () {
        injectDataPhotos();
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
})();
