---
id: 36
title: Documentation
date: '2006-04-11T05:02:46+02:00'
author: arnaud.desmons
layout: page
guid: 'http://arnaud.desmons.free.fr/wordpress/?page_id=36'
---

This is the I N P R O G R E S S administrator documentation. For a general overview of vulture or the installation documentation click respectively on [Vulture](http://arnaud.desmons.free.fr/wordpress/?page_id=19) or [Installation](http://arnaud.desmons.free.fr/wordpress/?page_id=24) in the right menu.

Vulture is an HTTP reverse proxy. It does many security checks (authentication, rewriting, filtering) before proxying request from Internet to your web applications. With authentication enabled, vulture will open flows only to authenticated users. It also allows to your users to use only one password to access many different applications by learning and forwarding their different accounts.

Vulture includes :

- Authentication (SSL, LDAP/AD, SQL, Radius)
- Authentication forwarding (SSO)
- HTTP headers modification on the fly
- Flow encryption
- Content filtering
- URL Rewriting
- Load balancing

<div style="position: relative;"><span style="background: #efefef;  padding: 5px; border: 1px solid black; position: absolute; top:125px;left:15px"><font size="-1">Authentication</font>  
</span>

<span style="background: #efefef;  padding: 5px; border: 1px solid black; position: absolute; top:110px;left:200px"><font size="-1">SSO</font>  
</span>

<span style="position: absolute; top:35px;left:290px"><font size="-1">Web servers</font>  
</span>

<span style="position: absolute; top:180px;left:195px"><font size="-1">Vulture</font>  
</span>

<span style="background: #efefef;  padding: 5px; border: 1px solid black; position: absolute; top:200px;left:75px"><font size="-1">Content filtering and encryption</font>  
</span></div>

<img src="http://arnaud.desmons.free.fr/vulture.png">


### Administration logging in

When Vulture is installed, go to https://localhost:9090. You may need
to do a ssh forward or editing conf/httpd.conf in order to get apache
listening on another IP if you don’t run your browser from the host
running vulture. The default password for admin is admin

   
![](/img/vulture-1.2.png)

### Modifying the administrator password

After logging in, the page below will come up. The icon
![](/img/vulture/badge.png) means that the user is an
administrator. We will see thereafter why non administrator users can
be usefull. Click on ![](/img/vulture/edit.png) to change the password
of “admin”.

   
![](/img/vulture-1.2-1.png)  
   
![](/wordpress/wp-content/themes/connections/img/divider.gif)

### Adding an interface

An interface is most likely an Apache process. By adding or editing an
interface you will specify most of the apache options (ip and port,
certificat, log format). Thereafter, we will bind applications on this
interface and look at SSL and « SSO portal » features.

![](/img/vulture/Capture-1.png)

Back to the interface list you can see thoses icons :  

![](/img/vulture/button_ok.png) : interface is up and running  
![](/img/vulture/button_cancel.png) : interface is down  
![](/img/vulture/stop.png) : click on it to stop an interface  
![](/img/vulture/reload.png) : click on it to commit changes and start or restart the interface  
  
Leave the interface stopped as we dont have an application configured on it yet.

   
![](/wordpress/wp-content/themes/connections/img/divider.gif)

### Adding an application

An application is mainly represented by its internet name. This is what users will type in the URL bar to join our application. Vulture will answer by providing content from the private URL. This is reverse proxying. We will see thereafter how vulture can require authentication before providing anything from the private URL. Add an application as shown below and start the interface.

![](/img/vulture/Capture-2.png)

Go back to the interface menu and start the interface. You should be able to type http://test or whatever you set the application name to and see your application. If you don’t, go to the FAQ menu.

![](/wordpress/wp-content/themes/connections/img/divider.gif)

### Authentication

Now that you have an application up and running let’s see how to restrict access to authorized users only. Vulture support LDAP, SQL, Radius and x509 client certificat authentication.  
We first defines parameters of an authentication method by creating one and then associates this method to an application by editing the application’s authentication method parameter.  
After associating an authentication method to an application you will be able to select an even more restricted pool of authenticated users using ACL. Thoses ACL are specific to an application.

<fieldset><legend>SSO</legend>If you use the same authentication method for two or more applications, user will be prompted for a password only one time.

</fieldset><fieldset><legend>SSO Forward</legend>Don’t be confused between SSO and SSO Forward. The first one is a native thing in Vulture which means that you don’t need to do anything special to enjoy it as described above. The second one, which is called « SSO Forward » needs a little bit of configuration. « SSO Forward » is the ability of Vulture to learn users profile onto applications and propagate them on applications as far as the user is authenticated.

<div style="position: relative;"><span style="background: #efefef;  padding: 5px; border: 1px solid black; position: absolute; top:125px;left:15px"><font size="-1">Authentication</font>  
</span>

<span style="background: #efefef;  padding: 5px; border: 1px solid black; position: absolute; top:10px;left:175px"><font size="-1">login = test  
lang = fr</font>  
</span>

<span style="background: #efefef; padding: 5px; border: 1px solid black; position: absolute; top:35px;left:330px"><font size="-1">user = bill  
password = gates</font>  
</span>

<span style="background: #efefef; padding: 5px; border: 1px solid black; position: absolute; top:180px;left:195px"><font size="-1">login = ads  
passwd = coucou</font>  
</span>

![](/vulture.png)

</div>
<img src="http://arnaud.desmons.free.fr/vulture.png">

</fieldset>

### SQL

Below is an example of informations needed by Vulture to do its query for authentication using SQL. Vulture support three encrytion algoritms for password comparaison besides plain text : SHA1, MD5 and Crypt.

![](/img/vulture/sql.png)

Actually, you already have an SQL authentication method configured by default which is called « vultureng ». This is the own SQL user database of the administration interface. To enable it on an application just edit the « authentication method » of this application.

![](/img/vulture/app_vultureng.png)

No need to restart the interface. It’s taken into account on the fly ;-).

### Vulture in action

So, now, go on http://test or whatever you set the application name to and you will see this authentication form and should be able to connect using your admin account.

![](/img/vulture/mire.png)

You can now add more users using the Users menu of the administration interface and experiment ACL by clicking on « ACL administration » in the application edition action menu.

![](/img/vulture/acl_user.png)

### LDAP

Nothing particular here excepted for « Searching attribute is a DN
». This parameter is only needed if you plan to do ACLs regarding
groups. Indeed, when looking for a member into groups, Vulture has to
know either to use the whole DN of the user or just the CN. If you use
an Active Directory and plan to configure ACLs by group check that.
For a common configuration of a <u>Fedora Directory Server</u>, user,
group and « searching attibute in group » would be respectively uid,
cn and uniquemember.  For a common configuration of an <u>Active
Directory</u> server, user, group and « searching attibute in group »
would be respectively samacountname, samaccountname and member.
Otherwise, for a common OpenLDAP configuration it would be something
like shown below :

![](/img/vulture/ldap.png)

### SSO Forward

   
![](/img/vulture/htaccess_forward.png)  
![](/img/vulture/post_forward.png)

### Redirections

```
  1. ^/secure => /index.php?do=secure [R]
  2. ^/redirect=(.*) => http://$1 [R]
  3. ^/admin => /administration [P]
  4. ^/admin => [403]
  5. .* => http://www.exemple.fr/enroll.php [NOCERT,R]
  6. ^/admin => /enroll.php [NOCERT,P]
```

- 1. \[R\] means that the redirection will be sent to the user (external) from http://www.exemple.fr/secure to http://www.exemple.com/index.php?do=secure
- 2. Here is an example of perl regex : http://www.exemple.com/redirect=http://www.intrinsec.com will be redirected to http://www.intrinsec.com
- 3. \[P\] means that the redirection will be transparent to the user and done internally by vulture itself. http://www.exemple.com/admin/index.php will be internally redirected to http://www.exemple.com/administration/index.php
- 4. If there is « admin » in the URL, Vulture will return code 403 (forbidden).
- 5. If the user doesn’t have a certificat it will be externally redirected.
- 6. Same as in 5 but internally.

### Headers rewriting

![](/img/vulture/headers_rewriting.png)

