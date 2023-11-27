---
title: 'Diff sur des fichiers GPG'
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

Pour voir des diff sur des fichiers chiffrés avec GPG, par exemple dans Magit, utiliser les commandes suivantes
dans le répertoire du projet :


```
git config --global diff.gpg.textconv "C:/XXXXXX/GnuPG/bin/gpg.exe --no-tty --decrypt"
echo "*.gpg filter=gpg diff=gpg" >> .gitattributes
echo "*.asc filter=gpg diff=gpg" >> .gitattributes
```

On peut alors voir directement via git le résulat d'un diff (avec une version d'il y a 2 semaines dans l'exemple) :

```
git diff HEAD 'HEAD@{2 days ago}' -- 
```
