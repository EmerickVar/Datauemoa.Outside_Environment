import './bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';

console.log(
	'This log comes from assets/app.js - welcome to AssetMapper! 🎉',
);

/**
 * Función para hacer scroll suave hacia arriba de la página
 * Utilizada por el QuickActionsBar
 */
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

/**
 * Función placeholder para mostrar chat de soporte
 * Se puede implementar más adelante con un sistema de chat real
 */
window.showSupportChat = function() {
    // TODO: Implementar sistema de chat de soporte
    alert('Chatbot will be implemented here.');
};
