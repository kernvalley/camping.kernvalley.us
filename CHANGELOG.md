<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- "Under Construction" notification

### Changed
- Various dependency & workflow updates
- Import updates to some components

### Fixed
- Add missing search icon

## [v 1.0.3] - 2020-07-18

### Changed
- Use `history.state` for managing map navigation
- Specify indent style and width in [`.editorconfig`](https://editorconfig.org/)
- Update various config files
- Update icons to be compatible with maskable icons
- Disable `'unsafe-inline'` for styles in CSP

## [v1.0.2] - 2020-07-15

### Updated
- Misc. changes for components to use external stylesheets

## [v1.0.1] - 2020-06-30

### Fixed
- Invalid call to `HTMLLeafletMarkerElement.close()` - use `open = false`

## [v1.0.0] - 2020-06-30

### Added
- Google Analytics
- Data file for campgrounds
- Privacy Policy
- Contact Page
- App icons & TWA asset links
- Search handler
- Share buttons
- Submodules now watched by dependabot
- Update URL hash on popup close [#5](https://github.com/kernvalley/camping.kernvalley.us/issues/5)

### Fixed
- Correctly set `<meta property="og:image">`

### Changed
- Theme colors
- Misc. metadata
<!-- markdownlint-restore -->
