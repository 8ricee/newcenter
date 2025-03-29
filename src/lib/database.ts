import type React from "react";

// Định nghĩa các types
export type CourseLevel = "Cơ bản" | "Trung cấp" | "Nâng cao";
export type CourseLanguage =
  | "Tiếng Anh"
  | "Tiếng Nhật"
  | "Tiếng Hàn"
  | "Tiếng Trung"
  | "Tiếng Pháp"
  | "Tiếng Đức"
  | "Tiếng Tây Ban Nha";
export type CourseFormat = "Trực tiếp" | "Trực tuyến" | "Kết hợp";
export type ClassStatus = "Còn chỗ" | "Sắp đầy" | "Hết chỗ";
export type BlogCategory =
  | "Tin tức"
  | "Mẹo học"
  | "Văn hóa"
  | "Sự kiện"
  | "Khóa học"
  | "Ngữ pháp"
  | "Từ vựng";

// Interfaces
export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  image: string;
  level: CourseLevel;
  language: CourseLanguage;
  duration: string;
  lessons: number;
  hoursPerLesson: number;
  schedule: string;
  groupSize: string;
  format: CourseFormat;
  price: number;
  promotionPrice?: number;
  hasPromotion: boolean;
  promotionPercent: number;
  isPopular: boolean;
  isNew: boolean;
  features: string[];
  curriculum: CourseCurriculum[];
  requirements: string[];
  outcomes: string[];
  teacherIds: number[];
  relatedCourseIds: number[];
  testimonialIds: number[];
  faq: CourseFAQ[];
}

export interface CourseCurriculum {
  title: string;
  lessons: {
    title: string;
    duration: string;
    description: string;
  }[];
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface Teacher {
  id: number;
  name: string;
  slug: string;
  position: string;
  avatar: string;
  languages: CourseLanguage[];
  bio: string;
  fullBio: string;
  education: string;
  experience: string;
  specialization: string;
  achievements: string[];
  courseIds: number[];
  socialMedia: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  scheduleAvailability: {
    day: string;
    hours: string;
  }[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: BlogCategory;
  tags: string[];
  date: string;
  author: {
    id: number;
    name: string;
    avatar: string;
    role: string;
  };
  readTime: string;
  relatedPostIds: number[];
}

export interface ClassSchedule {
  id: number;
  courseId: number;
  courseName: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  time: string;
  teacherId: number;
  teacher: string;
  location: string;
  room: string;
  language: CourseLanguage;
  level: CourseLevel;
  status: ClassStatus;
  maxStudents: number;
  currentStudents: number;
  price: number;
  promotionPrice?: number;
  registrationLink: string;
  format: CourseFormat;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  courseId: number;
  course: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Dữ liệu khóa học
export const courses: Course[] = [];

// Dữ liệu giảng viên
export const teachers: Teacher[] = [];

// Dữ liệu blog
export const blogPosts: BlogPost[] = [];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 1,
    course: "IELTS Academic",
    rating: 5,
    comment:
      "Tôi đã đạt được 7.0 IELTS sau khóa học. Giáo viên tận tâm và phương pháp học hiệu quả.",
    date: "15/05/2023",
    verified: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 3,
    course: "Tiếng Nhật N3",
    rating: 5,
    comment:
      "Môi trường học thân thiện, giáo viên nhiệt tình. Tôi đã vượt qua kỳ thi JLPT N3 dễ dàng.",
    date: "20/05/2023",
    verified: true,
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 1,
    course: "Tiếng Anh giao tiếp",
    rating: 4,
    comment:
      "Khóa học giúp tôi tự tin hơn khi giao tiếp bằng tiếng Anh trong công việc.",
    date: "25/05/2023",
    verified: false,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 4,
    course: "Tiếng Hàn cơ bản",
    rating: 5,
    comment:
      "Chỉ sau 3 tháng học, tôi đã có thể giao tiếp cơ bản bằng tiếng Hàn và hiểu được văn hóa Hàn Quốc.",
    date: "30/05/2023",
    verified: true,
  },
  {
    id: 5,
    name: "Hoàng Minh E",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 2,
    course: "TOEIC 4 kỹ năng",
    rating: 5,
    comment:
      "Đạt 850 điểm TOEIC sau khóa học. Phương pháp luyện thi hiệu quả và đội ngũ giáo viên chuyên nghiệp.",
    date: "01/06/2023",
    verified: true,
  },
  {
    id: 6,
    name: "Vũ Thị F",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 6,
    course: "Tiếng Trung thương mại",
    rating: 4,
    comment:
      "Khóa học giúp tôi tự tin giao tiếp với đối tác Trung Quốc. Giáo viên nhiệt tình và tài liệu học phong phú.",
    date: "05/06/2023",
    verified: false,
  },
  {
    id: 7,
    name: "Đặng Thanh G",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 1,
    course: "Tiếng Anh giao tiếp",
    rating: 5,
    comment:
      "Khóa học rất hữu ích, giúp tôi cải thiện đáng kể khả năng giao tiếp tiếng Anh.",
    date: "10/06/2023",
    verified: true,
  },
  {
    id: 8,
    name: "Lý Thị H",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 2,
    course: "IELTS Academic",
    rating: 4,
    comment: "Giáo viên nhiệt tình, tài liệu luyện thi sát với đề thi thật.",
    date: "15/06/2023",
    verified: true,
  },
  {
    id: 9,
    name: "Cao Văn I",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 3,
    course: "Tiếng Nhật cho người mới bắt đầu",
    rating: 5,
    comment: "Khóa học giúp tôi có nền tảng vững chắc để học tiếng Nhật.",
    date: "20/06/2023",
    verified: true,
  },
  {
    id: 10,
    name: "Hồ Thị K",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 4,
    course: "Tiếng Hàn giao tiếp",
    rating: 4,
    comment: "Môi trường học tập thân thiện, giáo viên tận tâm.",
    date: "25/06/2023",
    verified: false,
  },
  {
    id: 11,
    name: "Phan Anh L",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 5,
    course: "TOEIC 4 kỹ năng",
    rating: 5,
    comment: "Khóa học giúp tôi đạt điểm cao trong kỳ thi TOEIC.",
    date: "30/06/2023",
    verified: true,
  },
  {
    id: 12,
    name: "Trịnh Thị M",
    avatar: "/placeholder.svg?height=100&width=100",
    courseId: 6,
    course: "Tiếng Trung thương mại",
    rating: 4,
    comment: "Khóa học giúp tôi tự tin giao tiếp với đối tác Trung Quốc.",
    date: "05/07/2023",
    verified: true,
  },
];
