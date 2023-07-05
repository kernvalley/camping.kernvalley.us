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
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}leaflet/map.html',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}github/user.html',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}weather/current.html',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}toast-message.html',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}install/prompt.html',

		/* JS, `customElements`, etc. */
		'/js/index.min.js',
		'{{ site.data.importmap.imports["@shgysk8zer0/polyfills"] }}',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}leaflet/bundle.min.js',

		/* CSS */
		'/css/index.min.css',
		'{{ site.data.importmap.imports["leaflet/"] }}dist/leaflet.css',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}leaflet/map.css',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}github/user.css',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}weather/current.css',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}toast-message.css',
		'{{ site.data.importmap.imports["@shgysk8zer0/components/"] }}install/prompt.css',

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
		/\.(jpg|png|gif|svg|webp)$/,
	],
	allowedFresh: [
		'https://api.openweathermap.org/data/',
		'https://api.github.com/users/',
		/\.(html|css|js|json)$/,
	]
};
