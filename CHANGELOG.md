# Changelog

All notable changes to RAMP-Kit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-17

### Added

- **PHASE Modes**: Complete implementation of all 5 operational contexts
  - 👤 Personal: 3-second "RAMP Tap" screen
  - 👥 Huddle: Team "Finger Protocol" for sprint ceremonies
  - 🤖 Automated: CI/CD gate with rule-based scoring
  - 🤝 Supported: AI-augmented assessment (scaffolding)
  - 🏛️ Enterprise: Cross-functional sign-off workflow

- **MVR Protocol**: Full 15-minute Minimum Viable RAMP
  - 4-step rapid assessment (R-A-M-P)
  - Traffic light decision output (GREEN/YELLOW/RED)
  - Mode-aware adaptation per PHASE context

- **CI/CD Integration**
  - `ramp gate` command for pipeline integration
  - `--strict` flag for exit code enforcement
  - `--json` and `--oneline` output formats
  - Change detection flags (`--schema`, `--breaking`, etc.)

- **Decision Persistence**
  - Local storage in `~/.ramp/decisions/`
  - Decision history with `ramp history`
  - JSON export for audit trails

- **Methodology Reference Commands**
  - `ramp ref` — Quick reference card
  - `ramp levels` — RAMP levels reference
  - `ramp protocol` — RAMPKIT protocol
  - `ramp doors` — DOORS principles
  - `ramp phase` — PHASE modes
  - `ramp climbs` — CLIMBS patterns

- **108 RAMP Card Library**
  - Templates across 18 domains
  - `ramp list` with domain/level filtering
  - Foundation for custom card creation

### Changed

- CLI rewritten with Commander.js for better argument parsing
- Modular architecture separating commands from core logic
- Enhanced terminal UI with boxen, chalk, ora
- Improved scoring algorithm with detailed breakdown

### Technical

- ES Modules throughout
- Async/await for all interactive flows
- Comprehensive test suite (100+ tests)
- Security-first local-only architecture

---

## [1.0.0] - 2025-12-01

### Added

- Initial RAMP-Kit CLI release
- Basic RAMP scoring (5 questions)
- RAMP levels L1-L5
- DOORS check command
- RAMP card generation
- Quick reference display

---

## [0.1.0] - 2025-11-15

### Added

- Proof of concept CLI
- Basic scoring functionality
- Initial RAMPKIT protocol implementation

---

## Roadmap

### v2.1.0 (Planned)
- [ ] TUI Mission Control (like SPAR-Kit)
- [ ] RAMP Card Builder wizard
- [ ] Template marketplace
- [ ] Enhanced Huddle mode with voting

### v2.2.0 (Planned)
- [ ] Supported mode AI integration
- [ ] Enterprise mode approval workflows
- [ ] Slack/Teams integration
- [ ] Export to Confluence/Notion

### v3.0.0 (Future)
- [ ] RAMP + SPAR unified workflow
- [ ] Decision lifecycle dashboard
- [ ] Organization-wide analytics
- [ ] API for custom integrations

---

## Migration Guide

### From v1.x to v2.x

1. **Config location unchanged**: `~/.ramp/config.json`
2. **New commands**: `mvr`, `quick`, `huddle`, `gate`, `phase`, `climbs`
3. **Breaking**: `ramp score` renamed to `ramp mvr` (aliased for compatibility)
4. **New**: Decision history stored in `~/.ramp/decisions/`

```bash
# Old (still works via alias)
ramp score "My decision"

# New (recommended)
ramp mvr "My decision"
```
