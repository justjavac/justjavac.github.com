
**如何可以取得 artDialog 的div**

**问题描述**

如何把 artDialog 生成的html代码放到一个固定的DIV里面

**解答**

在artDialog中可以通过三种方法实现。

1.  获取内容方法一: 直接引用返回

        var dialog = art.dialog({
            title: '标题',
            content: '我是对话框的内容'
        });
        
        dialog.content('对话框内容被改变了').title('提示');
    
2.  获取内容方法二: 通过对话框ID

        art.dialog({
            id: 'KDf435',
            title: '警告',
            content: '我是初始化的内容'
        });
        
        art.dialog.list['KDf435'].content('对话框内容被扩展方法改变了');
    
    art.dialog.list 方法返回一个数组，包括页面内所有的artdialog对话框列表。
    可以用list方法查找到你想要操作的对话框，调用content方法，取得或者改变对话框的内容。

3.  获取内容方法三: 回调函数中this

        art.dialog({
            title: '警告',
            content: '我是初始化的内容',
            ok: function () {
                this.content('你点了确定按钮').lock();
                return false;
            },
            init: function () {
                this.content('对话框内容被改变了');
            }
        });
    
    在回调函数中，this变量引用的就是当前的对话框。
    
**如何关闭follow模式**

**问题描述**


普通调用 
    $.dialog({content:'hello world!'});

使用选择器方式，此时自动使用绑定了live click事件，
同时启用follow模式 

    $('#main .test').dialog({content: 'hello world'});

使用选择器方式调用时如何关闭follow模式？

**解答**

在artDialog中，follow模式是指：“让对话框吸附到指定元素附近”。

如果想关闭follow模式，首先需要找到此artDialog对话框的引用，可以通过list得到：

>> id: 设定对话框唯一标识。用途：
>>   1、防止重复弹出
>>   2、定义id后可以使用art.dialog.list[youID]获取扩展方法

找到artDialog对话框的引用后，就可以通过调用follow方法关闭自动吸附，只需要在参数中传入null即可。

**artDialog原生版与jquery有什么区别**

**问题描述**

下载完artDialog发现了很多文件，而且据说artDialog有原生版和jquery，这两个版本有什么区别，使用时有什么不同吗？

**解答**

在artDialog的首页说明中写道：

>> 它的消息容器甚至能够根据宽度让文本居中或居左对齐——**这一切全是XHTML+CSS原生实现**。

鉴于jquery的流行，作者又提供了jquery版本的artDialog供那些jquery粉丝使用

>> artDialog提供了一个jQuery版本，功能与标准版一致，调用只需要把art前缀改成jQuery的命名空间。
>>  
>> **注意**：最低兼容jquery1.3.2，但框架应用插件需要jquery1.4+运行。

估计很多人看晕了，既然最低兼容1.3.2，为什么又说必须1.4+才能运行呢？

>> jQuery版本小于1.4不能获取iframe内部尺寸，导致open方法无法自适应内容尺寸。

在使用jquery版的artDialog时，需要先加载jquery库，当然了，别忘了作者的忠告，1.4+版本。

有很多人对jquery版的有误解，在群里曾有人说到：

>> 我发现artDialog jq版并不能算是纯JQ版。里面好多原生JS，JQ都有提供方法，但他没用

其实，jquery版artDialog并不是用jq方法写的，而是作为jquery的一个插件提供，可以用jquery的方式调用，
比如链式操作等，但是artDialog的代码都是原生的xhtml和css，代码也是原生的js。

**关于框架iframe的问题**





