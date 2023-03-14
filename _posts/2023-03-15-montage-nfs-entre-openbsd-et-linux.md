---
title: 'Montage NFS entre OpenBSD et Linux'
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

Il semble y avoir un bug dans le client Linux ou le serveur OpenBSD et
donc voici comment le contourner.

# Options de montage sous linux

Configurer le fichier /etc/fstab sous Linux en remplacant openbsd par
le nom de votre serveur ci-dessous :

```
openbsd:/mnt/WD /media/nfs  nfs noatime,nodev,x-systemd.automount,x-systemd.device-timeout=10,timeo=14,x-systemd.idle-timeout=5min 0 0
```

Executer la commande suivante après avoir mis à jour le fichier fstab :

```
$ sudo systemctl daemon-reload
```

# Pour terminer les sessions TCP en FIN_WAIT2

Le bug cause des sessions TCP en attente. Il faut donc les terminer avec un
script coté client Linux toutes les 5mn.

Voici le script à déclencher dans une crontab après avoir renseigné
l'IP du serveur dans la variable nfs_ip :

```
#!/bin/sh

progName="nfsClientFix"
delay=15
nfs_ip=192.168.0.42

nfs_fin_wait2_state() {
   /usr/bin/netstat -an | /usr/bin/grep ${nfs_ip}:2049 | /usr/bin/grep  FIN_WAIT2 > /dev/null 2>&1
   return $?
}

nfs_fin_wait2_state
result=$?
if [ ${result} -eq 0 ] ; then
   /usr/bin/logger -s -i -p local7.error -t ${progName} "NFS Connection is in FIN_WAIT2!"
   /usr/bin/logger -s -i -p local7.error -t ${progName} "Enabling firewall to block ${nfs_ip}!"
   /usr/sbin/iptables -A INPUT -s ${nfs_ip} -j DROP

   while true
   do
       /usr/bin/sleep ${delay}
       nfs_fin_wait2_state
       result=$?
       if [ ${result} -ne 0 ] ; then
           /usr/bin/logger -s -i -p local7.notice -t ${progName} "NFS Connection is OK."
           /usr/bin/logger -s -i -p local7.error -t ${progName} "Disabling firewall to allow access to ${nfs_ip}!"
           /usr/sbin/iptables -D INPUT -s ${nfs_ip}  -j DROP
           sudo service plexmediaserver restart
           break
       fi
   done

```


