---
id: 84
title: 'pyOpenSSL patch for PKCS12'
date: '2006-11-29T23:02:27+01:00'
author: arnaudsnomsed
layout: post
categories:
    - Informatique
---

I wrote a [patch](/pyOpenSSL-0.6-pkcs12.patch) for pyOpenSSL to allow generation of PKCS12 files like this :

```
p12 = crypto.PKCS12()
p12.set_privatekey(pkey)
p12.set_certificate(cert)
open("test.p12", "w").write(crypto.dump_pkcs12(p12, "my_passphrase"))
```