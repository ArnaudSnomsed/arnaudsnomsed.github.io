---
title: 'Transformer des slides en GIF'
author: arnaudsnomsed
image: /assets/tty.png
layout: post
categories:
    - Informatique
---

Petit pense bête pour générer un GIF a partir de "slides" au format Markdown

![](/assets/tty.gif)

Pour convertir ensuite le gif en vidéo :

```

ffmpeg -i tty.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" tty.mp4

```

Pour lire les slides (sans générer de gif) :

```
sudo apt install curl
sudo snap install slides
curl https://raw.githubusercontent.com/ArnaudSnomsed/arnaudsnomsed.github.io/master/Ttygif.md\
	| /snap/bin/slides

```

[Voir le fichier Markdown](https://raw.githubusercontent.com/ArnaudSnomsed/arnaudsnomsed.github.io/master/Ttygif.md)
