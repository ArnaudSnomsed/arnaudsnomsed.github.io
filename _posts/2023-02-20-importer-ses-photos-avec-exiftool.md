---
title: 'Importer ses photos avec Exiftool'
author: arnaudsnomsed
image: /assets/exiftool.png
layout: post
categories:
    - Photographie
    - Informatique
---

Ci-dessous une commande permettant d'importer les photos d'un appareil
connecté en MTP.

Note : le chemin /home/arnaud/photos est à remplacer par ce que vous
souhaitez. Par exemple un espace chiffré et synchronisé pour être
sauvegardé.

```
nice exiftool -progress -v -r -ext PEF -ext DNG \
  '-Directory</home/arnaud/photos/${model;}/${datetimeoriginal}' \
  -d "%Y/%Y-%m-%d" \
  "/run/user/1000/gvfs/mtp:host=RICOH_IMAGING_COMPANY__LTD._PENTAX_K-3_Mark_III_8085888/SD1/DCIM"

```

Les répertoires auront alors une structure du type :

```
.
├── PENTAX K-3 Mark III
│   └── 2023
│       ├── 2023-01-03
│       │   ├── IMGP1643.DNG
│       │   ├── IMGP1644.DNG
│       ├── 2023-01-06
│       │   ├── IMGP1645.DNG


```

Pour les vidéos (par élminination des extensions dng, pp3, jpg, mp3)
on peut utiliser la commande suivante :

```

exiftool -progress -q -q -r --ext dng --ext pef --ext pp3 --ext xmp \
	--ext jpg --ext mp3 -ext '*' -d /dst/Videos/%Y/%m/%%f-%H%M.%%e \
	'-filename<filemodifydate' '-filename<createdate' \
	'-filename<datetimeoriginal' "/src/"

```
