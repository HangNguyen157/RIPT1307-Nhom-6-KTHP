import type { Comment } from '../models/Comment';
import type { Question } from '../models/Question';

export const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    title:
      'Giải thích OOP trong Java: Class, Object, Inheritance và Polymorphism',
    excerpt:
      'OOP là nền tảng của Java. Trong bài viết này, tôi sẽ giải thích chi tiết về các khái niệm cốt lõi như Class, Object, Inheritance và cách sử dụng trong thực tế...',
    author: 'Nguyễn Văn A',
    authorId: '2',
    authorRole: 'sinhvien',
    tags: ['Java', 'OOP', 'Lập Trình'],
    votes: 45,
    comments: 12,
    views: 523,
    timestamp: '2 giờ trước',
    subject: 'Lập Trình Cơ Bản',
    isSolved: true,
    status: 'active',
    createdAt: '09/05/2026',
  },
  {
    id: '2',
    title: 'React Hooks: useState, useEffect, useContext - Hướng dẫn toàn diện',
    excerpt:
      'React Hooks là một cách mới để viết components trong React. Bài viết này sẽ hướng dẫn bạn cách sử dụng các hooks phổ biến nhất trong dự án thực tế...',
    author: 'Trần Thị B',
    tags: ['React', 'JavaScript', 'Web Development'],
    votes: 67,
    comments: 23,
    views: 892,
    timestamp: '5 giờ trước',
    subject: 'Web Development',
    isSolved: false,
    status: 'active',
    createdAt: '08/05/2026',
  },
  {
    id: '3',
    title: 'Cấu trúc dữ liệu: Stack và Queue - Cài đặt và ứng dụng thực tế',
    excerpt:
      'Stack và Queue là hai cấu trúc dữ liệu quan trọng. Hôm nay chúng ta sẽ tìm hiểu về cách thực hiện, ứng dụng trong thực tế và so sánh với các CTDL khác...',
    author: 'Lê Văn C',
    authorId: '3',
    tags: ['Cấu Trúc Dữ Liệu', 'Thuật Toán', 'Java'],
    votes: 34,
    comments: 8,
    views: 421,
    timestamp: '1 ngày trước',
    subject: 'Cấu Trúc Dữ Liệu',
    isSolved: true,
    status: 'active',
    createdAt: '06/05/2026',
  },
  {
    id: '4',
    title: 'SQL: JOIN, Subquery, và Optimization - Tối ưu truy vấn database',
    excerpt:
      'JOIN là một trong những khái niệm quan trọng nhất trong SQL. Bài viết này sẽ giáo dạy bạn cách dùng các loại JOIN, subquery và tối ưu performance...',
    author: 'Phạm Minh D',
    authorId: '5',
    tags: ['SQL', 'Database', 'Optimization'],
    votes: 56,
    comments: 15,
    views: 734,
    timestamp: '2 ngày trước',
    subject: 'Cơ Sở Dữ Liệu',
    isSolved: false,
    status: 'active',
    createdAt: '07/05/2026',
  },
  {
    id: '5',
    title: 'Git & GitHub: Quản lý phiên bản hiệu quả cho team lớn',
    excerpt:
      'Git là công cụ không thể thiếu trong phát triển phần mềm. Hãy học cách sử dụng Git và GitHub trong môi trường team...',
    author: 'Hoàng Anh E',
    authorId: '6',
    tags: ['Git', 'GitHub', 'DevOps'],
    votes: 78,
    comments: 31,
    views: 1023,
    timestamp: '3 ngày trước',
    isSolved: true,
    status: 'active',
    createdAt: '05/05/2026',
  },
  {
    id: '6',
    title: 'Python: List Comprehension, Lambda và Functional Programming',
    excerpt:
      'Python có những tính năng rất tiện lợi để viết code ngắn gọn. Hôm nay tôi sẽ chia sẻ các kỹ thuật nâng cao...',
    author: 'Đặng Tuấn F',
    tags: ['Python', 'Lập Trình', 'Functional'],
    votes: 42,
    comments: 11,
    views: 356,
    timestamp: '4 ngày trước',
    isSolved: false,
    status: 'active',
    createdAt: '04/05/2026',
  },
];

const QUESTION_1_CONTENT = `OOP (Object-Oriented Programming) là một mô hình lập trình dựa trên khái niệm "đối tượng". Trong Java, OOP là nền tảng cốt lõi.

## 1. Class và Object

**Class** là bản thiết kế, mẫu để tạo ra object.
**Object** là một instance (thể hiện) của class.

\`\`\`java
public class Car {
    String color;
    String brand;
    
    public Car(String color, String brand) {
        this.color = color;
        this.brand = brand;
    }
    
    public void display() {
        System.out.println("Car: " + brand + " - " + color);
    }
}

// Tạo Object
Car myCar = new Car("red", "Toyota");
myCar.display(); // Output: Car: Toyota - red
\`\`\`

## 2. Inheritance (Kế thừa)

Inheritance cho phép một class con kế thừa thuộc tính và phương thức từ class cha.

\`\`\`java
public class Vehicle {
    String color;
    
    public void move() {
        System.out.println("Moving...");
    }
}

public class Car extends Vehicle {
    String brand;
    
    @Override
    public void move() {
        System.out.println("Car is moving with brand: " + brand);
    }
}
\`\`\`

## 3. Polymorphism (Đa Hình)

Polymorphism cho phép các object khác nhau phản hồi cùng một phương thức theo cách riêng.`;

export const MOCK_COMMENTS_BY_QUESTION: Record<string, Comment[]> = {
  '1': [
    {
      id: '1',
      questionId: '1',
      author: 'PGS.TS Lê Minh Đức',
      authorId: '3',
      authorRole: 'giangvien',
      authorRep: 5430,
      avatar: 'L',
      timestamp: '1 giờ trước',
      votes: 28,
      isBest: true,
      content: `Đây là một câu hỏi rất hay về OOP! Để hiểu rõ hơn, mình sẽ giải thích từng khái niệm:

**Class** là bản thiết kế (blueprint) – giống như bản vẽ kỹ thuật của một chiếc xe.
**Object** là thực thể cụ thể – chiếc xe thật được tạo ra từ bản vẽ đó.

\`\`\`java
// Class = Bản thiết kế
class Student {
    String name;
    int age;
    
    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    void study() {
        System.out.println(name + " đang học...");
    }
}

// Object = Thực thể
Student s1 = new Student("An", 20);
Student s2 = new Student("Bình", 21);
s1.study(); // An đang học...
\`\`\`

Về **Inheritance**, đây là cơ chế quan trọng nhất trong OOP. Con kế thừa tất cả từ cha.`,
      replies: [
        {
          id: 'r1',
          author: 'Trần Văn B',
          authorId: '4',
          timestamp: '45 phút trước',
          content:
            'Cảm ơn thầy! Phần về polymorphism thầy có thể giải thích thêm không ạ?',
          votes: 3,
        },
      ],
    },
    {
      id: '2',
      questionId: '1',
      author: 'Trần Thị Hương',
      authorId: '2',
      authorRole: 'sinhvien',
      authorRep: 1250,
      avatar: 'T',
      timestamp: '30 phút trước',
      votes: 12,
      isBest: false,
      content: `Bổ sung thêm về **Encapsulation** (Đóng gói) - cũng là một trụ cột quan trọng của OOP:

\`\`\`java
public class BankAccount {
    private double balance; // Ẩn dữ liệu
    
    public double getBalance() { // Getter
        return balance;
    }
    
    public void deposit(double amount) { // Setter với validation
        if (amount > 0) balance += amount;
    }
}
\`\`\`

Encapsulation giúp bảo vệ dữ liệu và giảm sự phụ thuộc giữa các module.`,
      replies: [],
    },
  ],
};

export function getQuestionById(id: string): Question | undefined {
  const base = MOCK_QUESTIONS.find((q) => q.id === id);
  if (!base) return undefined;
  if (id === '1') {
    return { ...base, content: QUESTION_1_CONTENT, authorRep: 1250 };
  }
  return base;
}

export function getCommentsByQuestionId(id: string): Comment[] {
  return MOCK_COMMENTS_BY_QUESTION[id] ?? [];
}
