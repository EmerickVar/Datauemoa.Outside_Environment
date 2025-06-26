<?php

namespace App\Controller\FrontOffice;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    // Redirección a la URL con locale por defecto
    #[Route('/', name: 'app_home_redirect')]
    public function redirectToLocale(): RedirectResponse
    {
        return $this->redirectToRoute('app_home', ['_locale' => 'fr']);
    }

    // Ruta principal con locale
    #[Route('/{_locale}', name: 'app_home', requirements: ['_locale' => 'fr|en|es|zh|ar|ru'])]
    public function main(): Response
    {
        return $this->render('FrontOffice/home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
}
