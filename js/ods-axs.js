window.addEventListener('load', function() {
	/* Add Keyboard Event Listener for Escape when in Fullscreen mode */
	document.body.addEventListener('keyup', function(e) {
		if(e.key == 'Escape' && document.body.classList.contains('full-page')) {
			let id = document.body.getAttribute('data-current-viewer');
			document.querySelector('#' + id + '-toolbar button.su-osd-collapse').click();
		}
	});
	
	/* Add OSD Viewers and Activate Their Buttons */
	var ods = document.querySelectorAll('.suarrmaterials-zoomable-image-axs');
	for(var i=0; i<ods.length; i++) {
		var imageId = ods[i].id
		var imagePath = 'images/' + ods[i].getAttribute('data-image');
		var figure = ods[i].parentElement;
		var title = figure.previousElementSibling; // H3.gallery_image-title
		var caption = figure.querySelector('figcaption'); // div.gallery_image-description
		
		/* Add IDs */
		figure.id = imageId + '-figure';
		title.id = imageId + '-title';
		caption.id = imageId + '-description';
		
		/* ARIA tagging */
		figure.setAttribute('aria-labelledby', 'image-viewer-text ' + title.id);
		figure.setAttribute('aria-describedby', caption.id);
		 
		/* Clone the toolbar and connect it */
		var toolbar = document.getElementById('toolbar-template').cloneNode(true);
		toolbar.id = imageId + '-toolbar';
		figure.prepend(toolbar);
		
		/* Create the OSD Viewer */
		let viewer = OpenSeadragon({
			id: imageId,
			showNavigationControl: false,
			toolbar: imageId + '-toolbar',
			prefixUrl: "images/",
			tileSources:{
				type: "image",
				url: imagePath,
				buildPyramid: false
			}
		});
		viewer.addHandler('open', function(e) { 
			let v = e.eventSource; // viewer
			let t = document.getElementById(v.id + '-toolbar');
			let f = document.getElementById(v.id + '-figure');
			let c = f.querySelector('.openseadragon-canvas');
			
			// add role and label to interactive viewer
			c.setAttribute('role','img');
			c.setAttribute('aria-labelledby','interactive-image ' + v.id + '-title');
			
			// disable flip command
			v.viewport.toggleFlip = function(){ };
			
			t.querySelector('.su-osd-zoomin').addEventListener('click', function() {
				v.viewport.zoomBy(1.5);
				v.viewport.applyConstraints();
			});
			t.querySelector('.su-osd-zoomout').addEventListener('click', function() {
				v.viewport.zoomBy(0.667);
				v.viewport.applyConstraints();
			});
			t.querySelector('.su-osd-reset').addEventListener('click', function() {
				v.viewport.goHome();
				v.viewport.setRotation(0);
				v.viewport.applyConstraints();
			});
			t.querySelector('.su-osd-rotateleft').addEventListener('click', function() {
				v.viewport.setRotation(v.viewport.getRotation() - 90);
				v.viewport.applyConstraints();
			});
			t.querySelector('.su-osd-rotateright').addEventListener('click', function() {
				v.viewport.setRotation(v.viewport.getRotation() + 90);
				v.viewport.applyConstraints();
			});				
			t.querySelector('.su-osd-full').addEventListener('click', function() {
				// have to copy over the templates to the full view
				let icons = document.getElementById('templates').cloneNode(true);
				v.setFullPage(true);
				document.body.prepend(icons);
				document.body.classList.add('full-page');
				document.body.setAttribute('data-current-viewer', v.id);
				t.querySelector('button.su-osd-collapse').focus();
			});
			t.querySelector('.su-osd-collapse').addEventListener('click', function() {
				// prevent the templates from hanging around
				document.getElementById('templates').remove();
				v.setFullPage(false);
				document.body.classList.remove('full-page');
				document.body.removeAttribute('data-current-viewer');
				t.querySelector('button.su-osd-full').focus();
			});
			
			f.querySelector('.openseadragon-canvas').addEventListener('keypress', function(e) {
				if(e.key == 'f' && !document.body.classList.contains('full-page')) {
					t.querySelector('.su-osd-full').click();
					f.querySelector(' .openseadragon-canvas').focus();
				}
			});

		});
	} // END FOR LOOP

});