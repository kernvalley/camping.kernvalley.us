function $(selector, base = document) {
	return Array.from(base.querySelectorAll(selector));
}

export function hashChange({oldURL = ''} = {}) {
	if (oldURL.includes('#')) {
		const [,hash = ''] = oldURL.split('#', 2);

		if (hash !== '') {
			const target = document.getElementById(hash);

			if (target instanceof HTMLElement && target.tagName === 'LEAFLET-MARKER') {
				target.close();
			}
		}
	}

	if (location.hash !== '') {
		const marker = document.getElementById(location.hash.substr(1));

		if (marker instanceof HTMLElement && marker.tagName === 'LEAFLET-MARKER') {
			marker.hidden = false;
			marker.open = true;
		} else {
			$('leaflet-marker').forEach(el => el.open = false);
		}
	}
}

export function markerOpen() {
	if (this.id !== '') {
		location.href = `#${this.id}`;
	}
}

export function markerClose() {
	if (location.hash.substr(1) === this.id) {
		location.hash = '';
	}
}

export function markerSearch() {
	const value = this.value.toLowerCase();

	if (value !== '') {
		const matches = $('leaflet-marker').filter(camp => camp.title.toLowerCase().contains(value));
		matches.forEach(match => match.hidden = false);
	}
}
