# Cloudflare Access for development

Development hostnames exposed through the Edge-owned Cloudflare Tunnel must be protected by
Cloudflare Access. Do not add an unauthenticated bypass for health or revision paths. The local
repository contains the connector, but does not manage the external Tunnel ingress or Access
policies.

The reason for requiring host-wide authentication and avoiding health-path bypasses is recorded in
[ADR 008](../../adr/008-edge-development-tunnel-exposure.md). The connector's local setup is in
[Tunnel development](cloudflare-tunnel-development.md).
