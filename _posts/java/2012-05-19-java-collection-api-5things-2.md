---
layout: post
title: 关于 Java Collections API 您不知道的 5 件事，第 2 部分
description: java.util 中的 Collections 类旨在通过取代数组提高 Java 性能。Collections 非常强大，但是很多变：使用它们要小心，滥用它们会带来风险。
keywords: api, collections, 算法
category : java
tags : [api, collections, 算法]
---

java.util 中的 Collections 类旨在通过取代数组提高 Java 性能。
如您在 [第 1 部分](http://justjavac.com/java/2012/05/18/java-collection-api-5things-1.html)中了解到的，它们也是多变的，能够以各种方式定制和扩展，帮助实现优质、简洁的代码。

Collections 非常强大，但是很多变：使用它们要小心，滥用它们会带来风险。

## 1. List 不同于数组

Java 开发人员常常错误地认为 ArrayList 就是 Java 数组的替代品。
Collections 由数组支持，在集合内随机查找内容时性能较好。
与数组一样，集合使用整序数获取特定项。
但集合不是数组的简单替代。

要明白数组与集合的区别需要弄清楚顺序 和位置 的不同。
例如，List 是一个接口，它保存各个项被放入集合中的顺序，如清单 1 所示：

清单 1. 可变键值
                               
    import java.util.*;

    public class OrderAndPosition {
        public static <T> void dumpArray(T[] array) {
            System.out.println("=============");
            for (int i=0; i<array.length; i++)
                System.out.println("Position " + i + ": " + array[i]);
        }
        
        public static <T> void dumpList(List<T> list) {
            System.out.println("=============");
            for (int i=0; i<list.size(); i++)
                System.out.println("Ordinal " + i + ": " + list.get(i));
        }
        
        public static void main(String[] args) {
            List<String> argList = new ArrayList<String>(Arrays.asList(args));

            dumpArray(args);
            args[1] = null;
            dumpArray(args);
            
            dumpList(argList);
            argList.remove(1);
            dumpList(argList);
        }
    }


当第三个元素从上面的 List 中被移除时，其 “后面” 的各项会上升填补空位。
很显然，此集合行为与数组的行为不同（事实上，从数组中移除项与从 List 中移除它也不完全是一回事儿 — 从数组中 “移除” 项意味着要用新引用或 null 覆盖其索引槽）。

## 2. 令人惊讶的 Iterator！

无疑 Java 开发人员很喜爱 Java 集合 Iterator，但是您最后一次使用 Iterator 接口是什么时候的事情了？
可以这么说，大部分时间我们只是将 Iterator 随意放到 `for()` 循环或加强 `for()` 循环中，然后就继续其他操作了。

但是进行深入研究后，您会发现 Iterator 实际上有两个十分有用的功能。

* 第一，Iterator 支持从源集合中安全地删除对象，只需在 Iterator 上调用 `remove()` 即可。
  这样做的好处是可以避免 `ConcurrentModifiedException`，这个异常顾名思意：当打开 Iterator 迭代集合时，同时又在对集合进行修改。
  有些集合不允许在迭代时删除或添加元素，但是调用 Iterator 的 `remove()` 方法是个安全的做法。

* 第二，Iterator 支持派生的（并且可能是更强大的）兄弟成员。
  ListIterator，只存在于 List 中，支持在迭代期间向 List 中添加或删除元素，并且可以在 List 中双向滚动。

双向滚动特别有用，尤其是在无处不在的 “滑动结果集” 操作中，因为结果集中只能显示从数据库或其他集合中获取的众多结果中的 10 个。
它还可以用于 “反向遍历” 集合或列表，而无需每次都从前向后遍历。
插入 ListIterator 比使用向下计数整数参数 `List.get()` “反向” 遍历 List 容易得多。

## 3. 并非所有 Iterable 都来自集合

Ruby 和 Groovy 开发人员喜欢炫耀他们如何能迭代整个文本文件并通过一行代码将其内容输出到控制台。
通常，他们会说在 Java 编程中完成同样的操作需要很多行代码：打开 `FileReader`，然后打开 `BufferedReader`，
接着创建 `while()` 循环来调用 `getLine()`，直到它返回 `null`。
当然，在 `try/catch/finally` 块中必须要完成这些操作，它要处理异常并在结束时关闭文件句柄。

这看起来像是一个没有意义的学术上的争论，但是它也有其自身的价值。

他们（包括相当一部分 Java 开发人员）不知道并不是所有 Iterable 都来自集合。
Iterable 可以创建 Iterator，该迭代器知道如何凭空制造下一个元素，而不是从预先存在的 Collection 中盲目地处理：

清单 2. 迭代文件
                         
    // FileUtils.java
    import java.io.*;
    import java.util.*;

    public class FileUtils {
        public static Iterable<String> readlines(String filename)
            throws IOException {
            final FileReader fr = new FileReader(filename);
            final BufferedReader br = new BufferedReader(fr);
            
            return new Iterable<String>() {
                    public <code>Iterator</code><String> iterator() {
                            return new <code>Iterator</code><String>() {
                                    public boolean hasNext() {
                                            return line != null;
                                    }
                                    
                                    public String next() {
                                            String retval = line;
                                            line = getLine();
                                            return retval;
                                    }
                                    
                                    public void remove() {
                                            throw new UnsupportedOperationException();
                                    }
                                    
                                    String getLine() {
                                            String line = null;
                                            try {
                                                    line = br.readLine();
                                            }
                                            catch (IOException ioEx) {
                                                    line = null;
                                            }
                                            return line;
                                    }
                                    
                                    String line = getLine();
                            };
                    }       
            };
        }
    }

    //DumpApp.java
    import java.util.*;

    public class DumpApp {
        public static void main(String[] args)
            throws Exception {
            for (String line : FileUtils.readlines(args[0]))
                System.out.println(line);
        }
    }


此方法的优势是不会在内存中保留整个内容，但是有一个警告就是，它不能 `close()` 底层文件句柄（每当 `readLine()` 返回 `null` 时就关闭文件句柄，可以修正这一问题，但是在 Iterator 没有结束时不能解决这个问题）。

## 4. 注意可变的 hashCode()

Map 是很好的集合，为我们带来了在其他语言（比如 Perl）中经常可见的好用的键/值对集合。
JDK 以 HashMap 的形式为我们提供了方便的 Map 实现，它在内部使用哈希表实现了对键的对应值的快速查找。
但是这里也有一个小问题：支持哈希码的键依赖于可变字段的内容，这样容易产生 bug，即使最耐心的 Java 开发人员也会被这些 bug 逼疯。

假设清单 3 中的 Person 对象有一个常见的 `hashCode()` （它使用 firstName、lastName 和 age 字段 — 所有字段都不是 `final` 字段 — 计算 `hashCode()`），
对 Map 的 `get()` 调用会失败并返回 `null`：

清单 3. 可变 hashCode() 容易出现 bug
                                
    // Person.java
    import java.util.*;

    public class Person implements Iterable<Person> {
        public Person(String fn, String ln, int a, Person... kids) {
            this.firstName = fn; this.lastName = ln; this.age = a;
            
            for (Person kid : kids)
                children.add(kid);
        }
        
        // ...
        
        public void setFirstName(String value) { this.firstName = value; }
        public void setLastName(String value) { this.lastName = value; }
        public void setAge(int value) { this.age = value; }
        
        public int hashCode() {
            return firstName.hashCode() & lastName.hashCode() & age;
        }

        // ...

        private String firstName;
        private String lastName;
        private int age;
        private List<Person> children = new ArrayList<Person>();
    }


    // MissingHash.java
    import java.util.*;

    public class MissingHash {
        public static void main(String[] args) {
            Person p1 = new Person("Ted", "Neward", 39);
            Person p2 = new Person("Charlotte", "Neward", 38);
            System.out.println(p1.hashCode());
            
            Map<Person, Person> map = new HashMap<Person, Person>();
            map.put(p1, p2);
            
            p1.setLastName("Finkelstein");
            System.out.println(p1.hashCode());
            
            System.out.println(map.get(p1));
        }
    }

很显然，这种方法很糟糕，但是解决方法也很简单：永远不要将可变对象类型用作 HashMap 中的键。

## 5. equals() 与 Comparable

在浏览 Javadoc 时，Java 开发人员常常会遇到 SortedSet 类型（它在 JDK 中唯一的实现是 TreeSet）。
因为 SortedSet 是 java.util 包中唯一提供某种排序行为的 Collection，所以开发人员通常直接使用它而不会仔细地研究它。
清单 4 展示了：

清单 4. SortedSet，我很高兴找到了它！
                          
    import java.util.*;

    public class UsingSortedSet {
        public static void main(String[] args) {
            List<Person> persons = Arrays.asList(
                new Person("Ted", "Neward", 39),
                new Person("Ron", "Reynolds", 39),
                new Person("Charlotte", "Neward", 38),
                new Person("Matthew", "McCullough", 18)
            );
            
            SortedSet ss = new TreeSet(new Comparator<Person>() {
                public int compare(Person lhs, Person rhs) {
                    return lhs.getLastName().compareTo(rhs.getLastName());
                }
            });
            
            ss.addAll(perons);
            System.out.println(ss);
        }
    }


使用上述代码一段时间后，可能会发现这个 Set 的核心特性之一：它不允许重复。
该特性在 Set Javadoc 中进行了介绍。
Set 是不包含重复元素的集合。
更准确地说，set 不包含成对的 e1 和 e2 元素，因此如果 `e1.equals(e2)`，那么最多包含一个 `null` 元素。

但实际上似乎并非如此 — 尽管 清单 4 中没有相等的 Person 对象（根据 Person 的 `equals()` 实现），
但在输出时只有三个对象出现在 TreeSet 中。

与 set 的有状态本质相反，TreeSet 要求对象直接实现 Comparable 或者在构造时传入 Comparator，它不使用 `equals()` 比较对象；
它使用 Comparator/Comparable 的 compare 或 compareTo 方法。

因此存储在 Set 中的对象有两种方式确定相等性：大家常用的 `equals()` 方法和 Comparable/Comparator 方法，采用哪种方法取决于上下文。

更糟的是，简单的声明两者相等还不够，因为以排序为目的的比较不同于以相等性为目的的比较：
可以想象一下按姓排序时两个 Person 相等，但是其内容却并不相同。

一定要明白 `equals()` 和 `Comparable.compareTo()` 两者之间的不同 — 实现 Set 时会返回 0。
甚至在文档中也要明确两者的区别。

## 结束语

Java Collections 库中有很多有用之物，如果您能加以利用，它们可以让您的工作更轻松、更高效。
但是发掘这些有用之物可能有点复杂，比如只要您不将可变对象类型作为键，您就可以用自己的方式使用 HashMap。

至此我们挖掘了 Collections 的一些有用特性，但我们还没有挖到金矿：
Concurrent Collections，它在 Java 5 中引入。

## 参考资料

* [Introduction to the Collections Framework][1]（MageLang Institute, Sun Developer Network, 1999）：这篇教程是很早以前的，但是很棒，它对并发集合之前的 Java Collections Framework 做了完整的介绍。

* [Java Collections Framework][]：阅读 Sun Microsystems 的 Java Collections Framework 和 API 文档。

* [关于 Java Collections API 您不知道的 5 件事，第 2 部分][3]：您可以在任何地方使用 Java 集合，但是一定要小心。
  集合有很多秘密，如果不正确处理可能会带来麻烦。
  Ted 探索了 Java Collections API 复杂、多变的一面并为您提供了一些技巧，帮您充分利用 Iterable、HashMap 和 SortedSet，又不会带来 bug。

[1]: http://java.sun.com/developer/onlineTraining/collections/Collection.html
[2]: http://java.sun.com/j2se/1.4.2/docs/guide/collections/index.html
[3]: http://justjavac.com/java/2012/05/18/java-collection-api-5things-2.html

## 关于作者

Ted Neward 是 Neward & Associates 的主管，负责有关 Java、.NET、XML 服务和其他平台的咨询、指导、培训和推介。
他现在居住在华盛顿州西雅图附近。