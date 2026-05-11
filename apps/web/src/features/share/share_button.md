# QR Code Share Flow

## Scope
Sharing a QR code for: community, event, activity.
(Entity sharing is separate — entities have their own QR structure.)

---

## 1. Share Button — Inviter Side

### Flow
- User clicks the share button on a community page.
  - **[API]** `GET /invite-token` — check if the user already has an active `UserInviteToken`.
    - If yes → use existing token.
    - If no → **[API]** `POST /invite-token` — create one server-side, return it to frontend.
  - QR code is generated from: `{base_url}/community/{community_slug}?token={token}`
  - Modal/sheet opens displaying the QR code + a copy-link option.

### Edge Cases
- User has no community membership → cannot share (share button should be hidden or disabled).
- Token exists but `is_active = false` → treat as no token, create a new one.
- Network failure on token fetch → show error state, do not render QR.

### Frontend Components/Pages
- `<ShareButton />` — triggers token fetch + opens modal.
- `<ShareModal />` — renders QR code (`community_slug + token`), copy-link button.
- `useInviteToken()` — hook: fetches or creates the token, caches it in state.

---

## 2. QR Code Scan — Invitee Side (Has Account)

### Flow
- Scan navigates to: `/community/{community_slug}?shareToken={token}`
- Token is extracted from URL and persisted in `localStorage`.
- **[API]** `POST /invite` — create `UserInvite` record linking `token + invited_user + community`.
- User lands on the community page normally.

### Edge Cases
- Invitee is already a member of the community → skip `POST /invite`, no-op silently, land on community page.
- Token is invalid or expired (`is_active = false`) → land on community page without linking the invite.
- Invitee is the same user as the inviter → skip invite creation.
- Token already used by this exact user → skip duplicate creation.

### Frontend Components/Pages
- `<QRCodeLandingHandler />` — runs on community page mount, reads `?shareToken` param, writes to `localStorage`, triggers invite link API call.
- `useConsumeInviteToken()` — hook: reads token from URL/localStorage, calls `POST /invite` if valid conditions are met.

---

## 3. QR Code Scan — Invitee Side (No Account)

### Flow
- Scan navigates to: `/community/{community_slug}?token={token}`
- Token is extracted from URL and persisted in `localStorage`.
- User is not authenticated → redirected to sign up page (token preserved via `localStorage`).
- User completes sign up.
- **[API]** `POST /invite` — called post-registration using token from `localStorage`, registers invitee under inviter (`UserInvite.status = REGISTERED`).
- User is redirected back to the community page.
- On joining the community → `UserInvite.status` updated to `JOINED`.

### Edge Cases
- User drops off mid sign-up → token stays in `localStorage`, invite is linked on next login if token is still active.
- User already has an account but is logged out → after login, token from `localStorage` is consumed (same as "has account" flow).
- Token expires between scan and signup completion → invite is not created, user still lands on community normally.
- `localStorage` is unavailable (private browsing) → token is lost after redirect; invite cannot be linked. Acceptable degradation.

### Frontend Components/Pages
- `useConsumeInviteToken()` — same hook as above, also runs post-auth on first render.
- Auth pages (`/signup`, `/login`) — must not clear `localStorage` on mount.
- `<PostAuthInviteLinker />` — small side-effect component that runs once after auth is confirmed, consumes token from `localStorage` and fires `POST /invite`.

---

## Backend APIs (to target next)
- `GET /invite-token` — fetch active token for authed user.
- `POST /invite-token` — create new `UserInviteToken` for authed user.
- `POST /invite` — create `UserInvite` record (handles dedup + membership check server-side).
- `PATCH /invite/:id/status` — update `UserInvite.status` to `JOINED` when user joins community.
