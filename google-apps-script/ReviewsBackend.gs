/**
 * Vidya Coachings - Reviews Backend
 *
 * IMPORTANT: Paste your Google Sheet ID below (from sheet URL):
 * https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
 */
var SPREADSHEET_ID = ''; // e.g. '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'

function getSpreadsheet() {
  if (SPREADSHEET_ID && String(SPREADSHEET_ID).trim() !== '') {
    return SpreadsheetApp.openById(String(SPREADSHEET_ID).trim());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getReviewsSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Reviews');
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }
  return sheet;
}

function setupSheet() {
  var sheet = getReviewsSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Name', 'Role', 'Rating', 'Review', 'Date', 'Approved']);
  }
}

function isApproved(val) {
  var s = String(val || '').trim().toLowerCase();
  return s === 'yes' || s === 'y' || s === '1' || s === 'true';
}

function isHeaderRow(name, role, text) {
  var n = String(name || '').trim().toLowerCase();
  return n === 'name' || n === '' || String(role || '').trim().toLowerCase() === 'role';
}

function getApprovedReviews() {
  setupSheet();
  var sheet = getReviewsSheet();
  var rows = sheet.getDataRange().getValues();
  var reviews = [];

  for (var i = 1; i < rows.length; i++) {
    var name = String(rows[i][0] || '').trim();
    var role = String(rows[i][1] || '').trim();
    var text = String(rows[i][3] || '').trim();

    if (!name || isHeaderRow(name, role, text)) continue;
    if (!isApproved(rows[i][5])) continue;

    reviews.push({
      name: name,
      role: role,
      rating: Number(rows[i][2]) || 5,
      text: text,
      date: rows[i][4] ? String(rows[i][4]) : ''
    });
  }

  reviews.reverse();
  return reviews;
}

function doGet(e) {
  e = e || {};
  var params = e.parameter || {};

  // Debug: open URL?debug=1 in browser to see sheet data
  if (params.debug === '1') {
    setupSheet();
    var sheet = getReviewsSheet();
    var rows = sheet.getDataRange().getValues();
    return jsonResponse({
      sheetName: sheet.getName(),
      totalRows: rows.length,
      headers: rows[0] || [],
      dataRows: rows.slice(1),
      approvedCount: getApprovedReviews().length
    });
  }

  var reviews = getApprovedReviews();
  var json = JSON.stringify(reviews);
  var callback = params.callback;

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  setupSheet();
  var sheet = getReviewsSheet();

  var data = {};
  try {
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Invalid data' });
  }

  var name = String(data.name || '').trim();
  var role = String(data.role || '').trim();
  var rating = Number(data.rating) || 5;
  var text = String(data.text || data.review || '').trim();

  if (!name || !role || !text) {
    return jsonResponse({ success: false, error: 'Missing fields' });
  }

  rating = Math.min(5, Math.max(1, rating));

  sheet.appendRow([name, role, rating, text, new Date(), 'pending']);

  return jsonResponse({ success: true, message: 'Review submitted' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
