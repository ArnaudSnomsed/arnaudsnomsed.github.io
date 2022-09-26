---
id: 34
title: 'Désactiver PHP chez free'
date: '2006-04-05T19:24:49+02:00'
author: arnaud.desmons
layout: post
categories:
    - Informatique
---

![](http://linuxfr.org/images/section/PHP.png)J’avais des fichiers php dont je souhaitais mettre les sources sur mon site free. Pour qu’ils ne se retrouvent pas executé voila le script que j’ai mis en place :

```

header("Content-Type: text/plain");

if (ereg("/cat.php/vultureng/(.*)",
    urldecode($_SERVER['REQUEST_URI']), $regs)) {
        if (substr(realpath("vultureng/".$regs[1]), 0,
              strlen(realpath('vultureng'))) == realpath('vultureng')) {
            readfile("vultureng/".$regs[1]);
        }
 }
```

Cela permet d’afficher tous les fichiers dans le repertoire ./vultureng relativement au fichier cat.php qui contient le code ci-dessus via l’url /cat.php/vultureng/mon\_fichier.php.