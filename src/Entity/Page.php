<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PageRepository")
 */
class Page
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $css;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $assets;

    /**
     * @ORM\Column(type="boolean")
     */
    private $frontpage = false;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $simple;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $contact;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $position;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCss(): ?string
    {
        return $this->css;
    }

    public function setCss(?string $css): self
    {
        $this->css = $css;

        return $this;
    }

    public function getAssets(): ?string
    {
        return $this->assets;
    }

    public function setAssets(?string $assets): self
    {
        $this->assets = $assets;

        return $this;
    }

    public function getFrontpage(): ?bool
    {
        return $this->frontpage;
    }

    public function setFrontpage(bool $frontpage): self
    {
        $this->frontpage = $frontpage;

        return $this;
    }

    public function getSimple(): ?bool
    {
        return $this->simple;
    }

    public function setSimple(?bool $simple): self
    {
        $this->simple = $simple;

        return $this;
    }

    public function getContact(): ?bool
    {
        return $this->contact;
    }

    public function setContact(?bool $contact): self
    {
        $this->contact = $contact;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(?int $position): self
    {
        $this->position = $position;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }
}
