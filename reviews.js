/**
 * Vidya Coachings - User Reviews (Google Sheets)
 */
const REVIEWS_CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbwT_ZLnnHlr5RHHmnxDkPEnd7o_TnF2dWMRaNw3Y0ehOPTBhMqXFl1JlkPN_IYDygOCWg/exec'
};

(function () {
    const listEl = document.getElementById('reviewsList');
    const summaryEl = document.getElementById('reviewsSummary');
    const formEl = document.getElementById('reviewForm');
    const formMsgEl = document.getElementById('reviewFormMessage');
    const starPicker = document.getElementById('starPicker');
    const ratingInput = document.getElementById('reviewRating');

    if (!listEl) return;

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getInitials(name) {
        return (name || 'U')
            .trim()
            .split(/\s+/)
            .map(function (w) { return w[0]; })
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    function starsHtml(rating) {
        const r = Math.min(5, Math.max(0, parseInt(rating, 10) || 0));
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += i <= r
                ? '<i class="fas fa-star"></i>'
                : '<i class="far fa-star"></i>';
        }
        return html;
    }

    function renderReview(review) {
        const name = escapeHtml(review.name || 'Anonymous');
        const role = escapeHtml(review.role || '');
        const text = escapeHtml(review.text || review.review || '');

        return (
            '<article class="review-card">' +
            '<div class="review-stars">' + starsHtml(review.rating) + '</div>' +
            '<p class="review-text">"' + text + '"</p>' +
            '<div class="review-author">' +
            '<div class="review-avatar">' + getInitials(review.name) + '</div>' +
            '<div><h4>' + name + '</h4><span>' + role + '</span></div>' +
            '</div></article>'
        );
    }

    function updateSummary(reviews) {
        if (!summaryEl) return;

        if (!reviews.length) {
            summaryEl.innerHTML =
                '<div class="rating-badge">' +
                '<div class="rating-stars">' + starsHtml(0) + '</div>' +
                '<strong>—</strong><span>No ratings yet</span></div>' +
                '<p>Be the first to share your experience!</p>';
            return;
        }

        const total = reviews.reduce(function (sum, r) {
            return sum + (parseInt(r.rating, 10) || 0);
        }, 0);
        const avg = (total / reviews.length).toFixed(1);
        const full = Math.floor(parseFloat(avg));

        summaryEl.innerHTML =
            '<div class="rating-badge">' +
            '<div class="rating-stars">' + starsHtml(full) + '</div>' +
            '<strong>' + avg + '</strong><span>out of 5</span></div>' +
            '<p>Based on ' + reviews.length + ' review' + (reviews.length === 1 ? '' : 's') + '</p>';
    }

    function showListMessage(html, className) {
        listEl.innerHTML = '<div class="' + (className || 'reviews-message') + '">' + html + '</div>';
    }

    function loadReviewsJsonp() {
        return new Promise(function (resolve, reject) {
            const cb = 'vcReviews_' + Date.now();
            const script = document.createElement('script');
            const timer = setTimeout(function () {
                cleanup();
                reject(new Error('Timeout'));
            }, 15000);

            function cleanup() {
                clearTimeout(timer);
                if (script.parentNode) script.parentNode.removeChild(script);
                try { delete window[cb]; } catch (e) { window[cb] = undefined; }
            }

            window[cb] = function (data) {
                cleanup();
                resolve(Array.isArray(data) ? data : []);
            };

            script.onerror = function () {
                cleanup();
                reject(new Error('Script load failed'));
            };

            script.src = REVIEWS_CONFIG.API_URL + '?callback=' + cb + '&t=' + Date.now();
            document.body.appendChild(script);
        });
    }

    async function loadReviewsFetch() {
        const res = await fetch(REVIEWS_CONFIG.API_URL + '?t=' + Date.now());
        const text = await res.text();
        return JSON.parse(text);
    }

    async function loadReviews() {
        if (!REVIEWS_CONFIG.API_URL) {
            showListMessage(
                '<i class="fas fa-info-circle"></i> Connect Google Sheet URL in reviews.js',
                'reviews-setup-notice'
            );
            updateSummary([]);
            return;
        }

        showListMessage('<i class="fas fa-spinner fa-spin"></i> Loading reviews...', 'reviews-loading');

        try {
            let data;
            try {
                data = await loadReviewsJsonp();
            } catch (e1) {
                data = await loadReviewsFetch();
            }

            if (!Array.isArray(data)) {
                throw new Error('Invalid response');
            }

            data = data.filter(function (r) {
                const n = String(r.name || '').trim().toLowerCase();
                return n && n !== 'name' && String(r.role || '').toLowerCase() !== 'role';
            });

            if (data.length === 0) {
                showListMessage(
                    '<i class="fas fa-comment-dots"></i> No approved reviews yet.<br><small>Submit a review below, then set <strong>Approved</strong> column to <strong>yes</strong> in Google Sheet.</small>',
                    'reviews-empty'
                );
                updateSummary([]);
                return;
            }

            listEl.innerHTML = data.map(renderReview).join('');
            updateSummary(data);
        } catch (err) {
            console.error('Reviews load error:', err);
            showListMessage(
                '<i class="fas fa-exclamation-triangle"></i> Could not load reviews.<br><small>Open site via Live Server (not double-click HTML). Check Sheet: Approved = <strong>yes</strong></small>',
                'reviews-error'
            );
            updateSummary([]);
        }
    }

    function initStarPicker() {
        if (!starPicker || !ratingInput) return;

        const stars = starPicker.querySelectorAll('button');
        let selected = 5;

        function paint(val) {
            stars.forEach(function (btn, i) {
                const icon = btn.querySelector('i');
                if (i < val) {
                    icon.className = 'fas fa-star';
                    btn.classList.add('active');
                } else {
                    icon.className = 'far fa-star';
                    btn.classList.remove('active');
                }
            });
        }

        stars.forEach(function (btn, index) {
            const value = index + 1;
            btn.addEventListener('mouseenter', function () { paint(value); });
            btn.addEventListener('click', function () {
                selected = value;
                ratingInput.value = value;
                paint(value);
            });
        });

        starPicker.addEventListener('mouseleave', function () { paint(selected); });
        ratingInput.value = '5';
        paint(5);
    }

    function showFormMessage(text, type) {
        if (!formMsgEl) return;
        formMsgEl.innerHTML = text;
        formMsgEl.className = 'review-form-message ' + (type || '');
        formMsgEl.hidden = false;
    }

    async function submitReview(e) {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const role = document.getElementById('reviewRole').value.trim();
        const text = document.getElementById('reviewText').value.trim();
        const rating = ratingInput.value;

        if (!name || !role || !text || !rating) {
            showFormMessage('Please fill all required fields and select a rating.', 'error');
            return;
        }

        const submitBtn = formEl.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        showFormMessage('Submitting your review...', 'info');

        const payload = JSON.stringify({ name: name, role: role, rating: rating, text: text });

        try {
            const res = await fetch(REVIEWS_CONFIG.API_URL, {
                method: 'POST',
                redirect: 'follow',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: payload
            });

            const result = await res.json();

            if (result.success) {
                formEl.reset();
                initStarPicker();
                showFormMessage(
                    'Thank you! Review submitted. In Google Sheet, set <strong>Approved</strong> to <strong>yes</strong> to show it here, then refresh.',
                    'success'
                );
            } else {
                showFormMessage(result.error || 'Could not submit. Try again.', 'error');
            }
        } catch (err) {
            console.error('Review submit error:', err);
            showFormMessage(
                'Submit failed. Open site with <strong>Live Server</strong> (VS Code) instead of double-clicking index.html.',
                'error'
            );
        }

        submitBtn.disabled = false;
    }

    if (formEl) {
        formEl.addEventListener('submit', submitReview);
    }

    initStarPicker();
    loadReviews();
})();
