---
title: 'Taskjuggler dans Org-mode'
image: /assets/ox-taskjuggler.png
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

![](/assets/ox-taskjuggler.png)

   
# Installation

## TJ3

Sous Windows, après avoir installé Ruby (par exemple via [https://rubyinstaller.org/](https://rubyinstaller.org/) :

```
gem install taskjuggler
```

<!-- more -->

Sous Linux :

```
sudo apt install tj3
```


## ox-taskjuggler

[https://elpa.nongnu.org/nongnu/org-contrib.html](https://elpa.nongnu.org/nongnu/org-contrib.html)

J'ai également patché le fichier en utilisant [ce patch](https://github.com/ArnaudSnomsed/arnaudsnomsed.github.io/blob/master/assets/ox-taskjuggler.el.patch)

puis dans .emacs :

```
(load-file "C:/Users/adesmons/notes/ox-taskjuggler.el")

```

# Création d'un projet org

Comme indiqué dans [https://orgmode.org/worg/org-tutorials/org-taskjuggler.html](https://orgmode.org/worg/org-tutorials/org-taskjuggler.html)

Le fichier Demo.org utilisé ci-après est disponible [ici](/assets/Demo.org)

# Configuration des rapports

Ce qui n'est pas expliqué dans le lien précédent c'est le tag
taskjuggler_report :

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
      :start: 2023-1-2
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
      :start: 2023-1-2
      :end: 2023-12-31
      :hidetask:  ~isleaf() 
      :END:
```

# Generation manuelle des rapports

- Après avoir créé un fichier avec 3 tags (C-c C-c) :
  - taskjuggler_report
  - taskjuggler_resource
  - taskjuggler_project
- Générer le fichier tjp via : M-x org-taskjuggler-export
- Générer les rappots (csv ou html) via : tj3 Demo.tjp
- Capture d'écran du Gantt et de l'allocation des ressources HTML

# Edition en mode colonne

# Génération des rapports dans Org-mode avec Babel

dans .emacs :

```
(setq org-confirm-babel-evaluate nil)

```

Dans fichier Org contenant l'exemple (Demo.org) :
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
  (shell-command "c:/Ruby32-x64/bin/tj3 Demo.tjp")
  (csv-to-table file)
#+end_src
#+RESULTS:
```

# Demonstration

- Edition de l'effort et des dates de fin en column view avec C-c C-x C-c
- Mise à jour du resultat avec C-c C-c

![](/assets/ox-taskjuggler.gif)

# Pour aller plus loin

Pour plus de précisions sur les personnalisations :
[https://orgmode.org/worg/exporters/taskjuggler/ox-taskjuggler.html](https://orgmode.org/worg/exporters/taskjuggler/ox-taskjuggler.html)
