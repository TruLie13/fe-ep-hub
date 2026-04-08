/**
 * Reference doPost for newsletter + duplicate check.
 * Copy into your Sheet-bound Apps Script and deploy a new web app version.
 *
 * Duplicate misses usually mean the email column index was wrong (email not in column D)
 * or the header row was not detected. This finds the column by header "Email" / "E-mail".
 */

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function normalizeHeaderCell_(cell) {
  return String(cell || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "");
}

/**
 * Use the column whose header normalizes to "email". Scan data starting row 2.
 * If no header match, assume email is column D (index 3) and scan from row 1.
 */
function findColumnAndStart_(values) {
  if (!values.length) return { col: 3, start: 0 };
  var hdr = values[0];
  for (var c = 0; c < hdr.length; c++) {
    if (normalizeHeaderCell_(hdr[c]) === "email") {
      return { col: c, start: 1 };
    }
  }
  for (var c2 = 0; c2 < hdr.length; c2++) {
    var h = String(hdr[c2] || "")
      .trim()
      .toLowerCase();
    if (h.indexOf("email") !== -1) {
      return { col: c2, start: 1 };
    }
  }
  return { col: 3, start: 0 };
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    return jsonOut_({ ok: false, error: "busy" });
  }

  try {
    var data = JSON.parse(e.postData.contents);
    var emailNorm = String(data.email || "")
      .trim()
      .toLowerCase();
    if (!emailNorm) {
      return jsonOut_({ ok: false, error: "validation" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var values = sheet.getDataRange().getValues();
    var found = findColumnAndStart_(values);
    var emailCol = found.col;
    var startRow = found.start;

    for (var r = startRow; r < values.length; r++) {
      var cell = String(values[r][emailCol] || "")
        .trim()
        .toLowerCase();
      if (cell === emailNorm) {
        return jsonOut_({ ok: false, error: "duplicate" });
      }
    }

    sheet.appendRow([
      new Date(),
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.phone || "",
    ]);
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: "server" });
  } finally {
    lock.releaseLock();
  }
}
