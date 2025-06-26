/**
 * ====================================================================
 * MODULE QUICKACTIONSBAR - GESTIONNAIRE D'INTERACTIONS
 * ====================================================================
 *
 * Module JavaScript gérant les interactions et animations de la barre
 * d'actions rapides. Contrôle l'affichage/masquage des éléments avec
 * des effets visuels avancés et une expérience utilisateur fluide.
 *
 * Fonctionnalités principales :
 * - Toggle des éléments avec effet ripple
 * - Défilement fluide vers le haut de page
 * - Gestion d'état de la barre d'actions
 * - Animations d'entrée et de sortie
 * - Contrôle basé sur le scroll de la page
 *
 * Dépendances :
 * - Font Awesome (pour les icônes)
 * - CSS QuickActionsBar (pour les styles)
 *
 * @author   Votre Nom
 * @version  1.0.0
 * @since    2025-06-26
 */

/**
 * FONCTION DE DÉFILEMENT FLUIDE
 * =============================
 *
 * Effectue un défilement animé vers le haut de la page.
 * Utilise l'API native du navigateur pour un mouvement fluide.
 *
 * @function scrollToTop
 * @returns {void}
 */
function scrollToTop() {
	window.scrollTo({
		top: 0, // Position cible : haut de la page
		behavior: 'smooth', // Animation fluide native du navigateur
	});
}

/**
 * VARIABLE D'ÉTAT GLOBAL
 * ======================
 *
 * Suit l'état d'expansion de la barre d'actions rapides.
 * Permet de contrôler la visibilité des éléments et
 * synchroniser les animations d'ouverture/fermeture.
 *
 * @type {boolean} État d'expansion (true = ouvert, false = fermé)
 */
let isQuickActionsBarExpanded = false;

/**
 * FONCTION TOGGLE PRINCIPALE
 * ==========================
 *
 * Gère l'affichage/masquage des éléments de la barre d'actions
 * avec des animations sophistiquées en cascade (effet ripple).
 * Contrôle également le changement d'icône du bouton toggle.
 *
 * Algorithme :
 * 1. Inverse l'état d'expansion
 * 2. Si expansion : affiche les éléments avec délai progressif
 * 3. Si réduction : masque les éléments en ordre inverse
 * 4. Met à jour l'icône et le tooltip du bouton toggle
 *
 * @function toggleQuickActionsBar
 * @returns {void}
 */
function toggleQuickActionsBar() {
	// Sélection des éléments DOM nécessaires
	const toggleButton = document.querySelector('.toggle-qab'); // Bouton de contrôle principal
	const items = document.querySelectorAll('.QuickActionsBar-item:not(.toggle-qab)'); // Tous les éléments sauf le toggle

	// Inversion de l'état d'expansion
	isQuickActionsBarExpanded = !isQuickActionsBarExpanded;

	if (isQuickActionsBarExpanded) {
		/**
		 * PHASE D'EXPANSION - Affichage des éléments
		 * =========================================
		 * Anime l'apparition des éléments avec un effet de cascade.
		 * Chaque élément apparaît avec un délai progressif créant
		 * un effet visuel de propagation (ripple effect).
		 */
		items.forEach((item, index) => {
			setTimeout(() => {
				// Rend l'élément visible dans le DOM
				item.removeAttribute('hidden');

				// État initial de l'animation (invisible et décalé)
				item.style.opacity = '0';
				item.style.transform = 'translateX(30px) scale(0.8)';

				// Animation d'entrée fluide
				requestAnimationFrame(() => {
					item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'; // Courbe d'animation personnalisée
					item.style.opacity = '1'; // Devient visible
					item.style.transform = 'translateX(0) scale(1)'; // Position et taille finales
				});
			}, index * 150); // Délai progressif de 150ms entre chaque élément
		});

		// Mise à jour de l'interface du bouton toggle
		const toggleIcon = toggleButton.querySelector('i');
		toggleIcon.className = 'fa fa-times'; // Change l'icône vers une croix
		toggleButton.setAttribute('data-tooltip', 'Close Actions'); // Met à jour le tooltip
	} else {
		/**
		 * PHASE DE RÉDUCTION - Masquage des éléments
		 * =========================================
		 * Anime la disparition des éléments en ordre inverse.
		 * Crée un effet visuel de fermeture en cascade.
		 */
		const reversedItems = Array.from(items).reverse(); // Inverse l'ordre pour l'effet de fermeture

		reversedItems.forEach((item, index) => {
			setTimeout(() => {
				// Animation de sortie plus rapide
				item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
				item.style.opacity = '0'; // Devient invisible
				item.style.transform = 'translateX(30px) scale(0.8)'; // Décalage et réduction

				// Masquage complet après l'animation
				setTimeout(() => {
					item.setAttribute('hidden', ''); // Retire du flux DOM
				}, 300); // Délai correspondant à la durée de l'animation
			}, index * 150); // Délai progressif inversé
		});

		// Restauration de l'interface du bouton toggle
		const toggleIcon = toggleButton.querySelector('i');
		toggleIcon.className = 'fa fa-bolt'; // Restaure l'icône éclair
		toggleButton.setAttribute('data-tooltip', 'Quick Actions!'); // Restaure le tooltip original
	}
}

/**
 * INITIALISATION AU CHARGEMENT DE LA PAGE
 * =======================================
 *
 * Gestionnaire d'événement déclenché une fois le DOM complètement chargé.
 * Configure les propriétés CSS personnalisées et attache les écouteurs
 * d'événements nécessaires au fonctionnement de la barre d'actions.
 *
 * Processus d'initialisation :
 * 1. Attribution des index CSS pour les animations décalées
 * 2. Attachement du gestionnaire de clic au bouton toggle
 * 3. Vérification de l'existence des éléments requis
 */
document.addEventListener('DOMContentLoaded', function () {
	/**
	 * Configuration des variables CSS personnalisées
	 * Chaque élément reçoit un index utilisé pour les délais d'animation
	 */
	const items = document.querySelectorAll('.QuickActionsBar-item');
	items.forEach((item, index) => {
		item.style.setProperty('--item-index', index); // Propriété CSS personnalisée pour les animations
	});

	/**
	 * Attachement de l'écouteur d'événement principal
	 * Configure le gestionnaire de clic sur le bouton toggle
	 */
	const toggleButton = document.querySelector('.toggle-qab');
	if (toggleButton) {
		toggleButton.addEventListener('click', toggleQuickActionsBar); // Lie la fonction toggle au clic
	}
});

/**
 * GESTIONNAIRE DE DÉFILEMENT INTELLIGENT
 * ======================================
 *
 * Contrôle l'affichage du bouton "Retour en haut" basé sur :
 * - La position de défilement de la page (seuil : 300px)
 * - L'état d'expansion de la barre d'actions
 *
 * Logique :
 * - Affiche le bouton seulement si la page est défilée ET la barre est ouverte
 * - Masque le bouton dans tous les autres cas
 *
 * Cette approche évite l'encombrement visuel et améliore l'UX.
 */
window.addEventListener('scroll', function () {
	const scrollTopButton = document.querySelector('.QuickActionsBar-item.primary'); // Bouton "Retour en haut"

	/**
	 * Logique de visibilité conditionnelle
	 * Deux conditions doivent être remplies simultanément :
	 * 1. Position de défilement > 300px (utilisateur a suffisamment défilé)
	 * 2. Barre d'actions en état d'expansion (éléments visibles)
	 */
	if (window.scrollY > 300 && isQuickActionsBarExpanded) {
		scrollTopButton.style.display = 'flex'; // Affiche le bouton avec layout flexbox
	} else {
		scrollTopButton.style.display = 'none'; // Masque complètement le bouton
	}
});
