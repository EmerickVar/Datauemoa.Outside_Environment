// Función para scroll suave hacia arriba
function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

// Estado del Quick Actions Bar
let isQuickActionsBarExpanded = false;

// Función para toggle de los elementos del Quick Actions Bar
function toggleQuickActionsBar() {
	const toggleButton = document.querySelector('.toggle-qab');
	const items = document.querySelectorAll('.QuickActionsBar-item:not(.toggle-qab)');

	isQuickActionsBarExpanded = !isQuickActionsBarExpanded;

	if (isQuickActionsBarExpanded) {
		// Mostrar elementos con efecto ripple
		items.forEach((item, index) => {
			setTimeout(() => {
				item.removeAttribute('hidden');
				item.style.opacity = '0';
				item.style.transform = 'translateX(30px) scale(0.8)';

				// Animación de entrada
				requestAnimationFrame(() => {
					item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
					item.style.opacity = '1';
					item.style.transform = 'translateX(0) scale(1)';
				});
			}, index * 150); // Efecto ripple con delay escalonado
		});

		// Cambiar icono del botón toggle
		const toggleIcon = toggleButton.querySelector('i');
		toggleIcon.className = 'fa fa-times';
		toggleButton.setAttribute('data-tooltip', 'Close Actions');
	} else {
		// Ocultar elementos con efecto ripple inverso
		const reversedItems = Array.from(items).reverse();
		reversedItems.forEach((item, index) => {
			setTimeout(() => {
				item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
				item.style.opacity = '0';
				item.style.transform = 'translateX(30px) scale(0.8)';

				// Ocultar completamente después de la animación
				setTimeout(() => {
					item.setAttribute('hidden', '');
				}, 300);
			}, index * 150); // Efecto ripple inverso más rápido
		});

		// Restaurar icono del botón toggle
		const toggleIcon = toggleButton.querySelector('i');
		toggleIcon.className = 'fa fa-bolt';
		toggleButton.setAttribute('data-tooltip', 'Quick Actions!');
	}
}

// Animación de entrada escalonada
document.addEventListener('DOMContentLoaded', function () {
	const items = document.querySelectorAll('.QuickActionsBar-item');
	items.forEach((item, index) => {
		item.style.setProperty('--item-index', index);
	});

	// Agregar event listener al botón toggle
	const toggleButton = document.querySelector('.toggle-qab');
	if (toggleButton) {
		toggleButton.addEventListener('click', toggleQuickActionsBar);
	}
});

// Mostrar/ocultar botón de ir arriba basado en el scroll
window.addEventListener('scroll', function () {
	const scrollTopButton = document.querySelector('.QuickActionsBar-item.primary');
	// Solo mostrar el botón de scroll si el Quick Actions Bar está expandido
	if (window.scrollY > 300 && isQuickActionsBarExpanded) {
		scrollTopButton.style.display = 'flex';
	} else {
		scrollTopButton.style.display = 'none';
	}
});
