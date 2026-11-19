---
author: arnaudsnomsed
layout: post
title: Diff dans git sur des fichiers GPG
date: 2023-11-26T11:00:00.000Z
categories:
  - Informatique
---

Pour voir des diff sur des fichiers chiffrés avec GPG, par exemple dans Magit, utiliser les commandes suivantes
dans le répertoire du projet :

```
git config --global diff.gpg.textconv "C:/XXXXXX/GnuPG/bin/gpg.exe --no-tty --decrypt"
echo "*.gpg filter=gpg diff=gpg" >> .gitattributes
```

On peut alors voir directement via git le résulat d'un diff. Comme par exemple ici, avec un diff sur les 2 derniers jours :

```
git diff HEAD 'HEAD@{2 days ago}' -- 
```
