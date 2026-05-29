/**
 * Vidya Coachings - CMS API helpers (gallery & downloads)
 * Uses localStorage cache so photos/files show fast on repeat visits.
 */
(function (global) {
    var CACHE_PREFIX = 'vidya_cms_';
    var CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

    function getApiUrl() {
        return (global.VIDYA_CONFIG && global.VIDYA_CONFIG.CMS_API_URL) || '';
    }

    function cacheKey(action) {
        return CACHE_PREFIX + action;
    }

    function readCache(action) {
        try {
            var raw = localStorage.getItem(cacheKey(action));
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.data)) return null;
            if (Date.now() - parsed.t > CACHE_MAX_AGE_MS) {
                localStorage.removeItem(cacheKey(action));
                return null;
            }
            return parsed.data;
        } catch (e) {
            return null;
        }
    }

    function writeCache(action, data) {
        try {
            localStorage.setItem(cacheKey(action), JSON.stringify({
                t: Date.now(),
                data: Array.isArray(data) ? data : []
            }));
        } catch (e) { /* quota */ }
    }

    function clearCache(action) {
        try {
            if (action) {
                localStorage.removeItem(cacheKey(action));
            } else {
                ['gallery', 'downloads'].forEach(function (a) {
                    localStorage.removeItem(cacheKey(a));
                });
            }
        } catch (e) { /* ignore */ }
    }

    function fetchJson(url) {
        return fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' })
            .then(function (r) { return r.json(); })
            .catch(function () { return null; });
    }

    function fetchJsonp(url, callbackName) {
        return new Promise(function (resolve) {
            var cb = callbackName || 'vidyaCmsCb_' + Date.now();
            var script = document.createElement('script');
            var timer = setTimeout(function () {
                cleanup();
                resolve(null);
            }, 12000);

            function cleanup() {
                clearTimeout(timer);
                delete global[cb];
                if (script.parentNode) script.parentNode.removeChild(script);
            }

            global[cb] = function (data) {
                cleanup();
                resolve(data);
            };

            var sep = url.indexOf('?') >= 0 ? '&' : '?';
            script.src = url + sep + 'callback=' + cb + '&_=' + Date.now();
            script.onerror = function () {
                cleanup();
                resolve(null);
            };
            document.head.appendChild(script);
        });
    }

    function cmsGetRaw(action) {
        var base = getApiUrl();
        if (!base) return Promise.resolve([]);
        var url = base + (base.indexOf('?') >= 0 ? '&' : '?') + 'action=' + encodeURIComponent(action) + '&_=' + Date.now();
        var loader = location.protocol === 'file:'
            ? fetchJsonp(url)
            : fetchJson(url);

        return loader.then(function (d) {
            var list = Array.isArray(d) ? d : [];
            writeCache(action, list);
            return list;
        });
    }

    function cmsGet(action, useCache) {
        if (useCache !== false) {
            var cached = readCache(action);
            if (cached) {
                cmsGetRaw(action).then(function (fresh) {
                    global.dispatchEvent(new CustomEvent('vidya-cms-updated', {
                        detail: { action: action, data: fresh }
                    }));
                });
                return Promise.resolve(cached);
            }
        }
        return cmsGetRaw(action);
    }

    function cmsPost(payload) {
        var base = getApiUrl();
        if (!base) {
            return Promise.resolve({ success: false, error: 'CMS API not configured' });
        }
        return fetch(base, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        })
            .then(function (r) { return r.json(); })
            .catch(function () {
                return { success: false, error: 'Network error. Redeploy script with Anyone access.' };
            });
    }

    function getAdminKey() {
        try {
            return sessionStorage.getItem('vidya_admin_key') || '';
        } catch (e) {
            return '';
        }
    }

    function setAdminKey(key) {
        try {
            if (key) sessionStorage.setItem('vidya_admin_key', key);
            else sessionStorage.removeItem('vidya_admin_key');
        } catch (e) { /* ignore */ }
    }

    function fileToBase64(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                var result = reader.result || '';
                var base64 = String(result).split(',')[1] || '';
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function prefetch(action) {
        if (!getApiUrl()) return;
        cmsGetRaw(action);
    }

    function invalidateCms() {
        clearCache();
    }

    global.VidyaCMS = {
        getApiUrl: getApiUrl,
        getGallery: function () { return cmsGet('gallery'); },
        getDownloads: function () { return cmsGet('downloads'); },
        getCachedGallery: function () { return readCache('gallery'); },
        getCachedDownloads: function () { return readCache('downloads'); },
        prefetchGallery: function () { prefetch('gallery'); },
        prefetchDownloads: function () { prefetch('downloads'); },
        clearCache: clearCache,
        invalidateCms: invalidateCms,
        adminGetGallery: function (key) {
            var base = getApiUrl();
            if (!base) return Promise.resolve([]);
            return fetchJson(base + '?action=adminGallery&adminKey=' + encodeURIComponent(key) + '&_=' + Date.now())
                .then(function (d) { return Array.isArray(d) ? d : []; });
        },
        adminGetDownloads: function (key) {
            var base = getApiUrl();
            if (!base) return Promise.resolve([]);
            return fetchJson(base + '?action=adminDownloads&adminKey=' + encodeURIComponent(key) + '&_=' + Date.now())
                .then(function (d) { return Array.isArray(d) ? d : []; });
        },
        post: cmsPost,
        getAdminKey: getAdminKey,
        setAdminKey: setAdminKey,
        fileToBase64: fileToBase64
    };

    if (getApiUrl()) {
        prefetch('gallery');
    }
})(window);
