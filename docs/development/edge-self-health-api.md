# Edge self-health API

The five apex Workers expose an Edge-only JSON health document:

```text
GET /api/v0/health.json
```

The response reports the Worker itself. It does not contact Rails or read a Cloudflare VPC
binding. The operational `/health` probes remain a separate `text/plain` contract. Revision data
is exposed separately at `/revision` and `/api/v0/revision.json`; see
[Edge deployment revision](edge-revision-api.md).

The JSON document has exactly two top-level keys:

```json
{
  "status": "pass",
  "checks": {
    "startup": { "status": "pass" },
    "liveness": { "status": "pass" },
    "readiness": { "status": "pass" }
  }
}
```

The response is `application/json`, `Cache-Control: no-store`, and
`X-Robots-Tag: noindex, nofollow`. It sets no cookie and does not redirect. The Hurl contract in
each package's `api/health-api.hurl` checks the response keys and headers against a running Worker.
