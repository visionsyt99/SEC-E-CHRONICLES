# The E Chronicles — Firebase setup

## Active Firebase project

- Project ID: `sec-e-chronicles`
- Authentication: Email/Password
- Database: Cloud Firestore, `(default)`
- Public data collection: `siteData`
- Admin allow-list document: `config/admins`

## Admin allow-list

Create `config/admins` with this field:

- `emails` — Array containing the exact email address(es) authorized to administer the site.

Do not store passwords in Firestore or in this repository. Admin passwords belong only in Firebase Authentication.

## Firestore rules

The rules in `firestore.rules` are the matching rules to publish in Firebase Console → Firestore Database → Rules. Public visitors can read `siteData`; only authenticated users whose email is in `config/admins.emails` can write it. The allow-list document is readable only to signed-in users and cannot be changed by the client.

## Data format

Each document in `siteData` stores one top-level site-data section. Its `value` field contains the section value. The admin panel seeds the bundled `data/ec-data.json` data on the first authorized admin session when the collection is empty.

## Deploying

1. Keep the repository's existing folder structure.
2. Publish all site files to the GitHub Pages repository root.
3. Do not upload a `.git` directory inside the site files.
4. Open `health.html` to check the Firebase connection.
5. Open `admin-ec2027.html`, sign in with the authorized Firebase Auth account, and verify that the dashboard loads.

## Important

The Firebase web configuration is a client identifier, not an admin secret. Security depends on Authentication and Firestore Security Rules. Never put service-account keys or private credentials in this repository.
