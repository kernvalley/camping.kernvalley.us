import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/theme-cookie.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import 'https://cdn.kernvalley.us/components/current-year.js';
// import 'https://cdn.kernvalley.us/components/pwa/install.js';
import 'https://cdn.kernvalley.us/components/install/prompt.js';
import 'https://cdn.kernvalley.us/components/ad/block.js';
import 'https://cdn.kernvalley.us/components/weather/current.js';
import 'https://cdn.kernvalley.us/components/app/list-button.js';
import 'https://cdn.kernvalley.us/components/app/stores.js';
import { $, on } from 'https://cdn.kernvalley.us/js/std-js/esQuery.js';
import { ready, loaded } from 'https://cdn.kernvalley.us/js/std-js/dom.js';
import { getCustomElement } from 'https://cdn.kernvalley.us/js/std-js/custom-elements.js';
import { init } from 'https://cdn.kernvalley.us/js/std-js/data-handlers.js';
import { loadImage } from 'https://cdn.kernvalley.us/js/std-js/loader.js';
import { importGa, externalHandler, telHandler, mailtoHandler } from 'https://cdn.kernvalley.us/js/std-js/google-analytics.js';
import { SECONDS } from 'https://cdn.kernvalley.us/js/std-js/date-consts.js';
import { site, GA } from './consts.js';

$(document.documentElement).toggleClass({
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
	'js': true,
	'no-js': false,
}).then($doc => {
	$doc.css({ '--viewport-height': `${window.innerHeight}px` });
	$doc.debounce('resize', () => $doc.css({ '--viewport-height': `${window.innherHeight}px` }));
});

getCustomElement('install-prompt').then(HTMLInstallPromptElement => {
	on('#install-btn', ['click'], () => new HTMLInstallPromptElement().show())
		.forEach(el => el.hidden = false);
});

if (typeof GA === 'string' && GA.length !== 0) {
	loaded().then(() => {
		requestIdleCallback(() => {
			importGa(GA).then(async ({ ga }) => {
				if (ga instanceof Function) {
					ga('create', ga, 'auto');
					ga('set', 'transport', 'beacon');
					ga('send', 'pageview');

					$('a[rel~="external"]').click(externalHandler, { passive: true, capture: true });
					$('a[href^="tel:"]').click(telHandler, { passive: true, capture: true });
					$('a[href^="mailto:"]').click(mailtoHandler, { passive: true, capture: true });
				}
			});
		});
	});
}

ready().then(async () => {
	init();

	if (location.pathname === '/') {
		Promise.all([
			getCustomElement('leaflet-marker'),
			customElements.whenDefined('leaflet-map'),
		]).then(([LeafletMarker]) => {
			$('#find-btn').unhide();
			$('#find-btn').click(async () => {
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
				const icon = await loadImage('https://cdn.kernvalley.us/img/markers.svg#map-marker', {
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
		});
	}
});
