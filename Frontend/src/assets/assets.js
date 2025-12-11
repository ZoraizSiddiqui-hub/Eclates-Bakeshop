// Image Imports
import basket_icon from './basket_icon.png';
import header_img from './header_img.png';
import search_icon from './search_icon.png';
import rating_starts from './rating_starts.png';
import add_icon_white from './add_icon_white.png';
import add_icon_green from './add_icon_green.png';
import remove_icon_red from './remove_icon_red.png';
import app_store from './app_store.png';
import play_store from './play_store.png';
import linkedin_icon from './linkedin_icon.png';
import facebook_icon from './facebook_icon.png';
import twitter_icon from './twitter_icon.png';
import cross_icon from './cross_icon.png';
import selector_icon from './selector_icon.png';
import profile_icon from './profile_icon.png';
import bag_icon from './bag_icon.png';
import logout_icon from './logout_icon.png';
import parcel_icon from './parcel_icon.png';

// Category Images
import men_1 from './men_1.png';
import men_2 from './men_2.png';
import men_3 from './men_3.png';
import men_4 from './men_4.png';
import men_5 from './men_5.png';
import men_6 from './men_6.png';
import men_7 from './men_7.png';

// Product Images
import food_1 from './food_1.png';
import food_2 from './food_2.png';
import food_3 from './food_3.png';
import food_4 from './food_4.png';
import food_5 from './food_5.png';
import food_6 from './food_6.png';
import food_7 from './food_7.png';
import food_8 from './food_8.png';
import food_9 from './food_9.png';
import food_10 from './food_10.png';
import food_11 from './food_11.png';
import food_12 from './food_12.png';
import food_13 from './food_13.png';
import food_14 from './food_14.png';
import food_15 from './food_15.png';
import food_16 from './food_16.png';

export const assets = {
  basket_icon,
  header_img,
  search_icon,
  rating_starts,
  add_icon_green,
  add_icon_white,
  remove_icon_red,
  app_store,
  play_store,
  linkedin_icon,
  facebook_icon,
  twitter_icon,
  cross_icon,
  selector_icon,
  profile_icon,
  logout_icon,
  bag_icon,
  parcel_icon,

  // Category Images
  category_images: {
    "Brownies": men_1,
    "Cakes": men_2,
    "Cookies": men_3,
    "Cupcakes": men_4,
    "Desserts": men_5,
    "Mini Donuts": men_6,
    "Sundae": men_7
  }
};

export const food_list = [
  // Cakes
  {
    _id: "1",
    name: "Ferrero Classic Cake",
    image: food_1,
    price: 2400,
    weight: "2.5 LBS",
    description: "Made from 100% Ferrero hazelnut chocolate & roasted nuts!",
    category: "Cakes"
  },
  {
    _id: "2",
    name: "Nutella Cake",
    image: food_2,
    price: 2200,
    weight: "2.5 LBS",
    description: "Made from 100% Nutella and milk chocolate that melts in your mouth",
    category: "Cakes"
  },
  {
    _id: "3",
    name: "Red Velvet Cake",
    image: food_3,
    price: 2200,
    weight: "2.5 LBS",
    description: "Cream cheese frosting on velvety soft red sponge",
    category: "Cakes"
  },
  {
    _id: "4",
    name: "Salted Caramel Cake",
    image: food_4,
    price: 2200,
    weight: "2.5 LBS",
    description: "Salted caramel, cream cheese with moist vanilla sponge",
    category: "Cakes"
  },

  // Brownies
  {
    _id: "5",
    name: "Fudge Brownie",
    image: food_5,
    price: 350,
    description: "Rich chocolate fudge brownie with a gooey center",
    category: "Brownies"
  },
  {
    _id: "6",
    name: "Walnut Brownie",
    image: food_6,
    price: 380,
    description: "Classic brownie topped with roasted walnuts for extra crunch and flavor",
    category: "Brownies"
  },

  // Cookies
  {
    _id: "7",
    name: "Lotus Cookie",
    image: food_7,
    price: 320,
    description: "Made with pure butter and imported Lotus spread",
    category: "Cookies"
  },
  {
    _id: "8",
    name: "Nutella Cookie",
    image: food_8,
    price: 320,
    description: "Vanilla cookie dough filled with Nutella and topped with chocolate chips",
    category: "Cookies"
  },

  // Cupcakes
  {
    _id: "9",
    name: "Chocolate Cupcake",
    image: food_9,
    price: 280,
    description: "Moist chocolate sponge with whipped ganache",
    category: "Cupcakes"
  },
  {
    _id: "10",
    name: "Vanilla Cupcake",
    image: food_10,
    price: 260,
    description: "Classic vanilla sponge with buttercream swirl frosting and sprinkles",
    category: "Cupcakes"
  },

  // Desserts
  {
    _id: "11",
    name: "Lotus Three Milk Cake",
    image: food_11,
    price: 400,
    description: "Cream cheese, vanilla sponge, and Lotus biscuit spread",
    category: "Desserts"
  },
  {
    _id: "12",
    name: "Chocolate Mousse Jar",
    image: food_12,
    price: 450,
    description: "Layers of rich chocolate mousse and sponge in a jar topped with cream",
    category: "Desserts"
  },

  // Mini Donuts
  {
    _id: "13",
    name: "Mini Donuts - Chocolate ",
    image: food_13,
    price: 250,
    description: "Mini donuts dipped in silky chocolate glaze and topped with sprinkles",
    category: "Mini Donuts"
  },
  {
    _id: "14",
    name: "Mini Donuts - Lotus Crumble",
    image: food_14,
    price: 250,
    description: "Lotus biscuit crumble on vanilla-glazed mini donuts",
    category: "Mini Donuts"
  },

  // Sundae
  {
    _id: "15",
    name: "Galaxy Sundae",
    image: food_15,
    price: 350,
    description: "Chocolate ice cream with caramel drizzle and brownie chunks",
    category: "Sundae"
  },
  {
    _id: "16",
    name: "Oreo Sundae",
    image: food_16,
    price: 320,
    description: "Vanilla ice cream layered with Oreo crumble and chocolate syrup",
    category: "Sundae"
  }
];
