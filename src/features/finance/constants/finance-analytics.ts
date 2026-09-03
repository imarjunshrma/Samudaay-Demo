export const billingInvoices = [
  ['Studio Retainer', 'INV-2048', '$7,200', 'Paid'],
  ['Brand Campaign', 'INV-2047', '$4,500', 'Pending'],
  ['Portfolio Refresh', 'INV-2046', '$2,200', 'Overdue'],
] as const;

export const transactionManagementItems = [
  ['TXN-82451', 'Donation • ₹12,500 • Completed'],
  ['TXN-82450', 'Matrimony Premium • ₹2,999 • Pending'],
  ['TXN-82449', 'Event Registration • ₹1,200 • Refunded'],
] as const;

export const transactionTrendHeights = [42, 58, 76, 74, 108, 100] as const;
export const transactionTrendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const;

export const topDonationPincodes = [
  ['390001', '₹1,82,500', '88%', '#18a875'],
  ['390007', '₹1,21,000', '68%', '#fb923c'],
  ['391110', '₹98,400', '56%', '#fdba74'],
  ['390015', '₹77,250', '44%', '#fed7aa'],
] as const;

export const analyticsTabs = ['Overview', 'Registrations', 'Catering'] as const;

export const eventAnalyticsStats = [
  ['Total Event Registrations', '4,821', '#7c3aed', 'confirmation-number'],
  ['Average Attendance Rate', '87.4%', '#0f766e', 'how-to-reg'],
  ['Active Workshops', '24', '#ea580c', 'groups'],
] as const;

export const cateringRequirements = [
  ['Lunch Veg', '2,920 plates', '90%', '#22c55e'],
  ['Dinner Veg', '2,240 plates', '74%', '#16a34a'],
  ['Jain Meals', '620 plates', '34%', '#86efac'],
  ['Kids Meals', '410 plates', '24%', '#bbf7d0'],
] as const;

export const peopleSummaryStats = [
  ['New Registrations', '842'],
  ['Active Matrimony', '2,104'],
] as const;

export const membersByCity = [
  ['Vadodara', '3,840', '100%', '#18a875'],
  ['Ahmedabad', '2,960', '78%', '#fb923c'],
  ['Surat', '2,420', '64%', '#fdba74'],
  ['Rajkot', '1,710', '45%', '#fed7aa'],
] as const;

export const regionalDistribution = [
  ['Central Gujarat', '38%'],
  ['North Gujarat', '24%'],
  ['Saurashtra', '21%'],
  ['South Gujarat', '17%'],
] as const;
