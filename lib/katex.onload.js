/*________________________________________________*/window.onload = function() {
	Array.prototype.forEach.call(
		document.getElementsByTagName("tex"),
		function(el) {
			try {
				katex.render(el.innerHTML, el); 
			} catch (e) { console.log(e); }
		}
	);
};
