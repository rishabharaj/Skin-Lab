import appleImg from "@/assets/phones/apple-latest.jpg";
import samsungImg from "@/assets/phones/samsung-latest.jpg";
import googleImg from "@/assets/phones/google-latest.jpg";
import oneplusImg from "@/assets/phones/oneplus-latest.jpg";
import xiaomiImg from "@/assets/phones/xiaomi-latest.jpg";
import realmeImg from "@/assets/phones/realme-latest.jpg";
import oppoImg from "@/assets/phones/oppo-latest.jpg";
import vivoImg from "@/assets/phones/vivo-latest.jpg";
import motorolaImg from "@/assets/phones/motorola-latest.jpg";
import nothingImg from "@/assets/phones/nothing-latest.jpg";
import redmiImg from "@/assets/phones/redmi-note-14.jpg";

export const brandPhoneImages: Record<string, { image: string; latestModel: string }> = {
  apple: { image: appleImg, latestModel: "iPhone 16 Pro Max" },
  samsung: { image: samsungImg, latestModel: "Galaxy S25 Ultra" },
  google: { image: googleImg, latestModel: "Pixel 9" },
  oneplus: { image: oneplusImg, latestModel: "OnePlus 13" },
  xiaomi: { image: xiaomiImg, latestModel: "Xiaomi 14 Ultra" },
  realme: { image: realmeImg, latestModel: "Realme 13 Pro" },
  oppo: { image: oppoImg, latestModel: "Find X7 Ultra" },
  vivo: { image: vivoImg, latestModel: "Vivo X100 Ultra" },
  motorola: { image: motorolaImg, latestModel: "Edge 60" },
  nothing: { image: nothingImg, latestModel: "Phone (3a)" },
};
