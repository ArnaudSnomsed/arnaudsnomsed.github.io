---
title: 'Importer ses photos avec Exiftool'
author: arnaudsnomsed
image: /assets/exiftool.png
layout: post
categories:
    - Photographie
    - Informatique
---

Ci-dessous un script permettant d'importer les photos depuis une carte
SD montée en H: vers E: grace au programme Exiftool.


```
#!/bin/sh

cd /e/
./exiftool -progress -v -r -ext PEF -ext DNG \
    '-Directory</Archives2023/Photos/Pentax/${model;}/${datetimeoriginal}' \
    -d "%Y/%Y-%m-%d" "/h/DCIM"
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
