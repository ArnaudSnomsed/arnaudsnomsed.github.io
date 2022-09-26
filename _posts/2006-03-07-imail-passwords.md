---
id: 15
title: 'IMail passwords'
date: '2006-03-07T03:55:21+01:00'
author: arnaud.desmons
layout: post
categories:
    - Informatique
    - Perl
---

![](http://arnaud.desmons.free.fr/img/lock-bottom.png)En cherchant à extraire les mots de passe d’un serveur IMail, je suis tombé la dessus :

<http://seclists.org/lists/bugtraq/1999/Mar/0010.html>

Ça fait peur mais en même temps on peut considerer que c’est bien joué de la part des auteurs de IMail qui nous permettent ainsi de changer de serveur.

On peut extraire les mots de passe depuis la base de registre *HKEY\_LOCAL\_MACHINE\\SOFTWARE\\Ipswitch\\IMail\\Domains\\yourdomain\\users\\*

Un bout de code Perl pour illustrer ça :

```
my $mail = "test";
my $password = "BDD4EAE2EDD4E8";
my @hex_mail = unpack("C*", $mail);
my ($i, @decrypted_password, @hex_password);
while ($password) {
\ \ push @hex_password, hex(substr($password, 0, 2, ''));
}
foreach (@hex_password) {
\ \ push @decrypted_password, ($_ - $hex_mail[$i++ % length($mail)]);
}
print pack("C*", @decrypted_password). "\\n";
```