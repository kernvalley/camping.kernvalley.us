import 'std-js/theme-cookie.js';
import '@shgysk8zer0/components/share-button.js';
import '@shgysk8zer0/components/github/user.js';
import '@shgysk8zer0/components/current-year.js';
import '@shgysk8zer0/components/install/prompt.js';
import '@kernvalley/components/ad.js';
import '@shgysk8zer0/components/weather/current.js';
import '@shgysk8zer0/components/app/list-button.js';
import '@shgysk8zer0/components/app/stores.js';
import { debounce } from 'std-js/events.js';
import { ready, loaded, on, css, toggleClass, each, map } from 'std-js/dom.js';
import { getCustomElement } from 'std-js/custom-elements.js';
import { init } from 'std-js/data-handlers.js';
import { loadImage } from 'std-js/loader.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'std-js/google-analytics.js';
import { SECONDS } from 'std-js/date-consts.js';
import { site, GA } from './consts.js';

toggleClass([document.documentElement], {
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
});

css([document.documentElement], { '--viewport-height': `${window.innerHeight}px` });

on([window], ['resize'], debounce(() =>
	css([document.documentElement], { '--viewport-height': `${window.innerHeight}px` })
), { passive: true });

getCustomElement('install-prompt').then(HTMLInstallPromptElement => {
	on('#install-btn', ['click'], () => new HTMLInstallPromptElement().show())
		.forEach(el => el.hidden = false);
});

if (typeof GA === 'string' && GA.length !== 0) {
	loaded().then(() => {
		requestIdleCallback(() => {
			importGa(GA).then(async ({ ga, hasGa }) => {
				if (hasGa()) {
					ga('create', ga, 'auto');
					ga('set', 'transport', 'beacon');
					ga('send', 'pageview');

					on('a[rel~="external"]', ['click'], externalHandler, { passive: true, capture: true });
					on('a[href^="tel:"]', ['click'], telHandler, { passive: true, capture: true });
					on('a[href^="mailto:"]', ['click'], mailtoHandler, { passive: true, capture: true });
				}
			});
		});
	});
}

ready().then(() => {
	init();

	if (location.pathname === '/') {
		Promise.all([
			getCustomElement('leaflet-marker'),
			customElements.whenDefined('leaflet-map'),
		]).then(([LeafletMarker]) => {
			document.getElementById('find-btn').hidden = false;
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
