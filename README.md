# SuperMart Manager — SQLite Edition

A small Flask application for managing multiple independent supermarkets using a local SQLite database.

## Features
- Separate supermarket registration and login; each store’s records are separated by its supermarket ID.
- Product catalogue, opening stock and low-stock warnings.
- Purchase entry that increases stock.
- Multi-item sales, stock checks, discounts, payment methods (Cash, UPI, Card, Bank transfer, Credit) and printable receipts showing amount received and balance due.
- Sales history and date-filtered reports.
- Printable reports and Excel (`.xlsx`) export.
- Other expense entry and a simple estimated profit/loss summary.
- Accounts Receivable report (customer balances), Accounts Payable report (supplier balances), printable reports and separate Excel export.
- Purchase payment type and amount paid, used to calculate supplier balances.
- Record partial or full customer collections against an invoice and supplier payments against a purchase, with printable receipt/payment voucher and payment history.
- Global system administrator console to create supermarkets and owner logins, view each store’s sales/AR/AP totals, rename stores, open a store workspace, and manage module permissions for each store user.
- Outstanding AR/AP lists show every unpaid invoice/bill regardless of age; date filters apply to the payment-history table.
- Sales returns and purchase returns with return quantity limits, return history, automatic stock adjustment, and return value deductions from outstanding customer/supplier balances.
- Aged receivables and aged payables report with Current, 1–30, 31–60, 61–90 and over-90-day buckets, print support, and Excel export.
- Responsive layout refinements for mobile phones, tablets, laptops and desktop screens.

## Run on your computer
Requires Python 3.10 or newer. No separate database installation is needed. SQLite is included with Python.

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000/login. On a fresh database, use the system admin credentials listed below. The system admin can create stores and owner logins from the Global Admin Console. Store owners can also register from `/register`. The database is created automatically at `instance/supermart.db`.

## Database location and backup
- Default database file: `instance/supermart.db`
- To use another location, set the `DB_PATH` environment variable to a full file path before starting the app.
- Stop the app before copying the database file for a simple backup. Keep backups secure because the database contains business records.
- Do not delete `instance/supermart.db` unless you intend to start with an empty database.

## Hosting online
SQLite is best suited to a single server or a small local installation. If you deploy to Render or another host, its normal filesystem may be temporary, so data can disappear during redeploys/restarts. Use a host with a persistent disk and set `DB_PATH` to a file on that disk (for example `/var/data/supermart.db`). Confirm persistent-disk support and pricing with the host before deploying. Do not run multiple app instances against the same SQLite file.

## Important notes
- Each store has an owner login; additional store users can be registered and their module access controlled by the system admin.
- Each store’s data is separated by `supermarket_id`, but test account isolation before real use.
- Receivables/payables are calculated from the invoice/purchase total less all payments/collections recorded against that invoice or purchase.
- Accounting figures are estimates for day-to-day management, not a complete double-entry ledger or statutory tax report. Cost of goods sold is based on the cost price saved on each sale line.
- Before real commercial use, set a strong `SECRET_KEY`, use HTTPS when hosted online, make regular backups, and test all workflows with sample data.


## Global administrator and permissions

On a fresh database, the app creates a global administrator account automatically:

- Email: `admin@supermart.local`
- Password: `SuperAdmin@2026`
- Login: `/login`
- Global console: `/admin`

**Change these credentials before using real data.** Set `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` in the environment before the first launch to choose credentials. If a global admin has already been created in the database, changing environment variables does not reset that account's password.

The global administrator can view all registered supermarkets, open a store workspace, and choose module permissions for each store user (Sales, Purchases, Stock/Products, Expenses, Reports, Accounting, and AR/AP). Store users only see data for their own store.

## Accounts receivable and payable settlements

In Receivables & Payables, use **Receive payment** against an outstanding customer invoice or **Pay supplier** against a supplier purchase. Enter the amount, date, method, and optional reference. The amount updates the invoice balance, is logged in payment history, and opens a printable receipt/voucher. Partial payments are supported; a payment cannot exceed the outstanding balance.


## Sales and purchase returns
Open **Sales / Purchase Returns** in the navigation. Select an original sale line or purchase, enter a quantity, date and reason, then save. Sales returns increase stock; purchase returns decrease stock (a purchase return cannot exceed the current available stock). The return amount is calculated from the original sale price or purchase cost. Returned quantities cannot exceed the original quantity. Return credits reduce outstanding AR/AP balances and appear in the ageing report.

**Accounting note:** This version applies return value against outstanding balances. If a customer invoice is already fully paid, a sales return does not automatically issue a cash refund or create a separate customer-credit ledger. Likewise, a purchase return on a fully paid supplier bill does not automatically create a supplier refund/credit note. Track those separately until a dedicated refund/credit-note workflow is added.

## Ageing report
Open **Aged AR / AP**. Outstanding balances are grouped by age from the original sale or purchase date into Current, 1–30, 31–60, 61–90 and over 90 days. The app currently does not store contractual invoice due dates, so ageing is based on invoice date, not the due date. Print from the page or export both reports to Excel.

## Additional features in this update

- **Configurable expense categories:** open `Expense & payment settings` from the sidebar to add or disable categories for the selected store.
- **Configurable payment methods:** add or disable payment methods in the same settings page. Active methods are used in sales, purchases, expenses, and customer/supplier settlement forms.
- **Sales and purchase returns in reports:** date-filtered reports show separate Sales Returns and Purchase Returns tables; the main Excel export includes separate worksheets for each return type.
- **Product expiry tracking:** enter an optional expiry date when creating a product and an expiry date for each purchase entry. `Expiry alerts` shows expired / near-expiry products and purchase entries due to expire within the selected number of days, with print and Excel export.
- **Supplier / vendor-wise report:** `Supplier / Vendor report` groups purchases by the supplier name and displays purchase totals, returns, paid amount, outstanding balance, and purchase count. Includes print and Excel export.

Existing SQLite databases are migrated automatically for the new `expiry_date` fields. Back up your database before upgrading. Expiry dates are recorded on products and purchase entries, but this version does not yet track remaining quantity separately for each inventory batch.


## Customer and supplier total reports
- **Supplier / Vendor-wise Total Report** groups purchase entries by supplier and shows purchase total, purchase returns, paid amount, outstanding balance and purchase count, with a grand total row.
- **Customer-wise Total Report** groups sales by customer and shows sales total, sales returns, amount received, outstanding balance and invoice count, with a grand total row.
- Both reports support date filters, print and Excel export. The report navigation is permission-controlled under Reports.
- Responsive layout safeguards cover small phones, tablets, laptops and desktop screens; wide tables scroll horizontally on narrow screens.


## GST / CST tax setup
- Set each product's GST rate (0%, 5%, 12%, 18%, or 28%) and optional legacy CST rate in Products & Stock.
- Purchase and sale forms calculate tax from the product rate. Choose Local / intra-state to split GST into CGST + SGST, or Inter-state to record IGST.
- Open **GST / CST Tax Report** to filter by period, print the summary, and export the tax workbook to Excel.
- CST is included only as a legacy option. GST rates, tax classifications, place-of-supply rules, exemptions, HSN, input tax credit and returns must be reviewed by your accountant/CA. The report is a preparation summary and does not file directly to the government portal.
- Existing databases are migrated automatically with zero tax rates; verify product rates before using the tax calculation. Back up `instance/supermart.db` before upgrading.

## Google Cloud deployment (Cloud Run + Cloud SQL for PostgreSQL)

This project includes a `Dockerfile` for Google Cloud Run. **Use Cloud SQL for PostgreSQL for production data**: Cloud Run's local container filesystem is temporary, so the default SQLite database is suitable for local testing only and can be lost after an instance restart or replacement.

### 1. Prepare Google Cloud

1. Install the Google Cloud CLI and run `gcloud auth login`.
2. Select your project: `gcloud config set project YOUR_PROJECT_ID`.
3. Enable the required APIs:

   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com
   ```

4. Create a Cloud SQL **PostgreSQL** instance and database, and create a dedicated database user. Keep the database password private.
5. Create a Secret Manager secret for the database URL and another for a long random Flask secret key. For a Cloud SQL Unix socket connection, use a URL in this format, URL-encoding special characters in the username/password:

   `postgresql://DB_USER:DB_PASSWORD@/DB_NAME?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME`

   The application automatically selects the Psycopg driver for PostgreSQL URLs.

### 2. Deploy

From the directory containing `Dockerfile` and `app.py`, run:

```bash
gcloud builds submit --tag REGION-docker.pkg.dev/YOUR_PROJECT_ID/supermart/supermart:latest

gcloud run deploy supermart-manager \
  --image REGION-docker.pkg.dev/YOUR_PROJECT_ID/supermart/supermart:latest \
  --region REGION \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT_ID:REGION:INSTANCE_NAME \
  --set-env-vars SESSION_COOKIE_SECURE=true,SUPERADMIN_EMAIL=admin@example.com \
  --set-secrets DATABASE_URL=supermart-database-url:latest,SECRET_KEY=supermart-flask-secret:latest,SUPERADMIN_PASSWORD=supermart-admin-password:latest
```

Before deploying, create an Artifact Registry Docker repository named `supermart` in the selected region, and create the three secrets named in the command. Grant the Cloud Run service identity the **Cloud SQL Client** role and permission to access those secrets. Replace every placeholder (`REGION`, `YOUR_PROJECT_ID`, database instance details, and secret names) with your real values. Do not put passwords directly into shell history or commit secrets to source control.

### 3. Verify the service

- Open the HTTPS URL returned by `gcloud run deploy`.
- Visit `/health`; the expected response is `{"status":"ok"}`.
- Sign in using the administrator email and password configured through environment variables on the **first database initialization**. Change these credentials to strong unique values.
- Test store creation, sales, stock updates, reports, Excel exports and backup/restore procedures with test data before using live business records.

**Important:** this app creates tables and applies lightweight schema changes at startup; it is not a full database migration framework. Back up the database before upgrades and test upgrades against a staging database first. If you already have data in the SQLite file, it is not automatically copied to PostgreSQL; migrate/export it before switching production traffic.
