# Wrangler authentication

Wrangler uses an interactive OAuth session inside the development container. Do not add an API
token to the image, repository, or package configuration.

## Browser login

From the workspace container, run:

```bash
pnpm run login
```

The host-loopback callback on port `8976` is forwarded by the Dev Container configuration.

## Device authorization

Use the device flow when the browser cannot reach the callback, such as when Wrangler is started
through `podman exec`:

```bash
pnpm run login:device
```

Wrangler prints the verification URL and one-time user code. Complete approval in a browser; the
CLI polls for authorization and writes its local session.

Wrangler stores the session in its container-local configuration directory. Recreating the
container removes that state, so log in again when needed. Do not print or copy the session file.
