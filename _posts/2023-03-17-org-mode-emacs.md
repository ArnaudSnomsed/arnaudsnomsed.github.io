---
title: 'Un second cerveau avec Org-mode'
image: /assets/orgmode.png
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

![](/assets/orgmode.png)

Il y a quelques mois j'ai fait le constat que la prise de notes était
un pivot très important pour structurer ses idées, préparer des
réunions, envoyer différents mails (et les relances qui vont avec) ou
même regrouper certaines actions (par exemple : en fonction de
l'interlocuteur, du lieu, du temps ou de la concentration
nécessaire). Cette idée me fait penser à mon passé de développeur où
toute l'intelligence était contenue dans quelques fichiers qui vivaient
tous les jours. J'étais alors décidé à trouver une solution à ma prise
de notes avec plusieurs contraintes :

- Utiliser les mêmes outils dans ma vie pro et perso
- Reposer sur un format standard (en mode texte, structuré, supportant les tableaux)
- Pouvoir exporter au format HTML et docx

<!-- more -->
J'ai alors commencé à utiliser le format Markdown avec un éditeur de
texte que je connais bien en tant qu'ancien développeur : Emacs.

J'ai alors utilisé les différents niveaux de chapitres, les listes,
les checkbox, les tableaux et l'outil pandoc pour exporter tout ça en
HTML en docx et j'ai aussi remonté mon blog au format Markdown grace à
Jekyll.

J'utilisais le org-mode dans Emacs pour éditer au format Markdown et
notamment mettre en forme des tableaux.

Curieux du org-mode d'Emacs j'ai alors découvert que le format Org
était assez similaire au format Markdown et permettait des calculs sur
les tableaux et permettait de planifier et archiver des taches ce qui
est très pratique pour garder un historique au travail également.



# Les calculs sur les tableaux

On peut créer un tableau simplement en écrivant quelque chose qui ressemble à ça puis en appuyant sur Tab :

```
| Test | Colonne | Total
|--

```

On peut ensuite ajouter une formule de calcul sous le tableau comme ceci :

```
| Test | Colonne | Total |
|------+---------+-------|
|      |         |       |
#+TBLFM: $3=vsum($1..$2)

```

On peut alors mettre à jour les sommes en ligne via C-c *

```
| Test | Colonne | Total |
|------+---------+-------|
|    2 |       3 | 5     |
#+TBLFM: $3=vsum($1..$2)
```

On peut aussi faire la somme d'une colonne en se positionnant en bas
de la colonne via C-c + (puis C-y pour coller le résultat dans certaines
configuration Emacs) :

```
| Test | Colonne | Total |
|------+---------+-------|
|    2 |       3 |     5 |
|    2 |         |       |
|    4 |         |       |
#+TBLFM: $3=vsum($1..$2)

```


# La gestion des taches

Une action sous Org-mode se caractérise par :
- Un ou plusieurs signes "*" au début de la ligne
- Optionnel : Le mot clé TODO ou DONE (on peut aussi selectionner d'autres
  mots clés en ajoutant une ligne #+TODO: TODO WAITING DONE dans le document Org)
- Optionnel : une date de planification

Exemple 1 : une action planifiée pour une date donnée avec une
progression entre crochets qui se met à jour automatiquement (note: on
 mettre un signe "/" ou "%" entre crochet au départ et la mise à jour
automatique se fera en nombre ou en %)

```
* TODO Ecrire un article [/]
  SCHEDULED: <2023-03-15 mer.>

- [ ] Ecrire le chapitre 1
- [ ] Ecrire le chapitre 2

```
Exemple 2 : un RDV

```
* TODO RDV
  SCHEDULED: <2023-03-15 mer. 15:00-16:00>

```

Exemple 3 : une écheance avec une priorité ([#A]) et un tag (:perso)
qui nous serviront dans la vue agenda dans la chapitre suivant

```
* TODO [#A] RDV                                                       :perso:
  DEADLINE: <2023-03-15 mer.>

```

Quelques raccourcis clavier possible quand on est positionné sur un chapitre :

- Modification des priorités : <kbd>S</kbd>-up et S-down
- Planification (schedule ou deadline) : C-c C-s ou C-c C-d
- Cocher ou décocher une checkbox : C-c C-c
- Ajouter un tag à une tache : C-c C-c
- Changer l'état d'une tache (par exemple de TODO à DONE) : S-left ou S-right
- Nouvelle tache : C-S <RET>
- Archiver (il ira alors dans un fichier .org_archive) : C-c C-x C-a
- Déplier ou replier : Tab ou S-Tab


A propos du dernier raccourci, on peut ajouter la ligne suivante dans
le fichier Org pour que les chapitres soient tous repliés à
l'ouverture :

```
#+STARTUP: overview
```

# La vue sous forme d'agenda

Ouvrez avec Emacs un fichier Org contenant les exemples précédents
puis ajoutez ce fichier dans l'agenda via le raccourci : C-c [

Cela ajoutera la configuration suivante dans votre fichier .emacs :

```
 '(org-agenda-files '("c:/Users/demo/notes/Demo.org"))
```

Tapez maintenant M-x org-agenda et vous verrez alors un buffer qui ressemble à ça :

```
Week-agenda (W11):
Monday     13 March 2023 W11
              18:00...... ----------------
              20:00...... ----------------
              22:21...... now - - - - - - - - - - - - - - - - - - - - - - - - -
              23:00...... ----------------
  Blog:       Deadline:   TODO [#A] RDV                             :perso:
  Blog:       Scheduled:  TODO Ecrire un article [/]

```

De façon à identifier plus facilement les actions non planifiées via
la commande "M-x org-agenda t" j'ai ajouté cette ligne dans mon .emacs
pour exclure de la liste les actions avec une date :

```
 '(org-agenda-todo-ignore-with-date t)
```

# Pour mettre ses idées sur le papier

L'utilisation d'un éditeur de texte permet de se concentrer davantage
sur le fond de structurer ses idées par itérations comme si on
sculptait. La mise en forme ne vient alors qu'au moment de la
transformation soit en action (mail, réunion, etc) soit en document
par exemple avec le .bat suivant qui transforme en docx tous les
fichiers org du répertoire.  (le repertoire "src" contient les images
etc et la commande start lance Word) :

```
for %%X in (*.org) do (
  cd src
  pandoc.exe -o ../%%~nX.docx -f org -t docx -M "toc-title: Table des matières" --file-scope --reference-doc template.docx ../%%X
  start /w ../%%~nX.docx
  cd ..
)

```

Le fichier template.docx ci-dessus (dans le répertoire src) est un
document ayant été généré une première fois par Pandoc puis
personnalisé pour correspondre par exemple au template de
l'entreprise.


Personnellement quand je rédige mes documents j'écris les noms des
chapitres et sous chapitres et j'écris les idées principales en
commentaires dans les différentes sections comme ceci :

```
* Test
** Sous chapitre
# - Idée n°1
# - Idée n°2

Ici le texte décrivant les idées 1 et 2

```



Cette façon de faire permet de toujours avoir un résultat propre
exportable à n'importe quel moment de la construction d'un document On
peut même utiliser le mot clé COMMENT sur certains chapitres. On peut
aussi utiliser la ligne #+OPTIONS: todo:nil au debut du document pour
ne pas exporter les actions liés au document :

```
* TODO Finir la rédaction des chapitres de cet article [1/2]
  DEADLINE: <2023-03-15 mer.>

** DONE Chapitre 1
** TODO Chapitre 2

* COMMENT Chapitre pour plus tard
Ici un chapitre qui ne sera pas exporté par pandoc.

```


On peut aussi relier des chapitres via des liens comme ceci :

```
[[file:c:/Users/xxxxxx/Book.org::*La conclusion][# La conclusion]]
```

Il faut ajouter la configuration suivante à son .emacs pour que les
liens ne soient pas "rendus" et soient ainsi éditables :

```
(setq org-descriptive-links nil)

```

# Pour aller plus loin

J'utilise l'application mobile Gitjournal qui permet de synchroniser
mes notes avec un repository Git et de les avoir toujours sur moi.

Une bonne pratique que j'ai mis en place consiste à créer un fichier
Inbox.org dans lequel je mets en vrac une idée dès qu'elle me vient (y
compris via Gitjournal). Je fais ensuite régulièrement du classement
de cette inbox vers mes différents fichiers Org et chapitres avec une
date quand il s'agit d'une action.

J'utilise également [agenda-html](https://github.com/dantecatalfamo/agenda-html) qui permet d'exporter sous forme HTML
mon agenda personnel via la commande suivante dans une crontab :

```
*/5 * * * * screen -d -m emacs -Q -nw -l /home/xxxxx/agenda-html/agenda-html.el --eval '(kill-emacs)'
```

Il faut aussi parfois mettre ces lignes à la fin du fichier Org de
façon à ce que Emacs le recharge automatiquement quand il a été mis à
jour par exemple par un git pull en dehors d'Emacs :

```
# Local Variables:
# eval: (auto-revert-mode)
# End:
```

Voici enfin quelques liens qui m'ont été utiles :

- [https://alphaalgorithms.github.io/2019/05/17/emacs-agenda-views/](https://alphaalgorithms.github.io/2019/05/17/emacs-agenda-views/)
- [https://orgmode.org/worg/org-tutorials/org4beginners.html](https://orgmode.org/worg/org-tutorials/org4beginners.html)
- [http://cachestocaches.com/2016/9/my-workflow-org-agenda/](http://cachestocaches.com/2016/9/my-workflow-org-agenda/)
