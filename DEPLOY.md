# Updating anahomstays.com

The site rebuilds and republishes itself whenever the code on GitHub
changes. You never need to build anything on your own computer.

## The whole procedure

1. Open the repository on **github.com**
2. **Add file → Upload files**
3. Drag in the folders/files that changed (dragging the whole `frontend`
   folder is always safe — GitHub records only what actually differs)
4. Scroll down, write a short note in the commit box
   (e.g. *"faster first load"*), click **Commit changes**

That's it. Netlify notices the commit, rebuilds, and publishes — usually
in about two minutes.

## Watching it happen

Netlify → **Deploys**. The newest entry moves through
*Building → Processing → Published*.

- **Published** — live. Refresh anahomstays.com (hard-refresh with
  ⌘⇧R if you still see the old version).
- **Failed** — nothing breaks. The previous version stays live. Open the
  deploy to read the log.

## Rules that keep this safe

- **Never upload `node_modules` or `build`.** They are generated, huge,
  and already excluded by `.gitignore`. Note that GitHub's *web* uploader
  ignores `.gitignore`, so simply don't drag those two folders in.
- **Don't edit build settings in Netlify.** They come from `netlify.toml`
  in this repo — base `frontend`, command `yarn build`, publish `build`.
- **Never touch DNS or MX records.** Those carry Google Workspace email
  for contact@anahomstays.com. Hosting changes never require them.

## Enquiries

The contact form uses **Netlify Forms** — no server involved. Submissions
appear under Netlify → **Forms → contact**. To get them by email:
Forms → contact → *Add notification* → email notification.

Forms only work on the deployed site, never on a local preview.
