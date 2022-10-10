---
id: 90
title: 'Revised pkcs12 patch for pyOpenSSL'
date: '2008-08-18T17:06:11+02:00'
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

Here is the new patch (doc strings added) :  
[pyOpenSSL-0.7-pkcs12.patch](/assets/pyOpenSSL-0.7-pkcs12.patch)  
[pyOpenSSL-0.8-pkcs12.patch](/assets/pyOpenSSL-0.8-pkcs12.patch) (*updated 29/03/2009*)

The synopsis is still the same :  
```
p12 = crypto.PKCS12()
p12.set_privatekey(pkey)
p12.set_certificate(cert)
open("test.p12", "w").write(crypto.dump_pkcs12(p12, "my_passphrase"))
```