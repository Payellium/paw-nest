export interface INIDVerification {
  documentFront: string;
  documentBack: string;

  status: "Pending" | "Verified" | "Rejected";

  consentGiven: boolean;

  verifiedAt?: Date;
  rejectionReason?: string;
}