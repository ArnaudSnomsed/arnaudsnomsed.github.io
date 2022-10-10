---
id: 8
title: 'Faire le ménage dans ses paquets'
date: '2006-02-04T15:27:51+01:00'
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

La commande suivante permet de trier par taille les RPMs installés :  
`rpm -qa --queryformat "%{size} %{name}\n" | sort -n`