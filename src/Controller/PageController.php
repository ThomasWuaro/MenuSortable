<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Page;
use App\Service\PageManager;

class PageController extends AbstractController
{
    /**
     * @Route("/page", name="page")
     */
    public function index()
    {
        return $this->render('page/index.html.twig', [
            'controller_name' => 'PageController',
        ]);
    }

    /**
     * @Route("/page/getpages", name="getpages", options={"expose":true}),
     */
    public function getPages(PageManager $pm)
    {
        $pages = $pm->getPages();
 		return $this->json($pages);
    }

    /**
     * @Route("/page/{id}", name="getpage")
     */
    public function getPage(Page $page)
    {
        return $this->render('page/page.html.twig', [
            'page' => $page,
        ]);
    }


}
