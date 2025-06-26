<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleListener implements EventSubscriberInterface
{
    private string $defaultLocale;

    public function __construct(string $defaultLocale = 'fr')
    {
        $this->defaultLocale = $defaultLocale;
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // No hacer nada si ya hay un locale configurado
        if ($request->hasPreviousSession()) {
            return;
        }

        // Intentar obtener el locale de la URL
        $locale = $request->attributes->get('_locale');

        if ($locale) {
            // Validar que el locale sea uno de los soportados
            $supportedLocales = ['fr', 'en', 'es', 'zh', 'ar', 'ru'];
            if (in_array($locale, $supportedLocales)) {
                $request->setLocale($locale);
            } else {
                $request->setLocale($this->defaultLocale);
            }
        } else {
            // Si no hay locale en la URL, usar el por defecto
            $request->setLocale($this->defaultLocale);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [
                ['onKernelRequest', 20],
            ],
        ];
    }
}
