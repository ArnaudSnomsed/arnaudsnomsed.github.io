---
id: 86
title: 'Yet another patch for pyOpenSSL'
date: '2007-02-24T15:18:37+01:00'
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

[This patch](http://arnaud.desmons.free.fr/pyOpenSSL-0.6-pkcs12_cafile.patch) (to be applied just after the pkcs12 one and before the CRL one) will allow you to add the CA certificat into a pkcs12.  
   
[pyOpenSSL-0.6-pkcs12\_cafile.patch](http://arnaud.desmons.free.fr/pyOpenSSL-0.6-pkcs12_cafile.patch)  
[pyOpenSSL-0.8-pkcs12\_cafile.patch](http://arnaud.desmons.free.fr/pyOpenSSL-0.8-pkcs12_cafile.patch)  

```
p12 = crypto.PKCS12()
p12.set_privatekey(pkey)
p12.set_certificate(cert)
open("test.p12", "w").write(crypto.dump_pkcs12(p12, "my_passphrase", "/my/path/to/cacert.pem"))
```
