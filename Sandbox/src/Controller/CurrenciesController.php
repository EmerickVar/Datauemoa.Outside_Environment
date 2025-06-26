<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class CurrenciesController extends AbstractController
{
    #[Route('/{_locale}/currencies', name: 'app_currencies', requirements: ['_locale' => 'fr|en|es|zh|ar|ru'])]
    public function index(Request $request): Response
    {
        // Obtener el par de monedas desde los parámetros de la URL o usar valores por defecto
        $fromCurrency = $request->query->get('from', 'EUR');
        $toCurrency = $request->query->get('to', 'USD');

        // Datos de ejemplo - en producción estos vendrían de una API o base de datos
        $currencyPair = $this->getCurrencyPairData($fromCurrency, $toCurrency);

        // Historial de los últimos 5 días (datos de ejemplo)
        $recentHistory = $this->getRecentHistory($fromCurrency, $toCurrency);

        return $this->render('currencies/index.html.twig', [
            'currency_pair' => $currencyPair,
            'recent_history' => $recentHistory,
        ]);
    }

    #[Route('/{_locale}/currencies/{from}-{to}', name: 'app_currencies_pair', requirements: ['_locale' => 'fr|en|es|zh|ar|ru'])]
    public function showPair(string $from, string $to): Response
    {
        $currencyPair = $this->getCurrencyPairData($from, $to);
        $recentHistory = $this->getRecentHistory($from, $to);

        return $this->render('currencies/index.html.twig', [
            'currency_pair' => $currencyPair,
            'recent_history' => $recentHistory,
        ]);
    }

    private function getCurrencyPairData(string $from, string $to): array
    {
        // Datos de ejemplo - en producción estos vendrían de una API externa
        $currencyNames = [
            'EUR' => 'Euro',
            'USD' => 'Dólar estadounidense',
            'GBP' => 'Libra esterlina',
            'JPY' => 'Yen japonés',
            'CHF' => 'Franco suizo',
            'CAD' => 'Dólar canadiense',
            'AUD' => 'Dólar australiano',
            'XOF' => 'Franco CFA',
        ];

        // Simulación de datos de mercado
        $baseRate = $this->getBaseRate($from, $to);
        $variation = (mt_rand(-100, 100) / 10000); // Variación pequeña para realismo

        return [
            'from_currency_code' => strtoupper($from),
            'to_currency_code' => strtoupper($to),
            'from_currency_name' => $currencyNames[strtoupper($from)] ?? strtoupper($from),
            'to_currency_name' => $currencyNames[strtoupper($to)] ?? strtoupper($to),
            'current_rate' => number_format($baseRate + $variation, 5, ',', '.'),
            'day_change' => number_format(mt_rand(-200, 200) / 100, 2, ',', '.'),
            'week_change' => number_format(mt_rand(-500, 500) / 100, 2, ',', '.'),
            'month_change' => number_format(mt_rand(-1000, 1000) / 100, 2, ',', '.'),
            'year_change' => number_format(mt_rand(-2000, 2000) / 100, 2, ',', '.'),
            'last_update' => (new \DateTime())->format('Y-m-d H:i:s'),
        ];
    }

    private function getBaseRate(string $from, string $to): float
    {
        // Tasas base de ejemplo (en producción vendrían de una API)
        $rates = [
            'EUR_USD' => 1.14611,
            'USD_EUR' => 0.87254,
            'GBP_USD' => 1.27845,
            'USD_GBP' => 0.78219,
            'EUR_GBP' => 0.89732,
            'GBP_EUR' => 1.11442,
            'USD_JPY' => 149.25,
            'JPY_USD' => 0.00670,
            'EUR_XOF' => 655.957,
            'XOF_EUR' => 0.00152,
            'USD_XOF' => 572.50,
            'XOF_USD' => 0.00175,
        ];

        $pair = strtoupper($from) . '_' . strtoupper($to);
        $reversePair = strtoupper($to) . '_' . strtoupper($from);

        if (isset($rates[$pair])) {
            return $rates[$pair];
        } elseif (isset($rates[$reversePair])) {
            return 1 / $rates[$reversePair];
        }

        // Si no existe la tasa, devolver una tasa por defecto
        return 1.0;
    }

    private function getRecentHistory(string $from, string $to): array
    {
        $history = [];
        $baseRate = $this->getBaseRate($from, $to);

        // Generar datos de los últimos 5 días
        for ($i = 4; $i >= 0; $i--) {
            $date = (new \DateTime())->modify("-{$i} days");
            $dayVariation = (mt_rand(-50, 50) / 10000);

            $open = $baseRate + $dayVariation;
            $high = $open + (mt_rand(0, 30) / 10000);
            $low = $open - (mt_rand(0, 30) / 10000);
            $close = $low + (mt_rand(0, ($high - $low) * 10000) / 10000);
            $change = (($close - $open) / $open) * 100;

            $history[] = [
                'date' => $date->format('d/m/Y'),
                'open' => number_format($open, 5, ',', '.'),
                'high' => number_format($high, 5, ',', '.'),
                'low' => number_format($low, 5, ',', '.'),
                'close' => number_format($close, 5, ',', '.'),
                'change' => number_format($change, 2, ',', '.'),
            ];
        }

        return $history;
    }
}
