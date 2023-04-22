---
title: 'Chiffrement transparent des notes Org mode avec EasyPG'
image: /assets/epa.png
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

Pour chiffrer de façon transparent vos notes org-mode dans emacs, ajoutez ceci dans votre fichier .emacs pour charger EasyPG Assitant qui inclus par défaut dans les dernières version d'emacs et y compris sous Windows :

```
(require 'epa-file)
(epa-file-enable)
```

Il faut ensuite nommer la note avec l'extension :

.org.gpg

et selectionner une première fois la (ou les) clé(s) de chiffrement en
les cochant avec la touche m après avoir saisi la commande suivante :

M-x epa-file-select-keys


