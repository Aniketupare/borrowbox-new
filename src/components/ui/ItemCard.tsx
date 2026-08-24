
interface ItemCardProps {
  item: {
    title: string;
    category: string;
    fee: number;
    image: string;
  };
}

export const ItemCard = ({ item }: ItemCardProps) => (
  <div className="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition">
    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
      <p className="text-sm text-text mb-2">{item.category}</p>
      <p className="font-bold text-accent text-lg">₹{item.fee} <span className="text-sm font-normal text-text">/ day</span></p>
    </div>
  </div>
);
