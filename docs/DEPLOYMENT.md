# Deployment Guide

This document covers the deployment infrastructure for **Zoho Email Signature Generator**.

## Overview

- **Primary Hosting**: GitHub Pages
- **CDN**: Cloudflare (free tier)
- **Monitoring**: UptimeRobot (free tier, 5min checks)
- **CI/CD**: GitHub Actions (automated deploy on push to main)

---

## GitHub Pages Deployment

### Automatic Deployment
Every push to `main` branch triggers automated deployment:

1. **Validate** - Check required files (.nojekyll, index.html)
2. **Test** - Run unit tests, visual regression, accessibility tests
3. **Build** - Compile TypeScript, bundle with Vite
4. **Deploy** - Upload to GitHub Pages

### Manual Deployment
```bash
# Build production bundle
npm run build

# Preview locally
npm run preview

# Push to main (triggers auto-deploy)
git push origin main
```

### Pre-Deployment Checklist
✅ All tests passing (`npm run test:all`)
✅ TypeScript compiles (`npm run type-check`)
✅ Build succeeds (`npm run build`)
✅ `.nojekyll` file exists (required for `.ui-design/` directory)
✅ Preview looks correct (`npm run preview`)

### Deployment URL
**Production**: https://tejasgadhia.github.io/zoho-signature-generator/

---

## Cloudflare CDN Setup

### Why Cloudflare?
- ✅ **Global CDN** - Faster load times worldwide
- ✅ **DDoS protection** - Automatic threat mitigation
- ✅ **SSL/TLS** - Free HTTPS (handled by GitHub Pages)
- ✅ **Caching** - Reduces GitHub Pages bandwidth
- ✅ **Analytics** - Traffic insights (optional)

### Setup Instructions

#### 1. Sign Up for Cloudflare
1. Go to https://cloudflare.com
2. Sign up for free account
3. Add site: `tejasgadhia.github.io`

#### 2. Update DNS Settings
**Option A: Full DNS Proxy** (Recommended)
1. In Cloudflare dashboard → DNS
2. Add CNAME record:
   - **Name**: `www` (or subdomain)
   - **Content**: `tejasgadhia.github.io`
   - **Proxy status**: Proxied (orange cloud) ✅
   - **TTL**: Auto

**Option B: GitHub Pages Custom Domain**
1. Create `CNAME` file in repo root:
   ```
   signature.tejasgadhia.com
   ```
2. In GitHub repo Settings → Pages → Custom domain:
   - Enter: `signature.tejasgadhia.com`
   - Check "Enforce HTTPS"
3. In Cloudflare DNS:
   - Add CNAME: `signature` → `tejasgadhia.github.io`
   - Enable proxy (orange cloud)

#### 3. Configure Caching Rules
1. Go to **Caching** → **Configuration**
2. Set **Browser Cache TTL**: 4 hours
3. Add **Page Rules** (free tier: 3 rules):

**Rule 1: Cache Static Assets**
- URL: `*tejasgadhia.github.io/zoho-signature-generator/assets/*`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 week

**Rule 2: Cache HTML (with short TTL)**
- URL: `*tejasgadhia.github.io/zoho-signature-generator/*.html`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 2 hours
  - Browser Cache TTL: 1 hour

**Rule 3: Bypass Cache for Root**
- URL: `*tejasgadhia.github.io/zoho-signature-generator/`
- Settings:
  - Cache Level: Bypass

#### 4. Security Settings
1. **SSL/TLS** → **Overview**: Full (strict)
2. **Security** → **Settings**:
   - Security Level: Medium
   - Challenge Passage: 30 minutes
   - Browser Integrity Check: On
3. **Firewall** → **Security Level**: Medium

#### 5. Performance Settings
1. **Speed** → **Optimization**:
   - Auto Minify: ✅ JavaScript, ✅ CSS, ❌ HTML (already minified)
   - Brotli: On
   - Early Hints: On (if available)

#### 6. Verify Setup
```bash
# Check if Cloudflare is active (should see cf-ray header)
curl -I https://tejasgadhia.github.io/zoho-signature-generator/

# Expected headers:
# cf-ray: [id]-[airport]
# cf-cache-status: HIT/MISS/EXPIRED
# server: cloudflare
```

---

## UptimeRobot Monitoring

### Why UptimeRobot?
- ✅ **Uptime monitoring** - 5-minute checks (free tier)
- ✅ **Alerts** - Email/Slack/SMS on downtime
- ✅ **Public status page** - Share uptime with users
- ✅ **Historical data** - 90-day retention (free tier)

### Setup Instructions

#### 1. Sign Up
1. Go to https://uptimerobot.com
2. Sign up for free account
3. Verify email

#### 2. Create Monitor
1. Dashboard → **Add New Monitor**
2. Monitor settings:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Zoho Signature Generator
   - **URL**: `https://tejasgadhia.github.io/zoho-signature-generator/`
   - **Monitoring Interval**: 5 minutes (free tier)
   - **Monitor Timeout**: 30 seconds

3. **Advanced Settings**:
   - **HTTP Method**: HEAD (faster than GET)
   - **Keyword** (optional): `Zoho Email Signature Generator`
   - **Keyword Type**: Exists
   - **Expected Status Code**: 200

4. Click **Create Monitor**

#### 3. Set Up Alerts
1. Go to **My Settings** → **Alert Contacts**
2. Add alert methods:

**Email Alerts** (Free):
- Add email address
- Verify via confirmation link
- Select: "Send alerts for all monitors"

**Slack Alerts** (Free):
- Go to Slack workspace → Apps → Add Incoming Webhooks
- Copy webhook URL
- In UptimeRobot: Add "Webhook" alert contact
- Paste Slack webhook URL
- Test alert

**SMS Alerts** (Paid):
- Requires Pro plan ($7/month)
- Add phone number

3. **Alert Settings**:
   - ✅ When monitor goes down
   - ✅ When monitor comes back up
   - ✅ Every 30 minutes while down (optional)

#### 4. Create Public Status Page
1. Dashboard → **Status Pages** → **Add New Status Page**
2. Status page settings:
   - **Friendly Name**: Zoho Signature Generator Status
   - **Custom Domain**: None (use UptimeRobot subdomain)
   - **Monitors**: Select "Zoho Signature Generator"
   - **Design**: Choose theme (Material, Bootstrap, etc.)

3. **Options**:
   - ✅ Show Uptime Percentages
   - ✅ Show Response Times
   - ✅ Show Incident History
   - ❌ Password Protection (public page)

4. Click **Create Status Page**

5. Copy public URL: `https://stats.uptimerobot.com/[your-id]`

#### 5. Add Status Badge to README
Copy the badge code from UptimeRobot:

```markdown
<!-- In README.md -->
[![Uptime](https://img.shields.io/uptimerobot/status/[monitor-id]?label=status)](https://stats.uptimerobot.com/[your-id])
[![Uptime %](https://img.shields.io/uptimerobot/ratio/7/[monitor-id])](https://stats.uptimerobot.com/[your-id])
```

**Get Monitor ID**:
1. UptimeRobot Dashboard → Monitors
2. Click monitor name → **Settings**
3. Monitor ID shown in URL: `?id=[monitor-id]`

---

## Failover Strategy

### Netlify Mirror (Emergency Backup)

If GitHub Pages goes down, deploy to Netlify as backup:

#### Setup Netlify Mirror
1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Connect Netlify**:
   ```bash
   netlify login
   netlify init
   ```

3. **Configure Netlify**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Production branch: `main`

4. **Add `netlify.toml`** (already in repo):
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Emergency Deployment
```bash
# Manual deploy to Netlify
npm run build
netlify deploy --prod --dir=dist

# Get deployment URL
netlify open:site
```

#### Update DNS for Failover
If GitHub Pages is down:
1. Go to Cloudflare DNS
2. Update CNAME record:
   - Change target from `tejasgadhia.github.io` to Netlify URL
   - TTL: 5 minutes (for faster failover)
3. Wait 5-10 minutes for DNS propagation

### Monitoring Failover
UptimeRobot will detect GitHub Pages downtime and alert via:
- Email (immediate)
- Slack (immediate)
- Public status page (updates within 5min)

---

## Troubleshooting

### Cloudflare Issues

**Problem**: 404 errors on Cloudflare-proxied site
**Solution**:
- Check CNAME record points to correct GitHub Pages URL
- Ensure proxy is enabled (orange cloud)
- Purge Cloudflare cache: Dashboard → Caching → Purge Everything

**Problem**: CSS/JS files not loading
**Solution**:
- Check `.nojekyll` file exists in repo root
- Verify caching rules don't block assets
- Check browser console for CORS errors

**Problem**: Slow response times
**Solution**:
- Verify Cloudflare is proxying (check `cf-ray` header)
- Check cache hit rate: Dashboard → Analytics → Caching
- Adjust Page Rules for better caching

### UptimeRobot Issues

**Problem**: False downtime alerts
**Solution**:
- Increase Monitor Timeout (30s → 60s)
- Change HTTP Method from HEAD to GET
- Remove keyword checking (if flaky)

**Problem**: Not receiving alerts
**Solution**:
- Check spam folder (email alerts)
- Verify alert contact is enabled
- Test alert: Monitor → Settings → Test Alert

**Problem**: Status page not updating
**Solution**:
- Refresh browser (hard refresh: Cmd+Shift+R)
- Check monitor is added to status page
- Verify status page is public (not password-protected)

### GitHub Pages Issues

**Problem**: Deploy fails (validation errors)
**Solution**:
```bash
# Check validation locally
npm run type-check  # TypeScript errors
npm run test:all    # Test failures
test -f .nojekyll   # Missing .nojekyll
npm run lighthouse  # Lighthouse failures
```

**Problem**: Site not updating after deploy
**Solution**:
- Wait 2-3 minutes (GitHub Pages CDN cache)
- Hard refresh browser: Cmd+Shift+R (Mac), Ctrl+Shift+R (Windows)
- Check GitHub Actions: Repo → Actions → Latest workflow
- Purge Cloudflare cache (if using)

**Problem**: `.ui-design/` directory returns 404
**Solution**:
- Verify `.nojekyll` file exists (critical!)
- Check file is committed: `git ls-files | grep .nojekyll`
- Redeploy if missing: `touch .nojekyll && git add . && git commit -m "Add .nojekyll" && git push`

---

## Monitoring Dashboard

### Key Metrics to Track
- **Uptime %**: Target 99.9% (UptimeRobot)
- **Response Time**: Target <500ms (UptimeRobot)
- **Lighthouse Score**: Performance/A11y/Best Practices >90 (CI)
- **CDN Cache Hit Rate**: Target >80% (Cloudflare Analytics)
- **Bandwidth**: Monitor for unusual spikes (Cloudflare Analytics)

### Weekly Health Check
✅ UptimeRobot status: 7-day uptime >99%
✅ Cloudflare cache hit rate: >80%
✅ GitHub Actions: All workflows passing
✅ Lighthouse CI: All scores >90
✅ No open critical issues

---

**Last Updated**: 2026-02-02 | **Version**: 3.4.0
