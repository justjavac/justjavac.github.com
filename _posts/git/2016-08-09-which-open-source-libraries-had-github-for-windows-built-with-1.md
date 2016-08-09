---
layout: post
title: GitHub for Windows 使用了哪些开源库（一）
categories: [git]
tags: [GitHub, 开源]
---

GitHub for Windows 是一个 Metro 风格应用程序，集成了 git，bash 命令行 shell，PowerShell 的 posh-git 扩展。GitHub 为 Windows 用户提供了一个基本的 GUI 去处理大部分常用版本控制任务，可以创建版本库，向本地版本库递交补丁，在本地和远程版本库之间同步。

GitHub 作为全球最大的开源社区，GitHub for Windows 自然也是构建在强大的开源软件之上，那么 GitHub for Windows 都用到了哪些开源软件呢？

1. Akavache

    ![Akavache](/assets/images/akavache.png)

    <https://github.com/akavache/Akavache>

    Akavache 是一个 C# 的异步 Key-Value 存储系统，支持持久化。可以用来作为 NoSQL 数据库，甚至是缓存来使用。

2. AvalonEdit

    ![AvalonEdit](/assets/images/avalonedit.png)

    <https://github.com/icsharpcode/AvalonEdit>

    AvalonEdit 是基于 WPF 的可扩展的文本编辑器。AvalonEdit 支持语法高亮、智能提示、代码折叠、撤销&重做，另外，还支持不少快捷键；可以说是该有的功能基本上都有了。AvalonEdit 可以独立作为一个编辑器使用，也可以嵌入到其他软件中。

3. Caliburn.Micro

    <https://github.com/BlueSpire/Caliburn.Micro>

    Caliburn 是 Rob Eisenberg 在 2009 年提出的一个开源框架，可以应用于 WPF，Silverlight，WP7 等，框架基于 MVVM 模式，像它的名字一样，是企业级应用的一把利器。

4. CEF

    <https://bitbucket.org/chromiumembedded/cef>

    CEF 全称是 Chromium Embedded Framework（Chromium 嵌入式框架），它主要目的是开发一个基于 Google Chromium 的 Webbrowser 控件。CEF 支持一系列的编程语言和操作系统，并且能很容易地整合到新的或已有的工程中去。

    它的设计思想政治就是易用且兼顾性能。CEF 基本的框架包含 C/C++ 程序接口，通过本地库的接口来实现，而这个库则会隔离宿主程序和 Chromium & Webkit 的操作细节。它在浏览器控件和宿主程序之间提供紧密的整合，它支持用户插件，协议，JavaScript 对象以及 javascript 扩展，宿主程序可以随意地控件资源下载，导航，下下文内容和打印等，并且可以跟 Google Chrome 浏览器一起，支持高性能和 HTML5 技术。

5. CefSharp

    ![CefSharp](/assets/images/cefsharp.png)

    <https://github.com/CefSharp/CefSharp>

    CefSharp 就是上面提到的 CEF 的 .NET 类库。

6. DotNetZip

    <http://dotnetzip.codeplex.com>

    DotNetZip 是一款比 SharpZipLib 更好用（据说是，具体我也没用过）的开源 ZIP 库，使用它可以很容易地创建、解压以及更新 ZIP 文件。

    ```
    using (ZipFile zip = new ZipFile())
    {
        // add this map file into the "images" directory in the zip archive
        zip.AddFile("c:\\images\\personal\\7440-N49th.png", "images");
        // add the report into a different directory in the archive
        zip.AddFile("c:\\Reports\\2008-Regional-Sales-Report.pdf", "files");
        zip.AddFile("ReadMe.txt");
        zip.Save("MyZipFile.zip");
    }
    ```

7. Json.NET

    <https://github.com/JamesNK/Newtonsoft.Json>

    Json.NET（现在 github 上的名字是 Newtonsoft.Json）是一款 .NET 平台中开源的 JSON 序列化和反序列化类库。

8. libgit2 - the Git linkable library

    <https://github.com/libgit2/libgit2>

    libgit2 是一个可移植、纯 C 语言实现的 Git 核心开发包，你可以使用它来编写自定义的 Git 应用。

    libgit2已被广泛应用在许多应用程序上，包括 GitHub 网站，还被应用在 Plastic SCM 和强大的微软 Visual Studio 工具箱。

9. LibGit2Sharp

    <https://github.com/libgit2/libgit2sharp>

    LibGit2Sharp 是一个轻量级的 .NET 封装 libgit2 库。