---
layout: post
title: java API 设计准则
description: 在java API设计中有着许多的各种规则与折衷考量，和其他所有复杂任务一样，它考验着我们的记忆力及脑力.
keywords: java, API, 设计准则
category : java
tags : [java]
---

在java API设计中有着许多的各种规则「[只要一个返回语句](http://justjavac.com/java/2012/05/18/a-return-to-good-code.html)」、「[关于返回 Null 值的问题](http://justjavac.com/java/2012/05/18/returning-null.html)」 与折衷考量，和其他所有复杂任务一样，它考验着我们的记忆力及脑力.
这里我找到了一个对正在设计java API的软件开发人员而言非常不错的[准则列表][1]，其中介绍的一些准则可能是很明显的，又或者不那么显眼，但确实非常不错，希望你会喜欢. 

这里摘录了一些： 

* 优先将API与其实现置于不同的包中. 
* 优先将API放入高层包中，实现则可放在低层包. 
* 考虑将大型API拆分成若干包. 
* 考虑将API与其实现包归置到不同的java文档中. 
* 避免对API中实现类的内部依赖. 
* 避免出现不必要的API碎裂（fragmentation）情况. 
* 不要将公共实现类放在API包中. 
* 不要在调用及实现类间创建依赖. 
* 不要将不相关的API放在不同的包中. 
* 不要将API与SPI（Service Provider Interface，服务提供者接口）放在同一个包中. 
* 不要移动及重命名已发布的公共API包. 

完整的准则列表点击[这里][1]查看. 

[1]: http://theamiableapi.com/2012/01/16/java-api-design-checklist/

