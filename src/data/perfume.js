import dior from "../assets/images/dior.jpg";
import chanel from "../assets/images/chanel.jpg";
import versace from "../assets/images/versace.jpg";
import gucci from "../assets/images/gucci.jpg";

const perfumes = [
  {
    id: 1,
    name: "Dior Sauvage",
    brand: "Dior",
    category: "Men",
    price: 12600,
    rating: 4.8,
    image: dior,

    description:
    "A bold and fresh fragrance with notes of bergamot, pepper, and amberwood.",

    notes: [
        "Bergamot",
        "Pepper",
        "Amberwood"
    ],

    volume:"100ml",

    stock:12,

    isNew: true,
  },
  {
    id: 2,
    name: "Chanel No.5",
    brand: "Chanel",
    category: "Women",
    price: 10500,
    rating: 4.9,
    image: chanel,
    description:
    "A timeless classic with notes of jasmine, rose, and sandalwood.",

    notes: [
        "Jasmine",
        "Rose",
        "Sandalwood"
    ],

    volume:"100ml",

    stock:15,
    isNew: false,
  },
  {
    id: 3,
    name: "Versace Eros",
    brand: "Versace",
    category: "Men",
    price: 11000,
    rating: 4.7,
    image: versace,
    description:
    "Versace Eros** is a bold and seductive fragrance with fresh mint, green apple, and lemon, balanced by warm vanilla, tonka bean, and cedarwood. It's a long-lasting scent, perfect for evenings and special occasionss.",
    notes: [
        "vanilla",
        "tonka bean",
        "cedarwood"
    ],
    volume:"100ml",
    stock:18,
    isNew: true,
  },
  {
    id: 4,
    name: "Gucci Bloom",
    brand: "Gucci",
    category: "Women",
    price: 13000,
    rating: 4.6,
    image: gucci,
    description:
    "A modern and elegant fragrance with notes of peony, jasmine, and sandalwood.",
    notes: [
        "Peony",
        "Jasmine",
        "Sandalwood"
    ],
    volume:"100ml",
    stock:24,
    isNew: false,
  },
  {
    id: 5,
    name: "YSL Black Opium",
    brand: "YSL",
    category: "Women",
    price: 13500,
    rating: 4.8,
    image: ysl,
    description:
    "An addictive gourmand floral fragrance with rich black coffee, white flowers, and sweet vanilla.",
    notes: [
        "Coffee",
        "Jasmine",
        "Vanilla"
    ],
    volume:"90ml",
    stock:14,
    isNew: false,
  },
  {
    id: 6,
    name: "Tom Ford Oud Wood",
    brand: "Tom Ford",
    category: "Unisex",
    price: 25000,
    rating: 4.7,
    image: tomford,
    description:
    "One of the most rare, precious, and expensive ingredients in a perfumer's arsenal, oud wood is often burned in incense-filled temples.",
    notes: [
        "Oud Wood",
        "Sandalwood",
        "Chinese Pepper"
    ],
    volume:"100ml",
    stock:11,
    isNew: true,
  },
];

export default perfumes;