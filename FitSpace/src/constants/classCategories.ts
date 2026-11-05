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
}

// The one place that knows which image and wording belongs to each category.
// Home tiles, class cards and the admin "category" dropdown all read from this list.
export const CLASS_CATEGORIES: ClassCategoryInfo[] = [
  {
    name: 'Yoga',
    tagline: 'Flow, stretch and breathe',
    image: yogaImage,
    imageAlt: 'Woman meditating cross-legged in a bright yoga studio full of plants',
  },
  {
    name: 'HIIT',
    tagline: 'Short, sharp and sweaty',
    image: hiitImage,
    imageAlt: 'Sweating athlete in a low crawl position during a high-intensity workout in a gym',
  },
  {
    name: 'Spin',
    tagline: 'Ride to the beat',
    image: spinImage,
    imageAlt:
      'Riders on stationary bikes in a neon-lit spin studio facing a screen that reads Stronger, Fitter, Together',
  },
  {
    name: 'Pilates',
    tagline: 'Strong core, steady mind',
    image: pilatesImage,
    imageAlt:
      'Instructor guiding a woman through a leg extension on a Pilates reformer in a light, airy studio',
  },
  {
    name: 'Boxing',
    tagline: 'Punch out your stress',
    image: boxingImage,
    imageAlt: 'Boxer in gloves throwing a punch at a heavy bag in a dark gym',
  },
  {
    name: 'Zumba',
    tagline: 'Dance your way fit',
    image: zumbaImage,
    imageAlt: 'Smiling women dancing in colourful workout clothes in front of a Zumba banner',
  },
];

export const getCategoryInfo = (categoryName: string): ClassCategoryInfo | undefined =>
  CLASS_CATEGORIES.find((category) => category.name === categoryName);