// Paste into the "FREE Lead Magnet Leads" sheet: Extensions → Apps Script (replace everything).
// Receives every lead from ceoturbo.com (/api/audit, /api/cal-webhook, /api/lead, /api/shopify-webhook) and files it on
// the right tab, under the matching column header. Columns can be reordered or hidden in the
// sheet: rows are matched by header NAME, not position. Setup steps: docs/leads-google-sheet.md
//
// Booked calls: the "Booked Calls" tab is laid out as a call-prep list (priority, answers, #1 move, meeting link)
// with a Status dropdown and Outcome / Quote $ / Follow-up columns, and "Call Dashboard" summarises it.
// After pasting, run setupSheet() once from the editor (▶ Run) to add dropdowns, colors and the dashboard.

const SECRET = "REPLACE_WITH_LEADS_WEBHOOK_SECRET"; // same value as LEADS_WEBHOOK_SECRET in Vercel (copy in docs/leads-apps-script.local.js, gitignored)
const SHEET_ID = "1sToqSfGp6eDAowaqvmtKxDPUHqDGNUruWsnIUzkr1GI"; // FREE Lead Magnet Leads (works even if this script is not attached to the sheet)
const ORDER_EMAIL = "stackmodenetwork@gmail.com"; // gets an email for every paid shirt order ("" = off)

// header label shown in the sheet  ->  field name sent by the website
const ATTR = {
  Source: "utm_source",
  Medium: "utm_medium",
  Campaign: "utm_campaign",
  "Ad / content": "utm_content",
  Keyword: "utm_term",
  "Google click ID": "gclid",
  "Microsoft click ID": "msclkid",
  "Meta click ID": "fbclid",
  "TikTok click ID": "ttclid",
  "Landing page": "landing",
};

// A field of "" is a column you fill in by hand (or that the script fills, like Status).
const TABS = {
  // Brand Boost quiz: everyone who answered the questions and left their details. "Booked?" flips to
  // "Yes" automatically when the same person books — anyone still "No" is your follow-up list.
  "Call Quiz Leads": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "business",
      Priority: "priority",
      "Lead score": "score",
      "Booked?": "booked",
      "Call time": "callTime",
      Status: "",
      "Follow-up notes": "",
      "What they do": "audience",
      Stage: "stage",
      Website: "website",
      "Biggest goal": "goal",
      "Holding them back": "blockers",
      "Monthly budget": "budget",
      "How soon": "timeline",
      "#1 move shown": "move",
      "Text opt-in": "smsOptIn",
    },
    ATTR,
    { "Form page": "page", "Quiz ID": "quizId", "Event ID": "eventId" }
  ),
  "Free Check Leads": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "business",
      Type: "type",
      "What they do": "what",
      Stage: "stage",
      City: "city",
      Website: "website",
      "Google profile claimed": "gbp",
      "Google reviews": "reviews",
      Press: "press",
      "Name search rank": "nameRank",
      "Text opt-in": "smsOptIn",
      "Overall score": "score",
      SEO: "seo",
      "AI answers": "aeo",
      Local: "geo",
      "Reviews score": "reviewsScore",
      "Top issues": "topIssues",
    },
    ATTR,
    { "Form page": "page", "Event ID": "eventId" }
  ),
  // One row per booked Brand Boost call, laid out for call prep: when, who, how hot, what they told you.
  "Booked Calls": Object.assign(
    {
      "Call time": "startTime",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "businessName",
      Priority: "priority",
      "Lead score": "score",
      Status: "",
      Outcome: "",
      "Quote $": "",
      "Follow-up date": "",
      "Follow-up notes": "",
      "What they do": "whatTheyDo",
      Stage: "stage",
      Website: "website",
      "Biggest goal": "goal",
      "Holding them back": "blockers",
      "Monthly budget": "budget",
      "How soon": "timeline",
      "#1 move shown": "move",
      "Meeting link": "meetingLink",
      Notes: "notes",
      Ends: "endTime",
      "Time zone": "timeZone",
      Event: "event",
      Received: "receivedAt",
      "Booked from": "source",
    },
    ATTR,
    { "Form page": "page", "Quiz ID": "quizId", "Booking ID": "uid" }
  ),
  "Card Orders": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "business",
      Type: "type",
      "Order #": "orderNumber",
      Items: "items",
      Quantity: "quantity",
      Total: "total",
      Payment: "paymentStatus",
      "Ship to": "shipTo",
      Pack: "pack",
      Style: "style",
      Product: "product",
      Note: "note",
    },
    ATTR,
    { "Form page": "page", "Order ID": "orderId", "Event ID": "eventId" }
  ),
  // Custom shirts (/custom-company-t-shirts and /artist-merch). Every finished design lands here with its
  // print-ready PNG saved to Google Drive; when it's paid, Status flips to "Paid" and the order number is filled in.
  "Shirt Designs": Object.assign(
    {
      Received: "receivedAt",
      Type: "kind",
      "Design ID": "designId",
      Preview: "preview",
      Status: "",
      "Order #": "orderNumber",
      Style: "style",
      Color: "color",
      Placement: "placement",
      "Back print": "backPrint",
      Sizes: "sizes",
      Quantity: "quantity",
      "Total $": "total",
      "Front text": "text",
      "Small line": "subtext",
      "Back text": "backText",
      "Front print file": "frontUrl",
      "Back print file": "backUrl",
      Mockup: "mockupUrl",
      "Print DPI": "dpi",
      "Logo file": "logoName",
      Font: "font",
      "Company / artist": "business",
    },
    ATTR,
    { "Form page": "page" }
  ),
  // Paid shirt orders = the to-do list: place each "New" row with the print partner (Printify manual order:
  // print file + sizes + ship-to), paste their order # and cost, then the tracking number when it ships.
  // docs/company-shirts.md has the step-by-step.
  "Shirt Orders": Object.assign(
    {
      Received: "receivedAt",
      Type: "kind",
      "Order #": "orderNumber",
      Status: "",
      "Print partner order #": "",
      "Print partner cost $": "",
      Tracking: "",
      Name: "name",
      Email: "email",
      Phone: "phone",
      "Company / artist": "business",
      "Sizes (style / color / size / print × qty)": "sizes",
      Quantity: "quantity",
      Total: "total",
      "Design ID": "designId",
      "Print file": "printFile",
      Placement: "placement",
      "Front text": "frontText",
      "Back text": "backText",
      "Ship to": "shipTo",
      Payment: "paymentStatus",
      Note: "note",
    },
    ATTR,
    { "Order ID": "orderId" }
  ),
  "Dev Intake Leads": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Email: "email",
      "App / repo / site": "appUrl",
      Platform: "platform",
      Stage: "stage",
      "Monthly ad budget": "budget",
      "What's stopping installs": "blocker",
      Type: "type",
    },
    ATTR,
    { "Form page": "page", "Event ID": "eventId" }
  ),
  "Office Setup Leads": Object.assign(
    { Received: "receivedAt", Name: "name", Phone: "phone", Email: "email", Service: "service", Job: "business", "Quote $": "value", "City / timing": "note", Type: "type" },
    ATTR,
    { "Form page": "page", "Event ID": "eventId" }
  ),
  // Dead-battery requests from /car-battery: the car and where it is, as real columns so the job can be quoted from the sheet.
  "Battery Leads": Object.assign(
    { Received: "receivedAt", Name: "name", Phone: "phone", Need: "need", Year: "year", Make: "make", Model: "model", Location: "location", When: "when", Company: "company", Vehicles: "vehicles", "Est. value $": "value", Status: "", Notes: "" },
    ATTR,
    { "Form page": "page", "Event ID": "eventId" }
  ),
  "Other Leads": Object.assign({ Received: "receivedAt", Name: "name", Phone: "phone", Email: "email", Company: "business", Type: "type", Note: "note" }, ATTR, { "Form page": "page" }),
};

const TYPE_LABEL = { "audit-business": "Business", "audit-artist": "Artist", "order-request": "Order request", "shopify-order": "Paid order", "shirt-order": "Shirt order", "brand-boost-quiz": "Call quiz" };

// Status dropdowns + colors for the two call tabs: [value, background, text]
const STATUS = {
  "Booked Calls": [
    ["New", "#cce0ff", "#1a3a6b"],
    ["Confirmed", "#d4edda", "#1e5631"],
    ["Showed", "#c2f0f0", "#0b4f4f"],
    ["No-show", "#f8c9c9", "#7a1212"],
    ["Rescheduled", "#fff2b3", "#6b5200"],
    ["Won", "#a8e6a8", "#0f4d0f"],
    ["Lost", "#e3e3e3", "#555555"],
  ],
  "Shirt Orders": [
    ["New", "#ffd8b3", "#7a3b00"],
    ["Ordered from printer", "#fff2b3", "#6b5200"],
    ["In production", "#cce0ff", "#1a3a6b"],
    ["Shipped", "#d4edda", "#1e5631"],
    ["Delivered", "#a8e6a8", "#0f4d0f"],
    ["Issue", "#f8c9c9", "#7a1212"],
  ],
  "Shirt Designs": [
    ["Designed", "#e8eef7", "#44546a"],
    ["Paid", "#ffd8b3", "#7a3b00"],
    ["Shipped", "#d4edda", "#1e5631"],
  ],
  "Office Setup Leads": [
    ["New", "#cce0ff", "#1a3a6b"],
    ["Contacted", "#fff2b3", "#6b5200"],
    ["Booked", "#d4edda", "#1e5631"],
    ["Won", "#a8e6a8", "#0f4d0f"],
    ["Lost", "#e3e3e3", "#555555"],
  ],
  "Battery Leads": [
    ["New", "#ffd8b3", "#7a3b00"],
    ["Contacted", "#fff2b3", "#6b5200"],
    ["Quoted", "#cce0ff", "#1a3a6b"],
    ["Booked", "#d4edda", "#1e5631"],
    ["Done", "#a8e6a8", "#0f4d0f"],
    ["Lost", "#e3e3e3", "#555555"],
  ],
  "Call Quiz Leads": [
    ["New", "#cce0ff", "#1a3a6b"],
    ["Contacted", "#fff2b3", "#6b5200"],
    ["Booked", "#d4edda", "#1e5631"],
    ["Won", "#a8e6a8", "#0f4d0f"],
    ["Lost", "#e3e3e3", "#555555"],
  ],
};

function tabFor(type) {
  if (type === "booking") return "Booked Calls";
  if (type === "brand-boost-quiz") return "Call Quiz Leads";
  if (String(type).indexOf("audit") === 0) return "Free Check Leads";
  if (type === "order-request" || type === "shopify-order") return "Card Orders";
  if (type === "shirt-design") return "Shirt Designs";
  if (type === "shirt-order") return "Shirt Orders";
  if (type === "dev-intake") return "Dev Intake Leads";
  if (type === "office-setup") return "Office Setup Leads";
  if (type === "battery") return "Battery Leads";
  return "Other Leads";
}

/* ───────────────────────── custom shirts: print files in Drive ───────────────────────── */

const DESIGN_FOLDER = "CEO Turbo Shirt Designs";

function designFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty("DESIGN_FOLDER_ID");
  if (id) {
    try {
      return DriveApp.getFolderById(id);
    } catch (e) {}
  }
  const found = DriveApp.getFoldersByName(DESIGN_FOLDER);
  const folder = found.hasNext() ? found.next() : DriveApp.createFolder(DESIGN_FOLDER);
  props.setProperty("DESIGN_FOLDER_ID", folder.getId());
  return folder;
}

/** Saves one base64 file and returns its link (anyone with the link can view, so the print partner can fetch it). */
function saveFile_(folder, b64, type, name) {
  if (!b64) return "";
  const file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(b64), type, name));
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {
    // Some Google Workspace accounts block link sharing; the file is still in your Drive.
  }
  return file.getUrl();
}

/** Stores the design's files in Drive and puts their links (and a preview) on the record. */
function saveDesignFiles_(data) {
  const folder = designFolder_();
  const id = String(data.designId || "design");
  data.frontUrl = saveFile_(folder, data.frontPng, "image/png", id + "-front.png");
  data.backUrl = saveFile_(folder, data.backPng, "image/png", id + "-back.png");
  data.mockupUrl = saveFile_(folder, data.mockupJpg, "image/jpeg", id + "-mockup.jpg");
  const fileId = (data.mockupUrl || data.frontUrl).match(/[-\w]{25,}/);
  if (fileId) data.preview = '=IMAGE("https://drive.google.com/thumbnail?id=' + fileId[0] + '&sz=w400")';
  delete data.frontPng;
  delete data.backPng;
  delete data.mockupJpg;
}

/** A paid shirt order: mark its design row Paid with the order number. */
function markDesignPaid_(book, data) {
  const sheet = book.getSheetByName("Shirt Designs");
  if (!sheet || sheet.getLastRow() < 2 || !data.designId) return;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = function (h) {
    return headers.indexOf(h) + 1;
  };
  if (col("Design ID") < 1) return;
  const ids = sheet.getRange(2, col("Design ID"), sheet.getLastRow() - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) !== String(data.designId)) continue;
    if (col("Status") > 0) sheet.getRange(i + 2, col("Status")).setValue("Paid");
    if (col("Order #") > 0) sheet.getRange(i + 2, col("Order #")).setValue(data.orderNumber || "");
    // The order row gets the print file even when the cart couldn't carry the link.
    if (!data.printFile && col("Front print file") > 0) data.printFile = sheet.getRange(i + 2, col("Front print file")).getValue();
    return;
  }
}

/** When someone books, mark their quiz row as booked (matched by Quiz ID, else by email). */
function markQuizBooked(book, data) {
  const sheet = book.getSheetByName("Call Quiz Leads");
  if (!sheet || sheet.getLastRow() < 2) return;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = function (h) {
    return headers.indexOf(h) + 1;
  };
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const email = String(data.email || "").toLowerCase();
  for (let i = rows.length - 1; i >= 0; i--) {
    const byId = data.quizId && col("Quiz ID") > 0 && String(rows[i][col("Quiz ID") - 1]) === String(data.quizId);
    const byEmail = !data.quizId && email && col("Email") > 0 && String(rows[i][col("Email") - 1]).toLowerCase() === email;
    if (!byId && !byEmail) continue;
    const r = i + 2;
    if (col("Booked?") > 0) sheet.getRange(r, col("Booked?")).setValue("Yes");
    if (col("Call time") > 0 && data.startTime) sheet.getRange(r, col("Call time")).setValue(display("startTime", data.startTime));
    if (col("Status") > 0) sheet.getRange(r, col("Status")).setValue("Booked");
    return;
  }
}

function display(field, value) {
  if (value === undefined || value === null || value === "") return "";
  // The site prefixes "'" to values starting with = + - @ so they can't run as formulas. Phone cells
  // are plain text, so the prefix is not needed there (and would show).
  if (field === "phone") return String(value).replace(/^'(?=[=+\-@])/, "");
  if (field === "smsOptIn") return value === true || value === "true" ? "Yes" : "No";
  if (field === "type") return TYPE_LABEL[value] || value;
  if (field === "receivedAt" || field === "startTime" || field === "endTime" || field === "callTime") {
    const d = new Date(value);
    if (!isNaN(d)) return d;
  }
  return value;
}

function labelsFor(map) {
  const keys = Object.keys(map);
  return keys.concat(["Status", "Follow-up notes"].filter(function (h) {
    return keys.indexOf(h) === -1;
  }));
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return ContentService.createTextOutput("bad json");
  }
  if (data.secret !== SECRET) return ContentService.createTextOutput("forbidden");

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const name = tabFor(data.type);
    const map = TABS[name];
    const book = SpreadsheetApp.openById(SHEET_ID);
    let sheet = book.getSheetByName(name);
    if (!sheet) {
      sheet = book.insertSheet(name);
      const labels = labelsFor(map);
      sheet.getRange(1, 1, 1, labels.length).setValues([labels]).setFontWeight("bold");
      sheet.setFrozenRows(1);
      if (STATUS[name]) formatTab_(sheet, name);
    }
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    // New columns added to the website later (e.g. "Quiz ID") are appended to an existing tab automatically.
    const missing = Object.keys(map).filter(function (h) {
      return headers.indexOf(h) === -1;
    });
    if (missing.length) {
      sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight("bold");
      headers = headers.concat(missing);
    }

    // Each booking / paid order / form lead is recorded once, even if Cal.com, Shopify or the website's
    // retry outbox sends it again.
    const dedupe =
      name === "Booked Calls" ? ["Booking ID", data.uid]
      : name === "Card Orders" && data.type === "shopify-order" ? ["Order ID", data.orderId]
      : name === "Shirt Orders" ? ["Order ID", data.orderId]
      : name === "Shirt Designs" ? ["Design ID", data.designId]
      : data.eventId ? ["Event ID", data.eventId]
      : null;
    if (dedupe && dedupe[1]) {
      const idCol = headers.indexOf(dedupe[0]) + 1;
      if (idCol > 0 && sheet.getLastRow() > 1) {
        const ids = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues();
        for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(dedupe[1])) return ContentService.createTextOutput("duplicate");
      }
    }

    if (name === "Call Quiz Leads") data.booked = "No";
    if (name === "Shirt Designs") saveDesignFiles_(data);
    if (name === "Shirt Orders") markDesignPaid_(book, data);
    const row = headers.map(function (h) {
      if (h === "Status") return name === "Shirt Designs" ? "Designed" : "New";
      const field = map[h];
      return field ? display(field, data[field]) : "";
    });
    const next = sheet.getLastRow() + 1;
    if (next > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 500);
    sheet.getRange(next, 1, 1, row.length).setValues([row]);
    if (name === "Booked Calls") markQuizBooked(book, data);
    if (name === "Shirt Designs") sheet.setRowHeight(next, 110);
    // Optional: email yourself every lead
    // MailApp.sendEmail("you@example.com", "New lead: " + data.name, JSON.stringify(data, null, 2));
    // A new paid shirt order: email yourself so it goes to the print partner the same day.
    if (name === "Shirt Orders" && ORDER_EMAIL) {
      try {
        MailApp.sendEmail(
          ORDER_EMAIL,
          "💰 Shirt order " + (data.orderNumber || "") + " — " + (data.kind || "") + " — place it with the printer",
          [
            "Total: " + (data.total || ""),
            "Sizes: " + (data.sizes || ""),
            "Print file: " + (data.printFile || "(see Shirt Designs tab)"),
            "Placement: " + (data.placement || ""),
            "Back: " + (data.backText || "none"),
            "",
            "Ship to: " + (data.name || ""),
            data.shipTo || "",
            "Phone: " + (data.phone || "") + "  Email: " + (data.email || ""),
            "",
            "Steps: Printify → Orders → Create order (manual) → product + print file above → paste the address → pay → put the order # and cost in the sheet.",
          ].join("\n")
        );
      } catch (e) {}
    }
    if (name === "Shirt Designs") return ContentService.createTextOutput(JSON.stringify({ ok: true, front: data.frontUrl, back: data.backUrl, mockup: data.mockupUrl }));
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

/* ───────────────────────── one-time setup: dropdowns, colors, dashboard ───────────────────────── */

function letter_(n) {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** Run once from the editor (▶ Run → setupSheet) after pasting. Safe to run again any time. */
function setupSheet() {
  const book = SpreadsheetApp.openById(SHEET_ID);
  Object.keys(STATUS).forEach(function (name) {
    let sheet = book.getSheetByName(name);
    if (!sheet) {
      sheet = book.insertSheet(name);
      const labels = labelsFor(TABS[name]);
      sheet.getRange(1, 1, 1, labels.length).setValues([labels]);
      sheet.setFrozenRows(1);
    }
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const missing = Object.keys(TABS[name]).filter(function (h) {
      return headers.indexOf(h) === -1;
    });
    if (missing.length) sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    formatTab_(sheet, name);
  });
  buildDashboard_(book);
}

/** Status dropdown, status/priority colors, date formats, filter and frozen columns for a call tab. */
function formatTab_(sheet, name) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = function (h) {
    return headers.indexOf(h) + 1;
  };
  const last = sheet.getMaxRows();
  const body = function (h) {
    return sheet.getRange(2, col(h), Math.max(last - 1, 1), 1);
  };
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0b1220").setFontColor("#ffffff").setWrap(true).setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(Math.min(2, headers.length));
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.getRange(1, 1, last, headers.length).createFilter();

  const statuses = STATUS[name];
  if (col("Status") > 0) {
    body("Status").setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(
          statuses.map(function (s) {
            return s[0];
          }),
          true
        )
        .setAllowInvalid(true)
        .build()
    );
  }
  ["Call time", "Ends", "Received"].forEach(function (h) {
    if (col(h) > 0) body(h).setNumberFormat("ddd, mmm d · h:mm AM/PM");
  });
  if (col("Follow-up date") > 0) {
    body("Follow-up date").setNumberFormat("ddd, mmm d").setDataValidation(SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(true).build());
  }
  if (col("Quote $") > 0) body("Quote $").setNumberFormat("$#,##0");
  if (col("Booked?") > 0) {
    body("Booked?").setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["Yes", "No"], true).setAllowInvalid(true).build());
  }

  const rules = [];
  if (col("Status") > 0) {
    statuses.forEach(function (s) {
      rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s[0]).setBackground(s[1]).setFontColor(s[2]).setRanges([body("Status")]).build());
    });
  }
  if (col("Priority") > 0) {
    const p = body("Priority");
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("HOT").setBackground("#ff8a1f").setFontColor("#ffffff").setBold(true).setRanges([p]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Warm").setBackground("#ffe0a8").setFontColor("#6b4200").setRanges([p]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Cool").setBackground("#e8eef7").setFontColor("#44546a").setRanges([p]).build());
  }
  if (name === "Booked Calls" && col("Call time") > 0) {
    // A call in the next 24 hours: highlight the time and name so it can't be missed.
    const t = letter_(col("Call time"));
    const range = sheet.getRange(2, col("Call time"), Math.max(last - 1, 1), Math.max(col("Name") - col("Call time") + 1, 1));
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied("=AND(ISNUMBER($" + t + "2),$" + t + "2>=NOW(),$" + t + "2<NOW()+1)").setBackground("#fff2b3").setBold(true).setRanges([range]).build());
  }
  if (col("Follow-up date") > 0 && col("Status") > 0) {
    // Follow-up date has passed and the deal is still open: red text.
    const f = letter_(col("Follow-up date"));
    const s = letter_(col("Status"));
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied("=AND(ISNUMBER($" + f + "2),$" + f + "2<TODAY(),$" + s + '2<>"Won",$' + s + '2<>"Lost")').setFontColor("#c0262d").setBold(true).setRanges([body("Follow-up date")]).build());
  }
  sheet.setConditionalFormatRules(rules);
}

/** Header → open-ended column reference, e.g. 'Booked Calls'!B2:B. Returns "" if the tab/column is missing. */
function ref_(book, tab, header) {
  const sheet = book.getSheetByName(tab);
  if (!sheet) return "";
  const i = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].indexOf(header);
  return i < 0 ? "" : "'" + tab + "'!" + letter_(i + 1) + "2:" + letter_(i + 1);
}

/** The Call Dashboard formulas; `r(tab, header)` returns a column reference. Pure, so it can be tested. */
const NEXT_COLS = ["Call time", "Name", "Phone", "Priority", "Company", "Biggest goal", "Monthly budget", "How soon", "#1 move shown", "Meeting link"];
const QUIZ_COLS = ["Received", "Name", "Phone", "Email", "Priority", "Company", "Monthly budget", "How soon", "#1 move shown"];
const FU_COLS = ["Follow-up date", "Name", "Phone", "Status", "Outcome", "Follow-up notes"];

function dashboardCells_(r) {
  const BC = "Booked Calls";
  const QZ = "Call Quiz Leads";
  const CT = r(BC, "Call time");
  const ST = r(BC, "Status");
  const Q = r(BC, "Quote $");
  const open = "(" + ST + '<>"No-show")*(' + ST + '<>"Rescheduled")*(' + ST + '<>"Won")*(' + ST + '<>"Lost")';
  const FU = r(BC, "Follow-up date");
  const qOpen = "(" + r(QZ, "Status") + '<>"Lost")*(' + r(QZ, "Status") + '<>"Won")';
  // =IFERROR(ARRAY_CONSTRAIN(SORT(FILTER(...),1,asc),rows,cols),"empty message")
  const top = function (filterArgs, sortCol, asc, rows, ncols, empty) {
    return "=IFERROR(ARRAY_CONSTRAIN(SORT(FILTER(" + filterArgs + ")," + sortCol + "," + (asc ? "TRUE" : "FALSE") + ")," + rows + "," + ncols + '),"' + empty + '")';
  };
  const cols = function (tab, hs) {
    return "{" + hs.map(function (h) { return r(tab, h); }).join(",") + "}";
  };
  return [
    ["A1", "Brand Boost — Call Dashboard"],
    ["A2", "Updates by itself. On the Booked Calls tab set each call's Status (Showed / No-show / Won / Lost) and type the Quote $ to keep these numbers true."],
    ["A4", "Calls today"], ["A5", "=COUNTIFS(" + CT + ',">="&TODAY(),' + CT + ',"<"&(TODAY()+1),' + ST + ',"<>No-show",' + ST + ',"<>Rescheduled")'],
    ["B4", "Next 7 days"], ["B5", "=COUNTIFS(" + CT + ',">="&NOW(),' + CT + ',"<"&(NOW()+7),' + ST + ',"<>No-show",' + ST + ',"<>Rescheduled")'],
    ["C4", "Booked last 7 days"], ["C5", "=COUNTIFS(" + r(BC, "Received") + ',">="&(TODAY()-6))'],
    ["D4", "Booked all time"], ["D5", "=COUNTA(" + r(BC, "Name") + ")"],
    ["E4", "Quiz leads not booked"], ["E5", '=IFERROR(COUNTIF(' + r(QZ, "Booked?") + ',"No"),0)'],
    ["F4", "Quiz → booked"], ["F5", "=IFERROR(COUNTIF(" + r(QZ, "Booked?") + ',"Yes")/COUNTA(' + r(QZ, "Name") + "),0)"],
    ["A7", "Calls held"], ["A8", "=COUNTIF(" + ST + ',"Showed")+COUNTIF(' + ST + ',"Won")+COUNTIF(' + ST + ',"Lost")'],
    ["B7", "Show rate"], ["B8", "=IFERROR(A8/(A8+COUNTIF(" + ST + ',"No-show")),0)'],
    ["C7", "Won"], ["C8", "=COUNTIF(" + ST + ',"Won")'],
    ["D7", "Close rate"], ["D8", "=IFERROR(C8/A8,0)"],
    ["E7", "Revenue won"], ["E8", "=SUMIFS(" + Q + "," + ST + ',"Won")'],
    ["F7", "Open pipeline (Showed)"], ["F8", "=SUMIFS(" + Q + "," + ST + ',"Showed")'],

    ["A10", "NEXT CALLS — soonest first (call prep)"],
    ["A12", top(cols(BC, NEXT_COLS) + "," + CT + ">=NOW()-0.05," + open, 1, true, 15, NEXT_COLS.length, "No upcoming calls yet")],

    ["A28", "QUIZ LEADS WHO HAVEN'T BOOKED — call or text them today"],
    ["A30", top(cols(QZ, QUIZ_COLS) + "," + r(QZ, "Booked?") + '="No",' + qOpen, 1, false, 15, QUIZ_COLS.length, "Nobody waiting — every quiz lead has booked")],

    ["A46", "FOLLOW-UPS DUE — follow-up date today or earlier, deal still open"],
    ["A48", top(cols(BC, FU_COLS) + "," + FU + '<>"",' + FU + "<=TODAY()," + "(" + ST + '<>"Won")*(' + ST + '<>"Lost")', 1, true, 15, FU_COLS.length, "No follow-ups due")],

    ["A64", "WHICH ADS BOOK CALLS"],
    ["A65", "=IFERROR(QUERY({" + r(BC, "Campaign") + "," + r(BC, "Ad / content") + '},"select Col1, Col2, count(Col1) where Col1 <> \'\' group by Col1, Col2 order by count(Col1) desc limit 15 label Col1 \'Campaign\', Col2 \'Ad / content\', count(Col1) \'Booked calls\'",0),"No ad-attributed bookings yet")'],
  ];
}

function buildDashboard_(book) {
  let sheet = book.getSheetByName("Call Dashboard");
  if (!sheet) sheet = book.insertSheet("Call Dashboard", 0);
  sheet.clear();
  sheet.setHiddenGridlines(true);
  dashboardCells_(function (tab, h) {
    return ref_(book, tab, h);
  }).forEach(function (c) {
    const cell = sheet.getRange(c[0]);
    if (typeof c[1] === "string" && c[1].charAt(0) === "=") cell.setFormula(c[1]);
    else cell.setValue(c[1]);
  });
  [["A11", NEXT_COLS], ["A29", QUIZ_COLS], ["A47", FU_COLS]].forEach(function (t) {
    sheet.getRange(t[0]).offset(0, 0, 1, t[1].length).setValues([t[1]]).setFontWeight("bold").setBackground("#e8eef7");
  });
  sheet.getRange("A1").setFontSize(18).setFontWeight("bold");
  sheet.getRange("A2").setFontColor("#5f6b7a");
  ["A4:F4", "A7:F7"].forEach(function (a) {
    sheet.getRange(a).setFontColor("#5f6b7a").setFontSize(9).setFontWeight("bold");
  });
  ["A5:F5", "A8:F8"].forEach(function (a) {
    sheet.getRange(a).setFontSize(20).setFontWeight("bold").setHorizontalAlignment("left");
  });
  sheet.getRange("F5").setNumberFormat("0%");
  sheet.getRange("B8").setNumberFormat("0%");
  sheet.getRange("D8").setNumberFormat("0%");
  sheet.getRange("E8:F8").setNumberFormat("$#,##0");
  ["A10", "A28", "A46", "A64"].forEach(function (a) {
    sheet.getRange(a).setFontWeight("bold").setBackground("#0b1220").setFontColor("#ffffff");
    sheet.getRange(a).offset(0, 0, 1, 10).setBackground("#0b1220");
  });
  sheet.getRange("A12:A26").setNumberFormat("ddd, mmm d · h:mm AM/PM");
  sheet.getRange("A30:A44").setNumberFormat("mmm d · h:mm AM/PM");
  sheet.getRange("A48:A62").setNumberFormat("ddd, mmm d");
  sheet.setColumnWidths(1, 10, 150);
  sheet.setTabColor("#ff6b1a");
}
