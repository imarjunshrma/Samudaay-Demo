import type { DonationRecordItem } from '../services/donation-service';
import type { CommunityPrintIdentity } from '@/src/features/community/services/community-print-identity';
import { isVadodaraCity } from '@/src/services/location/vadodara-area-options';

function numberToWords(amount: number): string {
  const n = Math.floor(amount);
  if (n === 0) return 'Zero Only';
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function below1000(x: number): string {
    if (x === 0) return '';
    if (x < 20) return ones[x] ?? '';
    if (x < 100) return (tens[Math.floor(x / 10)] ?? '') + (x % 10 ? ` ${ones[x % 10] ?? ''}` : '');
    return (ones[Math.floor(x / 100)] ?? '') + ' Hundred' + (x % 100 ? ` ${below1000(x % 100)}` : '');
  }

  const parts: string[] = [];
  let rem = n;
  if (rem >= 10000000) {
    parts.push(`${below1000(Math.floor(rem / 10000000))} Crore`);
    rem %= 10000000;
  }
  if (rem >= 100000) {
    parts.push(`${below1000(Math.floor(rem / 100000))} Lakh`);
    rem %= 100000;
  }
  if (rem >= 1000) {
    parts.push(`${below1000(Math.floor(rem / 1000))} Thousand`);
    rem %= 1000;
  }
  if (rem > 0) {
    parts.push(below1000(rem));
  }
  return `${parts.join(' ')} Only`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fval(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return `<span style="font-weight:bold;color:#1a3a8c;">${escapeHtml(String(value))}</span>`;
}

function formatDateValue(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-IN');
}

function paymentModeDisplay(paymentMode: DonationRecordItem['paymentMode']): string {
  if (paymentMode === 'cash') {
    return 'Cash';
  }

  if (paymentMode === 'cheque') {
    return 'Cheque';
  }

  if (paymentMode === 'transfer') {
    return 'Online';
  }

  return 'Manual';
}

function donationStatusDisplay(status: DonationRecordItem['status']): string {
  if (status === 'PAID') {
    return 'Paid';
  }

  if (status === 'CANCELLED') {
    return 'Cancelled';
  }

  return 'Pending';
}

const DEFAULT_HEADER = `
                <div class="trust-name">મોચી એકતા ચેરીટેબલ ટ્રસ્ટ, વડોદરા</div>
                <div class="address-line">કાર્યાલય : C 1/1/21, સુમંત ફ્લેટ્સ, ગાય સર્કલ પાસે, દુર્ગા સ્વીટ અને ફર&zwnj;સ&zwnj;ાણની બ&zwnj;ાજુ&zwnj;મ&zwnj;ાં, અ&zwnj;ક&zwnj;ોટ&zwnj;ા, વ&zwnj;ડ&zwnj;ોદ&zwnj;રા</div>
                <div class="reg-line">રજી. નં. : એ /3339 &nbsp;&nbsp;|&nbsp;&nbsp; ફોન : 98243 95362</div>`;

const DEFAULT_BANK_DETAILS = `
                <strong>Name :</strong> MOCHI EKTA CHARITABLE TRUST<br>
                <strong>Bank :</strong> ICICI BANK LTD. &nbsp;|&nbsp; <strong>Branch :</strong> WAGHODIA ROAD<br>
                <strong>A/c No. :</strong> 437701000533 &nbsp;|&nbsp; <strong>IFSC No. :</strong> ICIC0004377<br>
                <strong>80 G Registration No. :</strong> AAGTM2486CE2021001 &nbsp;|&nbsp; <strong>PAN Card No. :</strong> AAGTM2486C`;

function joinParts(parts: (string | null)[]) {
  return parts.filter(Boolean).join(' &nbsp;|&nbsp; ');
}

// Header and bank block from the active community's configuration (Samudaay).
function buildCommunityHeader(identity: CommunityPrintIdentity) {
  const address = identity.addressLocal || identity.address;
  const regLine = joinParts([
    identity.registrationNumber ? `રજી. નં. : ${escapeHtml(identity.registrationNumber)}` : null,
    identity.phoneNumber ? `ફોન : ${escapeHtml(identity.phoneNumber)}` : null,
  ]);
  return `
                <div class="trust-name">${escapeHtml(identity.trustNameLocal || identity.trustName)}</div>
                ${address ? `<div class="address-line">કાર્યાલય : ${escapeHtml(address)}</div>` : ''}
                ${regLine ? `<div class="reg-line">${regLine}</div>` : ''}`;
}

function buildCommunityBankDetails(identity: CommunityPrintIdentity) {
  const lines = [
    `<strong>Name :</strong> ${escapeHtml((identity.bankAccountName || identity.trustName).toUpperCase())}`,
    joinParts([
      identity.bankName ? `<strong>Bank :</strong> ${escapeHtml(identity.bankName)}` : null,
      identity.bankBranch ? `<strong>Branch :</strong> ${escapeHtml(identity.bankBranch)}` : null,
    ]),
    joinParts([
      identity.bankAccountNumber ? `<strong>A/c No. :</strong> ${escapeHtml(identity.bankAccountNumber)}` : null,
      identity.bankIfscCode ? `<strong>IFSC No. :</strong> ${escapeHtml(identity.bankIfscCode)}` : null,
    ]),
    joinParts([
      identity.registration80GNumber ? `<strong>80 G Registration No. :</strong> ${escapeHtml(identity.registration80GNumber)}` : null,
      identity.panNumber ? `<strong>PAN Card No. :</strong> ${escapeHtml(identity.panNumber)}` : null,
    ]),
  ].filter(Boolean);
  return lines.join('<br>\n                ');
}

export function generateDonationReceiptHtml(
  record: DonationRecordItem,
  logoUri: string | null,
  qrUri: string | null,
  identity: CommunityPrintIdentity | null = null,
): string {
  const headerHtml = identity ? buildCommunityHeader(identity) : DEFAULT_HEADER;
  const bankDetailsHtml = identity ? buildCommunityBankDetails(identity) : DEFAULT_BANK_DETAILS;
  const trustTitle = identity ? identity.trustName : 'Samudaay';
  const date = record.createdAt ? new Date(record.createdAt) : new Date();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);

  const amount = Number(record.amount || 0);
  const amountFormatted = amount.toLocaleString('en-IN');
  const amountWords = numberToWords(amount);
  const addressLine = record.addressLine1 || '';
  const addressExtraLine = record.addressLine2 || '';
  const isVadodaraDonation = isVadodaraCity(record.city);
  const areaLine = isVadodaraDonation ? record.area || '' : '';
  const detailText = [record.message, record.referenceNumber ? `Ref: ${record.referenceNumber}` : null]
    .filter(Boolean)
    .join(' | ');

  return `<!DOCTYPE html>
<html lang="gu">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(trustTitle)} Receipt</title>
<style>
    @page { size: A4 landscape; margin: 4mm; }
    html {
        background-color: #fff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: Arial, sans-serif;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: stretch;
        padding: 0;
        line-height: 1;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    .receipt-box {
        width: 289mm;
        min-height: 202mm;
        height: 202mm;
        max-width: none;
        background-color: #eaf3ff;
        border: 3px solid #293084;
        border-radius: 28px;
        padding: 10px 20px 12px 20px;
        color: #293084;
        position: relative;
        overflow: hidden;
        page-break-inside: avoid;
        break-inside: avoid;
    }

    /* Watermark */
    .watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 340px;
        height: 340px;
        opacity: 0.08;
        pointer-events: none;
        z-index: 0;
        object-fit: contain;
    }

    .content {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    /* HEADER */
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 3px solid #293084;
        padding-bottom: 6px;
        margin-bottom: 6px;
    }
    .logo-wrap {
        width: 138px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
    }
    .logo-circle {
        width: 108px;
        height: 108px;
        border-radius: 50%;
        border: 0;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    .logo-circle img {
        width: 106px;
        height: 106px;
        border-radius: 50%;
        object-fit: cover;
    }
    .logo-placeholder {
        font-size: 10px;
        font-weight: bold;
        color: #1a3a8c;
        text-align: center;
        padding: 6px;
    }
    .header-center {
        text-align: center;
        flex: 1;
        padding: 0 10px;
    }
    .trust-name {
        font-size: 34px;
        font-weight: bold;
        color: #293084;
        margin-bottom: 2px;
        line-height: 1.2;
    }
    .address-line {
        font-size: 15px;
        color: #222;
        margin-bottom: 1px;
        font-weight: bold;
    }
    .reg-line {
        font-size: 15px;
        font-weight: bold;
        color: #222;
    }

    /* FORM ROWS */
    .form-section {
        margin-bottom: 0;
    }

    /* Row 1: Date (left) + Receipt No (right) */
    .row-date-receipt {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 4px;
    }
    .date-block {
        display: flex;
        align-items: flex-end;
        gap: 0;
    }
    .date-label { font-weight: bold; font-size: 18px; line-height: 1.08; }
    .date-label .eng { font-size: 16px; font-weight: bold; display: block; }
    .date-slash {
        font-weight: bold;
        font-size: 18px;
        margin: 0 18px;
        padding-bottom: 1px;
    }
    .date-field {
        border-bottom: 2px dashed #293084;
        width: 50px;
        min-height: 20px;
        display: inline-block;
        text-align: center;
        font-weight: bold;
        padding: 0 4px;
    }
    .date-year {
        font-weight: bold;
        font-size: 18px;
        margin-left: 4px;
        padding-bottom: 1px;
    }
    .receipt-block {
        display: flex;
        align-items: flex-end;
        gap: 6px;
    }
    .receipt-label { font-weight: bold; font-size: 18px; text-align: left; line-height: 1.08; }
    .receipt-label .eng { font-size: 16px; font-weight: bold; display: block; }
    .receipt-line {
        border-bottom: 2px dashed #293084;
        width: 200px;
        min-height: 20px;
        text-align: center;
        font-weight: bold;
        padding: 0 4px;
    }

    /* Generic field row */
    .frow {
        display: flex;
        align-items: flex-end;
        margin-bottom: 4px;
        gap: 0;
    }
    .flabel {
        font-weight: bold;
        font-size: 18px;
        white-space: nowrap;
        line-height: 1.08;
    }
    .flabel .eng {
        font-size: 16px;
        font-weight: bold;
        display: block;
    }
    .fline {
        border-bottom: 2px dashed #293084;
        flex: 1;
        min-height: 20px;
        margin-left: 6px;
        font-weight: bold;
        padding: 0 4px;
    }
    .fgap { width: 20px; flex-shrink: 0; }

    /* FOOTER */
    .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: auto;
        padding-bottom: 0;
    }
    .bank-details {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 13px;
        color: #293084;
        line-height: 1.2;
        font-weight: bold;
        padding-bottom: 0;
    }
    .bank-details strong { color: #293084; }

    .footer-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
    }
    .received-by-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 160px;
    }
    .sig-line {
        border-bottom: 1.5px solid #1a3a8c;
        width: 160px;
        margin-bottom: 4px;
    }
    .sig-label {
        font-weight: bold;
        font-size: 14px;
        color: #1a3a8c;
        text-align: center;
    }
    .sig-label .eng {
        font-size: 11px;
        font-weight: normal;
        display: block;
    }
    .qr-box {
        width: 104px;
        height: 104px;
        border: 0;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: #1a3a8c;
    }
</style>
</head>
<body>

<div class="receipt-box">
    <!-- Watermark -->
    ${logoUri ? `<img class="watermark" src="${escapeHtml(logoUri)}" alt="">` : ''}

    <div class="content">
        <!-- HEADER -->
        <div class="header">
            <div class="logo-wrap">
                <div class="logo-circle">
                    ${logoUri ? `<img src="${escapeHtml(logoUri)}" alt="${escapeHtml(trustTitle)} Logo">` : ''}
                </div>
            </div>
            <div class="header-center">
${headerHtml}
            </div>
            <!-- No QR in header per original -->
        </div>

        <!-- FORM -->
        <div class="form-section">

            <!-- Row: Date (left) | Receipt No. (right) -->
            <div class="row-date-receipt">
                <div class="date-block">
                    <div class="date-label">તારીખ : <span class="eng">Date</span></div>
                    <div class="date-field">${fval(dd)}</div>
                    <span class="date-slash">/</span>
                    <div class="date-field">${fval(mm)}</div>
                    <span class="date-slash">/</span>
                    <span class="date-year">20</span>
                    <div class="date-field" style="width:35px;">${fval(yy)}</div>
                </div>
                <div class="receipt-block">
                    <div class="receipt-label">પ&zwnj;ા&zwnj;વ&zwnj;ત&zwnj;ી ન&zwnj;ં&zwnj;બ&zwnj;ર :<span class="eng">Receipt No.</span></div>
                    <div class="receipt-line">${fval(record.receiptNo)}</div>
                </div>
            </div>

            <!-- Row: Name (full width) -->
            <div class="frow">
                <div class="flabel">ન&zwnj;ામ <span class="eng">Name</span></div>
                <div class="fline">${fval(record.donorName)}</div>
            </div>

            <!-- Row: Address (full width) -->
            <div class="frow">
                <div class="flabel">સ&zwnj;ર&zwnj;ન&zwnj;ા&zwnj;મ&zwnj;ું <span class="eng">Address</span></div>
                <div class="fline">${fval(addressLine)}</div>
            </div>
            <!-- Second address line -->
            <div class="frow" style="margin-top:-4px;">
                <div class="fline" style="margin-left:0;">${fval(addressExtraLine)}</div>
            </div>

            <!-- Row: Area | City | Pin Code -->
            <div class="frow">
                <div class="flabel">વિસ્તાર <span class="eng">Area</span></div>
                <div class="fline" style="max-width:200px;">${fval(areaLine)}</div>
                <div class="fgap"></div>
                <div class="flabel">શ&zwnj;હ&zwnj;ે&zwnj;ર <span class="eng">City</span></div>
                <div class="fline" style="max-width:200px;">${fval(record.city)}</div>
                <div class="fgap"></div>
                <div class="flabel">પીન કોડ <span class="eng">Pin Code</span></div>
                <div class="fline" style="max-width:120px;">${fval(record.pincode)}</div>
            </div>

            <!-- Row: State | Country -->
            <div class="frow">
                <div class="flabel">ર&zwnj;ાજ&zwnj;્ય <span class="eng">State</span></div>
                <div class="fline" style="max-width:260px;">${fval(record.state)}</div>
                <div class="fgap"></div>
                <div class="flabel">દ&zwnj;ેશ <span class="eng">Country</span></div>
                <div class="fline" style="max-width:260px;">${fval(record.country)}</div>
            </div>

            <!-- Row: PAN Card (optional) | Phone | Deposit Date -->
            <div class="frow">
                ${record.panNumber ? `
                <div class="flabel">પ&zwnj;ા&zwnj;ન ક&zwnj;ા&zwnj;ર&zwnj;્&zwnj;ડ <span class="eng">PAN Card</span></div>
                <div class="fline" style="max-width:160px;">${fval(record.panNumber)}</div>
                <div class="fgap"></div>
                ` : ''}
                <div class="flabel">ફ&zwnj;ો&zwnj;ન <span class="eng">Phone</span></div>
                <div class="fline" style="max-width:180px;">${fval(record.phoneNumber)}</div>
                <div class="fgap"></div>
                <div class="flabel">જ&zwnj;મ&zwnj;ા ત&zwnj;ા&zwnj;ર&zwnj;ી&zwnj;ખ <span class="eng">Deposit Date</span></div>
                <div class="fline" style="max-width:130px;">${fval(formatDateValue(record.createdAt))}</div>
            </div>

            <!-- Row: Amount | Payment Mode | Status -->
            <div class="frow">
                <div class="flabel">ર&zwnj;ક&zwnj;મ <span class="eng">Amount</span></div>
                <div class="fline" style="max-width:170px;">${fval(`₹${amountFormatted}`)}</div>
                <div class="fgap"></div>
                <div class="flabel">રકમ જમા કર્યાની રીત <span class="eng">Payment Mode</span></div>
                <div class="fline" style="max-width:190px;">${fval(paymentModeDisplay(record.paymentMode))}</div>
                <div class="fgap"></div>
                <div class="flabel">સ્થિતિ <span class="eng">Status</span></div>
                <div class="fline" style="max-width:150px;">${fval(donationStatusDisplay(record.status))}</div>
            </div>

            <!-- Row: In Words (full width) -->
            <div class="frow">
                <div class="flabel">અ&zwnj;ં&zwnj;ક&zwnj;ે <span class="eng">In Words</span></div>
                <div class="fline">${fval(amountWords)}</div>
            </div>

            <!-- Row: Details (full width) -->
            <div class="frow">
                <div class="flabel">વ&zwnj;િ&zwnj;ગ&zwnj;ત <span class="eng">Details</span></div>
                <div class="fline">${fval(detailText)}</div>
            </div>

            <!-- Row: Purpose | Family Member -->
            <div class="frow">
                <div class="flabel">હ&zwnj;ે&zwnj;ત&zwnj;ુ <span class="eng">Purpose</span></div>
                <div class="fline" style="max-width:360px;">${fval(record.donationPurpose || record.donationType)}</div>
                <div class="fgap"></div>
                <div class="flabel">સભ્ય <span class="eng">Family Member</span></div>
                <div class="fline">${fval(record.totalFamilyMembers || record.memberSearch)}</div>
            </div>

            <!-- Row: Received By (left) -->
            <div class="frow">
                <div class="flabel">ભ&zwnj;ે&zwnj;ટ લ&zwnj;ે&zwnj;ન&zwnj;ા&zwnj;ર <span class="eng">Received By</span></div>
                <div class="fline" style="max-width:320px;">${fval(record.receivedBy)}</div>
            </div>

        </div>

        <!-- FOOTER: Bank details (left) + QR code (right) -->
        <div class="footer">
            <div class="bank-details">${bankDetailsHtml}
            </div>
            ${qrUri ? `<div class="qr-box">
                <img src="${escapeHtml(qrUri)}" alt="QR Code" style="width:100%;height:100%;object-fit:contain;">
            </div>` : ''}
        </div>
    </div>
</div>

</body>
</html>`;
}
