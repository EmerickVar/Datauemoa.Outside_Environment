/**
 * ====================================================================
 * MODULE FAVORIS - GESTIONNAIRE 
 * ====================================================================
 *
 *
 * @author   Équipe Développement DataUEMOA
 * @license  Propriétaire - Tous droits réservés
 * @version  1.0.0
 * @since    2025-06-26
 */

// Modèle IIFE pour éviter les conflits de variables globales
(function () {
	('use strict');

	// Parse URL for hierarchical categorization
	const urlPath = window.location.pathname;

	// Parse URL segments after domain
	function parseURLSegments() {
		// Remove leading and trailing slashes, then split
		const segments = urlPath
			.replace(/^\/+|\/+$/g, '')
			.split('/')
			.filter((segment) => segment.length > 0);

		console.log('🔗 PARSED URL SEGMENTS:', {
			fullPath: urlPath,
			segments: segments,
		});

		return segments;
	}

	// Get current URL segments for categorization
	const urlSegments = parseURLSegments();

	// Create bookmark path from URL segments
	function getBookmarkPath() {
		if (urlSegments.length === 0) {
			return ['home']; // Default for root path
		}

		return urlSegments;
	}

	const bookmarkPath = getBookmarkPath();
	console.log('📍 BOOKMARK PATH:', bookmarkPath);

	// Current bookmark being processed
	let currentBookmark = null;

	// Cookie management functions
	function setCookie(name, value, days = 365) {
		const expires = new Date();
		expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;

		// Debug log
		console.log(`🍪 COOKIE CREATED/UPDATED:`, {
			name: name,
			value: value,
			expires: expires.toUTCString(),
			actualCookie: document.cookie,
		});
	}

	function getCookie(name) {
		const nameEQ = name + '=';
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) {
				const value = c.substring(nameEQ.length, c.length);
				console.log(`🍪 COOKIE READ:`, {
					name: name,
					value: value,
				});
				return value;
			}
		}
		console.log(`🍪 COOKIE NOT FOUND:`, { name: name });
		return null;
	}

	function deleteCookie(name) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		console.log(`🍪 COOKIE DELETED:`, {
			name: name,
			remainingCookies: document.cookie,
		});
	}

	// Unified user data management
	function getUserData() {
		const userData = getCookie('datauemoa_user_data');
		if (!userData) {
			console.log(`👤 GET USER DATA: No user data found`);
			return {
				user_email: null,
				is_registered: false,
				user_bookmarks: {},
				bookmark_metadata: {},
			};
		}

		try {
			const decoded = JSON.parse(decodeURIComponent(userData));
			console.log(`👤 GET USER DATA:`, decoded);
			return decoded;
		} catch (e) {
			console.error(`👤 GET USER DATA ERROR:`, e);
			return {
				user_email: null,
				is_registered: false,
				user_bookmarks: {},
				bookmark_metadata: {},
			};
		}
	}

	function saveUserData(userData) {
		const encoded = encodeURIComponent(JSON.stringify(userData));
		setCookie('datauemoa_user_data', encoded);

		console.log(`👤 SAVE USER DATA:`, {
			userData: userData,
			encoded: encoded,
		});
	}

	function setUserEmail(email, isRegistered = false) {
		const userData = getUserData();
		userData.user_email = email;
		userData.is_registered = isRegistered;
		saveUserData(userData);

		console.log(`👤 SET USER EMAIL:`, {
			email: email,
			isRegistered: isRegistered,
			userData: userData,
		});
	}

	// Utility functions for hierarchical bookmark structure
	function createNestedPath(obj, pathArray) {
		let current = obj;
		for (let i = 0; i < pathArray.length; i++) {
			const segment = pathArray[i];
			if (!current[segment]) {
				// If it's the last segment, create an array; otherwise, create an object
				current[segment] = i === pathArray.length - 1 ? [] : {};
			}
			current = current[segment];
		}
		return current;
	}

	function getNestedPath(obj, pathArray) {
		let current = obj;
		for (const segment of pathArray) {
			if (!current || !current[segment]) {
				return null;
			}
			current = current[segment];
		}
		return current;
	}

	function deleteNestedPath(obj, pathArray) {
		if (pathArray.length === 0) return false;

		if (pathArray.length === 1) {
			if (obj[pathArray[0]]) {
				delete obj[pathArray[0]];
				return true;
			}
			return false;
		}

		const parentPath = pathArray.slice(0, -1);
		const lastSegment = pathArray[pathArray.length - 1];
		const parent = getNestedPath(obj, parentPath);

		if (parent && parent[lastSegment]) {
			delete parent[lastSegment];

			// Clean up empty parent objects recursively
			if (typeof parent === 'object' && Object.keys(parent).length === 0) {
				return deleteNestedPath(obj, parentPath);
			}
			return true;
		}
		return false;
	}

	function buildBookmarkKey(pathArray, type) {
		return [...pathArray, type];
	}

	function buildMetadataKey(pathArray, type) {
		return pathArray.join('/') + '/' + type;
	}

	// Bookmark management functions with new hierarchical structure
	function getUserBookmarks() {
		const userData = getUserData();
		if (!userData.user_email) {
			console.log(`📚 GET BOOKMARKS: No user email found`);
			return {};
		}

		console.log(`📚 GET BOOKMARKS:`, {
			userEmail: userData.user_email,
			bookmarks: userData.user_bookmarks,
		});

		return userData.user_bookmarks;
	}

	function isBookmarked(type, path = bookmarkPath) {
		const bookmarks = getUserBookmarks();
		const bookmarkKey = buildBookmarkKey(path, type);
		const targetArray = getNestedPath(bookmarks, bookmarkKey);
		const result = Array.isArray(targetArray) && targetArray.length > 0;

		console.log(`📚 CHECK BOOKMARK:`, {
			type: type,
			path: path,
			bookmarkKey: bookmarkKey,
			isBookmarked: result,
			targetArray: targetArray,
		});

		return result;
	}

	function addBookmark(type, name, path = bookmarkPath) {
		console.log(`📚 ADD BOOKMARK STARTED:`, {
			type: type,
			name: name,
			path: path,
		});

		const userData = getUserData();
		const bookmarkKey = buildBookmarkKey(path, type);

		// Create nested structure and get the array for this bookmark type
		const targetArray = createNestedPath(userData.user_bookmarks, bookmarkKey);

		// Check if this specific bookmark already exists
		if (!Array.isArray(targetArray)) {
			console.error(`📚 ADD BOOKMARK ERROR: Target is not an array`, {
				bookmarkKey: bookmarkKey,
				targetArray: targetArray,
			});
			return false;
		}

		// For now, we'll just add a timestamp to the array (could be enhanced later)
		const bookmarkEntry = {
			name: name,
			timestamp: new Date().toISOString(),
		};

		// Check if bookmark already exists
		const existingIndex = targetArray.findIndex((entry) => entry.name === name);
		if (existingIndex === -1) {
			targetArray.push(bookmarkEntry);

			// Also update metadata with new structure
			const metadataKey = buildMetadataKey(path, type);
			if (!userData.bookmark_metadata) {
				userData.bookmark_metadata = {};
			}
			userData.bookmark_metadata[metadataKey] = {
				name: name,
				timestamp: new Date().toISOString(),
				path: path,
				type: type,
			};

			saveUserData(userData);

			console.log(`📚 ADD BOOKMARK SUCCESS:`, {
				type: type,
				name: name,
				path: path,
				bookmarkKey: bookmarkKey,
				fullUserData: userData,
			});

			// Update QuickActionsBar badge for non-registered users
			if (!userData.is_registered) {
				const totalBookmarks = countTotalUserBookmarksInGeneral();
				updateQuickActionsBarBadge(totalBookmarks);
			}

			return true;
		} else {
			console.log(`📚 ADD BOOKMARK FAILED: Bookmark already exists`, {
				type: type,
				path: path,
				name: name,
				existingEntry: targetArray[existingIndex],
			});
		}
		return false;
	}

	function removeBookmark(type, path = bookmarkPath) {
		console.log(`📚 REMOVE BOOKMARK STARTED:`, {
			type: type,
			path: path,
		});

		const userData = getUserData();
		const bookmarkKey = buildBookmarkKey(path, type);
		const targetArray = getNestedPath(userData.user_bookmarks, bookmarkKey);

		if (Array.isArray(targetArray) && targetArray.length > 0) {
			// Clear the array (could be enhanced to remove specific entries)
			targetArray.length = 0;

			console.log(`📚 REMOVE BOOKMARK: Cleared array for ${bookmarkKey.join('/')}`);

			// Clean up empty nested objects
			if (targetArray.length === 0) {
				deleteNestedPath(userData.user_bookmarks, bookmarkKey);
				console.log(`📚 REMOVE BOOKMARK: Cleaned up empty path ${bookmarkKey.join('/')}`);
			}

			// Remove metadata
			const metadataKey = buildMetadataKey(path, type);
			if (userData.bookmark_metadata && userData.bookmark_metadata[metadataKey]) {
				delete userData.bookmark_metadata[metadataKey];
				console.log(`📚 REMOVE BOOKMARK: Cleaned up metadata for ${metadataKey}`);
			}

			saveUserData(userData);

			console.log(`📚 REMOVE BOOKMARK SUCCESS:`, {
				type: type,
				path: path,
				fullUserData: userData,
			});

			// Update QuickActionsBar badge for non-registered users
			if (!userData.is_registered) {
				const totalBookmarks = countTotalUserBookmarksInGeneral();
				updateQuickActionsBarBadge(totalBookmarks);
			}

			return true;
		} else {
			console.log(`📚 REMOVE BOOKMARK FAILED: Path not found or empty`, {
				type: type,
				path: path,
				bookmarkKey: bookmarkKey,
				targetArray: targetArray,
			});
		}
		return false;
	}

	// Modal management
	const modal = document.getElementById('bookmarkModal');
	const closeModal = document.getElementById('closeModal');
	const loginForm = document.getElementById('loginForm');
	const registrationForm = document.getElementById('registrationForm');

	function showModal() {
		modal.style.display = 'block';
		document.body.style.overflow = 'hidden';
	}

	function hideModal() {
		modal.style.display = 'none';
		document.body.style.overflow = 'auto';
		loginForm.style.display = 'block';
		registrationForm.style.display = 'none';

		// Clear forms
		document.getElementById('userEmail').value = '';
		document.getElementById('regEmail').value = '';
		document.getElementById('regName').value = '';
	}

	// Event listeners for modal
	closeModal.addEventListener('click', hideModal);

	modal.addEventListener('click', function (e) {
		if (e.target === modal) {
			hideModal();
		}
	});

	// Form switching
	document.getElementById('registerUser').addEventListener('click', function () {
		loginForm.style.display = 'none';
		registrationForm.style.display = 'block';
	});

	document.getElementById('backToLogin').addEventListener('click', function () {
		registrationForm.style.display = 'none';
		loginForm.style.display = 'block';
	});

	// Handle save bookmark
	document.getElementById('saveBookmark').addEventListener('click', function () {
		const email = document.getElementById('userEmail').value.trim();

		console.log(`🔐 SAVE BOOKMARK CLICKED:`, {
			email: email,
			currentBookmark: currentBookmark,
		});

		if (!email) {
			console.log(`🔐 SAVE BOOKMARK FAILED: No email provided`);
			alert('Por favor, ingresa tu email.');
			return;
		}

		if (!isValidEmail(email)) {
			console.log(`🔐 SAVE BOOKMARK FAILED: Invalid email format`, { email: email });
			alert('Por favor, ingresa un email válido.');
			return;
		}

		// Save user email (NOT registered)
		console.log(`🔐 SAVING USER EMAIL (NOT REGISTERED):`, { email: email });
		setUserEmail(email, false);

		// Add bookmark
		if (currentBookmark) {
			const success = addBookmark(currentBookmark.type, currentBookmark.name, bookmarkPath);

			if (success) {
				updateBookmarkIcon(currentBookmark.element, true);
				showNotification(`Bookmark "${currentBookmark.name}" guardado exitosamente!`);
				console.log(`🔐 BOOKMARK SAVED SUCCESSFULLY via email login`);
			} else {
				console.log(`🔐 BOOKMARK SAVE FAILED via email login`);
			}
		}

		hideModal();
	});

	// Handle registration
	document.getElementById('completeRegistration').addEventListener('click', function () {
		const email = document.getElementById('regEmail').value.trim();
		const name = document.getElementById('regName').value.trim();

		console.log(`🔐 COMPLETE REGISTRATION CLICKED:`, {
			email: email,
			name: name,
			currentBookmark: currentBookmark,
		});

		if (!email || !name) {
			console.log(`🔐 REGISTRATION FAILED: Missing fields`, { email: !!email, name: !!name });
			alert('Por favor, completa todos los campos.');
			return;
		}

		if (!isValidEmail(email)) {
			console.log(`🔐 REGISTRATION FAILED: Invalid email format`, { email: email });
			alert('Por favor, ingresa un email válido.');
			return;
		}

		// Save user data (REGISTERED)
		console.log(`🔐 SAVING REGISTRATION DATA:`, { email: email, name: name });
		setUserEmail(email, true);

		// Also save the name separately for display purposes
		const userData = getUserData();
		userData.user_name = name;
		saveUserData(userData);

		// Add bookmark
		if (currentBookmark) {
			const success = addBookmark(currentBookmark.type, currentBookmark.name, bookmarkPath);

			if (success) {
				updateBookmarkIcon(currentBookmark.element, true);
				showNotification(`¡Bienvenido ${name}! Bookmark "${currentBookmark.name}" guardado exitosamente!`);
				console.log(`🔐 BOOKMARK SAVED SUCCESSFULLY via registration`);
			} else {
				console.log(`🔐 BOOKMARK SAVE FAILED via registration`);
			}
		}

		hideModal();
	});

	// Utility functions
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function updateBookmarkIcon(element, isActive) {
		const icon = element.querySelector('i');
		console.log(`🎨 UPDATE BOOKMARK ICON:`, {
			element: element,
			isActive: isActive,
			iconBefore: icon.className,
		});

		if (isActive) {
			element.classList.add('active');
			icon.classList.remove('far');
			icon.classList.add('fas');
		} else {
			element.classList.remove('active');
			icon.classList.remove('fas');
			icon.classList.add('far');
		}

		console.log(`🎨 ICON UPDATED:`, {
			iconAfter: icon.className,
			elementClasses: element.className,
		});
	}

	function showNotification(message) {
		// Create notification element
		const notification = document.createElement('div');
		notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
		notification.textContent = message;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.style.animation = 'slideOutRight 0.3s ease';
			setTimeout(() => {
				document.body.removeChild(notification);
			}, 300);
		}, 3000);
	}

	// Initialize bookmark icons
	function initializeBookmarks() {
		const bookmarkIcons = document.querySelectorAll('.bookmark-icon');

		console.log(`🚀 INITIALIZING BOOKMARKS:`, {
			totalIcons: bookmarkIcons.length,
			bookmarkPath: bookmarkPath,
		});

		bookmarkIcons.forEach((icon) => {
			const type = icon.getAttribute('data-bookmark-type');
			const isActive = isBookmarked(type, bookmarkPath);
			updateBookmarkIcon(icon, isActive);

			console.log(`🚀 INITIALIZED ICON:`, {
				type: type,
				isActive: isActive,
			});

			icon.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();

				const bookmarkType = this.getAttribute('data-bookmark-type');
				const bookmarkName = this.getAttribute('data-bookmark-name');

				console.log(`🖱️ BOOKMARK ICON CLICKED:`, {
					type: bookmarkType,
					name: bookmarkName,
					path: bookmarkPath,
				});

				if (isBookmarked(bookmarkType, bookmarkPath)) {
					// Remove bookmark
					console.log(`🖱️ REMOVING BOOKMARK:`, { type: bookmarkType, path: bookmarkPath });
					const success = removeBookmark(bookmarkType, bookmarkPath);
					if (success) {
						updateBookmarkIcon(this, false);
						showNotification(`Bookmark "${bookmarkName}" eliminado.`);
						console.log(`🖱️ BOOKMARK REMOVED SUCCESSFULLY`);
					}
				} else {
					// Check if user is logged in
					const userData = getUserData();
					console.log(`🖱️ ADDING BOOKMARK - User data check:`, { userData: userData });

					if (userData.user_email) {
						// Add bookmark directly
						console.log(`🖱️ USER LOGGED IN - Adding bookmark directly`);
						const success = addBookmark(bookmarkType, bookmarkName, bookmarkPath);
						if (success) {
							updateBookmarkIcon(this, true);
							showNotification(`Bookmark "${bookmarkName}" guardado!`);
							console.log(`🖱️ BOOKMARK ADDED SUCCESSFULLY (logged in user)`);
						}
					} else {
						// Show modal for login/registration
						console.log(`🖱️ USER NOT LOGGED IN - Showing modal`);
						currentBookmark = {
							element: this,
							type: bookmarkType,
							name: bookmarkName,
						};
						console.log(`🖱️ CURRENT BOOKMARK SET:`, currentBookmark);
						showModal();
					}
				}
			});
		});
	}

	// Tab functionality
	const navButtons = document.querySelectorAll('.nav-btn');
	const tabPanes = document.querySelectorAll('.tab-pane');

	navButtons.forEach((button) => {
		button.addEventListener('click', function () {
			const targetTab = this.getAttribute('data-tab');

			// Remove active class from all buttons and panes
			navButtons.forEach((btn) => btn.classList.remove('active'));
			tabPanes.forEach((pane) => {
				pane.style.display = 'none';
				pane.classList.remove('active');
			});

			// Add active class to clicked button and corresponding pane
			this.classList.add('active');
			const targetPane = document.getElementById(targetTab);
			if (targetPane) {
				targetPane.style.display = 'block';
				targetPane.classList.add('active');
			}
		});
	});

	// Initialize everything
	initializeBookmarks();

	// Initialize QuickActionsBar badge if we're on home page
	setTimeout(() => {
		initializeQuickActionsBarBadge();
	}, 100); // Small delay to ensure DOM is fully loaded

	function countTotalBookmarksOnPage() {
		const bookmarkIcons = document.querySelectorAll('.bookmark-icon');
		const totalCount = bookmarkIcons.length;

		console.log(`📊 TOTAL BOOKMARKS ON PAGE: ${totalCount}`);
		return totalCount;
	}
	function countTotalUserBookmarksInGeneral() {
		const userData = getUserData();
		let totalBookmarks = 0;

		function countNestedBookmarks(obj) {
			let count = 0;
			for (const key in obj) {
				if (Array.isArray(obj[key])) {
					count += obj[key].length;
				} else if (typeof obj[key] === 'object') {
					count += countNestedBookmarks(obj[key]);
				}
			}
			return count;
		}

		totalBookmarks = countNestedBookmarks(userData.user_bookmarks);

		console.log(`📊 TOTAL USER BOOKMARKS IN GENERAL: ${totalBookmarks}`);
		return totalBookmarks;
	}

	function countUserBookmarksOnPage() {
		const bookmarkIcons = document.querySelectorAll('.bookmark-icon');
		let userBookmarksCount = 0;

		bookmarkIcons.forEach((icon) => {
			const type = icon.getAttribute('data-bookmark-type');
			if (isBookmarked(type, bookmarkPath)) {
				userBookmarksCount++;
			}
		});

		console.log(`📊 USER BOOKMARKS ON PAGE: ${userBookmarksCount} of ${bookmarkIcons.length}`);
		return userBookmarksCount;
	}
	// Function to update QuickActionsBar bookmark badge
	function updateQuickActionsBarBadge(totalBookmarks) {
		// Check if QuickActionsBar exists (it should be on all pages)
		const bookmarkButton = document.querySelector('.QuickActionsBar-item[data-tooltip="Bookmarks"]');
		if (!bookmarkButton) {
			console.log('🎯 QuickActionsBar bookmark button not found');
			return;
		}

		// Check if user is registered or has server-side data
		const userData = getUserData();
		const isRegisteredUser = userData.user_email && userData.is_registered;

		// Log current page and user status
		console.log('🎯 Updating QuickActionsBar badge:', {
			page: window.location.pathname,
			totalBookmarks: totalBookmarks,
			isRegisteredUser: isRegisteredUser,
		});

		// Get both badge elements
		const serverBadge = bookmarkButton.querySelector('.QuickActionsBar-badge[data-server-badge="true"]');
		const clientBadge = bookmarkButton.querySelector('.QuickActionsBar-badge[data-client-badge="true"]');

		if (isRegisteredUser) {
			// For registered users, prioritize server badge and hide client badge
			if (clientBadge) {
				clientBadge.style.display = 'none';
			}
			console.log('🎯 Using server-side badge for registered user');
		} else {
			// For non-registered users, use client-side badge
			if (serverBadge) {
				serverBadge.style.display = 'none';
			}

			if (!clientBadge) {
				// Create client badge if it doesn't exist
				const newClientBadge = document.createElement('span');
				newClientBadge.className = 'QuickActionsBar-badge';
				newClientBadge.setAttribute('data-client-badge', 'true');
				bookmarkButton.appendChild(newClientBadge);
			}

			const targetBadge =
				clientBadge || bookmarkButton.querySelector('.QuickActionsBar-badge[data-client-badge="true"]');

			if (totalBookmarks > 0) {
				targetBadge.textContent = totalBookmarks;
				targetBadge.style.display = '';
				console.log(`🎯 UPDATED client-side QuickActionsBar badge: ${totalBookmarks}`);
			} else {
				targetBadge.style.display = 'none';
				console.log('🎯 HIDDEN client-side QuickActionsBar badge (no bookmarks)');
			}
		}
	}

	// Function to detect if current page has bookmarkable elements
	function hasBookmarkableElementsOnPage() {
		const bookmarkIcons = document.querySelectorAll('.bookmark-icon');
		const hasElements = bookmarkIcons.length > 0;

		console.log(`🔍 CHECKING FOR BOOKMARKABLE ELEMENTS:`, {
			page: window.location.pathname,
			elementsFound: bookmarkIcons.length,
			hasElements: hasElements,
		});

		return hasElements;
	}

	// Enhanced function to initialize QuickActionsBar badge on page load
	function initializeQuickActionsBarBadge() {
		const userData = getUserData();
		const isRegisteredUser = userData.user_email && userData.is_registered;
		const currentPage = window.location.pathname;
		const hasBookmarkableElements = hasBookmarkableElementsOnPage();

		console.log('🎯 INITIALIZING QuickActionsBar badge:', {
			currentPage: currentPage,
			userEmail: userData.user_email,
			isRegistered: userData.is_registered,
			isRegisteredUser: isRegisteredUser,
			hasBookmarkableElements: hasBookmarkableElements,
		});

		if (isRegisteredUser) {
			// For registered users, let the server handle the badge
			console.log('🎯 Registered user detected, using server-side badge');
		} else {
			// For non-registered users, count bookmarks from cookies and update badge
			const totalBookmarks = countTotalUserBookmarksInGeneral();
			updateQuickActionsBarBadge(totalBookmarks);
			console.log('🎯 Non-registered user detected, using client-side badge with count:', totalBookmarks);
		}
	}

	/**
	 * ====================================================================
	 * INJECTION AUTOMATIQUE DES BOUTONS BOOKMARK
	 * ====================================================================
	 * 
	 * Configuration des éléments qui doivent recevoir automatiquement
	 * des boutons de bookmark lors du chargement de la page
	 */

	// Configuration des IDs d'éléments et leurs types de bookmark correspondants
	const BOOKMARK_INJECTION_CONFIG = [
		{
			elementId: 'currency-rate-display',
			bookmarkType: 'rate',
			bookmarkName: 'Cotización Actual',
			position: 'append' // 'append', 'prepend', 'before', 'after'
		},
		{
			elementId: 'main-chart-container',
			bookmarkType: 'chart',
			bookmarkName: 'Gráfico Principal',
			position: 'append'
		},
		{
			elementId: 'news-section',
			bookmarkType: 'news',
			bookmarkName: 'Noticias Financieras',
			position: 'prepend'
		}
		// Ajouter d'autres configurations ici selon les besoins
	];

	/**
	 * Crée un bouton de bookmark avec la configuration spécifiée
	 * @param {string} bookmarkType - Type du bookmark (rate, chart, news, etc.)
	 * @param {string} bookmarkName - Nom affiché du bookmark
	 * @returns {HTMLElement} - Élément bouton créé
	 */
	function createBookmarkButton(bookmarkType, bookmarkName) {
		console.log(`🔧 CRÉATION BOUTON BOOKMARK:`, {
			type: bookmarkType,
			name: bookmarkName
		});

		// Créer le bouton principal
		const button = document.createElement('button');
		button.className = 'bookmark-icon';
		button.setAttribute('data-bookmark-type', bookmarkType);
		button.setAttribute('data-bookmark-name', bookmarkName);
		button.setAttribute('data-auto-injected', 'true');

		// Créer l'icône FontAwesome
		const icon = document.createElement('i');
		icon.className = 'far fa-bookmark';

		// Assembler le bouton
		button.appendChild(icon);

		// Ajouter styles inline pour assurer la visibilité
		button.style.cssText = `
			margin-left: 8px;
			padding: 6px 8px;
			background: transparent;
			border: 1px solid #e2e8f0;
			border-radius: 4px;
			cursor: pointer;
			transition: all 0.2s ease;
		`;

		// Ajouter événements hover
		button.addEventListener('mouseenter', function() {
			this.style.borderColor = '#3b82f6';
			this.style.backgroundColor = '#f8fafc';
		});

		button.addEventListener('mouseleave', function() {
			this.style.borderColor = '#e2e8f0';
			this.style.backgroundColor = 'transparent';
		});

		console.log(`🔧 BOUTON BOOKMARK CRÉÉ:`, {
			type: bookmarkType,
			name: bookmarkName,
			element: button
		});

		return button;
	}

	/**
	 * Injecte un bouton de bookmark dans l'élément cible selon la position spécifiée
	 * @param {HTMLElement} targetElement - Élément cible où injecter le bouton
	 * @param {HTMLElement} bookmarkButton - Bouton de bookmark à injecter
	 * @param {string} position - Position d'injection ('append', 'prepend', 'before', 'after')
	 */
	function injectBookmarkButton(targetElement, bookmarkButton, position = 'append') {
		console.log(`💉 INJECTION BOUTON:`, {
			targetId: targetElement.id,
			position: position
		});

		switch (position) {
			case 'append':
				targetElement.appendChild(bookmarkButton);
				break;
			case 'prepend':
				targetElement.insertBefore(bookmarkButton, targetElement.firstChild);
				break;
			case 'before':
				targetElement.parentNode.insertBefore(bookmarkButton, targetElement);
				break;
			case 'after':
				targetElement.parentNode.insertBefore(bookmarkButton, targetElement.nextSibling);
				break;
			default:
				console.warn(`⚠️ Position d'injection inconnue: ${position}. Utilisation de 'append' par défaut.`);
				targetElement.appendChild(bookmarkButton);
		}

		console.log(`💉 INJECTION RÉUSSIE:`, {
			targetId: targetElement.id,
			position: position
		});
	}

	/**
	 * Fonction principale pour injecter automatiquement les boutons de bookmark
	 * Parcourt la configuration et ajoute les boutons aux éléments trouvés
	 */
	function autoInjectBookmarkButtons() {
		console.log(`🚀 DÉBUT AUTO-INJECTION BOUTONS BOOKMARK`);
		
		let successCount = 0;
		let failureCount = 0;

		BOOKMARK_INJECTION_CONFIG.forEach((config, index) => {
			console.log(`🔍 TRAITEMENT CONFIG ${index + 1}:`, config);

			// Rechercher l'élément cible
			const targetElement = document.getElementById(config.elementId);
			
			if (!targetElement) {
				console.log(`❌ ÉLÉMENT NON TROUVÉ: ${config.elementId}`);
				failureCount++;
				return;
			}

			// Vérifier si un bouton bookmark n'existe pas déjà
			const existingBookmark = targetElement.querySelector('.bookmark-icon[data-auto-injected="true"]');
			if (existingBookmark) {
				console.log(`⚠️ BOUTON DÉJÀ EXISTANT pour: ${config.elementId}`);
				return;
			}

			// Créer et injecter le bouton
			try {
				const bookmarkButton = createBookmarkButton(config.bookmarkType, config.bookmarkName);
				injectBookmarkButton(targetElement, bookmarkButton, config.position);
				successCount++;
				
				console.log(`✅ INJECTION RÉUSSIE pour: ${config.elementId}`);
			} catch (error) {
				console.error(`❌ ERREUR INJECTION pour ${config.elementId}:`, error);
				failureCount++;
			}
		});

		console.log(`🎯 RÉSULTATS AUTO-INJECTION:`, {
			total: BOOKMARK_INJECTION_CONFIG.length,
			succès: successCount,
			échecs: failureCount
		});

		// Réinitialiser les événements bookmark après injection
		if (successCount > 0) {
			console.log(`🔄 RÉINITIALISATION DES ÉVÉNEMENTS BOOKMARK`);
			initializeBookmarks();
		}
	}

	/**
	 * Fonction utilitaire pour ajouter manuellement une nouvelle configuration d'injection
	 * @param {string} elementId - ID de l'élément cible
	 * @param {string} bookmarkType - Type du bookmark
	 * @param {string} bookmarkName - Nom du bookmark
	 * @param {string} position - Position d'injection
	 */
	function addBookmarkInjectionConfig(elementId, bookmarkType, bookmarkName, position = 'append') {
		BOOKMARK_INJECTION_CONFIG.push({
			elementId: elementId,
			bookmarkType: bookmarkType,
			bookmarkName: bookmarkName,
			position: position
		});

		console.log(`➕ NOUVELLE CONFIG AJOUTÉE:`, {
			elementId: elementId,
			bookmarkType: bookmarkType,
			bookmarkName: bookmarkName,
			position: position
		});
	}

	// Exposer les fonctions utilitaires dans window pour utilisation en console
	window.autoInjectBookmarkButtons = autoInjectBookmarkButtons;
	window.addBookmarkInjectionConfig = addBookmarkInjectionConfig;
	window.BOOKMARK_INJECTION_CONFIG = BOOKMARK_INJECTION_CONFIG;

	// Developer utility functions (available in console)
	window.displayReadableCookies = function () {
		console.log('🍪 === COOKIES DECODIFICADAS ===');

		const cookies = document.cookie.split(';');
		const cookieObj = {};

		cookies.forEach((cookie) => {
			const [name, value] = cookie.trim().split('=');
			if (name && value) {
				let decodedValue = value;

				// Try to decode URI component
				try {
					decodedValue = decodeURIComponent(value);
				} catch (e) {
					// If decoding fails, use original value
					decodedValue = value;
				}

				// Try to parse as JSON
				try {
					const jsonValue = JSON.parse(decodedValue);
					cookieObj[name] = jsonValue;
					console.log(`${name}:`, jsonValue);
				} catch (e) {
					// If not JSON, show as string
					cookieObj[name] = decodedValue;
					console.log(`${name}:`, decodedValue);
				}
			}
		});

		console.log('🍪 === OBJETO COMPLETO ===');
		console.log(cookieObj);

		return cookieObj;
	};

	window.displayUserData = function () {
		console.log('� === DATOS DEL USUARIO ===');
		const userData = getUserData();
		console.log(JSON.stringify(userData, null, 2));
		return userData;
	};

	window.displayUserBookmarks = function () {
		console.log('📚 === RESUMEN DE BOOKMARKS ===');

		const userData = getUserData();
		console.log('Email del usuario:', userData.user_email);
		console.log('¿Está registrado?:', userData.is_registered);
		console.log('Bookmarks jerárquicos:', userData.user_bookmarks);
		console.log('Metadata de bookmarks:', userData.bookmark_metadata);

		// Mostrar resumen organizado
		function displayNestedStructure(obj, indent = '') {
			for (const key in obj) {
				if (Array.isArray(obj[key])) {
					console.log(`${indent}� ${key}: ${obj[key].length} bookmark(s)`);
					obj[key].forEach((bookmark, index) => {
						console.log(
							`${indent}  ${index + 1}. ${bookmark.name || bookmark} - ${
								bookmark.timestamp ? new Date(bookmark.timestamp).toLocaleString() : 'No timestamp'
							}`,
						);
					});
				} else if (typeof obj[key] === 'object') {
					console.log(`${indent}📁 ${key}:`);
					displayNestedStructure(obj[key], indent + '  ');
				}
			}
		}

		if (Object.keys(userData.user_bookmarks).length > 0) {
			console.log('📚 === ESTRUCTURA JERÁRQUICA ===');
			displayNestedStructure(userData.user_bookmarks);
		}

		return userData;
	};

	window.clearAllBookmarks = function () {
		const userData = getUserData();
		userData.user_bookmarks = {};
		userData.bookmark_metadata = {};
		saveUserData(userData);
		console.log('🗑️ Todos los bookmarks han sido eliminados');

		// Actualizar iconos en la página
		const bookmarkIcons = document.querySelectorAll('.bookmark-icon');
		bookmarkIcons.forEach((icon) => updateBookmarkIcon(icon, false));
	};

	window.clearAllUserData = function () {
		deleteCookie('datauemoa_user_data');
		console.log('🗑️ Todos los datos del usuario han sido eliminados');

		// Actualizar iconos en la página
		const bookmarkIcons = document.querySelectorAll('.bookmark-icon');
		bookmarkIcons.forEach((icon) => updateBookmarkIcon(icon, false));
	};

	// Test functions for developers
	window.addTestBookmark = function (type, name, path = bookmarkPath) {
		const userData = getUserData();
		if (!userData.user_email) {
			console.log('❌ No hay usuario logueado. Usa: setUserEmail("test@example.com", false)');
			return;
		}

		const success = addBookmark(type, name, path);
		if (success) {
			console.log(`✅ Bookmark de prueba agregado: ${name} (${type}) para ruta ${path.join('/')}`);
			initializeBookmarks(); // Refresh icons
		} else {
			console.log(`❌ No se pudo agregar el bookmark (posiblemente ya existe)`);
		}
	};

	window.removeTestBookmark = function (type, path = bookmarkPath) {
		const success = removeBookmark(type, path);
		if (success) {
			console.log(`✅ Bookmark eliminado: ${type} para ruta ${path.join('/')}`);
			initializeBookmarks(); // Refresh icons
		} else {
			console.log(`❌ No se pudo eliminar el bookmark (posiblemente no existe)`);
		}
	};

	window.setTestUser = function (email, isRegistered = false, name = null) {
		setUserEmail(email, isRegistered);
		if (name && isRegistered) {
			const userData = getUserData();
			userData.user_name = name;
			saveUserData(userData);
		}
		console.log(`✅ Usuario de prueba configurado: ${email} (registrado: ${isRegistered})`);
	};

	// Count functions available globally
	window.countTotalBookmarksOnPage = countTotalBookmarksOnPage;
	window.countUserBookmarksOnPage = countUserBookmarksOnPage;
	window.countTotalUserBookmarksInGeneral = countTotalUserBookmarksInGeneral;
	window.updateQuickActionsBarBadge = updateQuickActionsBarBadge;
	window.initializeQuickActionsBarBadge = initializeQuickActionsBarBadge;
	window.hasBookmarkableElementsOnPage = hasBookmarkableElementsOnPage;

	// Test function to verify badge functionality
	window.testQuickActionsBarBadge = function () {
		const userData = getUserData();
		const totalBookmarks = countTotalUserBookmarksInGeneral();
		const hasBookmarkableElements = hasBookmarkableElementsOnPage();
		const currentPage = window.location.pathname;

		console.log('🧪 === TESTING QuickActionsBar Badge ===');
		console.log('Current page:', currentPage);
		console.log('User email:', userData.user_email);
		console.log('Is registered:', userData.is_registered);
		console.log('Total bookmarks:', totalBookmarks);
		console.log('Has bookmarkable elements:', hasBookmarkableElements);
		console.log(
			'Page supports bookmarks:',
			hasBookmarkableElements || currentPage === '/' || currentPage === '/home',
		);

		// Force update badge regardless of user type
		updateQuickActionsBarBadge(totalBookmarks);

		return {
			userData: userData,
			totalBookmarks: totalBookmarks,
			hasBookmarkableElements: hasBookmarkableElements,
			currentPage: currentPage,
			supportsBookmarks: hasBookmarkableElements || currentPage === '/' || currentPage === '/home',
		};
	};

	// Show available commands on page load
	console.log(`
                    🛠️ === COMANDOS DISPONIBLES EN CONSOLA ===

                    📊 Para ver cookies decodificadas:
                    displayReadableCookies()

                    👤 Para ver datos del usuario unificados:
                    displayUserData()

                    📚 Para ver resumen de bookmarks (estructura jerárquica):
                    displayUserBookmarks()

                    📈 Para contar bookmarks en la página:
                    countTotalBookmarksOnPage()     - Total de iconos bookmark en la página
                    countUserBookmarksOnPage()      - Bookmarks del usuario actual en la página

                    🗑️ Para limpiar datos:
                    clearAllBookmarks()     - Solo elimina bookmarks
                    clearAllUserData()      - Elimina todo

                    🧪 Para pruebas (estructura jerárquica):
                    setTestUser('test@example.com', false)                     - Email solo
                    setTestUser('test@example.com', true, 'Juan')             - Usuario registrado
                    addTestBookmark('rate', 'Test Rate', ['es', 'currencies', 'EUR-USD'])  - Con ruta específica
                    addTestBookmark('rate', 'Test Rate')                      - Con ruta actual: ${bookmarkPath.join(
						'/',
					)}
                    removeTestBookmark('rate', ['es', 'currencies', 'EUR-USD']) - Con ruta específica
                    removeTestBookmark('rate')                                - Con ruta actual: ${bookmarkPath.join(
						'/',
					)}

                    📋 Estado actual:
                    📍 Ruta actual: ${bookmarkPath.join('/')}
                    🔗 URL completa: ${urlPath}
    `);

	displayUserData();
})();