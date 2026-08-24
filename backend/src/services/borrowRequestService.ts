import { BorrowRequest, RequestStatus } from '../models/BorrowRequest';
import { Item } from '../models/Item';

export const createBorrowRequest = async (borrowerId: string, data: any) => {
  const item = await Item.findById(data.item);
  if (!item) throw new Error('Item not found');
  if (item.owner.toString() === borrowerId) throw new Error('Cannot request your own item');

  // Check for overlaps with APPROVED requests
  const overlap = await BorrowRequest.findOne({
    item: data.item,
    status: RequestStatus.APPROVED,
    $or: [
      { startDate: { $lt: data.endDate }, endDate: { $gt: data.startDate } }
    ]
  });
  if (overlap) throw new Error('Item is already booked for this period');

  return await BorrowRequest.create({
    ...data,
    borrower: borrowerId,
    owner: item.owner,
    status: RequestStatus.PENDING
  });
};

export const getBorrowRequests = async (userId: string) => {
  return await BorrowRequest.find({
    $or: [{ borrower: userId }, { owner: userId }]
  }).populate('item borrower owner', 'title name email');
};

export const updateRequestStatus = async (requestId: string, userId: string, status: RequestStatus) => {
  const request = await BorrowRequest.findById(requestId);
  if (!request) throw new Error('Request not found');

  if (status === RequestStatus.APPROVED || status === RequestStatus.REJECTED) {
    if (request.owner.toString() !== userId.toString()) throw new Error('Unauthorized');
    
    // If approving, double-check no new overlapping approved requests
    if (status === RequestStatus.APPROVED) {
        const overlap = await BorrowRequest.findOne({
            item: request.item,
            status: RequestStatus.APPROVED,
            _id: { $ne: requestId },
            $or: [
              { startDate: { $lt: request.endDate }, endDate: { $gt: request.startDate } }
            ]
        });
        if (overlap) throw new Error('Item is already booked for this period');
    }
  } else if (status === RequestStatus.CANCELLED) {
    if (request.borrower.toString() !== userId.toString()) throw new Error('Unauthorized');
  }

  request.status = status;
  await request.save();

  if (status === RequestStatus.APPROVED) {
    await Item.findByIdAndUpdate(request.item, { status: 'Borrowed' });
  }

  return request;
};
