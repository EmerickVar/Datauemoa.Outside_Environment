<?php

/**
 * Componente Live para la Barra de Acciones Rápidas (QuickActionsBar)
 * 
 * Este componente maneja una barra flotante de acciones rápidas que se muestra
 * en la parte inferior derecha de la pantalla. Permite a los usuarios acceder
 * rápidamente a notificaciones, favoritos y otras funcionalidades importantes.
 * 
 * Características principales:
 * - Se puede abrir/cerrar dinámicamente
 * - Maneja pestañas (notifications, favorites, etc.)
 * - Actualización en tiempo real sin recargar la página (Live Components)
 * - Específicamente diseñado para DATA UEMOA
 * 
 * @package App\Twig\Components
 * @author DataUEMOA Team
 */

namespace App\Twig\Components;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\Attribute\LiveProp;
use Symfony\UX\LiveComponent\Attribute\LiveAction;
use Symfony\UX\LiveComponent\DefaultActionTrait;
use Symfony\UX\TwigComponent\Attribute\PostMount;

/**
 * Componente Live que gestiona la barra de acciones rápidas
 * 
 * Este atributo marca la clase como un Live Component de Symfony UX,
 * lo que permite actualizaciones dinámicas del DOM sin JavaScript personalizado
 */
#[AsLiveComponent]
class QuickActionsBar
{
    /**
     * Trait que proporciona funcionalidades básicas para Live Components
     * Incluye métodos para manejar acciones y actualizaciones del componente
     */
    use DefaultActionTrait;

    /**
     * Estado de apertura/cierre de la barra
     * 
     * @var bool $isOpen Determina si la barra está abierta (true) o cerrada (false)
     * 
     * LiveProp(writable: true) permite que esta propiedad sea modificada
     * desde el frontend y que los cambios se sincronicen automáticamente
     */
    #[LiveProp(writable: true)]
    public bool $isOpen = false;

    /**
     * Pestaña activa en la barra de acciones
     * 
     * @var string $activeTab Identifica qué pestaña está actualmente seleccionada
     * Valores posibles: 'notifications', 'favorites', etc.
     * 
     * LiveProp(writable: true) permite cambiar de pestaña dinámicamente
     */
    #[LiveProp(writable: true)]
    public string $activeTab = 'notifications';

    /**
     * Lista de notificaciones del usuario
     * 
     * @var array $notifications Array que contiene todas las notificaciones
     * Estructura: [['id' => int, 'message' => string, 'read' => bool], ...]
     * 
     * LiveProp sin writable: solo se puede modificar desde el servidor
     */
    #[LiveProp]
    public array $notifications = [];

    /**
     * Lista de elementos favoritos del usuario
     * 
     * @var array $favorites Array que contiene los favoritos del usuario
     * Estructura: [['id' => int, 'name' => string, 'url' => string], ...]
     * 
     * LiveProp sin writable: solo se puede modificar desde el servidor
     */
    #[LiveProp]
    public array $favorites = [];

    /**
     * Método que se ejecuta después del montaje del componente
     * 
     * PostMount se ejecuta automáticamente cuando el componente es inicializado,
     * es el lugar ideal para cargar datos iniciales y configurar el estado inicial
     * 
     * @return void
     */
    #[PostMount]
    public function postMount(): void
    {
        // Cargar datos iniciales de notificaciones y favoritos
        $this->loadNotifications();
        $this->loadFavorites();
    }

    /**
     * Acción Live para alternar el estado abierto/cerrado de la barra
     * 
     * LiveAction permite que este método sea llamado desde el frontend
     * sin necesidad de JavaScript personalizado. El estado se actualiza
     * automáticamente en el DOM.
     * 
     * @return void
     */
    #[LiveAction]
    public function toggleBar(): void
    {
        $this->isOpen = !$this->isOpen;
    }

    /**
     * Acción Live para cambiar la pestaña activa
     * 
     * Permite cambiar dinámicamente entre diferentes pestañas de la barra
     * (notificaciones, favoritos, etc.) sin recargar la página
     * 
     * @param string $tab Identificador de la pestaña a activar
     * @return void
     */
    #[LiveAction]
    public function switchTab(string $tab): void
    {
        $this->activeTab = $tab;
    }

    /**
     * Acción Live para marcar una notificación como leída
     * 
     * Busca la notificación por ID y cambia su estado a leída.
     * El cambio se refleja inmediatamente en la interfaz.
     * 
     * @param int $notificationId ID único de la notificación a marcar como leída
     * @return void
     */
    #[LiveAction]
    public function markNotificationAsRead(int $notificationId): void
    {
        // Buscar y actualizar la notificación específica
        foreach ($this->notifications as &$notification) {
            if ($notification['id'] === $notificationId) {
                $notification['read'] = true;
                break; // Optimización: salir del bucle una vez encontrada
            }
        }
    }

    /**
     * Método privado para cargar las notificaciones del usuario
     * 
     * Actualmente simula datos de notificaciones para DATA UEMOA.
     * En una implementación real, esto consultaría la base de datos
     * o un servicio externo para obtener las notificaciones reales.
     * 
     * Estructura de cada notificación:
     * - id: Identificador único de la notificación
     * - message: Mensaje de la notificación para mostrar al usuario
     * - read: Estado de lectura (true = leída, false = no leída)
     * 
     * @return void
     */
    private function loadNotifications(): void
    {
        // Simulación de notificaciones específicas para DATA UEMOA
        // TODO: Reemplazar con consulta real a la base de datos
        $this->notifications = [
            /*
                [
                    'id' => 1,
                    'message' => 'New data from your market bookmarks.',
                    'read' => false
                ]
            */];
    }

    /**
     * Método privado para cargar los elementos favoritos del usuario
     * 
     * Carga los marcadores y páginas favoritas del usuario para acceso rápido.
     * Actualmente simula datos específicos para DATA UEMOA.
     * En producción, esto consultaría las preferencias del usuario en la base de datos.
     * 
     * Estructura de cada favorito:
     * - id: Identificador único del favorito
     * - name: Nombre descriptivo para mostrar al usuario
     * - url: URL de destino al hacer clic en el favorito
     * 
     * @return void
     */
    private function loadFavorites(): void
    {
        // Simulación de favoritos específicos para DATA UEMOA
        // TODO: Reemplazar con consulta real a preferencias del usuario
        $this->favorites = [
            /*
                [
                    'id' => 1,
                    'name' => 'Dashboard Prcipal',
                    'url' => '/'
                ]
            */];
    }
}
