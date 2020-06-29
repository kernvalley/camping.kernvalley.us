function $(selector, base = document) {
	return Array.from(base.querySelectorAll(selector));
}

export function hashChange() {
	if (location.hash !== '') {
		const marker = document.getElementById(location.hash.substr(1));

		if (marker instanceof HTMLElement && marker.tagName === 'LEAFLET-MARKER') {
			marker.hidden = false;
			marker.open = true;
			marker.closest('leaflet-map').scrollIntoView({block: 'start', behavior: 'smooth'});
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

export function markerSearch() {
	const value = this.value.toLowerCase();

	if (value !== '') {
		const matches = $('leaflet-marker').filter(camp => camp.title.toLowerCase().contains(value));
		matches.forEach(match => match.hidden = false);
	}
}
