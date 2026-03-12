interface SkinPriceProps {
  price: number;
  originalPrice?: number;
  offer?: string;
  size?: "sm" | "lg";
}

const SkinPrice = ({ price, originalPrice, offer, size = "sm" }: SkinPriceProps) => {
  const isLg = size === "lg";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`font-display font-bold ${isLg ? "text-2xl" : "text-sm"} text-primary`}>
        ₹{price.toFixed(0)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className={`line-through text-muted-foreground ${isLg ? "text-base" : "text-xs"}`}>
          ₹{originalPrice.toFixed(0)}
        </span>
      )}
      {offer && (
        <span className={`${isLg ? "text-xs px-2 py-1" : "text-[10px] px-1.5 py-0.5"} rounded-full bg-destructive/10 text-destructive font-semibold`}>
          {offer}
        </span>
      )}
    </div>
  );
};

export default SkinPrice;
