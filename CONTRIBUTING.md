# Contributing to RAMP-Kit

Thank you for your interest in improving RAMP-Kit! 🚪

## Quick Start for Contributors

```bash
git clone https://github.com/synthanai/ramp-kit.git
cd ramp-kit
npm install
npm test
```

---

## Ways to Contribute

### 📦 New RAMP Cards
- Submit templates for uncovered decision types
- Cover new domains (Healthcare, Legal, Education)
- Add industry-specific reversibility patterns

### 🔌 New Integrations
- CI/CD platforms (GitLab, CircleCI, Azure DevOps)
- Project management (Jira, Linear, Asana)
- Observability tools (Datadog, PagerDuty, Grafana)
- Chat platforms (Slack, Teams, Discord)

### 🌍 Translations
- Translate CLI output strings
- Localize methodology documentation
- Add RTL support

### 🐛 Bug Fixes
- Edge cases in scoring logic
- Cross-platform compatibility
- Error handling improvements

### 📖 Methodology Refinements
- Propose improvements to RAMPKIT protocol
- Submit case studies from real assessments
- Refine DOORS principles based on practice

---

## Code Style

- **ES Modules** — Use `import/export`
- **Async/await** — For interactive prompts
- **chalk/boxen/ora** — For terminal UI
- **Comments** — Explain *why*, not *what*

---

## Pull Request Process

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Add/update tests as needed
5. Run `npm test` to verify
6. Submit PR with clear description

---

## Commit Messages

Use emoji prefixes:

| Emoji | Type |
|-------|------|
| ✨ | New feature |
| 🐛 | Bug fix |
| 📦 | New RAMP card template |
| 🔌 | Integration |
| 📝 | Documentation |
| ⚡ | Performance |
| 🔒 | Security |

Example: `✨ Add GitLab CI integration`

---

## Testing Guidelines

### Unit Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Manual Testing
```bash
node src/index.js mvr "Test decision"
node src/index.js quick "Feature flag"
node src/index.js gate "CI test" --json
```

---

## Adding a New RAMP Card

1. Add to `data/cards.json`
2. Follow the schema:
```json
{
  "id": "109",
  "domain": "your-domain",
  "name": "Card Name",
  "level": "L3",
  "description": "Brief description",
  "reversibilityFactors": [...],
  "rollbackMethods": [...],
  "signals": [...]
}
```
3. Test with `ramp list -d your-domain`

---

## Questions?

Open an issue or reach out on [LinkedIn](https://linkedin.com/in/naveenriaz).

---

> **"Can we undo this?"**
> *Move fast on two-way doors. Slow down on one-way doors.*
