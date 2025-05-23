// Mock data for dentists and services

export const services = [
  {
    id: "s1",
    name: "Профилактичен преглед",
    description: "Редовен преглед за поддържане на здравето на зъбите",
    price: 50,
    duration: 30,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "s2",
    name: "Поставяне на имплант",
    description: "Възстановяване на липсващи зъби с импланти",
    price: 1200,
    duration: 120,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "s3",
    name: "Лечение на кариес",
    description: "Премахване на кариес и възстановяване на зъба",
    price: 80,
    duration: 60,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "s4",
    name: "Професионално избелване",
    description: "Процедура за избелване на зъбите",
    price: 250,
    duration: 90,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "s5",
    name: "Ортодонтско лечение",
    description: "Корекция на зъбни деформации с брекети",
    price: 3000,
    duration: 180,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "s6",
    name: "Професионално почистване",
    description: "Премахване на зъбен камък и полиране",
    price: 100,
    duration: 60,
    imageUrl: "/placeholder.svg"
  }
];

export const dentists = [
  {
    id: "d1",
    name: "Д-р Иван Петров",
    specialization: "Ортодонт",
    imageUrl: "https://t3.ftcdn.net/jpg/00/96/01/26/360_F_96012689_u6TDoM1XHJ4mBAa6CM3HjL2eEngpn6eX.jpg",
    bio: "Опитен ортодонт с над 10 години практика. Специализиран в лечение на зъбни деформации при деца и възрастни.",
    rating: 4.7,
    yearsOfExperience: 12,
    education: "МУ София",
    languages: ["Bulgarian"]
  },
  {
    id: "d2",
    name: "Д-р Мария Димитрова",
    specialization: "Детски зъболекар",
    imageUrl: "https://i0.wp.com/ndaonline.org/wp-content/uploads/2022/04/Childrens-Dentist.png?resize=600%2C600&ssl=1",
    bio: "Детски специалист с индивидуален подход към всяко дете. Безболезнени процедури и приятна атмосфера.",
    rating: 4.9,
    yearsOfExperience: 9,
    education: "МУ Пловдив",
    languages: ["Bulgarian", "English"]
  },
  {
    id: "d3",
    name: "Д-р Петър Георгиев",
    specialization: "Хирург",
    imageUrl: "https://img.freepik.com/premium-photo/handsome-happy-young-man-doctor-medical-dentist-center_171337-60464.jpg",
    bio: "Зъбен хирург с богат опит в сложни екстракции и имплантология. Прецизност и внимание към детайла.",
    rating: 4.5,
    yearsOfExperience: 15,
    education: "МУ Варна",
    languages: ["Bulgarian", "German"]
  },
  {
    id: "d4",
    name: "Д-р Николай Стефанов",
    specialization: "Зъболекар",
    imageUrl: "https://somosdental.com/wp-content/uploads/2023/10/happy-male-dentist-explaining-what-is-the-difference-between-a-dentist-and-an-orthodontist.jpg",
    bio: "Зъболекар с дългогодишен опит и внимание към пациента.",
    rating: 4.6,
    yearsOfExperience: 11,
    education: "МУ Пловдив",
    languages: ["Bulgarian", "English"]
  }
];

export const appointmentSlots = [
  {
    id: "1",
    dentistId: "d1",
    date: "2024-07-15",
    startTime: "09:00",
    endTime: "09:30",
    isAvailable: true
  },
  {
    id: "2",
    dentistId: "d1",
    date: "2024-07-15",
    startTime: "09:30",
    endTime: "10:00",
    isAvailable: true
  },
  {
    id: "3",
    dentistId: "d1",
    date: "2024-07-15",
    startTime: "10:00",
    endTime: "10:30",
    isAvailable: true
  },
  {
    id: "4",
    dentistId: "d2",
    date: "2024-07-16",
    startTime: "11:00",
    endTime: "11:30",
    isAvailable: true
  },
  {
    id: "5",
    dentistId: "d2",
    date: "2024-07-16",
    startTime: "11:30",
    endTime: "12:00",
    isAvailable: true
  },
  {
    id: "6",
    dentistId: "d3",
    date: "2024-07-17",
    startTime: "14:00",
    endTime: "14:30",
    isAvailable: true
  },
  {
    id: "7",
    dentistId: "d3",
    date: "2024-07-17",
    startTime: "14:30",
    endTime: "15:00",
    isAvailable: true
  },
  {
    id: "8",
    dentistId: "d1",
    date: "2024-07-18",
    startTime: "16:00",
    endTime: "16:30",
    isAvailable: true
  },
  {
    id: "9",
    dentistId: "d1",
    date: "2024-07-18",
    startTime: "16:30",
    endTime: "17:00",
    isAvailable: true
  },
  {
    id: "10",
    dentistId: "d2",
    date: "2024-07-19",
    startTime: "09:00",
    endTime: "09:30",
    isAvailable: true
  }
];
