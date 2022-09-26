---
id: 60
title: 'How to feed Bogofilter with ham and spam thanks to IMP'
date: '2006-07-11T05:45:26+02:00'
author: arnaud.desmons
layout: post
categories:
    - Informatique
    - Perl
---

![](/img/horde-halfgear.png)

Here is a little, but very efficient, script that feed [bogofilter](http://bogofilter.sourceforge.net/) with ham (non-spam). Every mail coming from someone in any address book of the [IMP](http://www.horde.org/imp/) webmail will be considered as ham (check that you add automatically people in address books when sending mail to those people from the webmail). For the spam you can use the « report as spam » functionnality in IMP.

```
<pre style="background-color: #eee;overflow: auto;border-radius: 10px;padding: 0.5em;-moz-border-radius: 10px;display: block;border: 1px solid #bbb; width:500px;font-size: 85%">#!/usr/bin/perl

use Mail::Audit;
use DBI;
use POSIX qw(tmpnam);

my $dbh = DBI->connect("dbi:SQLite2:dbname=/var/horde/db");
my $mail = Mail::Audit->new();

$mail->noexit(1);
if (my ($email) = ($mail->from =~ /([^\s]*)/)) {
    my $sth = $dbh->prepare("SELECT count(*) FROM ".
              "turba_objects WHERE LOWER(object_email)=?");
    $sth->bind_param(1, lc($email));
    $sth->execute;
    if (($sth->fetchrow)) {
        $mail->pipe("/usr/bin/bogofilter -n -l");
        $mail->pipe("/usr/sbin/sendmail -i @ARGV");
        exit;
    }
}

my $tmp = tmpnam();
$mail->pipe("/usr/bin/bogofilter -l -p -O " . $tmp .
       " || /usr/sbin/sendmail -i @ARGV 
<p>With postfix you can edit /etc/postfix/master.cf :</p>
<pre style="background-color: #eee;overflow: auto;border-radius: 10px;padding: 0.5em;-moz-border-radius: 10px;display: block;border: 1px solid #bbb; width:500px;font-size: 85%">smtp inet n - - - - smtpd -o content_filter=filter:
filter unix - n n - - pipe
 flags=R user=filter argv=/opt/postfix-filter.pl -f ${sender} -- ${recipient}

```