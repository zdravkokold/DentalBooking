import { Dentist, Service, AppointmentSlot } from './models';

export const dentists: Dentist[] = [
  {
    id: "d1",
    name: "Д-р Иван Петров",
    specialization: "Обща дентална медицина",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3",
    bio: "Д-р Иван Петров е с над 15 години опит в денталната медицина. Завършил е Медицински университет - София и има специализации по имплантология и естетична стоматология.",
    rating: 4.9,
    yearsOfExperience: 15,
    education: "Медицински университет - София",
    languages: ["Български", "Английски", "Немски"],
  },
  {
    id: "d2",
    name: "Д-р Елена Тодорова",
    specialization: "Ортодонт",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3",
    bio: "Д-р Елена Тодорова е специалист ортодонт с фокус върху лечението на деца и тийнейджъри. Има богат опит в работата с брекети и алайнери.",
    rating: 4.8,
    yearsOfExperience: 12,
    education: "Медицински университет - Пловдив",
    languages: ["Български", "Английски", "Руски"],
  },
  {
    id: "d3",
    name: "Д-р Георги Николов",
    specialization: "Имплантолог",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: "Д-р Георги Николов е сертифициран специалист по дентална имплантология с международно признати квалификации. Използва най-съвременните методи за имплантологично лечение.",
    rating: 4.7,
    yearsOfExperience: 12,
    education: "Медицински университет - Варна",
    languages: ["Български", "Английски", "Руски"]
  },
  {
    id: "d4",
    name: "Д-р Мария Димитрова",
    specialization: "Детски зъболекар",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    bio: 'Д-р Мария Димитрова е специалист в детската дентална медицина с над 6 години опит. Тя е известна със своя топъл и приятелски подход към малките пациенти, създавайки позитивни спомени от посещенията при зъболекар.',
    rating: 4.9,
    yearsOfExperience: 6,
    education: "Медицински университет - София",
    languages: ["Български", "Английски", "Френски"]
  }
];

export const services: Service[] = [
  {
    id: '1',
    name: 'Профилактичен преглед',
    description: 'Цялостен преглед на устната кухина, включващ оценка на състоянието на зъбите и венците, ранно откриване на кариеси и консултация за поддържане на добра дентална хигиена.',
    price: 60,
    duration: 30,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1661766704348-30c572664c58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '2',
    name: 'Лечение на кариес',
    description: 'Премахване на кариозната тъкан и възстановяване на зъба с висококачествени фотополимерни материали, възстановяваща нормалната функция и естетика.',
    price: 120,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1609840113961-a9fe3b133378?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '3',
    name: 'Професионално избелване',
    description: 'Безопасна процедура за изсветляване на зъбите с няколько нюанса, използвайки специални избелващи системи под професионален контрол.',
    price: 300,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1581585391434-5716c0ecd2c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '4',
    name: 'Поставяне на имплант',
    description: 'Хирургично поставяне на зъбен имплант, заместващ липсващ зъб, осигурявайки здрава основа за бъдеща коронка.',
    price: 1500,
    duration: 90,
    imageUrl: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '5',
    name: 'Ортодонтско лечение',
    description: 'Коригиране на зъбни и челюстни неправилности чрез брекети или прозрачни алайнери за постигане на правилна захапка и красива усмивка.',
    price: 2500,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1588776813677-65f4f16d15ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '6',
    name: 'Професионално почистване',
    description: 'Премахване на зъбна плака и зъбен камък с ултразвук и полиране за поддържане на здрави зъби и венци и предотвратяване на заболявания.',
    price: 80,
    duration: 40,
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

export const generateAppointmentSlots = (): AppointmentSlot[] => {
  const slots: AppointmentSlot[] = [];
  const today = new Date();
  
  dentists.forEach(dentist => {
    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const endHour = minute === 30 ? hour + 1 : hour;
          const endMinute = minute === 30 ? 0 : 30;
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
          
          const isAvailable = Math.random() > 0.2;
          
          slots.push({
            id: `${dentist.id}-${date.toISOString().split('T')[0]}-${startTime}`,
            dentistId: dentist.id,
            date: date.toISOString().split('T')[0],
            startTime,
            endTime,
            isAvailable
          });
        }
      }
    }
  });
  
  return slots;
};

export const appointmentSlots = generateAppointmentSlots();
