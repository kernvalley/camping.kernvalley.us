import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://unpkg.com/@webcomponents/custom-elements@1.4.1/custom-elements.min.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/share-to-button/share-to-button.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
import 'https://cdn.kernvalley.us/components/leaflet/map.js';
import 'https://cdn.kernvalley.us/components/leaflet/marker.js';
import 'https://cdn.kernvalley.us/components/pwa/install.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import 'https://cdn.kernvalley.us/components/app/list-button.js';
import { $, ready } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { init } from 'https://cdn.kernvalley.us/js/std-js/data-handlers.js';
import { HTMLNotificationElement } from 'https://cdn.kernvalley.us/components/notification/html-notification.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { loadScript } from 'https://cdn.kernvalley.us/js/std-js/loader.js';
import { registerMapSearch } from './functions.js';
import { hashChange, stateHandler } from './handlers.js';
import { site, GA } from './consts.js';

$(document.documentElement).toggleClass({
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});

if (typeof GA === 'string' && GA.length !== 0) {
	requestIdleCallback(() => {
		importGa(GA).then(async ({ ga }) => {
			if (ga instanceof Function) {
				ga('create', ga, 'auto');
				ga('set', 'transport', 'beacon');
				ga('send', 'pageview');

				await ready();

				$('a[rel~="external"]').click(externalHandler, { passive: true, capture: true });
				$('a[href^="tel:"]').click(telHandler, { passive: true, capture: true });
				$('a[href^="mailto:"]').click(mailtoHandler, { passive: true, capture: true });
			}
		});
	});
}

Promise.allSettled([
	ready(),
	loadScript('https://cdn.polyfill.io/v3/polyfill.min.js'),
]).then(async () => {
	init().catch(console.error);

	if (location.pathname === '/') {
		requestIdleCallback(async () => {
			registerMapSearch();
			window.addEventListener('popstate', stateHandler);

			if (! await cookieStore.get({ name: 'notified' })) {
				const notification = new HTMLNotificationElement('Under Construction', {
					icon: '/img/favicon.svg',
					body: 'Kern Valley Camping is still under construction',
					image: 'https://i.imgur.com/6xZrS3mm.jpg',
					tag: 'construction',
					dir: 'ltr',
					lang: 'en',
					vibrate: 0,
					requireInteraction: true,
					data: {
						share: {
							title: 'Kern Valley Camping',
							text: 'Map of camping sites in and around the Kern River Valley',
							url: location.origin,
						},
						home: {
							url: 'https://kernvalley.us',
						}
					},
					actions: [{
						title: 'Share',
						action: 'share',
						icon: '/img/adwaita-icons/places/folder-publicshare.svg',
					}, {
						title: 'Dismiss',
						action: 'close',
						icon: '/img/octicons/x.svg',
					}]
				});

				notification.addEventListener('notificationclick', ({ action, notification }) => {
					switch (action) {
						case 'close':
							notification.close();
							break;

						case 'share':
							if (navigator.canShare({ title: document.title, url: location.href })) {
								const { title, text, url } = notification.data.share;
								navigator.share({ title, url, text });
							}
							break;
						case 'home':
							location.href = notification.data.home.url;
							break;
					}
				});

				notification.addEventListener('close', () => {
					cookieStore.set({
						name: 'notified',
						value: 'yes',
						path: '/',
						sameSite: 'strict',
						secure: true,
						expires: new Date('2021-01-01'),
					});
				});
			}
		});

		Promise.all([
			customElements.whenDefined('leaflet-map'),
			customElements.whenDefined('leaflet-marker'),
		]).then(async () => {
			if (history.state === null && location.hash !== '') {
				if (location.hash.includes(',')) {
					const [latitude = NaN, longitude = NaN] = location.hash.substr(1).split(',', 2).map(parseFloat);
					history.replaceState({
						latitude,
						longitude,
						title: 'Location',
						body: `Coorinates: ${latitude}, ${longitude}`,
					}, `Location: ${site.title}`, location.href);

					stateHandler(history);
				} else {
					const marker = document.getElementById(location.hash.substr(1));

					if (marker instanceof HTMLElement && marker.tagName === 'LEAFLET-MARKER') {
						document.title = `${marker.title} | ${site.title}`;
						history.replaceState({
							title: marker.title,
							longitude: marker.longitude,
							latitude: marker.latitude,
							uuid: marker.id,
						}, document.title, location.href);

						stateHandler(history);
					}
				}
			} else if (history.state !== null) {
				stateHandler(history);
			}
		});
	}

	$('leaflet-marker').on('open', ({target}) => {
		const url = new URL(location.pathname, location.origin);
		url.hash = `#${target.id}`;
		document.title = `${target.title} | ${site.title}`;

		if (location.hash.substr(1) !== target.id) {
			history.pushState({
				latitude: target.latitude,
				longitude: target.longitude,
				title: target.title,
				uuid: target.id,
			}, document.title, url.href);
		}
	});

	Promise.all(['leaflet-map', 'leaflet-marker'].map(tag => customElements.whenDefined(tag))).then(() => {
		hashChange();
	});
});
