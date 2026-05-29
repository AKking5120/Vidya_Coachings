/**
 * Vidya Coachings - User Reviews
 *
 * SETUP (one time):
 * 1. Create Google Sheet with columns: Name | Role | Rating | Review | Date | Approved
 *    Row 1 = headers. Approved = "yes" to show on website, "pending" for new submissions.
 * 2. Extensions → Apps Script → paste code from google-apps-script/ReviewsBackend.gs
 * 3. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
 * 4. Copy Web App URL and paste below in API_URL
 */
const REVIEWS_CONFIG = {
    API_URL: '' // Paste your Google Apps Script Web App URL here
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
            if (i <= r) {
                html += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= r) {
                html += '<i class="fas fa-star-half-alt"></i>';
            } else {
                html += '<i class="far fa-star"></i>';
            }
        }
        return html;
    }

    function renderReview(review) {
        const name = escapeHtml(review.name || 'Anonymous');
        const role = escapeHtml(review.role || '');
        const text = escapeHtml(review.text || review.review || '');
        const initials = getInitials(review.name);

        return (
            '<article class="review-card">' +
            '<div class="review-stars">' + starsHtml(review.rating) + '</div>' +
            '<p class="review-text">"' + text + '"</p>' +
            '<div class="review-author">' +
            '<div class="review-avatar">' + initials + '</div>' +
            '<div><h4>' + name + '</h4><span>' + role + '</span></div>' +
            '</div></article>'
        );
    }

    function updateSummary(reviews) {
        if (!summaryEl || !reviews.length) {
            if (summaryEl) {
                summaryEl.innerHTML =
                    '<div class="rating-badge">' +
                    '<div class="rating-stars">' + starsHtml(0) + '</div>' +
                    '<strong>—</strong><span>No ratings yet</span></div>' +
                    '<p>Be the first to share your experience!</p>';
            }
            return;
        }

        const total = reviews.reduce(function (sum, r) {
            return sum + (parseInt(r.rating, 10) || 0);
        }, 0);
        const avg = (total / reviews.length).toFixed(1);
        const full = Math.floor(avg);
        const half = avg - full >= 0.3;

        summaryEl.innerHTML =
            '<div class="rating-badge">' +
            '<div class="rating-stars">' + starsHtml(half ? full + 0.5 : full) + '</div>' +
            '<strong>' + avg + '</strong><span>out of 5</span></div>' +
            '<p>Based on ' + reviews.length + ' review' + (reviews.length === 1 ? '' : 's') + ' from our community</p>';
    }

    function showListMessage(html, className) {
        listEl.innerHTML = '<div class="' + (className || 'reviews-message') + '">' + html + '</div>';
    }

    async function loadReviews() {
        if (!REVIEWS_CONFIG.API_URL) {
            showListMessage(
                '<i class="fas fa-info-circle"></i> Reviews will appear here once the site owner connects Google Sheets. You can still submit your review below.',
                'reviews-setup-notice'
            );
            updateSummary([]);
            return;
        }

        showListMessage('<i class="fas fa-spinner fa-spin"></i> Loading reviews...', 'reviews-loading');

        try {
            const res = await fetch(REVIEWS_CONFIG.API_URL);
            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                showListMessage(
                    '<i class="fas fa-comment-dots"></i> No reviews yet. Be the first to share your experience!',
                    'reviews-empty'
                );
                updateSummary([]);
                return;
            }

            listEl.innerHTML = data.map(renderReview).join('');
            updateSummary(data);
        } catch (err) {
            showListMessage(
                '<i class="fas fa-exclamation-triangle"></i> Could not load reviews. Please try again later.',
                'reviews-error'
            );
            updateSummary([]);
        }
    }

    function initStarPicker() {
        if (!starPicker || !ratingInput) return;

        const stars = starPicker.querySelectorAll('button');
        let selected = 0;

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

            btn.addEventListener('mouseenter', function () {
                paint(value);
            });

            btn.addEventListener('click', function () {
                selected = value;
                ratingInput.value = value;
                paint(value);
            });
        });

        starPicker.addEventListener('mouseleave', function () {
            paint(selected);
        });

        ratingInput.value = '5';
        selected = 5;
        paint(5);
    }

    function showFormMessage(text, type) {
        if (!formMsgEl) return;
        formMsgEl.textContent = text;
        formMsgEl.className = 'review-form-message ' + (type || '');
        formMsgEl.hidden = false;
    }

    async function submitReview(e) {
        e.preventDefault();

        if (!REVIEWS_CONFIG.API_URL) {
            showFormMessage(
                'Review form is not connected yet. Please contact Vidya Coachings on WhatsApp to share your review.',
                'error'
            );
            return;
        }

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

        try {
            const res = await fetch(REVIEWS_CONFIG.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ name: name, role: role, rating: rating, text: text })
            });

            const result = await res.json();

            if (result.success) {
                formEl.reset();
                initStarPicker();
                showFormMessage(
                    'Thank you! Your review has been submitted. It will appear on the website after approval.',
                    'success'
                );
            } else {
                showFormMessage(result.error || 'Could not submit review. Please try again.', 'error');
            }
        } catch (err) {
            showFormMessage('Something went wrong. Please try again or contact us on WhatsApp.', 'error');
        }

        submitBtn.disabled = false;
    }

    if (formEl) {
        formEl.addEventListener('submit', submitReview);
    }

    initStarPicker();
    loadReviews();
})();
