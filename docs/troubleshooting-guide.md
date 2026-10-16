# Outreach Tool - CORS and Permissions Troubleshooting Guide

Oct 14, 2026 · @Ravi

## Overview

Users logging into `outreach.vlabs.ac.in` see a **Network Error** dialog and cannot proceed. The browser console reports a CORS error on the backend endpoint, but the real cause is a **502 Bad Gateway** returned by GCP App Engine — not a CORS misconfiguration in the code. Because the 502 comes from the App Engine proxy rather than Express, the `Access-Control-Allow-Origin` header that Express normally adds is never sent, causing the browser to report it as a CORS failure.

## Symptoms

| Where | What you see |
| --- | --- |
| App UI | "Network Error" dialog from `outreach.vlabs.ac.in` |
| Browser console | `CORS header 'Access-Control-Allow-Origin' missing` on a request to `<gcp-project-id>.et.r.appspot.com` |
| Browser console | HTTP status **502** on the failing request |
| GCP App Engine logs | `Error: The caller does not have permission` in `stderr`, originating from `utils/sheet.js → appendIntoSheet` |

## Root Cause Analysis

The Express server in `backend/server.js` uses `app.use(cors())` which correctly allows all origins. This is **not** a code bug.

The 502 is caused by a Google Sheets API call failing inside the backend with `Error: The caller does not have permission`. When Express crashes mid-request, App Engine's proxy returns the 502 directly — without the CORS headers Express would have added — making the browser surface it as a CORS error.

**Why the Sheets API call fails:** The backend authenticates to Google Sheets using the GCP App Engine default service account (`<gcp-project-id>@appspot.gserviceaccount.com`). This service account was never granted **Editor** access on the target Google Sheet, so every write operation (and some reads) is rejected by Google's API with a permission error.

This can recur whenever:

- The Google Sheet is recreated or a new spreadsheet ID is used
- The service account is rotated or a different one is used
- Someone removes the service account from the sheet's share settings

## Step-by-Step Resolution

**Step 1 — Confirm the error in GCP logs**

Go to **GCP Console → App Engine → Versions → Diagnose → Logs** (or run `gcloud app logs tail -s default` in your terminal) and look for a line containing `The caller does not have permission` in `stderr`. This confirms the root cause is a Sheets permission issue, not a code or network problem.

**Step 2 — Identify the service account email**

The service account used by App Engine is always:

```
<gcp-project-id>@appspot.gserviceaccount.com
```

You can verify this in **GCP Console → IAM & Admin → Service Accounts**.

**Step 3 — Grant Editor access on the Google Sheet**

1. Open the Google Sheet that backs the Outreach Tool.
2. Click **Share** (top-right).
3. Paste `<gcp-project-id>@appspot.gserviceaccount.com` in the people field.
4. Set the role to **Editor**.
5. Click **Share**.

**No redeployment is required.** The next API call from the backend will succeed immediately.

## Prevention

- **Document the sheet share as part of setup.** Add a checklist item to the deployment runbook: after creating or replacing the Google Sheet, immediately share it with `<gcp-project-id>@appspot.gserviceaccount.com` as Editor.
- **Improve the error surfaced to users.** The backend currently lets Google API errors propagate as unhandled 500/502s. Wrapping Sheets API calls in a try/catch that returns a meaningful JSON error (e.g. `{"error": "Unable to reach data source"}`) would make the problem easier to diagnose from the UI alone, without needing to check GCP logs.
- **Add a health-check endpoint.** A `GET /health` route that does a lightweight Sheets read on startup can surface permission failures immediately after a deployment, rather than only when a user triggers a write.

## Quick Reference

**If the app shows "Network Error" and the console shows a CORS or 502 error:**

- [ ] Check GCP App Engine logs for `The caller does not have permission`
- [ ] Open the backing Google Sheet and verify `<gcp-project-id>@appspot.gserviceaccount.com` is listed as an **Editor** under Share settings
- [ ] If missing, add it — no redeployment needed
- [ ] Reload the app and confirm the error is gone

**Key identifiers**

| Item | Value |
| --- | --- |
| Frontend URL | `https://outreach.vlabs.ac.in` |
| Backend URL | `https://<gcp-project-id>.et.r.appspot.com` |
| GCP Project | `<gcp-project-id>` |
| Service account | `<gcp-project-id@appspot.gserviceaccount.com` |
| Log stream to check | `projects/<gcp-project-id>/logs/stderr` |
