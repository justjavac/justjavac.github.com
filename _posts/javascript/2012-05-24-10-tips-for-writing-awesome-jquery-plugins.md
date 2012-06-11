---
layout: post
title: 10 个技巧助你写出卓越的jQuery插件
description: 目前网络中存在大量能够实现各种功能的jQuery插件，有的插件表面上看很不错，但在实际使用过程中会出现很多问题。而大多数插件只要再加入一点点额外的功能，就能从“优秀”变成“卓越”，并且有更广泛的用处。
keywords: jQuery, 技巧, jQuery插件
category : javascript
tags : [jQuery]
---

目前网络中存在大量能够实现各种功能的jQuery插件，有的插件表面上看很不错，但在实际使用过程中会出现很多问题。
而大多数插件只要再加入一点点额外的功能，就能从“优秀”变成“卓越”，并且有更广泛的用处。 

本文针对jQuery插件的开发者列出了一些技巧，以帮助开发者写出更好的jQuery插件，并且这些技巧在插件的维护和扩展方面也有一定的作用。 

## 1. 插件应该即开即用 

这是我遇到的最大的问题，因此我将它放在第一个来讲。
**插件就是插件，不需要用户再进行额外的设置和定义，应该有一个最基本的预设**。 

    $("#container").wTooltip();

jQuery的幻灯片放映插件就是个很好的示例，比如滑动的界面、上一个/下一个按钮等。
我曾经见过有的插件需要用户设定一个包含ID和class的DIV，然后再通过插件功能来引用它。
而实际上对于这种插件，应该直接设定好并提供启用/关闭选项。 

## 2. 总是提供默认设置 

一般插件都包括基础默认设置，因此，在开发插件时应提供一套默认值。
这肯定会提高开发者使用插件的机率，并扩大插件的知名度。 

    var defaultSettings = {
        mode            : 'Pencil',
        lineWidthMin    : '0',
        lineWidthMax    : '10',
        lineWidth       : '2'
    };

    settings = $.extend({}, defaultSettings, settings || {});

上面的代码是以标准的方式来设定默认值，其他插件使用者能够通过各种设置来对插件进行扩展。 

## 3. 独特的命名法 

在写插件时，尽量令插件的类、ID、命名与众不同。
这也不是件难事儿，只要避免与现有的JavaScript和CSS代码重名就可以了。 

    $("#container").tooltip();    //bad    
    $("#container").wTooltip();   //good

在上面的例子中，在插件的普通命名前加上一个“W”，就能和可能存在的通用名称区别开来。
包括“tab”或“holder”等通用术语我也使用这种包含独特关键字的命名方法。 

    _wPaint_button
    _wPaint_holder

同时，加入下划线的方法也可以确保ID或class的名称不与其他的重复，这也让我更加确信我写的jQuery插件将独一无二。 

## 4. 插件代码标准化  

大多数好的插件都有这段标准的jQuery代码，它包含了插件开发、维护和更新阶段所有的重要代码。
如果想获得更多信息的话，可以查看我的[jQuery Tooltip Plugin][1]代码。 

    var defaultSettings = {
        //settings
    };

    $.fn.wPaint = function(settings)
    {
        //check for setters/getters
        
        return this.each(function()
        {
            var elem = $(this);
            //run some code here
            elem.data("_wPaint", wPaint);
        }
        
        //classes/prototyping
    }

需要注意以下五个关键点： 


* 插件外的默认设置不需要每次都实例化;
* Setter&Getter方法并非必需，但在每个主要循环运行前都要进行检查;
* 返回每个元素时不要破坏jQuery的方法链流程;
* 存储所有元素使用的数据，因为之后Setter&Getter方法可能会用到;
* 最后设置所有外部的Classes/Prototypes.

## 5. 简洁的代码 

简单的文件结构和简洁的代码是非常重要的，因为这不仅便于别人看懂代码，也利于你自己梳理结构。
强调这点是因为我遇到过一些奇怪的名称，连开发者自己都无法看懂。 

    ./images/ 
    ./includes/ 
    ./themes/ 
    ./wPaint.js 
    ./wPaint.min.js 
    ./wPaint.css 
    ./wPaint.min.css 

上面的这些结构就非常清晰，需要包含哪些文件，在哪里可以找到其他插件文件或是否需要查看jQuery库等等。 

## 6. 使用class原型 

这是一个相当广的范围，所以我在这里只简单提一下。

使用原型模式主要有两个原因： 

* 一是不必实例化每个方法的单独拷贝，这样的话效率更高，运行速度更快;
* 二是只引用每个对象方法，不保存其拷贝，可以节省大量内存.

    function Canvas(settings)
    {
        this.canvas = null;     
        this.ctx = null;
    }

    Canvas.prototype = 
    {
        generate: function()
        {
            //generate code
        }
    }

它还能帮你组织代码，使其能重复使用。
上面的例子中只有Canvas对象对每个新对象进行实例化，原型只是被引用而已。 

## 7. 提供Setters & Getters方法 

提供Setters & Getters方法并非必需，但我觉得这是一个不错的选择。

下面的代码是关于允许插件被修改，最基本的设置如下： 

    if(typeof option === 'object') {
        settings = option;
    } else if (typeof option === 'string') {
        if(this.data('_wPaint_canvas') &&
                defaultSettings[option] !== undefined
                ) {
            var canvas = this.data('_wPaint_canvas');

            if (settings) {
                canvas.settings[option] = settings;
                return true;
            }else{
                return canvas.settings[option];
            }
        } else return false;
    }

## 8. 在所有浏览器上进行测试 

在所有浏览器上进行测试对于插件是否能生存至关重要。
开发者无法发现代码中的故障，但用户肯定能发现，如果出现了很多问题，毫无疑问，你的插件就被淘汰了。

有一次，我在这个jQuery Color Picker Plugin插件中发现了一些小Bug，这些Bug令该插件在IE7中完全不可用，
原因是IE7不支持“inline-block”元素，但只需要一个简单的修正就可以解决这个问题。 

写好插件后，你会想在第一时间发布它，但一定要Hold住并多花一天来测试。
这样做不仅能修复任何可能出现的简单错误，还能给你一些改进的灵感。 

## 9. 打包发布 

当你准备好发布插件后，别忘记以下三个步骤： 

* 为较复杂的插件部分写说明文档;
* 无论是通过文件名还是在文档中某处标明你的插件版本，让用户能够了解自己使用的版本，并能及时检查更新;
* 最后为你的代码提供MINI版本，只需要几分钟便能增加开发者再次使用你的插件的机率.

要知道有时候细小的步骤却真正能令你的插件与众不同。 

## 10. 上传插件代码 

有很多提供上传服务的网站，但我最喜欢Github（如果没听说过git，请看看这篇文章：[Git教程 快速上手][2]）和Google Code。 

也许大多数开发者并不想上传自己的jQuery插件代码，特别是如果它是一个内部项目的话，但如果插件是为公众服务的，
那么Github和Google code将显示出其神奇之处：提供插件的问题报告、即时动态和下载数量。 

总之，以上这些技巧几乎涵盖了jQuery插件开发的核心，也为开发插件提供了一个比较标准的格式和结构。
无论你是业余的还是专业的开发者，使用插件的人数与你所获的成就感是成正比的。 

英文原文：[10 Tips for Writing Awesome jQuery Plugins][3]

[1]: http://www.websanova.com/plugins/websanova/tooltip
[2]: http://justjavac.com/git/2012/04/13/git-quick-start.html
[3]: http://www.queness.com/post/10828/10-tips-for-writing-awesome-jquery-plugins/