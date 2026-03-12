// Keep legacy demo constants as plain strings so local texture files are not required at build time.
const carbonBlack = "";
const carbonRed = "";
const carbonBlue = "";
const leatherTan = "";
const leatherBlack = "";
const woodWalnut = "";
const woodBamboo = "";
const woodEbony = "";
const metalTitanium = "";
const camoGreen = "";
const camoDesert = "";
const matteBlue = "";
const matteGreen = "";
const matteOrange = "";

const animeCyberpunk = "";
const animeSakura = "";
const animeSamurai = "";
const animeDragonpower = "";
const threeHolographic = "";
const threeLiquidmetal = "";
const threeWireframe = "";
const threeCrystal = "";
const marbleWhite = "";
const marbleBlack = "";
const marbleGreen = "";
const galaxyNebula = "";
const galaxyAurora = "";
const galaxyStars = "";
const geometricBold = "";
const geometricMinimal = "";
const floralTropical = "";
const floralCherry = "";
const glitchRgb = "";
const glitchVaporwave = "";

export interface DeviceBrand {
  id: string;
  name: string;
  logo: string;
  category: string;
}

export interface DeviceModel {
  id: string;
  brandId: string;
  name: string;
  category: string;
  image: string;
}

export interface SkinDesign {
  id: string;
  name: string;
  collection: string;
  textureImage: string;
  color: string;
  price: number;
  originalPrice?: number; // strikethrough price (MRP)
  badge?: "trending" | "bestseller" | "new";
  offer?: string; // e.g. "20% OFF", "FLAT ₹100 OFF"
  coverageOptions: string[];
}

export interface CartItem {
  id: string;
  device: DeviceModel;
  skin: SkinDesign;
  coverage: string;
  quantity: number;
  price: number;
}

export const deviceCategories = [
  { id: "phones", name: "Phones", icon: "📱", count: 250 },
];

export const deviceBrands: DeviceBrand[] = [
  { id: "apple", name: "Apple", logo: "🍎", category: "phones" },
  { id: "samsung", name: "Samsung", logo: "📱", category: "phones" },
  { id: "google", name: "Google", logo: "🔍", category: "phones" },
  { id: "oneplus", name: "OnePlus", logo: "➕", category: "phones" },
  { id: "xiaomi", name: "Xiaomi", logo: "📱", category: "phones" },
  { id: "nothing", name: "Nothing", logo: "⚡", category: "phones" },
  { id: "motorola", name: "Motorola", logo: "📱", category: "phones" },
  { id: "realme", name: "Realme", logo: "📱", category: "phones" },
];

export const deviceModels: DeviceModel[] = [
  { id: "iphone-16-pro-max", brandId: "apple", name: "iPhone 16 Pro Max", category: "phones", image: "" },
  { id: "iphone-16-pro", brandId: "apple", name: "iPhone 16 Pro", category: "phones", image: "" },
  { id: "iphone-16", brandId: "apple", name: "iPhone 16", category: "phones", image: "" },
  { id: "iphone-16-plus", brandId: "apple", name: "iPhone 16 Plus", category: "phones", image: "" },
  { id: "iphone-15-pro-max", brandId: "apple", name: "iPhone 15 Pro Max", category: "phones", image: "" },
  { id: "iphone-15-pro", brandId: "apple", name: "iPhone 15 Pro", category: "phones", image: "" },
  { id: "iphone-15", brandId: "apple", name: "iPhone 15", category: "phones", image: "" },
  { id: "iphone-14-pro-max", brandId: "apple", name: "iPhone 14 Pro Max", category: "phones", image: "" },
  { id: "iphone-14", brandId: "apple", name: "iPhone 14", category: "phones", image: "" },
  { id: "iphone-13", brandId: "apple", name: "iPhone 13", category: "phones", image: "" },
  { id: "galaxy-s24-ultra", brandId: "samsung", name: "Galaxy S24 Ultra", category: "phones", image: "" },
  { id: "galaxy-s24-plus", brandId: "samsung", name: "Galaxy S24+", category: "phones", image: "" },
  { id: "galaxy-s24", brandId: "samsung", name: "Galaxy S24", category: "phones", image: "" },
  { id: "galaxy-s23-ultra", brandId: "samsung", name: "Galaxy S23 Ultra", category: "phones", image: "" },
  { id: "galaxy-z-fold5", brandId: "samsung", name: "Galaxy Z Fold 5", category: "phones", image: "" },
  { id: "galaxy-z-flip5", brandId: "samsung", name: "Galaxy Z Flip 5", category: "phones", image: "" },
  { id: "pixel-9-pro", brandId: "google", name: "Pixel 9 Pro", category: "phones", image: "" },
  { id: "pixel-9", brandId: "google", name: "Pixel 9", category: "phones", image: "" },
  { id: "pixel-8-pro", brandId: "google", name: "Pixel 8 Pro", category: "phones", image: "" },
  { id: "oneplus-12", brandId: "oneplus", name: "OnePlus 12", category: "phones", image: "" },
  { id: "oneplus-12r", brandId: "oneplus", name: "OnePlus 12R", category: "phones", image: "" },
  { id: "oneplus-nord-4", brandId: "oneplus", name: "OnePlus Nord 4", category: "phones", image: "" },
  { id: "xiaomi-14-ultra", brandId: "xiaomi", name: "Xiaomi 14 Ultra", category: "phones", image: "" },
  { id: "xiaomi-14", brandId: "xiaomi", name: "Xiaomi 14", category: "phones", image: "" },
  { id: "redmi-note-13-pro", brandId: "xiaomi", name: "Redmi Note 13 Pro", category: "phones", image: "" },
  { id: "nothing-phone-2", brandId: "nothing", name: "Nothing Phone (2)", category: "phones", image: "" },
  { id: "nothing-phone-2a", brandId: "nothing", name: "Nothing Phone (2a)", category: "phones", image: "" },
  { id: "moto-edge-50", brandId: "motorola", name: "Moto Edge 50 Pro", category: "phones", image: "" },
  { id: "realme-gt5-pro", brandId: "realme", name: "Realme GT5 Pro", category: "phones", image: "" },
];

export const skinCollections = [
  // Design themes
  { id: "anime", name: "Anime", description: "Japanese anime & manga inspired designs" },
  { id: "3d", name: "3D Abstract", description: "Futuristic 3D renders & holographic art" },
  { id: "marble", name: "Marble", description: "Luxury marble with gold veins" },
  { id: "galaxy", name: "Galaxy & Space", description: "Cosmic nebula & aurora designs" },
  { id: "geometric", name: "Geometric", description: "Bold patterns & art deco lines" },
  { id: "floral", name: "Floral", description: "Botanical prints & flower patterns" },
  { id: "glitch", name: "Glitch Art", description: "Digital glitch & vaporwave aesthetic" },
  // Material textures
  { id: "carbon", name: "Carbon Fiber", description: "Premium carbon fiber texture" },
  { id: "leather", name: "Leather", description: "Genuine leather feel" },
  { id: "wood", name: "Wood", description: "Natural wood grain patterns" },
  { id: "metal", name: "Brushed Metal", description: "Industrial metal finish" },
  { id: "matte", name: "Matte Colors", description: "Smooth matte finish" },
  { id: "camo", name: "Camo", description: "Military-grade patterns" },
];

const coverageOptions = ["Back Only", "Full Body", "Camera Skin"];

export const skinDesigns: SkinDesign[] = [
  // ── Anime ──
  { id: "anime-0", name: "Cyberpunk Collage", collection: "anime", textureImage: animeCyberpunk, color: "#e040fb", price: 499, originalPrice: 799, badge: "trending", offer: "38% OFF", coverageOptions },
  { id: "anime-1", name: "Sakura Dream", collection: "anime", textureImage: animeSakura, color: "#f8bbd0", price: 599, badge: "bestseller", coverageOptions },
  { id: "anime-2", name: "Dark Samurai", collection: "anime", textureImage: animeSamurai, color: "#b71c1c", price: 549, originalPrice: 799, offer: "₹250 OFF", coverageOptions },
  { id: "anime-3", name: "Dragon Power", collection: "anime", textureImage: animeDragonpower, color: "#ff6f00", price: 599, coverageOptions },

  // ── 3D Abstract ──
  { id: "3d-0", name: "Holographic Cubes", collection: "3d", textureImage: threeHolographic, color: "#b0bec5", price: 599, originalPrice: 899, badge: "trending", offer: "33% OFF", coverageOptions },
  { id: "3d-1", name: "Liquid Metal", collection: "3d", textureImage: threeLiquidmetal, color: "#c0c0c0", price: 799, badge: "bestseller", coverageOptions },
  { id: "3d-2", name: "Neon Wireframe", collection: "3d", textureImage: threeWireframe, color: "#00e5ff", price: 799, coverageOptions },
  { id: "3d-3", name: "Crystal Formation", collection: "3d", textureImage: threeCrystal, color: "#ce93d8", price: 799, coverageOptions },

  // ── Marble ──
  { id: "marble-0", name: "White & Gold", collection: "marble", textureImage: marbleWhite, color: "#fafafa", price: 499, originalPrice: 699, badge: "trending", offer: "29% OFF", coverageOptions },
  { id: "marble-1", name: "Nero Marquina", collection: "marble", textureImage: marbleBlack, color: "#1a1a1a", price: 699, coverageOptions },
  { id: "marble-2", name: "Emerald Verde", collection: "marble", textureImage: marbleGreen, color: "#2e7d32", price: 699, badge: "new", coverageOptions },

  // ── Galaxy & Space ──
  { id: "galaxy-0", name: "Cosmic Nebula", collection: "galaxy", textureImage: galaxyNebula, color: "#4a148c", price: 499, originalPrice: 699, badge: "bestseller", offer: "29% OFF", coverageOptions },
  { id: "galaxy-1", name: "Aurora Borealis", collection: "galaxy", textureImage: galaxyAurora, color: "#00c853", price: 699, coverageOptions },
  { id: "galaxy-2", name: "Milky Way", collection: "galaxy", textureImage: galaxyStars, color: "#1a237e", price: 699, coverageOptions },

  // ── Geometric ──
  { id: "geometric-0", name: "Bold Mosaic", collection: "geometric", textureImage: geometricBold, color: "#1565c0", price: 599, coverageOptions },
  { id: "geometric-1", name: "Art Deco Gold", collection: "geometric", textureImage: geometricMinimal, color: "#212121", price: 599, coverageOptions },

  // ── Floral ──
  { id: "floral-0", name: "Tropical Paradise", collection: "floral", textureImage: floralTropical, color: "#2e7d32", price: 599, coverageOptions },
  { id: "floral-1", name: "Cherry Blossom", collection: "floral", textureImage: floralCherry, color: "#f8bbd0", price: 599, coverageOptions },

  // ── Glitch Art ──
  { id: "glitch-0", name: "RGB Distortion", collection: "glitch", textureImage: glitchRgb, color: "#76ff03", price: 599, coverageOptions },
  { id: "glitch-1", name: "Vaporwave", collection: "glitch", textureImage: glitchVaporwave, color: "#ea80fc", price: 599, coverageOptions },

  // ── Carbon Fiber ──
  { id: "carbon-0", name: "Black Carbon", collection: "carbon", textureImage: carbonBlack, color: "#1a1a1a", price: 399, originalPrice: 599, badge: "bestseller", offer: "33% OFF", coverageOptions },
  { id: "carbon-1", name: "Red Carbon", collection: "carbon", textureImage: carbonRed, color: "#8b1a1a", price: 599, coverageOptions },
  { id: "carbon-2", name: "Blue Carbon", collection: "carbon", textureImage: carbonBlue, color: "#1a1a8b", price: 599, coverageOptions },
  { id: "carbon-3", name: "Silver Carbon", collection: "carbon", textureImage: carbonBlack, color: "#7a7a7a", price: 599, coverageOptions },

  // ── Leather ──
  { id: "leather-0", name: "Tan Leather", collection: "leather", textureImage: leatherTan, color: "#c4956a", price: 699, coverageOptions },
  { id: "leather-1", name: "Black Leather", collection: "leather", textureImage: leatherBlack, color: "#1a1a1a", price: 699, coverageOptions },

  // ── Wood ──
  { id: "wood-0", name: "Walnut Grain", collection: "wood", textureImage: woodWalnut, color: "#5d4037", price: 699, coverageOptions },
  { id: "wood-1", name: "Bamboo Natural", collection: "wood", textureImage: woodBamboo, color: "#c8b560", price: 699, coverageOptions },
  { id: "wood-2", name: "Dark Ebony", collection: "wood", textureImage: woodEbony, color: "#1a1a1a", price: 699, badge: "new", coverageOptions },

  // ── Brushed Metal ──
  { id: "metal-0", name: "Titanium Silver", collection: "metal", textureImage: metalTitanium, color: "#b0bec5", price: 799, badge: "new", coverageOptions },

  // ── Matte ──
  { id: "matte-0", name: "Ocean Blue", collection: "matte", textureImage: matteBlue, color: "#1565c0", price: 449, originalPrice: 599, offer: "25% OFF", coverageOptions },
  { id: "matte-1", name: "Forest Green", collection: "matte", textureImage: matteGreen, color: "#2e7d32", price: 449, coverageOptions },
  { id: "matte-2", name: "Sunset Orange", collection: "matte", textureImage: matteOrange, color: "#e65100", price: 449, coverageOptions },

  // ── Camo ──
  { id: "camo-0", name: "Jungle Green", collection: "camo", textureImage: camoGreen, color: "#33691e", price: 499, coverageOptions },
  { id: "camo-1", name: "Desert Sand", collection: "camo", textureImage: camoDesert, color: "#a1887f", price: 499, coverageOptions },
];

export const coveragePricing: Record<string, number> = {
  "Back Only": 0,
  "Full Body": 200,
  "Camera Skin": -100,
};
