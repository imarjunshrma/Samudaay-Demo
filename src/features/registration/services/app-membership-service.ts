import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import type { RazorpayCheckoutOptions, RazorpayPaymentError, RazorpayPaymentSuccess } from 'react-native-razorpay';

import { colors } from '@/src/theme';
import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { createAndDeliverPdf } from '@/src/services/files/pdf-file';
import { getReceiptPrintContext } from '@/src/features/community/services/community-print-identity';
import { communityConfig } from '@/src/core/config/community';

export type AppMembershipAccess = {
  required: boolean;
  status: string;
  locked: boolean;
  amount: number;
  currency: string;
  graceEndsAt?: string | null;
  expiresAt?: string | null;
  subscription?: {
    id: string;
    status: string;
    startsAt: string;
    endsAt: string;
    graceEndsAt?: string | null;
    amountPaid: number;
    currency: string;
    paidAt?: string | null;
  } | null;
};

type AppMembershipPaymentOrder = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  receipt?: string | null;
  name: string;
  description: string;
  prefill?: {
    name?: string | null;
    contact?: string | null;
    email?: string | null;
  };
};

export type AppMembershipReceiptInput = {
  transactionId: string;
  title: string;
  amount: number;
  status: string;
  createdAt: string;
  membershipStartsAt?: string | null;
  membershipEndsAt?: string | null;
  paymentRef?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleDateString('en-IN', options ?? {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function buildMembershipReceiptHtml(receipt: AppMembershipReceiptInput) {
  const receiptNo = receipt.paymentRef || receipt.transactionId;
  const tenantName = communityConfig.tenantName || communityConfig.brandName || 'Community';
  const tenantNameGu = communityConfig.tenantNameGu || tenantName;
  const tagline = communityConfig.tagline || 'Community Membership';
  const receiptPrintContext = getReceiptPrintContext();
  const logoUri = receiptPrintContext.logoUri;
  const authorizedSignatureUri = receiptPrintContext.authorizedSignatureUri;
  const paidOn = formatDate(receipt.createdAt);
  const membershipPeriod = `${formatDate(receipt.membershipStartsAt)} to ${formatDate(receipt.membershipEndsAt)}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Membership Receipt ${escapeHtml(receiptNo)}</title>
        <style>
          * { box-sizing: border-box; }
          @page { size: A4 portrait; margin: 14mm; }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #1f2937;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page {
            width: 190mm;
            min-height: 267mm;
            margin: 0 auto;
            padding: 24px;
            position: relative;
            border: 2px solid #293084;
            border-radius: 20px;
            overflow: hidden;
          }
          .watermark {
            position: absolute;
            top: 52%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            opacity: 0.06;
            object-fit: contain;
            z-index: 0;
          }
          .content { position: relative; z-index: 1; }
          .header {
            display: flex;
            align-items: center;
            gap: 18px;
            padding-bottom: 18px;
            border-bottom: 3px solid #f97316;
          }
          .logo {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
          }
          .tenant-gu {
            color: #293084;
            font-size: 24px;
            font-weight: 800;
            line-height: 1.2;
          }
          .tenant-en {
            margin-top: 4px;
            color: #111827;
            font-size: 18px;
            font-weight: 700;
          }
          .tagline {
            margin-top: 4px;
            color: #6b7280;
            font-size: 13px;
          }
          .receipt-title {
            margin: 26px 0 18px;
            display: flex;
            justify-content: space-between;
            gap: 18px;
            align-items: flex-start;
          }
          h1 {
            margin: 0;
            color: #293084;
            font-size: 28px;
          }
          .receipt-no {
            min-width: 210px;
            padding: 10px 14px;
            border: 1px solid #fed7aa;
            border-radius: 12px;
            background: #fff7ed;
            text-align: right;
          }
          .label {
            display: block;
            color: #6b7280;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .value {
            color: #111827;
            font-size: 15px;
            font-weight: 700;
          }
          .amount-box {
            margin: 0 0 22px;
            padding: 20px;
            border-radius: 16px;
            background: #ecfdf5;
            border: 1px solid #bbf7d0;
          }
          .amount {
            margin: 0;
            color: #166534;
            font-size: 40px;
            font-weight: 800;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .item {
            min-height: 76px;
            padding: 14px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: rgba(249, 250, 251, 0.86);
          }
          .note {
            margin-top: 28px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
            line-height: 1.5;
          }
          .signature {
            margin-top: 58px;
            display: flex;
            justify-content: flex-end;
          }
          .signature-box {
            width: 190px;
            text-align: center;
            color: #293084;
            font-weight: 700;
            font-size: 13px;
          }
          .signature-line {
            border-top: 1.5px solid #293084;
            margin-bottom: 8px;
          }
          .signature-image {
            width: 160px;
            height: 56px;
            object-fit: contain;
            margin: 0 auto 6px;
            display: block;
          }
        </style>
      </head>
      <body>
        <main class="page">
          ${logoUri ? `<img class="watermark" src="${logoUri}" alt="" />` : ''}
          <section class="content">
            <header class="header">
              ${logoUri ? `<img class="logo" src="${logoUri}" alt="Community logo" />` : ''}
              <div>
                <div class="tenant-gu">${escapeHtml(tenantNameGu)}</div>
                <div class="tenant-en">${escapeHtml(tenantName)}</div>
                <div class="tagline">${escapeHtml(tagline)}</div>
              </div>
            </header>

            <div class="receipt-title">
              <div>
                <span class="label">Payment Receipt</span>
                <h1>Yearly App Membership</h1>
              </div>
              <div class="receipt-no">
                <span class="label">Receipt No.</span>
                <div class="value">${escapeHtml(receiptNo)}</div>
              </div>
            </div>

            <div class="amount-box">
              <span class="label">Amount Paid</span>
              <p class="amount">${formatCurrency(receipt.amount)}</p>
            </div>

            <div class="grid">
              <div class="item"><span class="label">Payment Status</span><div class="value">${escapeHtml(receipt.status)}</div></div>
              <div class="item"><span class="label">Paid On</span><div class="value">${escapeHtml(paidOn)}</div></div>
              <div class="item"><span class="label">Membership Period</span><div class="value">${escapeHtml(membershipPeriod)}</div></div>
              <div class="item"><span class="label">Payment Reference</span><div class="value">${escapeHtml(receipt.paymentRef || '-')}</div></div>
            </div>

            <p class="note">
              This receipt was generated from your community app transaction history for yearly app membership access.
              Please keep this slip for your payment records.
            </p>

            <div class="signature">
              <div class="signature-box">
                ${authorizedSignatureUri ? `<img class="signature-image" src="${authorizedSignatureUri}" alt="Authorized signature" />` : ''}
                <div class="signature-line"></div>
                Authorized Signatory
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  `;
}

function readRazorpayField(payment: RazorpayPaymentSuccess, snakeKey: keyof RazorpayPaymentSuccess, camelKey: string) {
  const source = payment as unknown as Record<string, unknown>;
  const nestedData = source.data && typeof source.data === 'object' ? source.data as Record<string, unknown> : null;
  return String(source[snakeKey] || source[camelKey] || nestedData?.[snakeKey] || nestedData?.[camelKey] || '').trim();
}

function getRazorpayPaymentErrorMessage(error: RazorpayPaymentError) {
  const description = error?.description || error?.error?.description || error?.error?.reason;
  if (description) return description;
  return 'Payment was cancelled or could not be completed.';
}

async function getSession() {
  const backendSession = await getBackendSessionContext();
  if (!backendSession) {
    throw new Error('Backend session not found.');
  }
  return backendSession;
}

export const appMembershipService = {
  async loadMe(): Promise<AppMembershipAccess> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }
    const backendSession = await getSession();
    const response = await apiClient<{ data: AppMembershipAccess }>(
      apiEndpoints.communityAppMembershipMe(backendSession.tenantId),
      { token: backendSession.token },
    );
    return response.data;
  },

  async createPaymentOrder(): Promise<AppMembershipPaymentOrder> {
    const backendSession = await getSession();
    const response = await apiClient<{ data: AppMembershipPaymentOrder }>(
      apiEndpoints.communityAppMembershipPaymentOrder(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({}),
      },
    );
    return response.data;
  },

  async openRazorpayCheckout(order: AppMembershipPaymentOrder) {
    if (Platform.OS === 'web') {
      throw new Error('Razorpay checkout is available only in the mobile app.');
    }
    if (!order.keyId) {
      throw new Error('Razorpay key id was not returned by the server.');
    }
    const hasRazorpayNativeModule = Boolean(
      NativeModules.RNRazorpayCheckout || TurboModuleRegistry.get?.('RNRazorpayCheckout'),
    );
    if (!hasRazorpayNativeModule) {
      throw new Error('Razorpay native module is not available in this build.');
    }

    let RazorpayCheckout: typeof import('react-native-razorpay').default;
    try {
      RazorpayCheckout = (await import('react-native-razorpay')).default;
    } catch {
      throw new Error('Unable to load Razorpay checkout. Rebuild the app after installing react-native-razorpay.');
    }

    const options: RazorpayCheckoutOptions = {
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: order.name,
      description: order.description,
      prefill: order.prefill,
      theme: { color: colors.primary.DEFAULT },
      modal: { backdropclose: false, confirm_close: true },
    };

    try {
      return await RazorpayCheckout.open(options);
    } catch (error) {
      throw new Error(getRazorpayPaymentErrorMessage(error as RazorpayPaymentError));
    }
  },

  async verifyPayment(payload: { razorpay: RazorpayPaymentSuccess }): Promise<AppMembershipAccess> {
    const backendSession = await getSession();
    const razorpayOrderId = readRazorpayField(payload.razorpay, 'razorpay_order_id', 'razorpayOrderId');
    const razorpayPaymentId = readRazorpayField(payload.razorpay, 'razorpay_payment_id', 'razorpayPaymentId');
    const razorpaySignature = readRazorpayField(payload.razorpay, 'razorpay_signature', 'razorpaySignature');
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new Error('Payment was completed, but Razorpay did not return complete verification details. Please contact support with your payment id.');
    }

    const response = await apiClient<{ data: AppMembershipAccess }>(
      apiEndpoints.communityAppMembershipPaymentVerify(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        }),
      },
    );
    return response.data;
  },

  async downloadMembershipReceipt(receipt: AppMembershipReceiptInput) {
    return createAndDeliverPdf({
      source: {
        type: 'html',
        html: buildMembershipReceiptHtml(receipt),
        width: 794,
        height: 1123,
      },
      fileName: `membership-receipt-${receipt.paymentRef || receipt.transactionId}.pdf`,
      delivery: 'share',
    });
  },
};
