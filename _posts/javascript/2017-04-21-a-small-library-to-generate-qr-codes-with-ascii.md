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
    line-height: 1.2;
}
</style>

今天心血来潮建了个新项目 [qr-ascii](https://github.com/justjavac/qr-ascii)。

使用 javascript 生成基于纯文本的二维码，效果如下（可以扫描）：

```text

// 使用微信扫码下面二维码
// 会识别出 hello world

MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MM              MMMM  MMMMMMMMMMMMMM  MMMMMMMM              MM
MM  MMMMMMMMMM  MMMMMM    MMMMMM    MMMMMMMMMM  MMMMMMMMMM  MM
MM  MM      MM  MMMM  MM    MMMMMMMMMMMM  MMMM  MM      MM  MM
MM  MM      MM  MMMM  MMMM  MM        MMMMMMMM  MM      MM  MM
MM  MM      MM  MM    MMMM    MM  MMMMMM  MMMM  MM      MM  MM
MM  MMMMMMMMMM  MMMMMM      MM            MMMM  MMMMMMMMMM  MM
MM              MM  MM  MM  MM  MM  MM  MM  MM              MM
MMMMMMMMMMMMMMMMMM    MMMM  MMMMMM  MMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMM    MMMM      MM      MM    MMMM    MM    MM  MMMMMMMMMM
MMMMMMMM      MM  MM    MM  MM    MM    MM    MM  MMMMMM    MM
MM  MM      MM  MMMMMMMMMM        MMMM      MMMM          MMMM
MM    MMMM    MM  MMMMMM  MMMMMM    MMMMMM  MM      MMMMMM  MM
MMMM        MM        MM          MMMMMM    MMMMMMMMMM      MM
MMMM  MMMMMM  MM    MM        MM  MM      MMMM    MM    MM  MM
MMMM  MM  MMMM      MM      MM  MM  MMMM    MM      MMMM    MM
MM  MM        MM  MM    MMMMMMMM      MM  MMMMMM  MM  MM    MM
MMMMMM  MMMM    MMMM    MM      MMMM    MMMMMMMMMMMMMMMM  MMMM
MMMM        MMMMMMMM  MMMM  MM    MMMMMM  MM    MMMM  MMMMMMMM
MM  MMMMMM  MM        MM  MMMM    MMMM  MM              MMMMMM
MMMMMM    MMMMMM      MM    MMMM  MMMMMMMM  MM    MMMM      MM
MMMM  MM    MM    MM      MMMM                        MM  MMMM
MMMMMMMMMMMMMMMMMM        MMMM  MM          MMMMMM      MM  MM
MM              MM      MMMM  MM            MM  MM  MM    MMMM
MM  MMMMMMMMMM  MMMM                MM  MM  MMMMMM  MMMM    MM
MM  MM      MM  MMMM    MM  MMMMMM    MMMM          MM    MMMM
MM  MM      MM  MM  MMMMMM  MMMM  MM  MM      MM      MMMMMMMM
MM  MM      MM  MM  MMMM  MMMMMM    MM  MMMM  MM  MM    MM  MM
MM  MMMMMMMMMM  MMMM        MMMM        MMMMMM  MM        MMMM
MM              MMMMMM  MMMM          MM  MMMM  MM  MM    MMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

```

