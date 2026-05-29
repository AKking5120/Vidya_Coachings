/**
 * Vidya Coachings - Admin Panel
 */
(function () {
    var MAX_IMAGE_MB = 5;
    var MAX_PDF_MB = 8;

    var loginScreen = document.getElementById('loginScreen');
    var adminApp = document.getElementById('adminApp');
    var loginForm = document.getElementById('loginForm');
    var loginError = document.getElementById('loginError');
    var apiWarning = document.getElementById('apiWarning');

    function show(el) { el.classList.remove('hidden'); }
    function hide(el) { el.classList.add('hidden'); }

    function showMsg(el, text, type) {
        el.textContent = text;
        el.className = 'form-msg ' + type;
        show(el);
        setTimeout(function () { hide(el); }, 5000);
    }

    function checkApiConfigured() {
        if (!VidyaCMS.getApiUrl()) {
            show(apiWarning);
            return false;
        }
        hide(apiWarning);
        return true;
    }

    function enterApp() {
        hide(loginScreen);
        show(adminApp);
        checkApiConfigured();
        loadGalleryList();
        loadDownloadsList();
    }

    function tryStoredLogin() {
        var key = VidyaCMS.getAdminKey();
        if (!key || !VidyaCMS.getApiUrl()) return;

        VidyaCMS.post({ action: 'verify', adminKey: key }).then(function (res) {
            if (res && res.success) enterApp();
        });
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        hide(loginError);

        var password = document.getElementById('adminPassword').value.trim();
        var configKey = (window.VIDYA_CONFIG && window.VIDYA_CONFIG.ADMIN_KEY) || '';

        if (!VidyaCMS.getApiUrl()) {
            loginError.textContent = 'Set CMS_API_URL in config.js first.';
            show(loginError);
            return;
        }

        VidyaCMS.post({ action: 'verify', adminKey: password }).then(function (res) {
            if (res && res.success) {
                VidyaCMS.setAdminKey(password);
                if (configKey && password !== configKey) {
                    /* server key is source of truth */
                }
                enterApp();
            } else {
                loginError.textContent = (res && res.error) || 'Wrong password';
                show(loginError);
            }
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', function () {
        VidyaCMS.setAdminKey('');
        location.reload();
    });

    /* Tabs */
    document.querySelectorAll('.admin-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
            document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('active'); });
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-panel')).classList.add('active');
        });
    });

    function adminKey() {
        return VidyaCMS.getAdminKey();
    }

    function readFileSizeMb(file) {
        return file ? file.size / (1024 * 1024) : 0;
    }

    function renderGalleryList(items) {
        var el = document.getElementById('galleryList');
        if (!items.length) {
            el.innerHTML = '<p class="loading-text">No items yet. Upload a photo above.</p>';
            return;
        }

        el.innerHTML = items.map(function (item) {
            var badge = item.approved
                ? '<span class="badge badge-yes">Live</span>'
                : '<span class="badge badge-pending">Hidden</span>';
            return (
                '<div class="admin-item" data-row="' + item.rowIndex + '">' +
                '<img class="admin-item-thumb" src="' + escapeAttr(item.url) + '" alt="">' +
                '<div class="admin-item-body">' +
                '<strong>' + escapeHtml(item.alt) + badge + '</strong>' +
                '<div class="admin-item-meta">' + escapeHtml(item.category) + ' · ' + escapeHtml(item.date) + '</div>' +
                '</div>' +
                '<div class="admin-item-actions">' +
                '<button type="button" class="btn-sm btn-approve' + (item.approved ? '' : ' off') + '" data-sheet="gallery" data-row="' + item.rowIndex + '" data-approved="' + !item.approved + '">' +
                (item.approved ? 'Hide' : 'Publish') + '</button>' +
                '<button type="button" class="btn-sm btn-delete" data-sheet="gallery" data-row="' + item.rowIndex + '">Delete</button>' +
                '</div></div>'
            );
        }).join('');

        bindListActions(el);
    }

    function renderDownloadsList(items) {
        var el = document.getElementById('downloadsList');
        if (!items.length) {
            el.innerHTML = '<p class="loading-text">No items yet. Upload a PDF above.</p>';
            return;
        }

        el.innerHTML = items.map(function (item) {
            var badge = item.approved
                ? '<span class="badge badge-yes">Live</span>'
                : '<span class="badge badge-pending">Hidden</span>';
            return (
                '<div class="admin-item">' +
                '<div class="admin-item-icon"><i class="fas fa-file-pdf"></i></div>' +
                '<div class="admin-item-body">' +
                '<strong>' + escapeHtml(item.title) + badge + '</strong>' +
                '<div class="admin-item-meta">' + escapeHtml(item.category) + ' · ' + escapeHtml(item.classLabel) + '</div>' +
                '</div>' +
                '<div class="admin-item-actions">' +
                '<button type="button" class="btn-sm btn-approve' + (item.approved ? '' : ' off') + '" data-sheet="downloads" data-row="' + item.rowIndex + '" data-approved="' + !item.approved + '">' +
                (item.approved ? 'Hide' : 'Publish') + '</button>' +
                '<button type="button" class="btn-sm btn-delete" data-sheet="downloads" data-row="' + item.rowIndex + '">Delete</button>' +
                '</div></div>'
            );
        }).join('');

        bindListActions(el);
    }

    function bindListActions(container) {
        container.querySelectorAll('.btn-approve').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var sheet = btn.getAttribute('data-sheet');
                var row = btn.getAttribute('data-row');
                var approved = btn.getAttribute('data-approved') === 'true';
                VidyaCMS.post({
                    action: 'setApproved',
                    adminKey: adminKey(),
                    sheet: sheet,
                    rowIndex: Number(row),
                    approved: approved
                }).then(function (res) {
                    if (res && res.success) {
                        VidyaCMS.invalidateCms();
                        if (sheet === 'gallery') loadGalleryList();
                        else loadDownloadsList();
                    }
                });
            });
        });

        container.querySelectorAll('.btn-delete').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (!confirm('Delete this item permanently?')) return;
                var sheet = btn.getAttribute('data-sheet');
                var row = btn.getAttribute('data-row');
                VidyaCMS.post({
                    action: 'delete',
                    adminKey: adminKey(),
                    sheet: sheet,
                    rowIndex: Number(row)
                }).then(function (res) {
                    if (res && res.success) {
                        VidyaCMS.invalidateCms();
                        if (sheet === 'gallery') loadGalleryList();
                        else loadDownloadsList();
                    }
                });
            });
        });
    }

    function loadGalleryList() {
        var el = document.getElementById('galleryList');
        el.innerHTML = '<p class="loading-text">Loading…</p>';
        VidyaCMS.adminGetGallery(adminKey()).then(renderGalleryList);
    }

    function loadDownloadsList() {
        var el = document.getElementById('downloadsList');
        el.innerHTML = '<p class="loading-text">Loading…</p>';
        VidyaCMS.adminGetDownloads(adminKey()).then(renderDownloadsList);
    }

    function escapeHtml(text) {
        var d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    function escapeAttr(text) {
        return String(text || '').replace(/"/g, '&quot;');
    }

    /* Gallery form */
    document.getElementById('galleryForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('galleryFormMsg');
        var fileInput = document.getElementById('galleryFile');
        var url = document.getElementById('galleryUrl').value.trim();
        var file = fileInput.files[0];

        if (!file && !url) {
            showMsg(msg, 'Choose a file or paste an image URL.', 'error');
            return;
        }

        if (file && readFileSizeMb(file) > MAX_IMAGE_MB) {
            showMsg(msg, 'Image must be under ' + MAX_IMAGE_MB + ' MB.', 'error');
            return;
        }

        var btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;

        var payload = {
            action: 'addGallery',
            adminKey: adminKey(),
            alt: document.getElementById('galleryAlt').value.trim() || 'Gallery photo',
            category: document.getElementById('galleryCategory').value,
            url: url,
            autoApprove: document.getElementById('galleryAutoApprove').checked
        };

        var promise = file
            ? VidyaCMS.fileToBase64(file).then(function (b64) {
                payload.fileBase64 = b64;
                payload.mimeType = file.type;
                payload.fileName = file.name;
                return VidyaCMS.post(payload);
            })
            : VidyaCMS.post(payload);

        promise.then(function (res) {
            btn.disabled = false;
            if (res && res.success) {
                VidyaCMS.invalidateCms();
                showMsg(msg, (res.message || 'Photo added!') + ' Gallery refresh in 5–10 sec.', 'success');
                e.target.reset();
                loadGalleryList();
            } else {
                showMsg(msg, (res && res.error) || 'Upload failed', 'error');
            }
        });
    });

    /* Download form */
    document.getElementById('downloadForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('downloadFormMsg');
        var fileInput = document.getElementById('downloadFile');
        var url = document.getElementById('downloadUrl').value.trim();
        var file = fileInput.files[0];

        if (!file && !url) {
            showMsg(msg, 'Choose a PDF or paste a file URL.', 'error');
            return;
        }

        if (file && readFileSizeMb(file) > MAX_PDF_MB) {
            showMsg(msg, 'PDF must be under ' + MAX_PDF_MB + ' MB.', 'error');
            return;
        }

        var btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;

        var payload = {
            action: 'addDownload',
            adminKey: adminKey(),
            title: document.getElementById('downloadTitle').value.trim(),
            category: document.getElementById('downloadCategory').value,
            classLabel: document.getElementById('downloadClass').value.trim(),
            date: document.getElementById('downloadDate').value.trim(),
            type: 'pdf',
            url: url,
            autoApprove: document.getElementById('downloadAutoApprove').checked
        };

        var promise = file
            ? VidyaCMS.fileToBase64(file).then(function (b64) {
                payload.fileBase64 = b64;
                payload.mimeType = file.type;
                payload.fileName = file.name;
                return VidyaCMS.post(payload);
            })
            : VidyaCMS.post(payload);

        promise.then(function (res) {
            btn.disabled = false;
            if (res && res.success) {
                VidyaCMS.invalidateCms();
                showMsg(msg, (res.message || 'File added!') + ' Downloads page refresh to see.', 'success');
                e.target.reset();
                document.getElementById('downloadClass').value = 'All Classes';
                document.getElementById('downloadDate').value = '2026';
                loadDownloadsList();
            } else {
                showMsg(msg, (res && res.error) || 'Upload failed', 'error');
            }
        });
    });

    document.addEventListener('DOMContentLoaded', tryStoredLogin);
})();
