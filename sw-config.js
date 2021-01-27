---
layout: null
---
'use strict';
/*eslint no-unused-vars: 0*/
const config = {
	version: '{{ site.data.app.version | default: site.version }}',
	fresh: [
		'/',
		'https://apps.kernvalley.us/apps.json',
		'https://cdn.kernvalley.us/img/markers.svg',
		'/manifest.json',
	].map(path => new URL(path, location.origin).href),
	stale: [
		/* Other HTML */
		'https://cdn.kernvalley.us/components/leaflet/map.html',
		'https://cdn.kernvalley.us/components/github/user.html',
		'https://cdn.kernvalley.us/components/weather/current.html',
		'https://cdn.kernvalley.us/components/toast-message.html',

		/* JS, `customElements`, etc. */
		'/js/index.min.js',
		'https://cdn.kernvalley.us/components/leaflet/map.min.js',

		/* CSS */
		'/css/index.min.css',
		'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
		'https://cdn.kernvalley.us/components/leaflet/map.css',
		'https://cdn.kernvalley.us/components/github/user.css',
		'https://cdn.kernvalley.us/components/weather/current.css',
		'https://cdn.kernvalley.us/components/toast-message.css',

		/* Images & Icons */
		'/img/icons.svg',
		'/img/apple-touch-icon.png',
		'/img/icon-512.png',
		'/img/icon-192.png',
		'/img/icon-32.png',
		'/img/favicon.svg',
		'https://cdn.kernvalley.us/img/adwaita-icons/actions/mark-location.svg',
		'https://cdn.kernvalley.us/img/logos/play-badge.svg',
		'https://cdn.kernvalley.us/img/keep-kern-clean.svg',
		'https://cdn.kernvalley.us/img/logos/instagram.svg',

		/* Fonts */
		'https://cdn.kernvalley.us/fonts/roboto.woff2',
		/* Other */
	].map(path => new URL(path, location.origin).href),
	allowed: [
		// /https:\/\/maps\.wikimedia\.org\/osm-intl\/*/,
		// /https:\/\/[A-z]\.tile\.openstreetmap\.org\/*/,
		'https://server.arcgisonline.com/ArcGIS/rest/services/',
		'https://i.imgur.com/',
		/https:\/\/*\.githubusercontent\.com\/u\/*/,
	],
	allowedFresh: [
		'https://api.openweathermap.org/data/',
		'https://api.github.com/users/',
	]
};
