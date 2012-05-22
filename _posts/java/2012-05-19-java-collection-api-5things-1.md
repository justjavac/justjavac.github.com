---
layout: post
title: 关于 Java Collections API 您不知道的 5 件事，第 1 部分
description: 对于很多 Java 开发人员来说，Java Collections API 是标准 Java 数组及其所有缺点的一个非常需要的替代品。将 Collections 主要与 ArrayList 联系到一起本身没有错，但是对于那些有探索精神的人来说，这只是 Collections 的冰山一角。
keywords: api, collections, 算法
category : java
tags : [api, collections, 算法]
---

对于很多 Java 开发人员来说，Java Collections API 是标准 Java 数组及其所有缺点的一个非常需要的替代品。
将 Collections 主要与 ArrayList 联系到一起本身没有错，但是对于那些有探索精神的人来说，这只是 Collections 的冰山一角。

虽然 Map（以及它的常用实现 HashMap）非常适合名-值对或键-值对，但是没有理由让自己局限于这些熟悉的工具。
可以使用适当的 API，甚至适当的 Collection 来修正很多易错的代码。

之所以花这么大的篇幅讨论 Collections，是因为这些集合在 Java 编程中是如此重要。
首先我将讨论做每件事的最快（但也许不是最常见）的方式，例如将 Array 中的内容转移到 List。
然后我们深入探讨一些较少人知道的东西，例如编写定制的 Collections 类和扩展 Java Collections API。

## 1. Collections 比数组好

刚接触 Java 技术的开发人员可能不知道，Java 语言最初包括数组，是为了应对上世纪 90 年代初期 C++ 开发人员对于性能方面的批评。
从那时到现在，我们已经走过一段很长的路，如今，与 Java Collections 库相比，数组不再有性能优势。

例如，若要将数组的内容转储到一个字符串，需要迭代整个数组，然后将内容连接成一个 String；
而 Collections 的实现都有一个可用的 `toString()` 实现。

除少数情况外，好的做法是尽快将遇到的任何数组转换成集合。
于是问题来了，完成这种转换的最容易的方式是什么？
事实证明，Java Collections API 使这种转换变得容易，如清单 1 所示：

清单 1. ArrayToList

    import java.util.*;

    public class ArrayToList {
        public static void main(String[] args) {
            // This gives us nothing good
            System.out.println(args);

            // Convert args to a List of String
            List<String> argList = Arrays.asList(args);

            // Print them out
            System.out.println(argList);
        }
    }


注意，返回的 List 是不可修改的，所以如果尝试向其中添加新元素将抛出一个 UnsupportedOperationException。

而且，由于 `Arrays.asList()` 使用 varargs 参数表示添加到 List 的元素，所以还可以使用它轻松地用以 new 新建的对象创建 List。

## 2. 迭代的效率较低

将一个集合（特别是由数组转化而成的集合）的内容转移到另一个集合，或者从一个较大对象集合中移除一个较小对象集合，
这些事情并不鲜见。

您也许很想对集合进行迭代，然后添加元素或移除找到的元素，但是不要这样做。

在此情况下，迭代有很大的缺点：

* 每次添加或移除元素后重新调整集合将非常低效;
* 每次在获取锁、执行操作和释放锁的过程中，都存在潜在的并发困境;
* 当添加或移除元素时，存取集合的其他线程会引起竞争条件.

可以通过使用 addAll 或 removeAll，传入包含要对其添加或移除元素的集合作为参数，来避免所有这些问题。

## 3. 用 for 循环遍历任何 Iterable

Java 5 中加入 Java 语言的最大的便利功能之一，增强的 for 循环，消除了使用 Java 集合的最后一道障碍。

以前，开发人员必须手动获得一个 Iterator，使用 `next()` 获得 Iterator 指向的对象，并通过 `hasNext()` 检查是否还有更多可用对象。
从 Java 5 开始，我们可以随意使用 for 循环的变种，它可以在幕后处理上述所有工作。

实际上，这个增强适用于实现 Iterable 接口的任何对象，而不仅仅是 Collections。

清单 2 显示通过 Iterator 提供 Person 对象的孩子列表的一种方法。 
这里不是提供内部 List 的一个引用 （这使 Person 外的调用者可以为家庭增加孩子 — 而大多数父母并不希望如此），
Person 类型实现 Iterable。这种方法还使得 for 循环可以遍历所有孩子。

清单 2. 增强的 for 循环：显示孩子

    // Person.java
    import java.util.*;

    public class Person implements Iterable<Person> {
        public Person(String fn, String ln, int a, Person... kids) {
            this.firstName = fn; this.lastName = ln; this.age = a;
            for (Person child : kids)
                children.add(child);
        }
        
        public String getFirstName() { return this.firstName; }
        public String getLastName() { return this.lastName; }
        public int getAge() { return this.age; }

        public Iterator<Person> iterator() { return children.iterator(); }

        public void setFirstName(String value) { this.firstName = value; }
        public void setLastName(String value) { this.lastName = value; }
        public void setAge(int value) { this.age = value; }

        public String toString() { 
            return "[Person: " +
            "firstName=" + firstName + " " +
            "lastName=" + lastName + " " +
            "age=" + age + "]";
        }

        private String firstName;
        private String lastName;
        private int age;
        private List<Person> children = new ArrayList<Person>();
    }

    // App.java
    public class App {
        public static void main(String[] args) {
            Person ted = new Person("Ted", "Neward", 39,
            new Person("Michael", "Neward", 16），
            new Person("Matthew", "Neward", 10));

            // Iterate over the kids
            for (Person kid : ted) {
                System.out.println(kid.getFirstName());
            }
        }
    }

在域建模的时候，使用 Iterable 有一些明显的缺陷，因为通过 `iterator()` 方法只能那么 “隐晦” 地支持一个那样的对象集合。
但是，如果孩子集合比较明显，Iterable 可以使针对域类型的编程更容易，更直观。

## 4. 经典算法和定制算法

您是否曾想过以倒序遍历一个 Collection？
对于这种情况，使用经典的 Java Collections 算法非常方便。

在上面的 清单 2 中，Person 的孩子是按照传入的顺序排列的；但是，现在要以相反的顺序列出他们。
虽然可以编写另一个 for 循环，按相反顺序将每个对象插入到一个新的 ArrayList 中，但是 3、4 次重复这样做之后，就会觉得很麻烦。

在此情况下，清单 3 中的算法就有了用武之地：

清单 3. ReverseIterator 

    public class ReverseIterator {
        public static void main(String[] args) {
            Person ted = new Person("Ted", "Neward", 39,
            new Person("Michael", "Neward", 16），
            new Person("Matthew", "Neward", 10));

            // Make a copy of the List
            List<Person> kids = new ArrayList<Person>(ted.getChildren());
            // Reverse it
            Collections.reverse(kids);
            // Display it
            System.out.println(kids);
        }
    }


Collections 类有很多这样的 “算法”，它们被实现为静态方法，以 Collections 作为参数，提供独立于实现的针对整个集合的行为。

而且，由于很棒的 API 设计，我们不必完全受限于 Collections 类中提供的算法 — 例如，
我喜欢不直接修改（传入的 Collection 的）内容的方法。
所以，可以编写定制算法是一件很棒的事情，例如清单 4 就是一个这样的例子：

清单 4. ReverseIterator 使事情更简单

    class MyCollections {
        public static <T> List<T> reverse(List<T> src) {
            List<T> results = new ArrayList<T>(src);
            Collections.reverse(results);
            return results;
        }
    }

## 5. 扩展 Collections API

以上定制算法阐释了关于 Java Collections API 的一个最终观点：它总是适合加以扩展和修改，以满足开发人员的特定目的。

例如，假设您需要 Person 类中的孩子总是按年龄排序。
虽然可以编写代码一遍又一遍地对孩子排序（也许是使用 Collections.sort 方法），但是通过一个 Collection 类来自动排序要好得多。

实际上，您甚至可能不关心是否每次按固定的顺序将对象插入到 Collection 中（这正是 List 的基本原理）。
您可能只是想让它们按一定的顺序排列。

java.util 中没有 Collection 类能满足这些需求，但是编写一个这样的类很简单。
只需创建一个接口，用它描述 Collection 应该提供的抽象行为。
对于 SortedCollection，它的作用完全是行为方面的。

清单 5. SortedCollection

    public interface SortedCollection<E> extends Collection<E> {
        public Comparator<E> getComparator();
        public void setComparator(Comparator<E> comp);
    }


编写这个新接口的实现简直不值一提：

清单 6. ArraySortedCollection

    import java.util.*;

    public class ArraySortedCollection<E> implements SortedCollection<E>, Iterable<E> {
    
        private Comparator<E> comparator;
        private ArrayList<E> list;

        public ArraySortedCollection(Comparator<E> c) {
            this.list = new ArrayList<E>();
            this.comparator = c;
        }
    
        public ArraySortedCollection(Collection<? extends E> src, Comparator<E> c) {
            this.list = new ArrayList<E>(src);
            this.comparator = c;
            sortThis();
        }

        public Comparator<E> getComparator() { 
            return comparator; 
        }
        public void setComparator(Comparator<E> cmp) { 
            comparator = cmp; sortThis(); 
        }

        public boolean add(E e) { 
            boolean r = list.add(e); sortThis(); return r; 
        }
        
        public boolean addAll(Collection<? extends E> ec) { 
            boolean r = list.addAll(ec); sortThis(); return r; 
        }
        
        public boolean remove(Object o) { 
            boolean r = list.remove(o); sortThis(); return r; 
        }
        
        public boolean removeAll(Collection<?> c) { 
            boolean r = list.removeAll(c); sortThis(); return r; 
        }
           
        public boolean retainAll(Collection<?> ec) { 
            boolean r = list.retainAll(ec); sortThis(); return r; 
        }

        public void clear() { 
            list.clear(); 
        }
        
        public boolean contains(Object o) { 
            return list.contains(o); 
        }
        
        public boolean containsAll(Collection <?> c) { 
            return list.containsAll(c); 
        }
        
        public boolean isEmpty() { 
            return list.isEmpty(); 
        }
        
        public Iterator<E> iterator() { 
            return list.iterator(); 
        }
        
        public int size() { 
            return list.size(); 
        }
        
        public Object[] toArray() { 
            return list.toArray(); 
        }
        
        public <T> T[] toArray(T[] a) { 
            return list.toArray(a); 
        }

        public boolean equals(Object o) {
            if (o == this)
                return true;

            if (o instanceof ArraySortedCollection) {
                ArraySortedCollection<E> rhs = (ArraySortedCollection<E>)o;
                return this.list.equals(rhs.list);
            }

            return false;
        }
    
        public int hashCode() {
            return list.hashCode();
        }
        
        public String toString() {
            return list.toString();
        }

        private void sortThis() {
            Collections.sort(list, comparator);
        }
    }


这个实现非常简陋，编写时并没有考虑优化，显然还需要进行重构。
但关键是 Java Collections API 从来无意将与集合相关的任何东西定死。
它总是需要扩展，同时也鼓励扩展。

当然，有些扩展比较复杂，例如 java.util.concurrent 中引入的扩展。
但是另一些则非常简单，只需编写一个定制算法，或者已有 Collection 类的简单的扩展。

扩展 Java Collections API 看上去很难，但是一旦开始着手，您会发现远不如想象的那样难。

## 参考资料

* [Introduction to the Collections Framework][1]（MageLang Institute, Sun Developer Network, 1999）：这篇教程是很早以前的，但是很棒，它对并发集合之前的 Java Collections Framework 做了完整的介绍。

* [Java Collections Framework][]：阅读 Sun Microsystems 的 Java Collections Framework 和 API 文档。

* [关于 Java Collections API 您不知道的 5 件事，第 2 部分][3]：您可以在任何地方使用 Java 集合，但是一定要小心。
  集合有很多秘密，如果不正确处理可能会带来麻烦。
  Ted 探索了 Java Collections API 复杂、多变的一面并为您提供了一些技巧，帮您充分利用 Iterable、HashMap 和 SortedSet，又不会带来 bug。

[1]: http://java.sun.com/developer/onlineTraining/collections/Collection.html
[2]: http://java.sun.com/j2se/1.4.2/docs/guide/collections/index.html
[3]: http://justjavac.com/java/2012/05/18/java-collection-api-5things-2

## 关于作者

Ted Neward 是 Neward & Associates 的主管，负责有关 Java、.NET、XML 服务和其他平台的咨询、指导、培训和推介。
他现在居住在华盛顿州西雅图附近。