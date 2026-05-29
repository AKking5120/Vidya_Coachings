/**
 * Admin-uploaded gallery photos — fast load, reliable Google Drive images.
 */
(function () {
    var injected = false;

    function normalizeImageUrl(item) {
        var url = String(item.url || '');
        var fileId = String(item.fileId || '');
        if (fileId) {
            return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(fileId) + '&sz=w1200';
        }
        var m = url.match(/[?&]id=([^&]+)/);
        if (m && m[1] && url.indexOf('drive.google.com') !== -1) {
            return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(m[1]) + '&sz=w1200';
        }
        return url;
    }

    function escapeAttrUrl(url) {
        return String(url || '').replace(/"/g, '%22');
    }

    function escapeAlt(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
    }

    function photoHtml(item, eager) {
        var src = normalizeImageUrl(item);
        var fid = String(item.fileId || '');
        var loadAttr = eager ? ' loading="eager" fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"';
        var fallback = fid
            ? ' onerror="if(!this.dataset.tried){this.dataset.tried=1;this.src=\'https://drive.google.com/thumbnail?id=' + encodeURIComponent(fid) + '&sz=w800\';}"'
            : '';

        return (
            '<div class="photo-item cms-photo" onclick="openLightbox(this)">' +
            '<img src="' + escapeAttrUrl(src) + '" alt="' + escapeAlt(item.alt) + '"' + loadAttr + fallback + '>' +
            '</div>'
        );
    }

    function removeCmsPhotos() {
        document.querySelectorAll('.photo-item.cms-photo').forEach(function (el) {
            el.parentNode.removeChild(el);
        });
    }

    function injectIntoGrid(sectionId, html) {
        var section = document.getElementById(sectionId);
        if (!section) return;
        var grid = section.querySelector('.photo-grid');
        if (!grid || !html) return;
        grid.insertAdjacentHTML('afterbegin', html);
    }

    function injectPhotos(items) {
        if (!items || !items.length) return;

        removeCmsPhotos();

        var allHtml = '';
        var studentsHtml = '';
        var alumniHtml = '';
        var achievementsHtml = '';

        items.forEach(function (item, index) {
            var eager = index === 0;
            var block = photoHtml(item, eager);
            var cat = (item.category || '').toLowerCase();
            allHtml += block;
            if (cat === 'students') studentsHtml += block;
            else if (cat === 'alumni') alumniHtml += block;
            else if (cat === 'achievements') achievementsHtml += block;
        });

        if (allHtml) injectIntoGrid('all-photos', allHtml);
        if (studentsHtml) injectIntoGrid('students', studentsHtml);
        if (alumniHtml) injectIntoGrid('alumni', alumniHtml);
        if (achievementsHtml) injectIntoGrid('achievements', achievementsHtml);

        injected = true;

        if (typeof window.refreshGalleryCounts === 'function') {
            window.refreshGalleryCounts();
        }
    }

    function applyGallery(items) {
        if (!items || !items.length) return;
        injectPhotos(items);
    }

    function showLoader() {
        document.addEventListener('DOMContentLoaded', function () {
            if (document.getElementById('cms-gallery-status')) return;
            var block = document.getElementById('all-photos');
            if (!block) return;
            var p = document.createElement('p');
            p.id = 'cms-gallery-status';
            p.className = 'cms-gallery-status';
            p.innerHTML = '<i class="fas fa-spinner fa-spin"></i> New photos loading…';
            var grid = block.querySelector('.photo-grid');
            if (grid) block.insertBefore(p, grid);
        });
    }

    function hideLoader() {
        var p = document.getElementById('cms-gallery-status');
        if (p) p.remove();
    }

    function start() {
        if (!window.VidyaCMS || !VidyaCMS.getApiUrl()) return;

        var cached = VidyaCMS.getCachedGallery();
        if (cached && cached.length) {
            document.addEventListener('DOMContentLoaded', function () {
                applyGallery(cached);
            });
        } else {
            showLoader();
        }

        VidyaCMS.getGallery().then(function (items) {
            hideLoader();
            applyGallery(items);
        });

        window.addEventListener('vidya-cms-updated', function (e) {
            if (e.detail && e.detail.action === 'gallery' && e.detail.data) {
                applyGallery(e.detail.data);
            }
        });
    }

    start();
})();
