export interface IItem {
  _id: string;
  owner: string | { _id: string; name: string; email: string };
  title: string;
  description: string;
  category: string;
  images: string[];
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  borrowingFee: number;
  securityDeposit: number;
  availability: {
    startDate: string;
    endDate: string;
  };
  status: 'Available' | 'Borrowed' | 'Maintenance';
  createdAt: string;
  updatedAt: string;
}
