# Networking & HTTP Fundamentals — Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 2 Nov 2026 – 8 Nov 2026 (Days 78–84)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Phase 4** — Days 78–81 (before databases finish + before ANY system design).  
> **Prerequisites:** Node.js basics (PDF #07).  
> **Unlocks:** System Design Prerequisites (10c), HLD (10), Distributed Systems (11).

---

## Why this exists (don't skip)

You cannot design URL shorteners, chat systems, or understand CAP theorem without knowing:
- How HTTP requests work
- What TCP guarantees
- Why CORS errors happen
- Difference between HTTP/1.1, HTTP/2, WebSockets

**80 LPA interviews** ask networking before scaling discussions.

---

## 1. OSI / TCP-IP simplified

| Layer | Protocols | You care about |
|-------|-----------|----------------|
| Application | HTTP, WebSocket, DNS | API design, REST |
| Transport | TCP, UDP | Reliability vs speed |
| Network | IP | Routing |
| Link | Ethernet, WiFi | — |

---

## 2. HTTP fundamentals

### Request structure

```
GET /api/users/123 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbG...
Accept: application/json
Content-Type: application/json

{ "name": "Amit" }   ← body (POST/PUT/PATCH)
```

### Methods

| Method | Idempotent | Safe | Body | Use |
|--------|------------|------|------|-----|
| GET | Yes | Yes | No | Read |
| POST | No | No | Yes | Create |
| PUT | Yes | No | Yes | Replace |
| PATCH | No | No | Yes | Partial update |
| DELETE | Yes | No | No | Delete |

### Status codes (memorize)

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No content |
| 301/302 | Redirect |
| 400 | Bad request (client error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (authenticated, no permission) |
| 404 | Not found |
| 409 | Conflict |
| 429 | Too many requests |
| 500 | Internal server error |
| 502 | Bad gateway |
| 503 | Service unavailable |

### Headers you must know

| Header | Purpose |
|--------|---------|
| `Authorization` | Bearer token, Basic auth |
| `Content-Type` | `application/json` |
| `Cache-Control` | Caching policy |
| `ETag` | Cache validation |
| `Cookie` / `Set-Cookie` | Session management |
| `CORS` headers | Cross-origin access |

---

## 3. HTTPS & TLS

```
HTTP  → plaintext (port 80)
HTTPS → HTTP + TLS encryption (port 443)

TLS handshake (simplified):
Client → "hello, supported ciphers"
Server → certificate (public key)
Client → verifies cert with CA, generates session key
Both → encrypted communication
```

**Interview:** HTTPS protects data in transit, not at rest. Certificate validates server identity.

---

## 4. TCP vs UDP

| | TCP | UDP |
|---|-----|-----|
| Connection | Connection-oriented | Connectionless |
| Reliability | Guaranteed delivery, order | Best effort |
| Speed | Slower (handshake, ack) | Faster |
| Use | HTTP, API, DB connections | Video, gaming, DNS |

**TCP 3-way handshake:** SYN → SYN-ACK → ACK

---

## 5. DNS

```
Browser: "What is api.stripe.com?"
DNS resolver → Root → TLD (.com) → Authoritative → IP: 54.x.x.x
Cached at browser, OS, ISP levels (TTL)
```

**Types:** A (IP), AAAA (IPv6), CNAME (alias), MX (mail).

---

## 6. CORS (Cross-Origin Resource Sharing)

```
Browser blocks: frontend localhost:3000 → API localhost:4000
Unless API responds with:
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: GET, POST
  Access-Control-Allow-Headers: Content-Type, Authorization
```

**Preflight:** Browser sends OPTIONS before POST with custom headers.

**Fix in Express:**
```javascript
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
```

---

## 7. Cookies vs JWT vs Sessions

| | Cookie (session) | JWT |
|---|------------------|-----|
| Storage | Server session store | Client (header/cookie) |
| Revocation | Easy (delete session) | Hard (need blocklist/short expiry) |
| Size | Small session ID | Larger (claims encoded) |
| Stateless server | No | Yes |

**Best practice:** JWT access token (short) + refresh token in httpOnly cookie.

---

## 8. WebSockets

```
HTTP: request → response (client initiates each time)
WebSocket: persistent bidirectional connection

Upgrade: HTTP GET with Upgrade: websocket
Use: chat, live dashboards, gaming
Alternative at scale: Server-Sent Events (one-way server→client)
```

---

## 9. HTTP/1.1 vs HTTP/2 vs HTTP/3

| Version | Key feature |
|---------|-------------|
| HTTP/1.1 | One request per connection (head-of-line blocking) |
| HTTP/2 | Multiplexing, header compression, binary framing |
| HTTP/3 | QUIC over UDP, faster connection setup |

---

## 10. REST API design rules

1. Nouns for resources: `/users`, not `/getUsers`
2. Plural collections: `/users/123/posts`
3. Pagination: `?page=2&limit=20`
4. Filtering: `?status=active&sort=-createdAt`
5. Versioning: `/v1/users` or header `Accept: application/vnd.api+json;version=1`
6. Idempotency keys for POST payments

---

## 11. Connection to later topics

| This topic | Used in |
|------------|---------|
| HTTP | REST API design (05), System Design APIs |
| TCP | Load balancers (10c), why connections pool |
| DNS | CDN routing (10), GeoDNS |
| CORS | Auth (07), frontend-backend |
| WebSocket | Chat system design (10), TaskFlow |
| Cookies | Session management, OAuth |

---

## 12. Exercises

1. Use `curl -v https://httpbin.org/get` — read request/response headers
2. Build Express API — observe CORS error from browser, fix it
3. Draw TCP 3-way handshake on paper
4. Explain what happens when you POST login form

---

## 13. Interview Q&A

**Q: What happens when you type a URL and press Enter?**  
**A:** DNS resolves hostname to IP. Browser opens TCP connection to server (port 443 for HTTPS). TLS handshake establishes encrypted channel. Browser sends HTTP GET request with headers. Server processes, returns HTTP response (status, headers, body). Browser parses HTML, issues additional requests for CSS/JS/images (HTTP/2 multiplexes). Renders page. JavaScript may make further API calls.

**Q: Difference between 401 and 403?**  
**A:** 401 Unauthorized: authentication required or failed — client should retry with credentials. 403 Forbidden: authenticated but lacks permission — retrying with same credentials won't help. Example: valid JWT but not admin role accessing `/admin`.

**Q: How would you debug a CORS error?**  
**A:** Check browser console for blocked origin. Verify server sends `Access-Control-Allow-Origin` matching frontend origin (not `*` when credentials used). For preflight failures, check OPTIONS handler and `Allow-Methods`/`Allow-Headers`. Confirm frontend URL matches exactly (protocol, port). Use curl to test API independently of browser.

---

## 14. Gate to System Design

Before opening PDF #10c or #10:
- [ ] Explain HTTP request/response structure
- [ ] List 10 status codes from memory
- [ ] Explain CORS in one minute
- [ ] Draw TCP vs UDP tradeoff
- [ ] curl an API and read headers
