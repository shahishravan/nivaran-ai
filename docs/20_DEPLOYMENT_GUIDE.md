# Deployment Guide

## Local validation
```bash
npm ci
npm run lint
npm test
```

## Required environment
Node.js 22.13 or newer. The current synthetic prototype requires no customer-data credential or model API key.

## Deployment principles
- Deploy the exact tested commit.
- Keep environment files and secrets untracked.
- Confirm the public URL does not require platform or team login.
- Test login and all primary flows in an incognito window.
- Verify the demo-video and repository URLs separately.
- Record the deployed commit SHA with the submission.

## Rollback
Keep the last verified deployment available and roll back if navigation, login, theme, or Recovery Command fails after release.