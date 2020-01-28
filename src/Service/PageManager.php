<?php

namespace App\Service;

use App\Entity\Page;
use App\Repository\PageRepository;

class PageManager 
{	
	private $pageRepository;

	public function __construct(PageRepository $pageRepository) 
	{
		$this->pageRepository = $pageRepository;
	}

	public function getPages()
	{
    	$pages = $this->pageRepository->findAll();
    	$parsed = [];
 		foreach($pages as $page) {
 			$parsed[$page->getId()] = $page->getTitle();
 		}
 		return $parsed;
	}

}