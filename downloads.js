/* Vidya Coachings - Downloads Page */

/** Optional local files (folder uploads without admin) */
const STATIC_DOWNLOAD_ITEMS = [];

let DOWNLOAD_ITEMS = STATIC_DOWNLOAD_ITEMS.slice();

(function () {
    let currentSection = 'all-downloads';

    function getIcon(type) {
        if (type === 'image') return 'fa-file-image';
        return 'fa-file-pdf';
    }

    function getTypeLabel(type) {
        return type === 'image' ? 'Image' : 'PDF';
    }

    function renderCard(item) {
        const icon = getIcon(item.type);
        const typeLabel = getTypeLabel(item.type);
        const catLabel = item.category === 'notes' ? 'Notes' : 'Circular';
        const fileUrl = item.file || item.url || '';

        return (
            '<article class="download-card ' + item.category + '">' +
            '<div class="download-icon"><i class="fas ' + icon + '"></i></div>' +
            '<span class="download-badge">' + catLabel + '</span>' +
            '<h3>' + escapeHtml(item.title) + '</h3>' +
            '<p class="download-meta">' +
            '<span><i class="fas fa-graduation-cap"></i> ' + escapeHtml(item.classLabel) + '</span>' +
            '<span><i class="fas fa-calendar"></i> ' + escapeHtml(item.date) + '</span>' +
            '<span><i class="fas fa-file"></i> ' + typeLabel + '</span>' +
            '</p>' +
            '<div class="download-actions">' +
            '<a href="' + escapeAttr(fileUrl) + '" class="btn-download" download><i class="fas fa-download"></i> Download</a>' +
            '<a href="' + escapeAttr(fileUrl) + '" class="btn-view" target="_blank" rel="noopener"><i class="fas fa-eye"></i> View</a>' +
            '</div></article>'
        );
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function escapeAttr(text) {
        return String(text || '').replace(/"/g, '&quot;');
    }

    function getItemsForSection(sectionId) {
        if (sectionId === 'all-downloads') return DOWNLOAD_ITEMS;
        return DOWNLOAD_ITEMS.filter(function (item) {
            return item.category === sectionId;
        });
    }

    function renderSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const grid = section.querySelector('.download-grid');
        const items = getItemsForSection(sectionId);

        if (!items.length) {
            grid.innerHTML =
                '<div class="downloads-empty">' +
                '<i class="fas fa-folder-open"></i>' +
                '<p>No files in this section yet.</p>' +
                '</div>';
            return;
        }

        grid.innerHTML = items.map(renderCard).join('');
    }

    function renderAllSections() {
        ['all-downloads', 'notes', 'circulars'].forEach(renderSection);
        updateTabCounts();
        updateHeroCounts();
    }

    function updateTabCounts() {
        document.querySelectorAll('.tab-btn').forEach(function (btn) {
            const id = btn.getAttribute('data-section');
            const count = getItemsForSection(id).length;
            const countEl = btn.querySelector('.tab-count');
            if (countEl) countEl.textContent = count;
        });
    }

    function updateHeroCounts() {
        var notes = DOWNLOAD_ITEMS.filter(function (i) { return i.category === 'notes'; }).length;
        var circulars = DOWNLOAD_ITEMS.filter(function (i) { return i.category === 'circulars'; }).length;
        var allEl = document.getElementById('countAll');
        var notesEl = document.getElementById('countNotes');
        var circEl = document.getElementById('countCirculars');
        if (allEl) allEl.textContent = DOWNLOAD_ITEMS.length;
        if (notesEl) notesEl.textContent = notes;
        if (circEl) circEl.textContent = circulars;
    }

    function mergeCmsDownloads(cmsItems) {
        if (!cmsItems || !cmsItems.length) return;
        cmsItems.forEach(function (item) {
            DOWNLOAD_ITEMS.unshift({
                title: item.title,
                category: item.category,
                classLabel: item.classLabel,
                date: item.date,
                file: item.file,
                type: item.type || 'pdf'
            });
        });
    }

    window.showDownloadSection = function (sectionId, btn) {
        currentSection = sectionId;

        document.querySelectorAll('.section-block').forEach(function (block) {
            block.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        document.querySelectorAll('.tab-btn').forEach(function (tab) {
            tab.classList.remove('active');
        });
        if (btn) btn.classList.add('active');

        const bar = document.querySelector('.gallery-tabs-bar');
        if (bar) {
            window.scrollTo({ top: bar.offsetTop - 72, behavior: 'smooth' });
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        function initPage() {
            renderAllSections();

            document.querySelectorAll('.tab-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    showDownloadSection(this.getAttribute('data-section'), this);
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
        }

        function loadCmsAndInit(items) {
            DOWNLOAD_ITEMS = STATIC_DOWNLOAD_ITEMS.slice();
            mergeCmsDownloads(items || []);
            initPage();
        }

        if (window.VidyaCMS && VidyaCMS.getApiUrl()) {
            var cached = VidyaCMS.getCachedDownloads();
            if (cached && cached.length) {
                loadCmsAndInit(cached);
            }
            VidyaCMS.getDownloads().then(loadCmsAndInit);
            window.addEventListener('vidya-cms-updated', function (e) {
                if (e.detail && e.detail.action === 'downloads') {
                    DOWNLOAD_ITEMS = STATIC_DOWNLOAD_ITEMS.slice();
                    loadCmsAndInit(e.detail.data);
                }
            });
        } else {
            initPage();
        }
    });
})();
