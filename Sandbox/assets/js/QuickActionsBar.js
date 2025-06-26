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

	/**
	 * INITIALISATION DU MODULE SHARE
	 * =============================
	 *
	 * Configuration du gestionnaire d'événement pour le bouton de partage.
	 * Le bouton de partage correspond à l'index 3 dans la QuickActionsBar.
	 */
	const shareButton = document.querySelector('.QuickActionsBar-item[style*="--item-index: 3"]');
	if (shareButton) {
		shareButton.addEventListener('click', function (event) {
			event.preventDefault();
			event.stopPropagation();
			openShareModal(event);
		});
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

/**
 * ====================================================================
 * MODULE SHARE - GESTIONNAIRE DE PARTAGE SOCIAL
 * ====================================================================
 *
 * Module JavaScript gérant le modal de partage sur les réseaux sociaux.
 * Permet aux utilisateurs de partager la page actuelle sur différentes
 * plateformes sociales avec des fonctionnalités spécialisées par réseau.
 *
 * Fonctionnalités principales :
 * - Modal interactif avec overlay
 * - Partage sur Facebook (post, story, messenger)
 * - Partage sur Instagram (post, chat, story)
 * - Partage sur Telegram (chat, story)
 * - Partage sur Twitter/X
 * - Copie du lien vers le presse-papiers
 * - Fermeture automatique en cliquant à l'extérieur
 * - Notifications de confirmation
 *
 * Dépendances :
 * - Font Awesome (icônes des réseaux sociaux)
 * - CSS du modal de partage
 * - APIs Web natives (Clipboard, Navigator)
 *
 * @author   DataUEMOA Team
 * @version  1.0.0
 * @since    2025-06-26
 */

/**
 * VARIABLES D'ÉTAT DU MODULE SHARE
 * ===============================
 *
 * Variables globales pour contrôler l'état du modal de partage
 * et gérer les interactions utilisateur.
 */

/**
 * État d'ouverture du modal de partage
 * @type {boolean} État du modal (true = ouvert, false = fermé)
 */
let isShareModalOpen = false;

/**
 * GESTIONNAIRE D'ÉVÉNEMENTS POUR LE BOUTON PARTAGER
 * =================================================
 *
 * Fonction déclenchée lors du clic sur le bouton "Partager" de la QuickActionsBar.
 * Ouvre le modal de partage avec des animations fluides et gère l'état d'ouverture.
 *
 * Processus :
 * 1. Prévient la propagation de l'événement
 * 2. Marque le modal comme ouvert
 * 3. Active les classes CSS pour les animations
 * 4. Met le focus sur le modal pour l'accessibilité
 *
 * @function openShareModal
 * @param {Event} event - Événement de clic sur le bouton
 * @returns {void}
 */
function openShareModal(event) {
	// Prévient la propagation pour éviter les conflits avec d'autres gestionnaires
	if (event) {
		event.stopPropagation();
	}

	// Sélection des éléments DOM du modal
	const shareModalOverlay = document.getElementById('shareModalOverlay');
	const shareModal = document.getElementById('shareModal');

	// Vérification de l'existence des éléments
	if (!shareModalOverlay || !shareModal) {
		console.error('Éléments du modal de partage introuvables dans le DOM');
		return;
	}

	// Mise à jour de l'état global
	isShareModalOpen = true;

	// Activation du modal avec classes CSS
	shareModalOverlay.classList.add('active');

	// Focus automatique sur le modal pour l'accessibilité
	setTimeout(() => {
		shareModal.focus();
	}, 100);

	// Attachement des gestionnaires d'événements temporaires
	attachShareModalEventListeners();
}

/**
 * GESTIONNAIRE DE FERMETURE DU MODAL
 * =================================
 *
 * Fonction de fermeture du modal de partage avec animations de sortie.
 * Nettoie les gestionnaires d'événements et remet à zéro l'état.
 *
 * Processus :
 * 1. Désactive les classes CSS d'animation
 * 2. Met à jour l'état global
 * 3. Nettoie les gestionnaires d'événements temporaires
 * 4. Restaure le focus si nécessaire
 *
 * @function closeShareModal
 * @returns {void}
 */
function closeShareModal() {
	// Sélection de l'overlay du modal
	const shareModalOverlay = document.getElementById('shareModalOverlay');

	// Vérification de l'existence de l'élément
	if (!shareModalOverlay) {
		return;
	}

	// Désactivation des animations CSS
	shareModalOverlay.classList.remove('active');

	// Mise à jour de l'état global
	isShareModalOpen = false;

	// Nettoyage des gestionnaires d'événements
	removeShareModalEventListeners();
}

/**
 * GESTIONNAIRE DE PARTAGE PRINCIPAL
 * ================================
 *
 * Fonction centrale qui gère le partage sur les différentes plateformes.
 * Analyse les attributs data du bouton cliqué et délègue vers les fonctions
 * spécialisées de chaque plateforme sociale.
 *
 * Algorithme :
 * 1. Récupère les données de plateforme et type depuis l'élément
 * 2. Génère l'URL de partage appropriée
 * 3. Délègue vers la fonction spécialisée de la plateforme
 * 4. Ferme le modal après l'action
 *
 * @function handleSocialShare
 * @param {HTMLElement} shareOption - Élément bouton de partage cliqué
 * @returns {void}
 */
function handleSocialShare(shareOption) {
	// Extraction des données de l'élément
	const platform = shareOption.dataset.platform; // Plateforme cible (facebook, instagram, etc.)
	const type = shareOption.dataset.type; // Type de partage (post, story, chat, etc.)

	// Récupération des informations de la page actuelle
	const currentUrl = encodeURIComponent(window.location.href); // URL encodée
	const pageTitle = encodeURIComponent(document.title || 'Page interessante'); // Titre encodé
	const pageDescription = encodeURIComponent(
		document.querySelector('meta[name="description"]')?.content ||
			document.querySelector('meta[property="og:description"]')?.content ||
			'Découvrez cette page interessante!'
	); // Description encodée depuis les meta tags

	// Délégation vers les gestionnaires spécialisés par plateforme
	switch (platform) {
		case 'facebook':
			handleFacebookShare(currentUrl, pageTitle, pageDescription, type);
			break;

		case 'messenger':
			handleMessengerShare(currentUrl, pageTitle);
			break;

		case 'instagram':
			handleInstagramShare(currentUrl, pageTitle, pageDescription, type);
			break;

		case 'telegram':
			handleTelegramShare(currentUrl, pageTitle, pageDescription, type);
			break;

		case 'twitter':
			handleTwitterShare(currentUrl, pageTitle, pageDescription);
			break;

		case 'clipboard':
			handleClipboardCopy(currentUrl);
			break;

		default:
			console.warn(`Plateforme de partage non supportée : ${platform}`);
			return;
	}

	// Fermeture automatique du modal après l'action
	setTimeout(() => {
		closeShareModal();
	}, 500);
}

/**
 * GESTIONNAIRES SPÉCIALISÉS PAR PLATEFORME
 * =======================================
 *
 * Fonctions dédiées à chaque réseau social avec leurs APIs
 * et paramètres spécifiques de partage.
 */

/**
 * Gestionnaire de partage Facebook
 * @param {string} url - URL à partager
 * @param {string} title - Titre de la page
 * @param {string} description - Description de la page
 * @param {string} type - Type de partage (post ou story)
 */
function handleFacebookShare(url, title, description, type) {
	let shareUrl;

	if (type === 'story') {
		// Facebook Stories via l'application mobile ou web
		shareUrl = `https://www.facebook.com/stories/create/?link=${url}`;
	} else {
		// Publication Facebook standard
		shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title} - ${description}`;
	}

	// Ouverture dans une nouvelle fenêtre popup
	openShareWindow(shareUrl, 'Facebook', 600, 400);
}

/**
 * Gestionnaire de partage Facebook Messenger
 * @param {string} url - URL à partager
 * @param {string} _title - Titre de la page
 */
function handleMessengerShare(url, _title) {
	// URL de partage Messenger
	const shareUrl = `https://www.facebook.com/dialog/send?link=${url}&app_id=YOUR_FB_APP_ID&redirect_uri=${url}`;

	// Ouverture dans une nouvelle fenêtre
	openShareWindow(shareUrl, 'Messenger', 600, 400);
}

/**
 * Gestionnaire de partage Instagram
 * @param {string} url - URL à partager
 * @param {string} _title - Titre de la page
 * @param {string} _description - Description de la page
 * @param {string} type - Type de partage (post, chat, story)
 */
function handleInstagramShare(url, _title, _description, type) {
	// Instagram ne supporte pas les partages directs via URL
	// On copie le lien et redirige vers Instagram
	navigator.clipboard
		.writeText(url)
		.then(() => {
			let instagramUrl;

			switch (type) {
				case 'story':
					// Tentative d'ouverture des stories Instagram
					instagramUrl = 'https://www.instagram.com/stories/';
					break;
				case 'chat':
					// Messages directs Instagram
					instagramUrl = 'https://www.instagram.com/direct/inbox/';
					break;
				default:
					// Page principale Instagram
					instagramUrl = 'https://www.instagram.com/';
			}

			// Affichage d'une notification
			showCopyNotification('Lien copié! Ouvrez Instagram pour partager.');

			// Ouverture d'Instagram après un court délai
			setTimeout(() => {
				window.open(instagramUrl, '_blank');
			}, 1500);
		})
		.catch(() => {
			// Fallback si la copie échoue
			showCopyNotification('Ouvrez Instagram et partagez manuellement.');
			window.open('https://www.instagram.com/', '_blank');
		});
}

/**
 * Gestionnaire de partage Telegram
 * @param {string} url - URL à partager
 * @param {string} title - Titre de la page
 * @param {string} description - Description de la page
 * @param {string} type - Type de partage (chat ou story)
 */
function handleTelegramShare(url, title, description, type) {
	let shareUrl;

	if (type === 'story') {
		// Telegram Stories (fonctionnalité récente)
		shareUrl = `https://t.me/share/url?url=${url}&text=${title}%0A${description}`;
	} else {
		// Chat Telegram standard
		shareUrl = `https://t.me/share/url?url=${url}&text=${title}%0A${description}`;
	}

	// Ouverture dans une nouvelle fenêtre
	openShareWindow(shareUrl, 'Telegram', 600, 400);
}

/**
 * Gestionnaire de partage Twitter/X
 * @param {string} url - URL à partager
 * @param {string} title - Titre de la page
 * @param {string} description - Description de la page
 */
function handleTwitterShare(url, title, description) {
	// Construction du tweet avec hashtags
	const tweetText = encodeURIComponent(`${title}\n\n${description}\n\n#DataUEMOA #Partage`);
	const shareUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`;

	// Ouverture dans une nouvelle fenêtre popup
	openShareWindow(shareUrl, 'Twitter', 600, 400);
}

/**
 * Gestionnaire de copie vers le presse-papiers
 * @param {string} url - URL à copier
 */
function handleClipboardCopy(url) {
	// Décodage de l'URL pour un affichage propre
	const cleanUrl = decodeURIComponent(url);

	// Tentative de copie avec l'API Clipboard moderne
	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard
			.writeText(cleanUrl)
			.then(() => {
				showCopyNotification('Enlace copiado al portapapeles!');
			})
			.catch((error) => {
				console.error('Erreur lors de la copie:', error);
				fallbackCopyToClipboard(cleanUrl);
			});
	} else {
		// Méthode de fallback pour les navigateurs plus anciens
		fallbackCopyToClipboard(cleanUrl);
	}
}

/**
 * FONCTIONS UTILITAIRES DU MODULE SHARE
 * ====================================
 *
 * Fonctions auxiliaires pour le bon fonctionnement du module.
 */

/**
 * Ouvre une fenêtre popup pour le partage
 * @param {string} url - URL du service de partage
 * @param {string} title - Titre de la fenêtre
 * @param {number} width - Largeur de la fenêtre
 * @param {number} height - Hauteur de la fenêtre
 */
function openShareWindow(url, title, width = 600, height = 400) {
	// Calcul de la position centrée
	const left = window.screen.width / 2 - width / 2;
	const top = window.screen.height / 2 - height / 2;

	// Configuration de la fenêtre popup
	const windowFeatures = `
		width=${width},
		height=${height},
		left=${left},
		top=${top},
		resizable=yes,
		scrollbars=yes,
		status=yes,
		toolbar=no,
		menubar=no,
		location=no
	`;

	// Ouverture de la fenêtre
	const popupWindow = window.open(url, `share_${title}`, windowFeatures);

	// Focus sur la nouvelle fenêtre si possible
	if (popupWindow && popupWindow.focus) {
		popupWindow.focus();
	}
}

/**
 * Méthode de fallback pour la copie (navigateurs anciens)
 * @param {string} text - Texte à copier
 */
function fallbackCopyToClipboard(text) {
	// Création d'un élément textarea temporaire
	const textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.position = 'fixed';
	textArea.style.opacity = '0';
	textArea.style.pointerEvents = 'none';

	// Ajout au DOM et sélection
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		// Tentative de copie avec l'ancienne API
		const successful = document.execCommand('copy');
		if (successful) {
			showCopyNotification('Enlace copiado al portapapeles!');
		} else {
			showCopyNotification('Error al copiar el enlace');
		}
	} catch (error) {
		console.error('Erreur lors de la copie fallback:', error);
		showCopyNotification('Error al copiar el enlace');
	} finally {
		// Nettoyage de l'élément temporaire
		document.body.removeChild(textArea);
	}
}

/**
 * Affiche une notification temporaire de copie
 * @param {string} message - Message à afficher
 */
function showCopyNotification(message) {
	// Sélection de l'élément de notification
	let notification = document.getElementById('copyNotification');

	// Création de la notification si elle n'existe pas
	if (!notification) {
		notification = document.createElement('div');
		notification.id = 'copyNotification';
		notification.className = 'copy-notification';
		document.body.appendChild(notification);
	}

	// Mise à jour du contenu
	notification.innerHTML = `<i class="fa fa-check"></i> ${message}`;

	// Affichage avec animation
	notification.classList.add('show');

	// Masquage automatique après 3 secondes
	setTimeout(() => {
		notification.classList.remove('show');
	}, 3000);
}

/**
 * GESTIONNAIRES D'ÉVÉNEMENTS DU MODULE SHARE
 * ==========================================
 *
 * Fonctions d'attachement et de nettoyage des écouteurs d'événements
 * pour le modal de partage.
 */

/**
 * Attache les gestionnaires d'événements du modal
 */
function attachShareModalEventListeners() {
	// Gestionnaire de clic sur l'overlay (fermeture)
	const shareModalOverlay = document.getElementById('shareModalOverlay');
	if (shareModalOverlay) {
		shareModalOverlay.addEventListener('click', handleOverlayClick);
	}

	// Gestionnaire de la touche Escape
	document.addEventListener('keydown', handleEscapeKey);

	// Gestionnaires des boutons de partage
	const shareOptions = document.querySelectorAll('.share-option');
	shareOptions.forEach((option) => {
		option.addEventListener('click', handleShareOptionClick);
	});
}

/**
 * Supprime les gestionnaires d'événements du modal
 */
function removeShareModalEventListeners() {
	// Suppression du gestionnaire d'overlay
	const shareModalOverlay = document.getElementById('shareModalOverlay');
	if (shareModalOverlay) {
		shareModalOverlay.removeEventListener('click', handleOverlayClick);
	}

	// Suppression du gestionnaire Escape
	document.removeEventListener('keydown', handleEscapeKey);

	// Suppression des gestionnaires des boutons
	const shareOptions = document.querySelectorAll('.share-option');
	shareOptions.forEach((option) => {
		option.removeEventListener('click', handleShareOptionClick);
	});
}

/**
 * Gestionnaire de clic sur l'overlay
 * @param {Event} event - Événement de clic
 */
function handleOverlayClick(event) {
	// Fermeture seulement si le clic est sur l'overlay, pas sur le modal
	if (event.target === event.currentTarget) {
		closeShareModal();
	}
}

/**
 * Gestionnaire de la touche Escape
 * @param {KeyboardEvent} event - Événement clavier
 */
function handleEscapeKey(event) {
	// Fermeture du modal si Escape est pressée et le modal est ouvert
	if (event.key === 'Escape' && isShareModalOpen) {
		closeShareModal();
	}
}

/**
 * Gestionnaire de clic sur les boutons de partage
 * @param {Event} event - Événement de clic
 */
function handleShareOptionClick(event) {
	// Prévention de la propagation
	event.stopPropagation();

	// Délégation vers le gestionnaire principal
	handleSocialShare(event.currentTarget);
}
