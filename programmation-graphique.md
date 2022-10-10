---
id: 47
title: 'Programmation graphique'
date: '2006-05-06T05:46:16+02:00'
author: arnaudsnomsed
layout: default

---

Les exemples de ce tutorial doivent être compilés avec Djgpp, le portage DOS du célèbre GCC (GNU C Compilateur) de la Free Software Foundation.

*« Ce tutorial me donne le gout d’apprendre la programmation graphique. (…) merci pour vos initiatives dans l’elargissement de la communaute des programmeurs. Personnellement, je vous dois déjà beaucoup. »*  
— Auguste REGIS, Canada

###  Sommaire 

VGA

- [ Modes graphiques](#modes)
- [ Palette de couleur](#pallet)
- [ Double buffering](#buffering)
- [ Texte en mode graphique](#text)

Primitives

- [ Pixel](#pixel)
- [ Ligne](#line)
- [ Cercle](#circle)

Transformations

- [ Projection perspective](#projection)
- [ Rotation](#rotation)

Remplissage

- [ Remplir un polygone convexe](#fill)
- [ Projection de texture](#texture)
- [ Determiner les faces cachées](#zsort)

[ BMP](#bmp)

Effets

- [ Bump mapping](#bump)
- [ Feu](#fire)

[ Liens](#links)

###  VGA 

<a name="modes"></a>

####  Modes graphiques

VGA (Video Graphics Array) est la carte sur laquelle est connecté l’écran.  
Elle gère un grand nombre de mode graphique ainsi qu’un mode texte (0x03) :  
– 0x04h 320x200x4  
– 0x05h 320x200x4

– 0x06h 640x200x4  
– 0x0Dh 320x200x16  
– 0x0Eh 640x200x16  
– 0x0Fh 640×350 MONO   
– 0x10h 640x350x16  
– 0x11h 640×480 MONO  
– 0x12h 640x480x16  
– 0x13h 320x200x256

Pour accéder à des résolution supérieures il faut utiliser les modes SVGA ou VESA qui ne font pas encore l’objet de ce tutorial. Les exemples de ce tutorial utilisent le mode 13h. Pour indiquer le mode auquel on souhaite accéder on l’inscrit dans un registre (zone memoire du microprocesseur) dans notre cas 13h puis par l’interruption 10h du BIOS, qui lit alors la valeur du registre par l’intermediaire de son adresse (&amp;regs), on accède au mode.

```

void set_video_mode(int mode)
{
  union REGS regs;
  regs.x.ax = mode;
  int86(0x10, &regs, &regs);
}
```

<a name="pallet"></a>

####  Palette de couleur 

[palette.zip](/assets/palette.zip)

VGA permet d’afficher 63^3 = 220000 couleurs, mais un nombre limité de couleurs en simultané qui dépend de la résolution couleur du mode ou bpp (bits per pixel), il est de 256 (8bpp) pour le mode 13h. Cela signifie que vous stockez 256 couleurs (16bits) différentes que votre image utilisera dans une zone de mémoire correspondant à la palette, et vous accédez à l’écran comme un tableau. Mais au lieu de spécifier la couleur du pixel dans la table, vous y placez l’index. La valeur va de 0 à 255, chacun se referant à une couleur de la palette. Cela permet d’utiliser toutes les couleurs de la carte dans un mode 8 bits au depend du nombre de couleurs simultanees.

```

set_palette(unsigned char color, int red, int green, int blue)
{
  outp(0x03C8, color);
  outp(0x03C9, red);
  outp(0x03C9, green);
  outp(0x03C9, blue);
}
```

Les 3 intensités stockées dans la palette dans l’ordre R,V,B par le port d’entrée 0x0C9 forment une couleur identifiée par un unsigned char que l’on initialise par le port d’entrée 0x03C8.  
Si l’on appelle set\_palette(1, 0, 0, 0) on ecrira un pixel de couleur noir en appelant put\_pixel(screen, x, y, 1) car la couleur d’intensité 0, 0, 0 est indexée en 1.  
<a name="buffering"></a>

####  Double buffering 

Quand l’affichage semble clignoter, il s’agit d’un décalage entre le transfert vers la memoire video d’une image et son affichage par le canon à électrons. Prenons l’exemple d’un canon à électrons qui affiche une image issue d’une animation. Arrivé à la moitié de son chemin, une autre image arrive vers la mémoire video. Le canon à électrons qui a donc déjà dessiné la moitié de la première image dessine alors la deuxième moitié avec la nouvelle image qui vient d’arriver et qui souvent ne colle pas avec la précédente. La solution est un tableau buffer qui recoit l’image prête en attendant son affichage, on synchronise alors le transfere du buffer vers l’écran avec le canon à electron.

```

void vsync(unsigned char *buffer)
{
/* attend le signal de frequence du canon à electron*/
  while (!(inportb(0x3da) & 8))
    ;
  /* transfere le contenu du buffer vers l'ecran */
  memcpy((char *)screen,(char *)buffer,64000);
}
```

<a name="text"></a>

#### Texte en mode graphique

[texte.zip](/assets/texte.zip)

Il existe une police de caractere stockée en ROM à l’adresse 0xffa6e, c’est un tableau qui contient une série de caractères de résolution 8×8 bits. On obtient donc un caractère en multipliant sa valeur ASCII par 8; on ajoute alors cette valeur au pointeur initialisé à 0xffa6e. On transfère ensuite, vers l’ecran, la portion 8×8 qui débute la où est notre pointeur.

```

void text(unsigned char *buffer,char *string,int x,int y,unsigned char color)
{
  int index, int offset, x2, y2;
  char *work_char;
  unsigned char bit_mask = 0x80;
  
  for(index=0; string[index] != 0; index++)
  {
    work_char = rom_char_set + string[index] * 8;
    offset=(y > 1);
      }
      offset+=320;work_char++;
    }
  }
}

```

###  Primitives 

<a name="pixel"></a>

####  Pixel 

[pixel.zip](/assets/pixel.zip)

On allume un pixel en envoyantl’indice de sa couleur aux coordonnées souhaitées vers lamemoire de l’ecran, representé par un pointeur à l’adresse0xa0000. En mode 13h elle represente 320\*200 octets soit 64 Ko etest lineaire (bitmap). L’ordre d’affichage des pixel commence en haut agauche, puis arrivé en bout de ligne on recommence à la lignesuivante, etc. Le calcul de la position en 2 dimensions est : 320 \* y+ x

```
void put_pixel(unsigned char *buffer,int x,int y,unsigned char color)
{
  buffer[(y << 8)+(y << 6)+x] = color;
}

```
<p>
<a name="line"></a></p>

#### Ligne

[ligne.zip](/assets/ligne.zip)

On écrit des pixels dans la direction de l'axe à plus forte
dénivellation en mettant à jour une variable qui est l'écart entre le
pente idéale et la pente tracée. Lorsque cette variable dépasse le
seuil à partir duquel il est plus exacte d'écrire un pixel suivant
l'autre axe on suit alors l'axe à plus faible dénivellation.

```
void ligne(unsigned char *bitmap, int x1,int y1, int x2,int y2, unsigned char color)
{
  int x,y,xinc,yinc,diff,i;
  int dx = abs(x2-x1);
  int dy = abs(y2-y1);

  if(x1<x2) xinc = 1;
  else	xinc = -1;

  if(y1<y2) yinc = 1;
  else	yinc = -1;

  x = x1;
  y = y1;

  if(dx>dy)
    {
      diff = dx/2;     
      for(i=0;i<dx;i++)
	{
	  x += xinc;
	  diff += dy;
	  if(diff>dx)
	    {
	      diff -= dx;
	      y += yinc;
	    }
	  put_pixel(bitmap,x,y,color);
	}
    }
  else
    {
      diff = dy/2;     
      for(i=0;i<dy;i++)
	{
	  y += yinc;
	  diff += dx;
	  if(diff>dy)
	    {
	      diff -= dy;
	      x += xinc;
	    }
	  put_pixel(bitmap,x,y,color);
	}
    }
}

```
<a name="circle"></a>

####  Cercle

[cercle.zip](/assets/cercle.zip)

La distance d'un point du cercle à son centre sera toujours égale au
rayon. Or en faisant varier x, qui est la distance en abscisse qui le
sépare du centre on peut trouver y, la distance en ordonnée, car
d'après Pythagore racine(rayon) = racine(x + y) donc y = racine(r^2 -
X^2).

Quand on dessine un cercle avec des carres, tels des pixels, on
remarque qu'il y a 8 axes de symetries il est donc suffisant de ne
calculer qu'un 8ème du cercle c'est à dire pour 0 <= x <= y.

```
void	circle(unsigned char *bitmap, int Ox, int Oy, int r, int color)
{
  int	X = 0;
  int	Y = r;

  r = r * r;
  while (X <= Y)
    {
      put_pixel(bitmap, Ox+X, Oy-Y, color);
      put_pixel(bitmap, Ox-X, Oy-Y, color);
      put_pixel(bitmap, Ox+X, Oy+Y, color);
      put_pixel(bitmap, Ox-X, Oy+Y, color);
      put_pixel(bitmap, Ox+Y, Oy-X, color);
      put_pixel(bitmap, Ox-Y, Oy-X, color);
      put_pixel(bitmap, Ox+Y, Oy+X, color);
      put_pixel(bitmap, Ox-Y, Oy+X, color);
      X++;
      Y = sqrt(r - ((double)X * X)) + 0.5;
    }
  }
```

### Transformations

<a name="projection"></a>

#### Projection perspective

<a href="/assets/projection.zip">projection.zip</a>

```

                     objet
                        ,'|
              écran  ,-'  |
                  ,-'     |x
               ,-'|       |
            ,-'   |x'    _|
      oeil,'______|_____|_|
              d       z

```

D'après le théorème de Thales, d / z = x' / x donc x' = dx / z. Idem pour y.

On utilise pour d la valeur 256 ce qui permet d'optimiser par un décalage binaire de 8. O.x et O.y sont les coordonnées de l'origine par rapport à l'écran.

```
void	projection(void)
{
  int	i;

  for(i = 0; i < 8; i++)
  {
    vertex2d[i].x = (vertex3d[i].x << 8) / (vertex3d[i].z + O.z) + O.x;
    vertex2d[i].y = (vertex3d[i].y << 8) / (vertex3d[i].z + O.z) + O.y;
  }
}
```

<a name="rotation"></a>

#### Rotation 

<p><a href="/assets/rotation.zip">rotation.zip</a></p>
<p align="justify">Soit un repère de l'espace (x,y,z), si l'on considère une rotation autour de l'axe x d'angle alpha dans le sens trigonometrique (inverse des aiguillesd'une montre), y(0,1,0) a pour image y'(0,cos(alpha),-sin(alpha)) et z(0,0,1): z'(0,sin(alpha),cos(alpha)), x restant invariant. cette transformation s'écrit analytiquement :</p>

```
x' = x
y' = y * cos(alpha) - z * sin(alpha)
z' = y * sin(alpha) + z * cos(alpha)
```

<p><img src="http://arnaud.desmons.free.fr/logarno/djgfxfr/rotation.jpg" style="float: right; margin: 1em"></p>
<p align="justify">Lorsque l'on désire effecuter une rotation autour de plusieurs axes successivement, les rotations dependent des précédentes. Si l'on fait subire respectivement une rotation autour de x, y puis z cela donne analytiquement:</p>

```
x' = x
y' = y * cos(alpha) - z * sin(alpha)
z' = y * sin(alpha) + z * cos(alpha)
x''= x' * cos(beta) + z' * sin(beta) 
y'' = y'
z'' = y' * -sin(beta) + z'cos(beta)
x'''= x'' * cos(gamma) + y'' * sin(gamma)
y''' = y'' * -sin(gamma) + y'' * cos(gamma)
z''' = z''
```

On obtient en combinant puis en factorisant :

```
x''' = x * a + y * b + z * c
y''' = x * d + y * e + z * f
z''' = x * g + y * h + z * i

```

On passe alors de 12 à 9 multiplications.
On obtient les coefficients a,b,c,d,e,f,g,h,i en multipliant entre elles les 3 matrices 3x3 de rotations autour de chaque axe.
A titre d'exemple la matrice 3x3 de rotation autour de l'axe x d'angle  alpha s'ecrit :


```
1	0			0
0	cos(alpha)	sin(alpha)
0	-sin(alpha)	cos(alpha)
```

On multiplie deux matrices comme ceci, ligne par colonne :

<table>
<tr>
<td>
<table border="1">
<tr>
<td>a</td>
<td>b</td>
</tr>
<tr>
<td>c</td>
<td>d</td>
</tr>
</table>
</td>
<td>*</td>
<td>
<table border="1">
<tr>
<td>e</td>
<td>f</td>
</tr>
<tr>
<td>g</td>
<td>h</td>
</tr>
</table>
</td>
<td>=</td>
<td>
<table border="1">
<tr>
<td>a * e + b * g</td>
<td>a * f + b * h</td>
</tr>
<tr>
<td>c * e+d * g</td>
<td>c * f + c * h</td>
</tr>
</table>
</td>
</tr>
</table>

Pour optimiser on précalcule sin et cos :

```

for(i = 0; i < 360;i ++)
{
  Sin[i]=sin(i*3.14/180);
  Cos[i]=cos(i*3.14/180);
}

```

On obtient une matrice de rotation globale 3*3 qui prend en charge les angles, alpha, beta, gamma, autour des axes respectifs, x, y, z :

```
matrix[0][0] = Cos[gamma]*Cos[beta];
matrix[1][0] = -Sin[gamma]*Cos[beta];
matrix[2][0] = -Sin[beta];
matrix[0][1] = Cos[gamma]*Sin[beta]*Sin[alpha]+Sin[gamma]*Cos[alpha];
matrix[1][1] = Sin[gamma]*Sin[beta]*-Sin[alpha]+Cos[alpha]*Cos[gamma];
matrix[2][1] = Sin[alpha]*Cos[beta];
matrix[0][2] = Cos[gamma]*Sin[beta]*Cos[alpha]-Sin[gamma]*Sin[alpha];
matrix[1][2] = -Sin[gamma]*Sin[beta]*Cos[alpha]-Cos[gamma]*Sin[alpha];
matrix[2][2] = Cos[alpha]*Cos[beta];

```

On applique la rotation en multipliant la matrice 3*3 de rotation par une matrice 1*3 contenant les coordonnés du point à transformer.


```
vertex3d[i].x = matrix[0][0] * vertex3d[i].x
                + matrix[1][0] * vertex3d[i].y
                + matrix[2][0] * vertex3d[i].z;
vertex3d[i].y = matrix[0][1] * vertex3d[i].x
                + matrix[1][1] * vertex3d[i].y
                + matrix[2][1] * vertex3d[i].z;
vertex3d[i].z = matrix[0][2] * vertex3d[i].x
                + matrix[1][2] * vertex3d[i].y
                + matrix[2][2] * vertex3d[i].z;
```

<p><a name="fill"></a></p>

#### Remplir un polygone convexe 

<p><a href="http://logarno.planet-d.net/djgfxfr/remplissage.zip">http://logarno.planet-d.net/djgfxfr/remplissage.zip</a></p>
<p>Lorsque l'on initialise les segments du polygone au lieu d'écrire directement les pixels on stocke la valeurde x qui est associée à y selon l'algorithme de tracé de ligne. Comme à une hauteur y il existe plusieurs valeurs de x, on les compare pour déterminer laquelle correspond à la gauche (valeur de x la plus petite) et laquelle à la doite (la plus grande) du polygone soit le début ou la fin de la ligne horizontale que l'on tracera pour le remplissage.</p>

```
void scanline(int x1,int y1, int x2,int y2)
{
int temp,y;
long x,m;
if(y2!=y1){
        if(y2=0) & (y>8;
                else scanboard[y].fin=x>>8;
                x+=m;}}}

void fill(int x1,int y1,int x2,int y2,int x3,int y3,int color)
{
int x, y;
/* on initialise les variables avec une valeur arbitraire
 de facon à eviter les conflits */
for(y=0;yscanboard[y].fin){
                x=scanboard[y].debut;
                scanboard[y].debut=scanboard[y].fin;
                scanboard[y].fin=x;}
        if (scanboard[y].debut!= -16000){
                if(scanboard[y].fin==-16000)
                scanboard[y].fin=scanboard[y].debut;
for(x=scanboard[y].debut;x

```
<p><a name="texture"></a></p>

#### Projection de texture 

<p><a href="/assets/texture.zip">texture.zip</a>
<a href="/assets/bump.tgz">bump.tgz</a></p>
<p align="justify"><img src="http://logarno.planet-d.net/djgfxfr/texture.jpg" style="float: right; margin: 1em"></img>A chaque sommet du polygone à texturer est associé une valeur x,y sur l'écran mais aussi les cordonnées u,v correspondant dans la texture.Comme pour le remplissage de polygone lorsque l'on initialise les segmentsdu polygone on stocke non seulement la valeur de x qui est associées à y selon l'algorithme de tracé de ligne mais aussi l'abscisse et l'ordonnée de la correspondance du point dans la texture selon le meme principe (double interpolation).</p>
<p></p>

```
void scanline(int x1,int y1,int u1, int v1, int x2,
              int y2,int u2, int v2)
{
  int temp,y;
  long x,m,u,v,uinc,vinc;

  if(y2!=y1)
  {
    if(y2 >8;
        scanboard[y].u1=u>>8;
        scanboard[y].v1=v>>8;
      }
      else
      {
        scanboard[y].fin=x>>8;
        scanboard[y].u2=u>>8;
        scanboard[y].v2=v>>8;
      }
      x+=m;
      u+=uinc;
      v+=vinc;
    }
  }
}
```

<p>On a ensuite à tracer les lignes horizontales, comme pour le remplissage de polygone, entre les deux valeurs de x associées à une hauteur y en utilisant les données de la textures. On utilise alors une fonction qui retourne les données de la texture entre les deux valeurs de u et de v associées à y (double interpolation). Enfin on ajuste la taille de cette ligne à celle de la ligne à tracer entre les deux valeurs de x en utilisant encore une interpolation.</p>

```
void h_line_tex(int x1,int u1,int v1,int x2,int u2,int v2,
                int y, char *texture, unsigned char *screen)
{
  long longueur, deltax, deltay, xincr, yincr, xpos, ypos, src;
  int  indice, x,temp;

  if (x1 > x2)
  {
    temp = x1;
    x1 = x2;
    x2 = temp;
    temp = u1;
    u1 = u2;
    u2 = temp;
    temp = v1;
    v1 = v2;
    v2 = temp;
  }
  longueur = x2 - x1 + 1;
  if (longueur > 0)
  {
    deltax = u2-u1+1;
    deltay = v2-v1+1;
    indice = y*320+x1;
    src    = v1*320+u1;    /* 320 = largeur texture */
    xincr = ((long)(deltax)>8) + (ypos & 0xFF00) + ((ypos & 0xFF00)>>2);
      screen[indice++]=texture[src];
      xpos+=xincr;
      ypos+=yincr;
    }
  }
}

```

Ce qui donne par exemple pour un triangle :


```
void fill_poly_tex(int x1, int y1, int u1, int v1, int x2, int y2, int u2, int v2, int x3,int y3,
                  int u3, int v3, unsigned char *texture, unsigned char *output)
{
  int x, y;

  for(y=0;y<200;y++)
     scanboard[y].debut=scanboard[y].fin=-16000;
  scanline(x1,y1,u1,v1,x2,y2,u2,v2);
  scanline(x2,y2,u2,v2,x3,y3,u3,v3);
  scanline(x3,y3,u3,v3,x1,y1,u1,v1);
  for(y=0;y<200;y++)
  {
    if (scanboard[y].debut!= -16000)    
    {  
      if(scanboard[y].fin==-16000)
        scanboard[y].fin=scanboard[y].debut;
      h_line_tex(scanboard[y].debut,scanboard[y].u1,scanboard[y].v1,
                 scanboard[y].fin, scanboard[y].u2,scanboard[y].v2,y,texture,output);
    }
  }
}
```

<p>
<a name="zsort"></a></p>

#### Determiner les faces cachées 

<p>
On trie les sommes des coordonnées Z des sommets des faces. Et on dessine dans l'ordre croissant.</p>
<p><a name="bmp"></a></p>

#### Bmp (320x200x256) 

<p><a href="/assets/bmp.zip">bmp.zip</a></p>
<table>
<tr>
<td>Signification du champs<br>Signature = BM<br>Taille fichier<br>Inconnu<br>Offset de l'image dans le fichier</td>
<td align="center">Taille en octets<br>2<br>4<br>4<br>4</td>
</tr>
</table>
<table>
<tr>
<td valign="bottom">Hauteur de l'image<br>Largeur de l'image<br>Nombre de plan (= 1)<br>Bits par pixel<br>Compression<br>Taille de l'image<br>Résolution horizontale<br>Résolution verticale<br>Nombre de couleurs<br>nombre de couleurs importantes</td>
<td align="center">v2.0<br>2<br>2<br>2<br>2<br>Nulle<br>Nulle<br>Nulle<br>Nulle<br>Nulle<br>Nulle</td>
<td align="center">v4.0<br>4<br>4<br>2<br>2<br>4<br>4<br>4<br>4<br>4<br>4</td>
</tr>
</table>
<p>Palette :
Contient les intensités de chaques couleurs primaires sur 6 bits dans l'ordre alpha, bleu, vert, rouge. On ignore ici la composante alpha.</p>
<p>Image ou bitmap :
Les lignes y sont rangées de bas en haut.</p>

```
int loadbmp(char *filename, unsigned char *bitmap, unsigned char *datapal)
{
FILE *f;
int i,line;
unsigned char *ptr;

f = fopen(filename,"rb");
fseek(f,53, SEEK_SET);
for (i=0;i>2;	//bleu
  datapal[i*3+1]=getc(f)>>2;	//vert
  datapal[i*3+2]=getc(f)>>2;	//rouge 
  }

fseek(f,1078,SEEK_SET);

for(line=199;line>=0;line--)
	{
        ptr=(char *)bitmap+line*320;
	fread(ptr,320,1,f);
	}

fclose(f);
return 1;
}

main()
{
unsigned char *buffer, *pal;
int i;
union REGS regs; 
__djgpp_nearptr_enable(); // desactive toutes les protections memoire
screen += __djgpp_conventional_base; 
regs.x.ax=0x013;
int86(0x10, &regs, &regs);
buffer = (char *)malloc(64000);
pal = (char *)malloc(768);

loadbmp("img.bmp",buffer,pal);
for(i=0;i<256;i++)
set_palette(i, pal[i*3+2], pal[i*3+1], pal[i*3+0]);
memcpy(screen,buffer,64000);
getch();

regs.x.ax=0x03;
int86(0x10, regs, regs);
__djgpp_nearptr_disable(); // reactive toutes les protections memoire
return;
}
```
<p>
<a name="bump"></a></p>

#### Bump mapping 

<p><a href="/assets/bump.zip">bump.zip</a>
<a href="/assets/bump.tgz">bump.tgz</a>
<a href="/assets/gba_bump.zip">gba_bump.zip</a></p>

<p align="justify"><img src="http://arnaud.desmons.free.fr/logarno/djgfxfr/bump.jpg" style="margin: 1em; float: right"></img>Créer un effet de relief sur une texture sous entends des differences d'altitudes sur celle-ci. On détermine l'altitude de chaque pixel par son intensité, plus elle est importante plus le point est haut. On calcule ensuite "l'inclinaison" d'un pixel par rapport à la source de lumiere par l'intermediaire de sa normale. Les normales sont des vecteurs unitaires dont on peut calculer la composante z si l'on a x et y d'après l'équation norme^2 = x^2 + y^2 + z^2 donc z = 1 - racine(x^2 + y^2). Ce calcule ne peut se faire en temps réel on stocke donc au préalable dans un tableau, appelé environnement map, la composante z qui correspond aux composantes x et y normalisées entre 1 et -1. X et y sont respectivement le degré d'inclinaison par rapportà la source lumineuse en abscisse et en ordonné, on l'obtient en comparant l'altitude donc l'intensité des pixels avoisinants et en soustrayant la distance qui sépare le pixel de la source de lumière. En effet si l'on cherche à ce qu'un pixel soit de forte intensité il faut que les composantes x et y soient faibles pour que la composante z tende vers 1 or si un pixel est incliné de x unité(s) a droite il faudra que la source lumineuse soit à x unités à droite du pixel pour que la soustraction donne un resultat faible et que la composante z s'en trouve augmenté.</p>


```
/* lx et ly sont les coordonnés de la source de lumiere */
void bump_mapping(unsigned char *buffer,float lx,float ly)
{
int nx, ny;
offset = 0;
float nX,nY,nZ;
/* calcule les composantes z des normales pour toutes 
les valeurs des composantes x et y */
for (y=0;y<256;y++)
for (x=0;x<256;x++){
        nX=(x-128)/128.0;
        nY=(y-128)/128.0;
        nZ=1-sqrt(nX*nX+nY*nY);
        if (nZ<0) nZ=0;
        envmap[x+(y<<8)] = ambient + diffuse * nZ;}
for (y=0;y<200;y++){
        for (x=0;x<320;x++){
         /* calcule l'inclinaison d'un pixel... */
         nx=bumpmap[offset+1]-bumpmap[offset-1];
         ny=bumpmap[offset+1]-bumpmap[offset-1];
         /* ... par rapport à la source lumineuse */
         nx-=(x-lx);
         ny-=(y-ly);
         /* on s'assure d'etre dans les limites */
         if (nx>255 || nx<0) nx=255;
         if (ny>255 || ny<0) ny=255;
        /* attribue les intensités via les composantes z des normales 
        precalculées dans l'environnement map */ 
        buffer[offset++]=envmap[nx+(ny<<8)];;}}}

```

<p><a name="fire"></a></p>

#### Feu

<p><a href="/assets/feu.zip">feu.zip</a></p>

```
for(i=0; ijaune
  set_palette(i+64,255,i,0);     // jaune->rouge
  set_palette(i,i,0,0);          // rouge->noir
}
 
void fire(unsigned char *bitmap){
int offset,x,y;
unsigned char color;
   /* chaque pixel de la derniere ligne recoit aleatoirement la couleur 255 ou 0 */
   for(x=0; x>2;
        /* attenuation */
        if(color>5) color-=4;
        else color=0;
        /* attribution */
        bitmap[offset]=color;
   }
}
```

<p>
<a name="links"></a></p>

### Liens 

<p>Tutorial de "l'Artiste Digital"
<a href="/assets/2d3dfx.zip">2d3dfx.zip</a></p>
<p>Programmation 3D en C (génialissime) :
<a href="http://membres.lycos.fr/heulin/">http://membres.lycos.fr/heulin/</a></p>
<p>Algorithmique de base de l'infographie
<a href="http://raphaello.univ-fcomte.fr/IG/Algorithme/Algorithmique.htm">http://raphaello.univ-fcomte.fr/IG/Algorithme/Algorithmique.htm</a></p>
<p>Game Programming with djgpp :
<a href="http://www.geocities.com/SiliconValley/Park/8933/">http://www.geocities.com/SiliconValley/Park/8933/</a></p>
<p>Graphic libraries and source code examples :
<a href="http://www.geocities.com/SiliconValley/Vista/6552/l5.html">http://www.geocities.com/SiliconValley/Vista/6552/l5.html</a></p>
<p>Zen de la programmation graphique
<a href="http://www.amazon.fr/exec/obidos/ASIN/2841801438/qid=1136726162/sr=1-1/ref=sr_1_0_1/171-4779008-6816255">http://www.amazon.fr/exec/obidos/ASIN/2841801438/qid=1136726162/sr=1-1/ref=sr_1_0_1/171-4779008-6816255</a></p>
