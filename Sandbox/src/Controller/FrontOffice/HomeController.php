<?php

namespace App\Controller\FrontOffice;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    #[Route('/FrontOffice/Home', name: 'app_FrontOffice_Home')]
    public function index(): Response
    {
        return $this->render('FrontOffice/Home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/', name: 'app_Home')]
    public function main(): Response
    {
        return $this->render('FrontOffice/Home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
}
