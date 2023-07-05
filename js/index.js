import '@shgysk8zer0/kazoo/theme-cookie.js';
import { createPolicy } from '@shgysk8zer0/kazoo/trust.js';
import { getGooglePolicy, getDefaultPolicy } from '@shgysk8zer0/kazoo/trust-policies.js';
import { debounce } from '@shgysk8zer0/kazoo/events.js';
import { ready, on, css, toggleClass, each, map } from '@shgysk8zer0/kazoo/dom.js';
import { getCustomElement } from '@shgysk8zer0/kazoo/custom-elements.js';
import { init } from '@shgysk8zer0/kazoo/data-handlers.js';
import { loadImage } from '@shgysk8zer0/kazoo/loader.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from '@shgysk8zer0/kazoo/google-analytics.js';
import { SECONDS } from '@shgysk8zer0/kazoo/date-consts.js';
import { site, GA } from './consts.js';

getDefaultPolicy();

toggleClass([document.documentElement], {
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});


if (! CSS.supports('height', '100dvh')) {
	css([document.documentElement], { '--viewport-height': `${window.innerHeight}px` });
	on([window], ['resize'], debounce(() =>
		css([document.documentElement], { '--viewport-height': `${window.innerHeight}px` })
	), { passive: true });
}

getCustomElement('install-prompt').then(HTMLInstallPromptElement => {
	on('#install-btn', ['click'], () => new HTMLInstallPromptElement().show())
		.forEach(el => el.hidden = false);
});

if (typeof GA === 'string' && GA.length !== 0) {
	const policy = getGooglePolicy();
	scheduler.postTask(async() => {
		const { ga, hasGa } = await importGa(GA, {}, { policy });

		if (hasGa()) {
			ga('create', GA, 'auto');
			ga('set', 'transport', 'beacon');
			ga('send', 'pageview');

			on('a[rel~="external"]', 'click', externalHandler, { passive: true, capture: true });
			on('a[href^="tel:"]', 'click', telHandler, { passive: true, capture: true });
			on('a[href^="mailto:"]', 'click', mailtoHandler, { passive: true, capture: true });
		}
	}, { priority: 'background' });
} else {
	createPolicy('goog#html', {});
	createPolicy('goog#script-url', {});
	getGooglePolicy();
}

ready().then(() => {
	init();

	if (location.pathname === '/') {
		Promise.all([
			getCustomElement('leaflet-marker'),
			customElements.whenDefined('leaflet-map'),
		]).then(([LeafletMarker]) => {
			on('#query', ['input'], debounce(({ target: { value: query }}) => {
				if (query.length === 0) {
					each('leaflet-marker[title][hidden]', el => el.hidden = false);
				} else {
					const queryStr = query.toLowerCase();
					each('leaflet-marker[title]', marker => {
						marker.hidden = ! marker.title.toLowerCase().includes(queryStr);
					});
				}

				const openMarkers = document.querySelectorAll('leaflet-marker:not([hidden])');

				if (openMarkers.length === 1) {
					const marker = openMarkers.item(0);
					const map = marker.closest('leaflet-map');
					marker.open = true;
					map.flyTo({
						latitude: marker.latitude,
						longitude: marker.longitude,
						zoom: 16,
					});
				}
			}));

			on([document.forms.search], ['reset'], () => {
				each('leaflet-marker[title][hidden]', el => el.hidden = false);
			});

			on([document.forms.search], ['submit'], event => event.preventDefault());

			document.forms.search.hidden = false;

			on('#find-btn', ['click'], async () => {
				const map = document.querySelector('leaflet-map');
				const ShareButton = await getCustomElement('share-button');
				const { coords: { latitude, longitude }} = await map.locate({
					enableHighAccuracy: true,
					maxAge: 15 * SECONDS,
					maxZoom: 16,
				});
				const share = new ShareButton();
				const popup = document.createElement('div');
				const h3 = document.createElement('h3');
				const pos = document.createElement('div');
				const url = new URL(document.baseURI);
				const icon = await loadImage('@shgysk8zer0/img/markers.svg#map-marker', {
					height: 30,
					width: 30,
					slot: 'icon',
					loading: 'lazy',
				});
				url.hash = `#${latitude},${longitude}`;
				h3.textContent = 'Current Location';
				pos.textContent = `${latitude}, ${longitude}`;
				share.textContent = 'Share Location';
				share.url = url.href;
				share.text = 'See my current location';

				popup.append(h3, pos, share);

				const marker = new LeafletMarker({ latitude, longitude, icon, popup });
				marker.addEventListener('close', ({ target }) => target.remove());
				document.title = `Current Location: ${site.title}`;
				marker.open = true;
				map.append(marker);
			});

			const list = document.getElementById('campgrounds-list');

			new Set(map('leaflet-marker[title]', ({ title }) => title)).forEach(value => {
				const option = document.createElement('option');
				option.value = value;
				list.append(option);
			});
		});
	}
});
