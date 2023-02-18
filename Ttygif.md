---
created: 2022-12-11T10:23:05+01:00
modified: 2023-01-07T11:02:23+01:00
---

```
███████╗██╗     ██╗██████╗ ███████╗███████╗  ██╗      ██████╗ ██╗███████╗
██╔════╝██║     ██║██╔══██╗██╔════╝██╔════╝  ╚██╗    ██╔════╝ ██║██╔════╝
███████╗██║     ██║██║  ██║█████╗  ███████╗   ╚██╗   ██║  ███╗██║█████╗  
╚════██║██║     ██║██║  ██║██╔══╝  ╚════██║   ██╔╝   ██║   ██║██║██╔══╝  
███████║███████╗██║██████╔╝███████╗███████║  ██╔╝    ╚██████╔╝██║██║     
╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝╚══════╝  ╚═╝      ╚═════╝ ╚═╝╚═╝     
```

---

# Transformer des slides Markdown en gif

## Pré-requis

```
$ sudo apt install ttyrec ttygif
$ sudo snap install slides
```

---

# Transformer des slides Markdown en gif

## Commandes

Commandes à saisir dans un terminal X (avec par exemple une taille de
police de 11 dans mon cas) :

```
$ ttyrec -e 'slides demo.md'
$ ttygif ttyrecord

(...)

exit
Creating Animated GIF ... this can take a while
Created: tty.gif in the current directory!


```
