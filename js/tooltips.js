window.addEventListener('load', function() {
	let e = document.getElementById('tooltip-toggle');
	let show_tooltips = localStorage.getItem('show-tooltips');
	if(show_tooltips == null) {
		show_tooltips = true;
	}
	if(show_tooltips == 'true') {
		localStorage.setItem('show-tooltips','true');
		e.setAttribute('aria-checked','true');
		document.body.classList.add('show-tooltips');
	}
	else {
		localStorage.setItem('show-tooltips','false');
		e.setAttribute('aria-checked','false');
		document.body.classList.remove('show-tooltips');
	}
	
	// toggle code
	e.addEventListener('click', function() {
		if(e.getAttribute('aria-checked') == 'true') {
			e.setAttribute('aria-checked','false');
			document.body.classList.remove('show-tooltips');
			localStorage.setItem('show-tooltips','false');
		}
		else {
			e.setAttribute('aria-checked','true');
			document.body.classList.add('show-tooltips');
			localStorage.setItem('show-tooltips','true');
		}
	});
});