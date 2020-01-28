<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Controller\EasyAdminController;
use App\Entity\Menu;
use App\Service\PageManager;

class MenuController extends EasyAdminController
{	
	private $pm;
	private $pages;

	public function __construct(PageManager $pm)
	{
		$this->pm = $pm;
	}

    /**
     * @Route("/menu", name="menu")
     */
    public function index()
    {
        return $this->render('menu/index.html.twig', [
            'controller_name' => 'MenuController',
        ]);
    }

    public function displayMenu($slug)
    {	
    	$em = $this->getDoctrine()->getManager();
    	$menu = $em->getRepository(Menu::class)->findBySlug($slug);
    	dump($menu);
    	$list = json_decode($menu[0]->getList(), true);
    	$this->pages = $this->pm->getPages();

    	$menuParsed = [];
    	foreach($list as $item){
    		$newItem = $this->createItem($item);
    		if(!$newItem) continue;
    		elseif(isset($item['children'])){
    			foreach($item['children'] as $child){
    				$newChildItem = $this->createItem($child);
    				if($newChildItem) $newItem['children'][] = $newChildItem;
    			}
    		}
    		$menuParsed[] = $newItem;
    	}

    	return $this->render('menu/menu.html.twig', [
            'menu' => $menuParsed,
        ]);
    }

    private function createItem($item)
    {	
    	if(!$item['custom']){
    		if(!array_key_exists($item['id'], $this->pages)) return false;
    		$item['href'] = $this->generateUrl('getpage', [
    			'id' => $item['page']
    		]);
    	}

    	$parsed = [
    		'name' => $item['name'],
    		'href' => $item['href'],
    		'tab' => $item['tab'],
    		'children' => null
    	];

    	return $parsed;
    }
}
