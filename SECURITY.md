# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | ✅ Actively supported |
| 1.x.x   | ⚠️ Security fixes only |
| < 1.0   | ❌ No longer supported |

## Reporting a Vulnerability

If you discover a security vulnerability in RAMP-Kit, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Email: synthai@synthai.biz
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to respond within 48 hours and will work with you to address the issue.

---

## Security Architecture

### Local-First Design

RAMP-Kit is designed with privacy as a core principle:

- **No external data transmission** — All processing is local
- **No telemetry** — We don't collect usage data
- **No cloud dependency** — Works fully offline
- **Local storage only** — Decisions stored in `~/.ramp/`

### Input Validation

All user input is validated before processing:

| Input Type | Validations |
|------------|-------------|
| Decision ID | UUID v4 format required |
| Decision text | Length limits, character validation |
| File paths | Path traversal prevention |
| PHASE mode | Enum validation |
| RAMP level | L1-L5 range check |

### Output Sanitization

All output is sanitized before display or export:

- **Terminal output** — Control characters removed
- **Markdown export** — Special characters escaped
- **JSON export** — Schema validated
- **RAMP cards** — Content sanitized

### Sensitive Data Handling

| Data Type | Handling |
|-----------|----------|
| Decision text | Stored locally only, never transmitted |
| RAMP scores | Local calculation, no external APIs |
| History | Local JSON files in `~/.ramp/decisions/` |
| Config | Local file in `~/.ramp/config.json` |

---

## Configuration Security

### File Permissions

The CLI checks config file permissions:

```bash
# Recommended: 600 (owner read/write only)
chmod 600 ~/.ramp/config.json
```

If permissions are too open, a warning is displayed.

### Config File Location

```
~/.ramp/
├── config.json     # Settings
├── decisions/      # Decision history
└── cards/          # Custom RAMP cards
```

---

## CI/CD Security

### Pipeline Integration

When using RAMP in CI/CD pipelines:

1. **Don't log sensitive decisions** — Use `--quiet` for security-sensitive checks
2. **Validate exit codes** — Use `--strict` for enforcement
3. **Audit trail** — JSON output can be stored securely
4. **No secrets in decisions** — Never include credentials in decision text

### GitHub Actions Example

```yaml
- name: RAMP Gate Check
  run: |
    ramp gate "${{ github.event.pull_request.title }}" \
      --strict --json > ramp-result.json
  env:
    # No secrets needed - RAMP is local-only
```

---

## Dependency Security

We use:

- `npm audit` for vulnerability scanning
- Dependabot for automated updates
- Minimal runtime dependencies

To audit your installation:

```bash
cd /path/to/ramp-kit
npm audit
```

---

## Best Practices

### For Users

1. **Protect your config directory**
   ```bash
   chmod 700 ~/.ramp
   chmod 600 ~/.ramp/config.json
   ```

2. **Don't include secrets in decision text**
   - Bad: "Deploy API key sk-12345 rotation"
   - Good: "Deploy API key rotation"

3. **Review exported decisions** before sharing

### For Developers

1. **Validate all CLI input** — Use validation module
2. **Sanitize all output** — Use sanitization module
3. **No external calls** — RAMP is local-only by design
4. **Test security** — Run `npm run test:security`

---

## Security Tests

The test suite includes security-specific tests:

```bash
npm run test:security
```

Tests cover:
- Input validation
- Output sanitization
- File path security
- Config permission checks
- Decision ID validation

---

## Changelog

### v2.0.0 Security Features

- Local-first architecture (no external transmission)
- Input validation for all CLI arguments
- Output sanitization for exports
- Config permission warnings
- CI/CD security guidelines

---

🔒 **Security is a feature, not an afterthought.**
