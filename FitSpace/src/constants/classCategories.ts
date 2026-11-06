import yogaImage from '../assets/categories/yoga-class.png';
import hiitImage from '../assets/categories/hiit-class.png';
import spinImage from '../assets/categories/spin-class.png';
import pilatesImage from '../assets/categories/pilates-class.png';
import boxingImage from '../assets/categories/boxing-class.png';
import zumbaImage from '../assets/categories/zumba-class.png';
import type { ClassCategoryName } from '../types';

export interface ClassCategoryInfo {
  name: ClassCategoryName;
  tagline: string;
  image: string;
  imageAlt: string;
  whatToBring: string[];
}

// The one place that knows which image and wording belongs to each category.
// Home tiles, class cards, the details page and the admin "category" dropdown all read from here.
export const CLASS_CATEGORIES: ClassCategoryInfo[] = [
  {
    name: 'Yoga',
    tagline: 'Flow, stretch and breathe',
    image: yogaImage,
    imageAlt: 'Woman meditating cross-legged in a bright yoga studio full of plants',
    whatToBring: ['Yoga mat', 'Water bottle', 'Comfortable clothes', 'Towel'],
  },
  {
    name: 'HIIT',
    tagline: 'Short, sharp and sweaty',
    image: hiitImage,
    imageAlt: 'Sweating athlete in a low crawl position during a high-intensity workout in a gym',
    whatToBring: ['Water bottle', 'Towel', 'Training shoes', 'Sweat-wicking clothes'],
  },
  {
    name: 'Spin',
    tagline: 'Ride to the beat',
    image: spinImage,
    imageAlt: 'Riders on stationary bikes in a neon-lit spin studio facing a screen that reads Stronger, Fitter, Together',
    whatToBring: ['Water bottle', 'Towel', 'Cycling or trainer shoes', 'Light, breathable clothes'],
  },
  {
    name: 'Pilates',
    tagline: 'Strong core, steady mind',
    image: pilatesImage,
    imageAlt: 'Instructor guiding a woman through a leg extension on a Pilates reformer in a light, airy studio',
    whatToBring: ['Grip socks', 'Water bottle', 'Towel', 'Comfortable clothes'],
  },
  {
    name: 'Boxing',
    tagline: 'Punch out your stress',
    image: boxingImage,
    imageAlt: 'Boxer in gloves throwing a punch at a heavy bag in a dark gym',
    whatToBring: ['Hand wraps', 'Water bottle', 'Towel', 'Trainers'],
  },
  {
    name: 'Zumba',
    tagline: 'Dance your way fit',
    image: zumbaImage,
    imageAlt: 'Smiling women dancing in colourful workout clothes in front of a Zumba banner',
    whatToBring: ['Water bottle', 'Towel', 'Trainers', 'Light, loose clothes'],
  },
];

export const getCategoryInfo = (categoryName: string): ClassCategoryInfo | undefined =>
  CLASS_CATEGORIES.find((category) => category.name === categoryName);