# Contributing

This repository is a reference implementation pattern. Changes should remain minimal, correct, and aligned with the canonical assertions in [reference-fonts-implementation](https://github.com/Monotype/reference-fonts-implementation).

## Process

1. Open an issue describing the proposed change and the reason
2. Submit a PR referencing the issue
3. Request review from appropriate stakeholders:
   - DevRel for pattern correctness and clarity
   - Engineering for technical accuracy
   - Legal for any changes affecting licensing guidance

## Style

- Keep the implementation minimal — this is a pattern, not a production app
- The **demo subset** font under `public/fonts/` is intentional so CI and `next build` succeed; do not add unrelated font binaries without legal review. The `.gitignore` rule for `*.woff2` still applies to **new** files unless explicitly whitelisted or force-added
- If a canonical assertion changes in the reference repo, update this pattern to stay aligned
