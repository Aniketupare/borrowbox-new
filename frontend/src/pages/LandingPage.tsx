import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getItems } from '../api/items';
import { BrowseItemCard } from '../components/ui/BrowseItemCard';
import { Skeleton } from '../components/ui/Skeleton';
import { LandingItemsMap } from '../components/location/LandingItemsMap';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
  });

  const categories = [
    { name: 'Tools', icon: '🛠️' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Camping', icon: '⛺' },
    { name: 'Sports', icon: '⚽' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    navigate(`/browse?${params.toString()}`);
  };

  const featuredItems = items?.slice(0, 3) || [];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero */}
      <section className="bg-surface py-20 px-4 text-center border-b border-border">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">Borrow what you need.<br/>Share what you have.</h1>
        <p className="text-xl text-text max-w-2xl mx-auto mb-10">BorrowBox makes it easy to find useful items nearby, borrow them from people in your community, and share the things you already own.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/browse" className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-hover">Browse Items</Link>
          <Link to="/listings/new" className="bg-surface border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-border">List an Item</Link>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-4xl mx-auto px-4 w-full">
        <form onSubmit={handleSearchSubmit} className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search for tools, electronics..." 
            className="flex-grow p-3 border border-border rounded-lg bg-surface text-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Your location (e.g. Pune)" 
            className="md:w-64 p-3 border border-border rounded-lg bg-surface text-primary"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
          />
          <button type="submit" className="bg-accent text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover shadow-sm">Search</button>
        </form>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold text-primary mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div 
              key={cat.name} 
              onClick={() => navigate(`/browse?category=${encodeURIComponent(cat.name)}`)}
              className="bg-surface border border-border p-6 rounded-xl hover:shadow-md cursor-pointer transition text-center"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="font-semibold text-primary">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold text-primary mb-8">Featured Items</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map(item => (
              <BrowseItemCard key={item._id} item={item as any} />
            ))}
          </div>
        ) : (
          <p className="text-text text-center">No featured items available.</p>
        )}
      </section>

      {/* Discovery Map */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        {isLoading ? (
          <Skeleton className="h-[450px]" />
        ) : items ? (
          <LandingItemsMap items={items} />
        ) : (
          <p className="text-text text-center">Unable to load map items.</p>
        )}
      </section>
    </div>
  );
};
