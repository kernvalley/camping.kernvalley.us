<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Button for fullscreen
- Button to show user's current location

### Changed
- Re-write to use components in `_includes/common/` and `_includes/leaflet/` via submodules
- Use main site privacy page and add redirect

### Removed
- Git copy of `icons.svg` (rely on `svg-sprite-generator` on build)

## [v1.1.1] - 2021-01-17

### Changed
- Update components and places data

## [v1.1.0] - 2021-01-11

### Added
- Places data as submodule
- New and updated components in `_includes/` for map markers
- Weather from OpenWeatherMap via `<weather-current>`
- Also show markers for towns, gas stations, stores, etc.
- Add fullscreen button

### Changed
- Use data from places instead of local copy of data
- Replace contact page with redirect to `https://contact.kernvalley.us`
- Update nav layout

### Removed
- Remove unused icons from `icons.svg`
- Clean-up SW cache list
- `<html-notification>` notifying of site being under construction

### Fixed
- Footer layout in Chrome (do not use multi-column layout)
- Fix incorrect viewport / nav placement on mobile

## [v1.0.6] - 2020-12-13

### Added
- Add `<button is="app-list">`
- Control theme via `cookieStore`

### Changed
- Move `<button is="pwa-install">` to `<nav>`

### Changed
- Update to Leaflet [1.7.1](https://leafletjs.com/2020/09/04/leaflet-1.7.1.html)

## [v1.0.4] - 2020-09-06

### Added
- "Under Construction" notification
- Preloading of assets
- Different sized background images
- GA tracking of external link clicks

### Changed
- Various dependency & workflow updates
- Import updates to some components

### Fixed
- Add missing search icon
- Disable bash script linting due to issue with `.rvmrc`

### Removed
- Duplicate form styles (use CDN CSS `.form-group` rules)

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
