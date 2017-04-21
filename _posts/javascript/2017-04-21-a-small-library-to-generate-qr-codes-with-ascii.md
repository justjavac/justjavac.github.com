---
layout: post
title: 使用 ascii 码生成可以扫码的二维码
keywords: javascript,qrcode,qr,二维码
category : javascript
tags : [javascript, qr]
---

<style>
code, pre {
    font-size: 10px;
    line-height: 1;
}
</style>

今天心血来潮建了个新项目 [qr-ascii](https://github.com/justjavac/qr-ascii)。

使用 javascript 生成基于纯文本的二维码，效果如下（可以扫描）：

```text
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MM              MMMM  MM  MMMMMMMMMMMM          MMMM        MM              MM
MM  MMMMMMMMMM  MM  MM      MMMM    MM    MM    MMMMMMMMMM  MM  MMMMMMMMMM  MM
MM  MM      MM  MMMM  MMMMMM  MM    MMMM      MMMM  MM  MM  MM  MM      MM  MM
MM  MM      MM  MMMMMM    MMMM  MM  MMMMMM      MMMMMM    MMMM  MM      MM  MM
MM  MM      MM  MMMM    MM    MMMM    MM  MM                MM  MM      MM  MM
MM  MMMMMMMMMM  MM  MMMM  MMMMMMMMMM  MM      MMMM  MM  MM  MM  MMMMMMMMMM  MM
MM              MM  MM  MM  MM  MM  MM  MM  MM  MM  MM  MM  MM              MM
MMMMMMMMMMMMMMMMMM  MM      MM            MM  MM    MMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMM        MMMM      MM  MMMMMM  MM  MM    MM  MM    MM    MMMMMM  MMMM
MM  MMMM  MM  MMMM  MM      MMMM  MM      MMMM    MM  MM  MM    MM  MM  MMMMMM
MMMMMM  MM        MMMM    MM      MM      MM    MM        MM  MMMM        MMMM
MM  MMMM  MM  MMMMMM      MM  MM            MMMMMMMMMM        MM  MMMM      MM
MM  MMMMMMMMMM  MM    MMMM  MMMM    MMMM    MMMMMMMMMMMM    MM  MMMMMMMMMM  MM
MMMM        MMMM      MMMM  MMMMMM    MMMM          MM    MM  MMMM  MM  MMMMMM
MMMMMMMMMM            MMMMMMMMMMMMMMMM      MM    MM      MM  MMMM      MMMMMM
MM      MMMM  MM  MM    MM      MM  MM  MM    MM    MM  MMMMMMMMMM  MM    MMMM
MMMM  MM        MMMMMM  MMMMMM      MM  MMMM  MMMM  MMMMMMMM    MMMM    MMMMMM
MM    MM    MMMM  MM    MMMM    MM  MMMM  MMMMMMMMMMMM        MMMM  MM  MMMMMM
MM    MM            MM      MM    MMMM        MM    MMMM      MMMM  MM  MMMMMM
MMMM      MMMMMM      MM      MM  MM  MM  MMMMMM    MMMMMMMM        MM  MM  MM
MMMM      MM    MMMMMM  MMMM  MMMMMM  MM      MM  MM  MM  MMMM  MMMMMM  MMMMMM
MM        MMMMMMMM  MMMMMM  MM  MMMM  MM  MM  MM  MMMM    MM  MMMM        MMMM
MMMMMM  MM  MM  MM            MMMMMMMMMMMMMMMM    MM      MMMMMMMMMMMMMMMMMMMM
MMMMMM    MMMMMM  MMMM      MMMM  MM      MM  MM  MMMM  MMMMMM    MMMM  MM  MM
MMMMMMMM    MM      MM  MMMM      MM  MMMMMMMM      MMMM          MM      MMMM
MM  MMMMMMMM  MMMM  MM  MMMMMMMMMM    MM    MMMMMMMM      MMMM  MM        MMMM
MMMMMM    MMMM  MM  MM  MMMM        MMMM        MMMMMM    MM    MM      MMMMMM
MMMMMM  MM  MMMMMM      MM        MMMM  MMMMMM  MM  MM    MM    MMMMMM  MM  MM
MM      MM      MMMM  MM    MMMM    MM  MM  MM      MMMM                  MMMM
MMMMMMMMMMMMMMMMMM    MMMMMM  MM  MM  MMMMMMMM  MMMMMM      MMMMMM    MM  MMMM
MM              MM  MM            MMMM        MM  MMMM  MM  MM  MM      MMMMMM
MM  MMMMMMMMMM  MM  MMMM    MMMMMM  MMMMMMMM    MM  MM      MMMMMM  MM  MMMMMM
MM  MM      MM  MM  MM  MMMMMM    MM    MMMMMM      MM  MM              MMMMMM
MM  MM      MM  MMMM      MM      MMMMMM  MM  MMMM          MM  MMMM    MMMMMM
MM  MM      MM  MMMM  MM    MM    MM      MM  MM  MMMM            MM  MM  MMMM
MM  MMMMMMMMMM  MMMM  MMMM  MM  MMMMMM    MMMMMM    MM    MM  MMMMMM      MMMM
MM              MMMM  MMMM            MM  MMMMMM      MMMMMM    MM  MM      MM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
```
