<?php
// src/Twig/Components/QuickActionsBar.php

namespace App\Twig\Components;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\Attribute\LiveProp;
use Symfony\UX\LiveComponent\Attribute\LiveAction;
use Symfony\UX\LiveComponent\DefaultActionTrait;
use Symfony\UX\TwigComponent\Attribute\PostMount;

#[AsLiveComponent]
class QuickActionsBar
{
    use DefaultActionTrait;

    #[LiveProp(writable: true)]
    public bool $isOpen = false;

    #[LiveProp(writable: true)]
    public string $activeTab = 'notifications';

    #[LiveProp]
    public array $notifications = [];

    #[LiveProp]
    public array $favorites = [];

    #[PostMount]
    public function postMount(): void
    {
        // Cargar datos iniciales
        $this->loadNotifications();
        $this->loadFavorites();
    }

    #[LiveAction]
    public function toggleBar(): void
    {
        $this->isOpen = !$this->isOpen;
    }

    #[LiveAction]
    public function switchTab(string $tab): void
    {
        $this->activeTab = $tab;
    }

    #[LiveAction]
    public function markNotificationAsRead(int $notificationId): void
    {
        // Lógica para marcar como leída
        foreach ($this->notifications as &$notification) {
            if ($notification['id'] === $notificationId) {
                $notification['read'] = true;
            }
        }
    }

    private function loadNotifications(): void
    {
        // Simulación de carga de notificaciones para DATA UEMOA
        $this->notifications = [
            ['id' => 1, 'message' => 'Nuevos datos de mercado disponibles', 'read' => false],
            ['id' => 2, 'message' => 'Reporte mensual generado', 'read' => false],
            ['id' => 3, 'message' => 'API actualizada a v2.1', 'read' => true],
        ];
    }

    private function loadFavorites(): void
    {
        // Simulación de carga de favoritos para DATA UEMOA
        $this->favorites = [
            ['id' => 1, 'name' => 'Dashboard Principal', 'url' => '/'],
            ['id' => 2, 'name' => 'Mercados', 'url' => '/markets'],
            ['id' => 3, 'name' => 'API Docs', 'url' => '/api/docs'],
        ];
    }
}
