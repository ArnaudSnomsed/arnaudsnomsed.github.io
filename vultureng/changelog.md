---
id: 35
title: Changelog
date: '2006-04-11T04:48:44+02:00'
author: arnaud.desmons
layout: page
guid: 'http://arnaud.desmons.free.fr/wordpress/?page_id=35'
---

### 1.91

*26 jun 2006*

- Debian packaging
- Suffix and prefix for SSO forward profile variables
- URL attribute name (optional) in LDAP and SQL
- Translation updates
- Fedora directory server support

### 1.90p3

*2 jun 2006*

- Bug with SSO Forward
- Bug in interface (some blank pages)
- Some translation updates

### 1.90p2

*30 may 2006*

- Bug with ACL http://groups.open-source.fr/viewtopic.php?t=306#724
- Missing « Profiles » in menu

### 1.90p1

*25 may 2006*

- Bug in ProxyPassReverse (Location wasn’t rewritten)
- Bug in authentication ids (authentication didn’t work in some cases)

### 1.90

*25 apr 2006*

- Application’s session timeout configuration
- [ProxyPassReverse](http://httpd.apache.org/docs/2.0/mod/mod_proxy.html#proxypassreverse) enabled by default
- « Host » header overwriting (no more workaround with /etc/hosts)
- Authentication is now possible with only one name or IP (sso portal name can be the same as an application name).
- New CSS (click on the top banner to switch)
- « Check for update » link

### 1.1

*24 Jan 2006*

- ACL now linked with applications to keep SSO
- Radius authentication
- One Time Password management
- Misc GUI improvements
- Easter egg 😉

### 1.0

*25 Oct 2005*

- Load balancing
- Dynamic variables (headers, SSO Forward)
- Cleanup into ResponseHandler (favicon fixed)
- Authentication via form (was Basic)
- Passwords encryption into database
- SSO proxy configuration now in IHM
- Hash algorithms for SQL authentication
- ACL for SSL authentication
- Rooster integration
- DB migration’s dump

### 0.9

*29 Aug 2005*

- Fixed IE cache (thx to bounty)  
     http://groups.open-source.fr/viewtopic.php?t=25
- mod\_perl 2.0 renaming (thx to bounty)  
     http://perl.apache.org/docs/2.0/rename.html  
     http://groups.open-source.fr/viewtopic.php?t=25
- Win32 DBD:SQLite multithread workaround (thx to bounty)  
     http://groups.open-source.fr/viewtopic.php?t=25
- IHM improvements (thx to glr)
- PNG transparency hack for IE  
     http://www.youngpup.net/2001/sleight
- Added support for application’s headers customization
- Fixed buildrequires to sqlite
- Fixed minus in alias

### 0.8

*20 Jun 2005*

- Fixed interface deletion (thanks to oeufdure)
- Fixed menu in IE

### 0.7

*7 Jun 2005*

- Added support of regexp for application names

### 0.6

*24 May 2005*

- Gentoo packaging

### 0.5

*25 April 2005*

- Mdk packaging

### 0.4

*18 April 2005*

- Fixed the « SSO\_FORWARD\_DISPLAY » bug in application edition form
- Added support for port number in private address
- Autologon Support
- ServerAlias Support
- Allow rewrite rules to return HTTP Status Codes
- Applications are now binded to an interface
- Custom Log Format for both interfaces and applications
- Several RPM minor changes

### 0.3

*21 March 2005*

- Support of SSLVerifyClient in SSL CA Authentication
- SSO Forward
- mod\_access implementation
- SSL Engine
- Sqlite2 -&gt; Sqlite1
- RPM Spec File modification
- Ebuild modification

### 0.2

*8 March 2005*

- Fixed a trailing slash bug in rewrite\_rules
- Fixed a bug in LDAP Group Authentication
- Basic authentication instead of form

### 0.1

*4 March 2005*

- Initial Release