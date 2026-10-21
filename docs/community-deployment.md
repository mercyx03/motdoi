# Community on Cloudflare Pages

Build with `npm run build`. Deploy `dist` to the existing Pages project. Keep its production D1 binding `REVIEWS_DB` pointing to the existing ratings/accounts database; do not replace that database. The worker migrates tables additively on first use. `/api/comments` is included in the Pages routes.

Historical review text stays in D1, but is excluded from the ratings API and page. New ratings accept stars only. Existing accounts keep their password, sessions, saves and username, and choose a display name from Account before posting. New accounts must choose a display name during registration.

## Privately grant an existing account Admin

Run `node tools/grant-admin.js <existing-username>` locally. This writes ignored `.local/grant-admin.sql`. Execute it using the Cloudflare D1 console for the database bound to this Pages project, or an authenticated Wrangler command:

```powershell
npx wrangler d1 execute <database-name> --remote --file .local/grant-admin.sql
```

The final query must return `granted = 1`. A result of zero means that account does not exist in the selected database. The script never creates an account or resets credentials. The role belongs to the existing account ID, so deleting that account and registering the same username does not inherit Admin.

No admin username, password, secret token or automatic username-based privilege is shipped to browsers. Display names and badges are public; login names, password hashes and session tokens are absent from comment responses. A browser can alter its own local UI, but cannot grant a server role. Cloudflare access credentials must remain outside Git and public assets.
