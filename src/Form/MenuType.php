<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class MenuType extends AbstractType
{
	public function getParent()
	{
		return TextareaType::class;
	}

}
