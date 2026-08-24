import { Link } from 'react-router-dom';

interface Item {
  _id: string;
  title: string;
  category: string;
  borrowingFee: number;
  condition: string;
  images: string[];
  status: string;
}

interface ItemCardProps {
  item: Item;
}

export const BrowseItemCard = ({ item }: ItemCardProps) => (
  <div className="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col h-full">
    <img src={item.images[0] || 'https://via.placeholder.com/400'} alt={item.title} className="w-full h-48 object-cover" />
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-primary">{item.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {item.status}
        </span>
      </div>
      <p className="text-sm text-text mb-1">{item.category} • {item.condition}</p>
      <div className="mt-auto flex justify-between items-center pt-4">
        <p className="font-bold text-accent text-lg">₹{item.borrowingFee} <span className="text-sm font-normal text-text">/ day</span></p>
        <Link to={`/items/${item._id}`} className="bg-accent text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-hover shadow-sm">View</Link>
      </div>
    </div>
  </div>
);

