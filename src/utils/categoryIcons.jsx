// src/utils/categoryIcons.jsx

// 1. Resimleri Import Et
import iconEntertainment from '../assets/icons/entertainment.png';
import iconBills from '../assets/icons/bills.png';
import iconGroceries from '../assets/icons/groceries.png';
import iconDining from '../assets/icons/dining_out.png';
import iconTransport from '../assets/icons/transportation.png';
import iconPersonal from '../assets/icons/personal_care.png';
import iconEducation from '../assets/icons/education.png';
import iconLifestyle from '../assets/icons/lifestyle.png';
import iconShopping from '../assets/icons/shopping.png';
import iconGeneral from '../assets/icons/general.png';
import iconIncome from '../assets/icons/income.png';

// Kategoriye göre resim ve arka plan rengi döndüren fonksiyon
export const getCategoryTheme = (category) => {
  const normalizedCategory = category ? category.toLowerCase() : 'general';

  switch (normalizedCategory) {
    case 'entertainment':
      return { image: iconEntertainment, bg: '#ede9fe' }; // Morumsu arka plan
    case 'bills':
      return { image: iconBills, bg: '#fee2e2' }; // Kırmızımsı
    case 'groceries':
      return { image: iconGroceries, bg: '#d1fae5' }; // Yeşilimsi
    case 'dining out':
    case 'food':
      return { image: iconDining, bg: '#fef3c7' }; // Turuncumsu
    case 'transportation':
      return { image: iconTransport, bg: '#cffafe' }; // Mavimsi
    case 'personal care':
      return { image: iconPersonal, bg: '#fce7f3' }; // Pembemsi
    case 'education':
      return { image: iconEducation, bg: '#e0e7ff' }; // İndigo
    case 'lifestyle':
      return { image: iconLifestyle, bg: '#f3e8ff' };
    case 'shopping':
      return { image: iconShopping, bg: '#ffedd5' };
    case 'income':
      return { image: iconIncome, bg: '#dcfce7' }; // Gelir Yeşili
    case 'general':
    default:
      return { image: iconGeneral, bg: '#f1f5f9' }; // Gri
  }
};