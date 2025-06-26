<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Attribute\Route;

final class LocaleController extends AbstractController
{
    #[Route('/{_locale}/change-locale/{locale}', name: 'app_change_locale', requirements: ['_locale' => 'fr|en|es|zh|ar|ru', 'locale' => 'fr|en|es|zh|ar|ru'])]
    public function changeLocale(string $locale, Request $request): RedirectResponse
    {
        // Obtener la URL de referencia o redirigir a la página principal
        $referer = $request->headers->get('referer');

        if ($referer) {
            // Extraer la ruta de la URL de referencia y cambiar el locale
            $currentRoute = $this->extractRouteFromReferer($referer);
            if ($currentRoute) {
                return $this->redirectToRoute($currentRoute['name'], array_merge($currentRoute['params'], ['_locale' => $locale]));
            }
        }

        // Si no hay referencia válida, redirigir a la página principal con el nuevo locale
        return $this->redirectToRoute('app_home', ['_locale' => $locale]);
    }

    private function extractRouteFromReferer(string $referer): ?array
    {
        // Análisis simple de la URL de referencia para extraer la ruta
        $path = parse_url($referer, PHP_URL_PATH);

        if (!$path) {
            return null;
        }

        // Remover el locale actual de la URL si existe
        $pathParts = explode('/', trim($path, '/'));

        if (count($pathParts) >= 1 && in_array($pathParts[0], ['fr', 'en', 'es', 'zh', 'ar', 'ru'])) {
            array_shift($pathParts); // Remover el locale actual
        }

        $cleanPath = '/' . implode('/', $pathParts);

        // Mapear rutas conocidas
        switch ($cleanPath) {
            case '/':
            case '':
                return ['name' => 'app_home', 'params' => []];
            case '/currencies':
                return ['name' => 'app_currencies', 'params' => []];
            case '/FrontOffice/home':
                return ['name' => 'app_FrontOffice_home_locale', 'params' => []];
            default:
                // Para rutas más complejas como /currencies/EUR-USD
                if (preg_match('/^\/currencies\/([A-Z]{3})-([A-Z]{3})$/', $cleanPath, $matches)) {
                    return ['name' => 'app_currencies_pair', 'params' => ['from' => $matches[1], 'to' => $matches[2]]];
                }
                return null;
        }
    }
}
