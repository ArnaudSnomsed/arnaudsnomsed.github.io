---
title: 'Taskjuggler dans Org-mode'
image: /assets/ox-taskjuggler.png
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

J'ai découvert récemment l'outil taskjuggler qui est une sorte de
calculatrice pour construire des plannings et allouer des ressources
sur les projets. Il n'existe plus d'interface graphique pour éditer le
projet (avec les taches, les dépendances, les charges, les ressources
associées). Cependant, on peut faire encore plus rapide grâce à
Emacs. Le fichier ox-taskjuggler.el permet de convertir une
arborescence Org-mode dans le format taskjuggler. Cela à deux
avantages :

- On peut editer rapidement toutes les propriétés du projet
  (dépendances, charges, ressources associées) grace au mode colonne
  de org-mode dans Emacs
- On peut générer le Gantt directement dans le fichier Org sans
  quitter Emacs via quelques lignes de lisp avec Babel

<center>
<p><img src="/assets/ox-taskjuggler.png"/></p>
</center>
   
# Installation

## Installation de TJ3

Sous Windows, après avoir installé Ruby (par exemple via [https://rubyinstaller.org/](https://rubyinstaller.org/)) :

```
> gem install taskjuggler
```

<!-- more -->

Sous Linux :

```
$ sudo apt install tj3
```


## Installation de ox-taskjuggler

Télécharger l'archive org-contrib-0.X.X.tar depuis [https://elpa.nongnu.org/nongnu/org-contrib.html](https://elpa.nongnu.org/nongnu/org-contrib.html)

Extraire le fichier ox-taskjuggler.el et éventuellement le patcher en
utilisant [ce
patch](https://github.com/ArnaudSnomsed/arnaudsnomsed.github.io/blob/master/assets/ox-taskjuggler.el.patch)

Placer le fichier ox-taskjuggler.el dans un repertoire de façon à le
charger dans le .emacs :

```
(load-file "C:/Users/Arnaud/notes/ox-taskjuggler.el")

```

# Création d'un projet org

Créer un fichier [Demo.org](/assets/Demo.org) avec le contenu indiqué dans
[https://orgmode.org/worg/org-tutorials/org-taskjuggler.html](https://orgmode.org/worg/org-tutorials/org-taskjuggler.html)

# Configuration des rapports

Ce qui n'est pas expliqué dans le lien précédent c'est que le tag
taskjuggler_report peut être appliqué pour intégrer des rapports personnalisés dans le fichier Tjp que nous allons générer :

```
* Report                                                 :taskjuggler_report:
** Plan
      :PROPERTIES:
      :loadunit: days
      :formats: html
      :columns: bsi, name, resources, start, end, effort, complete, chart { width 1000 }
      :hidetask: treelevel() > 4
      :END:

** Plan2
      :PROPERTIES:
      :loadunit: days
      :formats: csv
      :timeformat: "%b"
      :start: 2023-3-2
      :end: 2024-2-1
      :columns: name, resources, complete, monthly
      :hidetask: treelevel() > 4
      :END:

** Resource
      :PROPERTIES:
      :REPORT_KIND: resourcereport
      :loadunit: days
      :formats: csv
      :columns: name, effort, monthly
      :timeformat: "%b"
      :start: 2023-3-2
      :end: 2023-12-31
      :hidetask:  ~isleaf() 
      :END:
```

# Generation manuelle des rapports

Après avoir créé le fichier [Demo.org](/assets/Demo.org) avec les tags
(on ajoute un tag en se placant sur l'entrée et avec les raccourcis
C-c C-c) :taskjuggler_report:,
:taskjuggler_resource:, :taskjuggler_project:

- Générer le fichier tjp depuis emacs via :

```
M-x org-taskjuggler-export
```

- Générer les rappots (csv ou html) via la commande shell :

```
$ tj3 Demo.tjp
```

Résultat (en html) :

![](/assets/ox-taskjuggler-html.png)

# Edition en mode colonne

On peut éditer chaque attribut de chaque tâche du projet dans le mode
"column view" de Org-mode (raccourci C-c C-x C-c)

<center>
<p><img src="/assets/ox-taskjuggler-col.png"/></p>
</center>


# Génération des rapports dans Org-mode avec Babel

Dans fichier Org contenant le projet (Demo.org dans notre exemple) il
est possible d'ajouter ce code pour générer automatiquement un tableau
Org-mode avec le contenu du rapport CSV taskjuggler :

```
#+begin_src elisp :var file="Demo.csv" :results raw
  (defun csv-to-table (file)
    (with-temp-buffer
      (erase-buffer)
      (insert-file file)
      (org-table-convert-region (point-min) (point-max) ";")
      (while (re-search-forward "\"\"" nil t)
        (replace-match ""))
      (buffer-string)))
  (org-taskjuggler-export)
  (call-process-shell-command
   "tj3 Demo.tjp"
   nil "*Shell Command Output*" t
   )
  (csv-to-table file)
#+end_src
#+RESULTS:
```

Pour éviter les questions intempestives lors de la génération du
résultat (avec le raccourci C-c C-c en se positionnant sur le code
lisp) et pour augmenter la durée par défaut d'un projet ajouter dans
le .emacs :

```
(setq org-confirm-babel-evaluate nil)
(setq org-taskjuggler-default-project-duration 600)

```


# Démonstration

- Edition de l'effort et des allocations de ressources en column view avec le raccourci C-c C-x C-c
- Mise à jour du resultat en se positionnant sur le code lisp (cf
  chapitre précédent) et avec le raccourci C-c C-c


<center>
<p><img src="/assets/ox-taskjuggler.gif"/></p>
</center>



# Pour aller plus loin

Pour plus de précisions sur les personnalisations :
[https://orgmode.org/worg/exporters/taskjuggler/ox-taskjuggler.html](https://orgmode.org/worg/exporters/taskjuggler/ox-taskjuggler.html)
