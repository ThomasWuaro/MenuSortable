<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Page;

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
    public function getPages()
    {
    	$em = $this->getDoctrine()->getManager();
    	$pages = $em->getRepository(Page::class)->findAll();
    	$parsed = [];
 		foreach($pages as $page){
 			$parsed[$page->getId()] = $page->getTitle();
 		}

 		return $this->json($parsed);
    }
}
