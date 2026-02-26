// 1. Resimleri Import Et (Hepsi webp oldu)
import iconEntertainment from '../assets/icons/entertainment.webp';
import iconBills from '../assets/icons/bills.webp';
import iconGroceries from '../assets/icons/groceries.webp';
import iconDining from '../assets/icons/dining_out.webp';
import iconTransport from '../assets/icons/transportation.webp';
import iconPersonal from '../assets/icons/personal_care.webp';
import iconEducation from '../assets/icons/education.webp';
import iconLifestyle from '../assets/icons/lifestyle.webp';
import iconShopping from '../assets/icons/shopping.webp';
import iconGeneral from '../assets/icons/general.webp';
import iconIncome from '../assets/icons/income.webp';

// Kategoriye göre resim ve arka plan rengi döndüren fonksiyon
export const getCategoryTheme = (category) => {
  const normalizedCategory = category ? category.toLowerCase() : 'general';

  switch (normalizedCategory) {
    case 'entertainment':
      return { image: iconEntertainment, bg: '#ede9fe' }; 
    case 'bills':
      return { image: iconBills, bg: '#fee2e2' }; 
    case 'groceries':
      return { image: iconGroceries, bg: '#d1fae5' }; 
    case 'dining out':
    case 'food':
      return { image: iconDining, bg: '#fef3c7' }; 
    case 'transportation':
      return { image: iconTransport, bg: '#cffafe' }; 
    case 'personal care':
      return { image: iconPersonal, bg: '#fce7f3' }; 
    case 'education':
      return { image: iconEducation, bg: '#e0e7ff' }; 
    case 'lifestyle':
      return { image: iconLifestyle, bg: '#f3e8ff' };
    case 'shopping':
      return { image: iconShopping, bg: '#ffedd5' };
    case 'income':
      return { image: iconIncome, bg: '#dcfce7' }; 
    case 'general':
    default:
      return { image: iconGeneral, bg: '#f1f5f9' }; 
  }
};