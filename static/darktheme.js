let darkMode = localStorage.getItem('darkMode');
let darkModeToggle = document.getElementsByClassName("theme-main-selector-moon");

Array.from(darkModeToggle).forEach(e => e.addEventListener("click", function() {
  darkMode = localStorage.getItem("darkMode");
	if (darkMode !== 'enabled') {
		enableDarkMode();
		console.log(darkMode);
	} else {
		disableDarkMode();
		console.log(darkMode);
	}
}));

const enableDarkMode = () => {
	document.body.classList.add('dark-mode');
	localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
	document.body.classList.remove('dark-mode');
	localStorage.setItem('darkMode', null);
}

if (darkMode === 'enabled'){
	enableDarkMode();
}
