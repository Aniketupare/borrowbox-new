import { DamageReport, ReportStatus } from '../models/DamageReport';
import { Booking } from '../models/Booking';
import { Dispute } from '../models/Dispute';
import { Types } from 'mongoose';

export const createDamageReport = async (userId: string, data: any) => {
  const booking = await Booking.findById(data.bookingId);
  if (!booking) throw new Error('Booking not found');
  if (booking.borrower.toString() !== userId && booking.owner.toString() !== userId) throw new Error('Unauthorized');
  
  const reportedAgainst = booking.borrower.toString() === userId ? booking.owner : booking.borrower;
  
  return await DamageReport.create({
    booking: booking._id,
    item: booking.item,
    reportedBy: userId,
    reportedAgainst: reportedAgainst,
    description: data.description,
    damageType: data.damageType,
    estimatedCost: data.estimatedCost,
    evidenceImages: data.evidenceImages || []
  });
};

export const getDamageReport = async (id: string, userId: string) => {
  const report = await DamageReport.findById(id);
  if (!report) throw new Error('Report not found');
  if (report.reportedBy.toString() !== userId && report.reportedAgainst.toString() !== userId) throw new Error('Unauthorized');
  return report;
};

export const getDamageReportsByBooking = async (bookingId: string, userId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  if (booking.borrower.toString() !== userId && booking.owner.toString() !== userId) throw new Error('Unauthorized');
  
  return await DamageReport.find({ booking: bookingId });
};

export const createDispute = async (userId: string, data: any) => {
  const report = await DamageReport.findById(data.damageReportId).populate('booking');
  if (!report) throw new Error('Report not found');
  if (report.reportedBy.toString() !== userId && report.reportedAgainst.toString() !== userId) throw new Error('Unauthorized');
  
  return await Dispute.create({
    damageReport: report._id,
    booking: report.booking._id,
    raisedBy: userId,
    against: report.reportedBy.toString() === userId ? report.reportedAgainst : report.reportedBy,
    reason: data.reason,
    evidence: data.evidence || []
  });
};

export const getDispute = async (id: string, userId: string) => {
  const dispute = await Dispute.findById(id);
  if (!dispute) throw new Error('Dispute not found');
  // Simple check: raisedBy or against should be the user
  if (dispute.raisedBy.toString() !== userId && dispute.against.toString() !== userId) throw new Error('Unauthorized');
  return dispute;
};

export const resolveDispute = async (id: string, adminId: string, data: any) => {
  // Assuming 'admin' role check is needed, but for now just basic auth
  const dispute = await Dispute.findById(id);
  if (!dispute) throw new Error('Dispute not found');
  
  dispute.status = data.status;
  dispute.resolution = data.resolution;
  dispute.resolvedBy = new Types.ObjectId(adminId);
  dispute.resolvedAt = new Date();
  
  await dispute.save();
  await DamageReport.findByIdAndUpdate(dispute.damageReport, { 
    status: data.status, 
    resolution: data.resolution,
    resolutionNote: data.resolutionNote,
    resolvedBy: new Types.ObjectId(adminId),
    resolvedAt: new Date()
  });
  
  return dispute;
};
