import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
import 'https://cdn.kernvalley.us/components/leaflet/map.js';
import 'https://cdn.kernvalley.us/components/leaflet/marker.js';
import 'https://cdn.kernvalley.us/components/pwa/install.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import 'https://cdn.kernvalley.us/components/weather/current.js';
import 'https://cdn.kernvalley.us/components/app/list-button.js';
import 'https://cdn.kernvalley.us/components/app/stores.js';
import { $, ready, getCustomElement, getLocation } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { init } from 'https://cdn.kernvalley.us/js/std-js/data-handlers.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { SECONDS } from 'https://cdn.kernvalley.us/js/std-js/date-consts.js';
import { registerMapSearch } from './functions.js';
import { hashChange, stateHandler } from './handlers.js';
import { site, GA } from './consts.js';

const locIcon = 'https://cdn.kernvalley.us/img/adwaita-icons/actions/mark-location.svg';

$(document.documentElement).toggleClass({
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
}).then($doc => {
	$doc.css({ '--viewport-height': `${window.innerHeight}px` });
	$doc.debounce('resize', () => $doc.css({ '--viewport-height': `${window.innherHeight}px` }));
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
]).then(async () => {
	init().catch(console.error);

	if (location.pathname === '/') {
		requestIdleCallback(async () => {
			registerMapSearch();
			window.addEventListener('popstate', stateHandler);
		});

		Promise.all([
			getCustomElement('leaflet-marker'),
			customElements.whenDefined('leaflet-map'),
		]).then(async ([Marker]) => {
			hashChange();

			$('#find-btn').click(async () => {
				const { coords: { latitude, longitude }} = await getLocation({
					enableHighAccuracy: true,
					maxAge: 15 * SECONDS,
				});
				const ShareButton = await getCustomElement('share-button');
				const share = new ShareButton();
				const map = document.getElementById('leaflet-map');
				const popup = document.createElement('div');
				const h3 = document.createElement('h3');
				const pos = document.createElement('div');
				const url = new URL(document.baseURI);
				url.hash = `#${latitude},${longitude}`;
				h3.textContent = 'Current Location';
				pos.textContent = `${latitude}, ${longitude}`;
				share.textContent = 'Share Location';
				share.url = url.href;
				share.text = 'See my current location';

				popup.append(h3, pos, share);

				const marker = new Marker({ latitude, longitude, icon: locIcon, popup });
				marker.addEventListener('close', ({ target }) => target.remove());
				document.title = `Current Location: ${site.title}`;
				marker.open = true;
				map.append(marker);
				map.center = { latitude, longitude };
				map.zoom = 16;
				history.pushState({
					latitude,
					longitude,
					title: 'Marked Location',
					body: `Location: ${latitude}, ${longitude}`,
				}, document.title, url.href);

			});
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
});
