---
id: 24
title: Installation
date: '2006-04-02T08:04:19+02:00'
author: arnaud.desmons
layout: page
guid: 'http://arnaud.desmons.free.fr/wordpress/?page_id=24'
---

###  Gentoo 

```
<pre style="background-color: #eee;overflow: auto;border-radius: 10px;padding: 0.5em;-moz-border-radius: 10px;display: block;border: 1px solid #bbb; width:46em;font-size: 85%"># USE="ldap apache2 postgres dba pear sqlite session curl cli pcre mcrypt xml" \\
ACCEPT_KEYWORDS="~x86" emerge vulture<br></br>
# echo "apache ALL=NOPASSWD:/usr/sbin/apache2" >> /etc/sudoers
```

### RPM

```
<pre style="background-color: #eee;overflow: auto;border-radius: 10px;padding: 0.5em;-moz-border-radius: 10px;display: block;border: 1px solid #bbb; width:46em;font-size: 85%"># rpm -i INTRINsec-common-W.X-1.i686.rpm vulture-Y.Z.noarch.rpm
# echo "apache ALL=NOPASSWD:/opt/INTRINsec/httpd/bin/httpd" >> /etc/sudoers
```

### Vulture From Scratch

```
<pre style="background-color: #eee;overflow: auto;border-radius: 10px;padding: 0.5em;-moz-border-radius: 10px;display: block;border: 1px solid #bbb; width:52em;font-size: 75%">cd /tmp
wget http://www.openssl.org/source/openssl-0.9.8a.tar.gz
wget http://apache.crihan.fr/dist/httpd/httpd-2.2.0.tar.bz2
wget http://www.modsecurity.org/download/modsecurity-apache-1.9.2.tar.gz
wget http://be2.php.net/distributions/php-5.1.2.tar.bz2
wget http://perl.apache.org/dist/mod_perl-2.0.2.tar.gz
wget http://lwp.linpro.no/lwp/libwww-perl-5.64.tar.gz
wget http://search.cpan.org/CPAN/authors/id/G/GB/GBARR/perl-ldap-0.3202.tar.gz
wget http://search.cpan.org/CPAN/authors/id/T/TI/TIMB/DBI-1.48.tar.gz
wget http://search.cpan.org/CPAN/authors/id/M/MS/MSERGEANT/DBD-SQLite-0.31.tar.gz
wget http://search.cpan.org/CPAN/authors/id/D/DB/DBDPG/DBD-Pg-1.47.tar.gz
wget http://search.cpan.org/CPAN/authors/id/J/JB/JBAKER/Apache-Session-1.6.tar.gz
wget http://search.cpan.org/CPAN/authors/id/G/GB/GBARR/Convert-ASN1-0.18.tar.gz
wget http://search.cpan.org/CPAN/authors/id/M/MS/MSCHWERN/ExtUtils-MakeMaker-6.26.tar.gz
wget http://search.cpan.org/CPAN/authors/id/L/LD/LDS/CGI.pm-3.11.tar.gz
wget http://search.cpan.org/CPAN/authors/id/G/GA/GAAS/URI-1.35.tar.gz
wget http://search.cpan.org/CPAN/authors/id/G/GE/GEOFF/Apache-SSLLookup-2.00_04.tar.gz
wget http://search.cpan.org/CPAN/authors/id/L/LD/LDS/Crypt-CBC-2.15.tar.gz
wget http://sqlite.org/sqlite-2.8.17.tar.gz
wget http://vulture.open-source.fr/download/VultureNG-1.1.1.tar.bz2
wget http://ftp.gnome.org/mirror/gnome.org/sources/libxml2/2.6/libxml2-2.6.23.tar.gz
for d in `ls *.tar.gz`; do tar vxfz $d; rm $d; done
for d in `ls *.tar.bz2`; do bunzip2 $d; done
for d in `ls *.tar`; do tar vxf $d; rm $d; done
cd openssl-0.9.8a && \\
./config --prefix=/opt/openssl && \\
make CPPFLAGS="-DSSL_EXPERIMENTAL_ENGINE" && \\
make install && \\
cd ../httpd-2.2.0 && \\
./configure --prefix=/opt/httpd \\
  --enable-ssl --enable-proxy --mandir=/opt/man \\
  --with-ssl=/opt/openssl && \\
make CPPFLAGS="-I/usr/kerberos/include -DSSL_EXPERIMENTAL_ENGINE" && \\
make install && \\
make clean && \\
cd ../libxml2-2.6.23 && \\
./configure --prefix=/opt/libxml2 && \\
make && make install && make clean && \\
cd ../php-5.1.2 && \\
./configure --prefix=/opt/php \\
  --with-config-file-path=/opt/etc \\
  --mandir=/opt/man \\
  --with-apxs2=/opt/httpd/bin/apxs \\
  --with-sqlite --without-mysql --with-pgsql --with-ldap \\
  --with-curl --with-mcrypt --with-openssl && \\
make && \\
make install && \\
make clean && \\
install -m 755 -d /opt/etc/ && \\
install -m 644 php.ini-recommended /opt/etc/php.ini && \\
cd ../modsecurity-1.9.2/apache2 && \\
  /opt/httpd/bin/apxs -cia ./mod_security.c && \\
  cd ../../mod_perl-2.0.2 && \\
perl -I ../ExtUtils-MakeMaker-6.26/lib Makefile.PL \\
  LIB=/opt/INTRINsec/lib \\
  PERLPREFIX=/opt \\
  SITEPREFIX=/opt \\
  VENDORPREFIX=/opt \\
  INSTALLBIN=/opt/usr/bin \\
  INSTALLMAN1DIR=/opt/man/man1 \\
  INSTALLMAN3DIR=/opt/man/man3 \\
  MP_APXS=/opt/httpd/bin/apxs && \\
make && \\
make install && \\
make clean && \\
cd ../libwww-perl-5.64 && \\
perl -I ../ExtUtils-MakeMaker-6.26/lib Makefile.PL LIB=/lib -n && \\
make && \\
make DESTDIR=/opt SITEPREFIX= PERLPREFIX= install && \\
make clean && \\
cd ../Convert-ASN1-0.18 && \\
perl -I ../ExtUtils-MakeMaker-6.26/lib Makefile.PL LIB=/lib -n && \\
make && \\
make DESTDIR=/opt SITEPREFIX= PERLPREFIX=install && \\
make clean && \\
cd ../perl-ldap-0.3202 && \\
perl -I /opt/lib -I ../ExtUtils-MakeMaker-6.26/lib Makefile.PL LIB=/lib 
<pre class="code">
```