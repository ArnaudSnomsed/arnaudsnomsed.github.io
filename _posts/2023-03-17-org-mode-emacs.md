---
title: 'Montage NFS entre OpenBSD et Linux'
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

# Objectifs

Il y a quelques mois j'ai fait le constat que la prise de note était
un pivot très important pour structurer ses idées, préparer des
réunions, envoyer differents mails (et les relances qui vont avec) ou
même regrouper certaines actions (par exemple : en fonction de
l'interlocuteur, du lieu, du temps ou de la concentration
nécessaire). Cette idée me fait penser à mon passé de developpeur où
toute l'intelligence était contenu dans quelques fichiers qui vivaient
tous les jours. J'étais alors décidé à trouver une solution à ma prise
de notes avec plusieurs contraintes :

- Utiliser les mêmes outils dans ma vie pro et perso
- Reposer sur un format standard (en mode texte, structuré, supportant les tableaux)
- Pouvoir exporter au format HTML et docx

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

# La gestion des taches

Une action sous Org-mode se caracterise par :
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

Quelques raccourcis clavier :

- Modification des priorités : <kbd>S</kbd>-up et S-down
- Planification (schedule ou deadline) : C-c C-s ou C-c C-d
- Cocher ou décocher une checkbox : C-c C-c
- Ajouter un tag à une tache : C-c C-c
- Changer l'état d'une tache (par exemple de TODO à DONE) : S-left ou S-right
- Nouvelle tache : C-S <RET>


## La vue sous forme d'agenda

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
  Perso:      23:00...... Scheduled:  TODO Test                                                                              :perso:rdv::
```
