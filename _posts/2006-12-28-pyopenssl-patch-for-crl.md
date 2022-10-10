---
id: 85
title: 'pyOpenSSL patch for CRL'
date: '2006-12-28T22:20:34+01:00'
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

I wrote a second patch for pyOpenSSL (to be applied just after pkcs12 one) :  
[pyOpenSSL-0.6-crl.patch](http://arnaud.desmons.free.fr/pyOpenSSL-0.6-crl.patch)  
[pyOpenSSL-0.8-crl.patch](http://arnaud.desmons.free.fr/pyOpenSSL-0.8-crl.patch)

This allows generation of CRL like this :  
```
crl = crypto.CRL()
crl.make_revoked("100928084218Z", "1")
crl.make_revoked("100928084218Z", "2")
print crypto.dump_crl(crl, cacert, capkey)
```

Maybe I will do a separate sign(cacert, cakey) fonction instead of doing everything in dump\_crl…
