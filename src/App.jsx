import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import piexif from 'piexifjs';
import styles from './ReceiptComponent.module.css';
import bbva2019Logo from './assets/BBVA_2019.svg.png';

// Helpers to format current date/time in Spanish style used by the receipt
const ES_MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const pad2 = (n) => n.toString().padStart(2, '0');
const getNowDateEs = () => {
    const d = new Date();
    return `${d.getDate()} ${ES_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
const getNowTime24 = () => {
    const d = new Date();
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};
const getRandomAccount = () => Math.floor(Math.random() * 90000 + 10000).toString();
const getRandomReference = () => Math.floor(Math.random() * 9000000 + 1000000).toString();
const getRandomFolio = () => Math.floor(Math.random() * 900000000 + 100000000).toString();
const getRandomTrackingKey = () => {
    let digits = '';
    for (let i = 0; i < 20; i++) {
        digits += Math.floor(Math.random() * 10);
    }
    return `MBANO${digits}`;
};
const getRandomAmount = () => {
    const amount = Math.random() * 999999 + 1; // 1.00 to 1,000,000.00
    return amount.toFixed(2);
};

// Helper component for individual form fields with enhanced styling
const FormField = ({ label, name, type = 'text', value, onChange, placeholder, icon }) => (
    <div className="mb-3 sm:mb-4">
        <label className="block text-gray-800 text-xs sm:text-sm font-semibold mb-2">
            {icon && <span className="inline-block mr-2">{icon}</span>}
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            className="w-full px-3 sm:px-4 py-3 sm:py-2 border-2 border-gray-200 rounded-lg text-gray-800 bg-white 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     hover:border-gray-300 transition-all duration-200 placeholder-gray-500 text-base
                     min-h-[44px] sm:min-h-[auto]"
        />
    </div>
);

// Enhanced section component for grouping form fields
const FormSection = ({ title, children, icon }) => (
    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center">
            {icon && <span className="mr-2 text-blue-600">{icon}</span>}
            {title}
        </h3>
        {children}
    </div>
);

// Template types
const TEMPLATES = {
    TRANSFERIR: 'transferir',
    DIMO: 'dimo',
    INTERNATIONAL: 'international',
    BBVA_PROOF: 'bbva-proof'
};

// The original receipt preview component (Transferir template)
const ReceiptPreview = React.forwardRef(({ data }, ref) => {
    const formatAccount = (account) => `•${account.slice(-5)}`;
    const formatAmount = (amount) => {
        const number = parseFloat(amount);
        return isNaN(number) ? '0.00' : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className={styles.receiptWrapper}>
            <div id="phone-mock" ref={ref} className={styles.phoneContainer}>
                <header className={styles.header}>
                    <svg className={styles.headerArrow} viewBox="0 0 24 24">
                        <path className={styles.arrowIcon} d="M9 5l7 7-7 7" />
                    </svg>
                    <h1>Transferir</h1>
                </header>
                
                <div className={styles.successSection}>
                    <h2>Operación exitosa</h2>
                    <p className={styles.date}>{data.date}, {data.time} h</p>
                </div>
                
                <section className={styles.amountSection}>
                    <p className={styles.amountLabel}>Importe transferido</p>
                    <p className={styles.amount}>{formatAmount(data.amount)}</p>
                    <p className={styles.commission}>Comisión $0.00</p>
                </section>

                <div className={styles.contentArea}>
                    <div className={styles.accountVisual}>
                        <div className={styles.accountContainer}>
                            <div className={styles.bbvaCard}>
                                <div className={styles.cardHighlight}></div>
                                <div className={styles.logo}>BBVA</div>
                                <div className={styles.lines}>
                                    <div className={styles.line}></div>
                                    <div className={styles.line}></div>
                                </div>
                            </div>
                            {/* The only inline style needed is for the dynamic background color */}
                            <div className={styles.edCircle} style={{ backgroundColor: data.circleColor }}>
                                <div className={styles.circleText}>
                                    {(data.receiverName || '').trim().slice(0, 2).toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className={styles.accountDetails}>
                            <div className={`${styles.accountInfo} ${styles.sender}`}>
                                <p className={styles.name}>Cuenta Ahorro</p>
                                <p className={styles.number}>{formatAccount(data.senderAccount)}</p>
                            </div>
                            <div className={styles.accountInfo}>
                                <p className={styles.name}>{data.receiverName}</p>
                                <p className={styles.number}>{formatAccount(data.receiverAccount)}</p>
                                <p className={styles.bank}>{data.receiverBank}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.transactionDetails}>
                        <div className={styles.detailItem}>
                            <p className={styles.label}>Concepto</p>
                            <p className={`${styles.value} ${styles.italic}`}>{data.concept}</p>
                        </div>
                        <div className={styles.detailItem}>
                            <p className={styles.label}>Referencia</p>
                            <p className={styles.value}>{data.reference}</p>
                        </div>
                        <div className={styles.detailItem}>
                            <p className={styles.label}>Tipo de operación</p>
                            <p className={styles.value}>Transferencia a otros bancos</p>
                        </div>
                        <div className={styles.detailItem}>
                            <p className={styles.label}>Folio de operación</p>
                            <p className={styles.value}>{data.folio}</p>
                        </div>
                        <div className={styles.detailItem}>
                            <p className={styles.label}>Clave de rastreo</p>
                            <p className={`${styles.value} ${styles.breakWord}`}>{data.trackingKey}</p>
                        </div>
                        <div className={styles.verification}>
                            <p className={styles.label}>Verifica el estatus de tu transferencia</p>
                            <a href="#" className={styles.link}>www.banxico.org.mx/cep</a>
                        </div>
                        <div className={styles.emailReceipt}>
                            <p className={styles.label}>Recibirás el comprobante de tu transferencia al correo</p>
                            <p className={styles.email}>
                                <span className={styles.address}>•{data.email}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Dimo receipt template component
const DimoReceiptPreview = React.forwardRef(({ data }, ref) => {
    const formatAmount = (amount) => {
        const number = parseFloat(amount);
        return isNaN(number) ? '0.00' : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    const formatAccount = (account) => `•${account.slice(-4)}`;

    // Format date for Dimo style: "15 dic 2025, 13:52 h." (no seconds)
    const formatDimoDate = () => {
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const d = new Date();
        // Remove seconds from time (HH:MM:SS -> HH:MM)
        const timeWithoutSeconds = data.time.split(':').slice(0, 2).join(':');
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${timeWithoutSeconds} h.`;
    };

    return (
        <div className={styles.receiptWrapper}>
            <div id="phone-mock" ref={ref} className={styles.dimoPhoneContainer}>
                {/* Header */}
                <header className={styles.dimoHeader}>
                    <span className={styles.dimoHeaderTitle}>Transferir & Dimo®</span>
                    <div className={styles.dimoCloseBtn}>
                        <svg viewBox="0 0 24 24" className={styles.dimoCloseIcon}>
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Cerrar</span>
                    </div>
                </header>

                {/* Success Section */}
                <div className={styles.dimoSuccessSection}>
                    <div className={styles.dimoCheckCircle}>
                        <svg viewBox="0 0 24 24" className={styles.dimoCheckIcon}>
                            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                    </div>
                    <h2 className={styles.dimoSuccessTitle}>Transferencia exitosa</h2>
                    <p className={styles.dimoAmountLabel}>Monto transferido</p>
                    <p className={styles.dimoAmount}>$ {formatAmount(data.amount)}</p>
                </div>

                {/* Details Card */}
                <div className={styles.dimoDetailsCard}>
                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Origen</span>
                        <span className={styles.dimoDetailValue}>Cuenta de Ahorro {formatAccount(data.senderAccount)}</span>
                    </div>
                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Destino</span>
                        <span className={styles.dimoDetailValue}>{data.receiverBank} {formatAccount(data.receiverAccount)} {data.receiverName}</span>
                    </div>
                    
                    <div className={styles.dimoInfoNote}>
                        <span className={styles.dimoInfoIcon}>ⓘ</span>
                        <span>El nombre del beneficiario de esta operación es un dato no verificado por la institución.</span>
                    </div>

                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Comisión</span>
                        <span className={styles.dimoDetailValue}>$ 0.00</span>
                    </div>
                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Concepto</span>
                        <span className={styles.dimoDetailValue}>{data.concept}</span>
                    </div>
                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Referencia</span>
                        <span className={styles.dimoDetailValue}>{data.reference}</span>
                    </div>
                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Tipo de operación</span>
                        <span className={styles.dimoDetailValue}>Transferencia a otros bancos</span>
                    </div>
                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Folio de operación</span>
                        <span className={styles.dimoDetailValue}>{data.folio}</span>
                    </div>
                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Fecha de operación</span>
                        <span className={styles.dimoDetailValue}>{formatDimoDate()}</span>
                    </div>
                    <div className={styles.dimoDetailRow}>
                        <span className={styles.dimoDetailLabel}>Clave de rastreo</span>
                        <span className={`${styles.dimoDetailValue} ${styles.dimoTrackingKey}`}>{data.trackingKey}</span>
                    </div>

                    <div className={styles.dimoBanxicoSection}>
                        <p>Verifica el estatus de tu transferencia</p>
                        <a href="#" className={styles.dimoBanxicoLink}>www.banxico.org.mx/cep</a>
                    </div>

                    <div className={styles.dimoEmailSection}>
                        <p>Recibirás el comprobante de tu transferencia al correo:</p>
                        <p className={styles.dimoEmail}>•{data.email}</p>
                    </div>
                </div>

                {/* Info Box */}
                <div className={styles.dimoInfoBox}>
                    <span className={styles.dimoInfoBoxIcon}>ⓘ</span>
                    <div>
                        <p>Conoce los requisitos para realizar una aclaración SPEI.</p>
                        <a href="#" className={styles.dimoMoreInfoLink}>Más información</a>
                    </div>
                </div>

                {/* Share Button */}
                <div className={styles.dimoShareSection}>
                    <div className={styles.dimoShareIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3"/>
                            <circle cx="6" cy="12" r="3"/>
                            <circle cx="18" cy="19" r="3"/>
                            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                        </svg>
                    </div>
                    <span className={styles.dimoShareText}>Compartir</span>
                </div>
            </div>
        </div>
    );
});

// International transfer receipt template component
const InternationalReceiptPreview = React.forwardRef(({ data }, ref) => {
    const formatAmount = (amount) => {
        const number = parseFloat(amount);
        return isNaN(number) ? '0.00' : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    const formatAccount = (account) => `•${String(account || '').slice(-4)}`;
    const getInitials = (name) => {
        const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) {
            return 'NA';
        }
        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    };
    const getDestinationAmount = () => {
        const symbolMap = {
            EUR: '€',
            USD: 'USD',
            GBP: '£',
            JPY: 'JPY'
        };
        const currency = String(data.destinationCurrency || 'EUR').toUpperCase();
        const symbol = symbolMap[currency] || currency;
        const amount = formatAmount(data.destinationAmount);
        if (symbol.length === 1 || symbol === 'USD') {
            return `${amount}${symbol}`;
        }
        return `${amount} ${symbol}`;
    };

    return (
        <div className={styles.receiptWrapper}>
            <div id="phone-mock" ref={ref} className={styles.intlPhoneContainer}>
                <header className={styles.intlHeader}>
                    <h1 className={styles.intlHeaderTitle}>Transferencia Internacional</h1>
                    <svg viewBox="0 0 24 24" className={styles.intlCloseIcon}>
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </header>

                <section className={styles.intlHeroSection}>
                    <h2 className={styles.intlStatus}>Operación en proceso</h2>
                    <p className={styles.intlAmountLabel}>Importe a transferir</p>
                    <p className={styles.intlAmount}>{formatAmount(data.amount)}</p>
                    <div className={styles.intlFeesBlock}>
                        <p className={styles.intlFee}>Comisión por transferencia ${formatAmount(data.transferCommission)}</p>
                        <p className={styles.intlFee}>IVA de la comisión ${formatAmount(data.commissionVAT)}</p>
                    </div>

                    <div className={styles.intlSummaryList}>
                        <div className={styles.intlSummaryRow}>
                            <span>Importe a cargar</span>
                            <span>${formatAmount(data.debitAmount || data.amount)}</span>
                        </div>
                        <div className={styles.intlSummaryRow}>
                            <span>Importe en divisa destino</span>
                            <span>{getDestinationAmount()}</span>
                        </div>
                        <div className={styles.intlSummaryRow}>
                            <span>Tipo de cambio</span>
                            <span>{data.exchangeRate}</span>
                        </div>
                    </div>
                </section>

                <div className={styles.intlBody}>
                    <div className={styles.intlAccountSection}>
                        <div className={styles.accountContainer}>
                            <div className={styles.bbvaCard}>
                                <div className={styles.cardHighlight}></div>
                                <div className={styles.logo}>BBVA</div>
                                <div className={styles.lines}>
                                    <div className={styles.line}></div>
                                    <div className={styles.line}></div>
                                </div>
                            </div>
                            <div className={styles.edCircle} style={{ backgroundColor: data.circleColor }}>
                                <div className={styles.circleText}>
                                    {getInitials(data.receiverName)}
                                </div>
                            </div>
                        </div>

                        <div className={styles.intlAccountsRow}>
                            <div className={`${styles.intlAccountItem} ${styles.intlSender}`}>
                                <p className={styles.intlAccountName}>Cuenta Corriente</p>
                                <p className={styles.intlAccountNumber}>{formatAccount(data.senderAccount)}</p>
                            </div>
                            <div className={styles.intlAccountItem}>
                                <p className={styles.intlReceiverName}>{data.receiverName}</p>
                                <p className={styles.intlAccountNumber}>{formatAccount(data.receiverAccount)}</p>
                                <p className={styles.intlSwift}>{data.receiverSwift}</p>
                                <p className={styles.intlBank}>{data.receiverBank}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.intlDetailsSection}>
                        <div className={styles.intlDetailItem}>
                            <p className={styles.intlDetailLabel}>Referencia</p>
                            <p className={styles.intlDetailValue}>{data.reference}</p>
                        </div>
                        <div className={styles.intlDetailItem}>
                            <p className={styles.intlDetailLabel}>Relación con el destinatario</p>
                            <p className={styles.intlDetailValue}>{data.relationship}</p>
                        </div>
                        <div className={styles.intlDetailItem}>
                            <p className={styles.intlDetailLabel}>Motivo de la transferencia</p>
                            <p className={styles.intlDetailValue}>{data.transferReason}</p>
                        </div>
                        <div className={styles.intlDetailItem}>
                            <p className={styles.intlDetailLabel}>Concepto</p>
                            <p className={styles.intlDetailValue}>{data.concept}</p>
                        </div>
                        <div className={styles.intlDetailItem}>
                            <p className={styles.intlDetailLabel}>Tipo de operación</p>
                            <p className={styles.intlDetailValue}>{data.internationalOperationType}</p>
                        </div>
                        <div className={styles.intlDetailItem}>
                            <p className={styles.intlDetailLabel}>Actividad económica actual</p>
                            <p className={styles.intlDetailValue}>{data.economicActivity}</p>
                        </div>
                        <div className={styles.intlDetailItem}>
                            <p className={styles.intlDetailLabel}>Número de folio</p>
                            <p className={styles.intlDetailValue}>{data.internationalFolio}</p>
                        </div>
                    </div>

                    <div className={styles.intlInfoCard}>
                        <div className={styles.intlInfoIcon} aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="10.5" x2="12" y2="17"></line>
                                <line x1="12" y1="7" x2="12" y2="7.1"></line>
                            </svg>
                        </div>
                        <p className={styles.intlInfoText}>
                            Recibirás el comprobante de esta transferencia en el correo:
                        </p>
                        <p className={styles.intlInfoEmail}>•{data.email}</p>
                    </div>

                    <div className={styles.intlInfoCard}>
                        <div className={styles.intlInfoIcon} aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="10.5" x2="12" y2="17"></line>
                                <line x1="12" y1="7" x2="12" y2="7.1"></line>
                            </svg>
                        </div>
                        <p className={styles.intlInfoText}>
                            La transferencia puede tardar hasta 15 días hábiles en verse reflejada debido a los horarios y políticas del banco receptor.
                        </p>
                        <p className={styles.intlInfoText}>
                            Considera que el banco destino podría aplicar alguna comisión extra sobre el monto total.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

const BbvaProofReceiptPreview = React.forwardRef(({ data }, ref) => {
    const formatAmount = (amount) => {
        const number = parseFloat(amount);
        return isNaN(number)
            ? '0.00'
            : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    const formatAccount = (account) => `•${String(account || '').slice(-4)}`;
    const formatTimeShort = (timeValue) => {
        const parts = String(timeValue || '').split(':');
        return `${parts[0] || '00'}:${parts[1] || '00'} h`;
    };

    return (
        <div className={styles.receiptWrapper}>
            <div id="phone-mock" ref={ref} className={styles.bbvaProofContainer}>
                <div className={styles.bbvaProofInner}>
                    <img src={bbva2019Logo} alt="BBVA" className={styles.bbvaProofLogo} />
                    <p className={styles.bbvaProofKicker}>COMPROBANTE DE LA OPERACION</p>

                    <section className={styles.bbvaProofCard}>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Tipo de operación</p>
                            <p className={styles.bbvaProofValueStrong}>{data.bbvaOperationType}</p>
                        </div>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Folio de la operación</p>
                            <p className={styles.bbvaProofValueStrong}>{data.folio}</p>
                        </div>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Fecha</p>
                            <p className={styles.bbvaProofValueStrong}>{data.date}</p>
                        </div>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Hora</p>
                            <p className={styles.bbvaProofValueStrong}>{formatTimeShort(data.time)}</p>
                        </div>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Concepto</p>
                            <p className={styles.bbvaProofValueStrong}>{data.concept}</p>
                        </div>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Clave de rastreo</p>
                            <p className={`${styles.bbvaProofValueStrong} ${styles.bbvaProofTracking}`}>
                                {data.trackingKey}
                            </p>
                        </div>
                    </section>

                    <section className={styles.bbvaProofCard}>
                        <div className={styles.bbvaProofFieldCompact}>
                            <p className={styles.bbvaProofLabel}>Importe transferido</p>
                            <p className={styles.bbvaProofAmount}>$ {formatAmount(data.amount)}</p>
                        </div>
                    </section>

                    <section className={styles.bbvaProofCard}>
                        <div className={styles.bbvaProofFieldCompact}>
                            <p className={styles.bbvaProofLabel}>Cuenta de origen</p>
                            <p className={styles.bbvaProofValueStrong}>{formatAccount(data.senderAccount)}</p>
                        </div>
                    </section>

                    <section className={styles.bbvaProofCard}>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Nombre del beneficiario</p>
                            <p className={styles.bbvaProofValueStrong}>{data.receiverName}</p>
                        </div>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Nombre del banco</p>
                            <p className={styles.bbvaProofValueStrong}>{data.receiverBank}</p>
                        </div>
                        <div className={styles.bbvaProofFieldCompact}>
                            <p className={styles.bbvaProofLabel}>Cuenta de destino</p>
                            <p className={styles.bbvaProofValueStrong}>{formatAccount(data.receiverAccount)}</p>
                        </div>
                    </section>

                    <section className={styles.bbvaProofCard}>
                        <div className={styles.bbvaProofField}>
                            <p className={styles.bbvaProofLabel}>Verifica el estatus de tu operación en</p>
                            <p className={styles.bbvaProofLink}>{data.bbvaCepUrl}</p>
                        </div>
                        <div className={styles.bbvaProofFieldCompact}>
                            <p className={styles.bbvaProofLabel}>Información sobre aclaración SPEI en</p>
                            <p className={styles.bbvaProofLink}>{data.bbvaAclaracionUrl}</p>
                        </div>
                    </section>

                    <footer className={styles.bbvaProofFooter}>
                        <p>{data.bbvaFooterLine1}</p>
                        <p>{data.bbvaFooterLine2}</p>
                    </footer>
                </div>
            </div>
        </div>
    );
});

// Main App Component
export default function App() {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES.TRANSFERIR);
    const [receiptData, setReceiptData] = useState(() => ({
        date: getNowDateEs(),
        time: getNowTime24(),
        amount: getRandomAmount(),
        senderAccount: getRandomAccount(),
        receiverAccount: getRandomAccount(),
        receiverName: 'EL SAT',
        receiverBank: 'Cuenta BANCOMEME',
        concept: 'rancheritos y coca de 600',
        reference: getRandomReference(),
        folio: getRandomFolio(),
        trackingKey: getRandomTrackingKey(),
        email: 'ay@gmail.com',
        circleColor: '#2979ff',
        transferCommission: '0.00',
        commissionVAT: '0.00',
        debitAmount: '100.00',
        destinationAmount: '4.77',
        destinationCurrency: 'EUR',
        exchangeRate: '1 EUR = 20.9447 MXN',
        relationship: 'Personal',
        transferReason: 'Pago de servicios',
        internationalOperationType: 'Transferencia internacional',
        receiverSwift: 'BSCHESMMXXX',
        economicActivity: 'GESTOR CULTURAL',
        internationalFolio: '8355212',
        bbvaOperationType: 'Transferencia a otros bancos',
        bbvaCepUrl: 'https://www.banxico.org.mx/cep/',
        bbvaAclaracionUrl: 'www.bbva.mx',
        bbvaFooterLine1: 'BBVA México, S.A., Institución de Banca Múltiple, Grupo Financiero BBVA México.',
        bbvaFooterLine2: 'Avenida Paseo de la Reforma 510, colonia Juárez, código postal 06600, alcaldía Cuauhtémoc, Ciudad de México.',
    }));

    const [isExporting, setIsExporting] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    const receiptRef = useRef();

    // Mobile device detection utilities
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isSafariIOS = isIOS && /Safari/i.test(navigator.userAgent);
    const hasShareAPI = 'share' in navigator && 'canShare' in navigator;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'senderAccount' || name === 'receiverAccount') {
            const numericValue = value.replace(/\D/g, '');
            setReceiptData(prev => ({ ...prev, [name]: numericValue.slice(0, 5) }));
        } else {
            setReceiptData(prev => ({ ...prev, [name]: value }));
        }
    };

    const exportAsJPEG = async () => {
        // Prevent multiple simultaneous exports
        if (isExporting) {
            console.log('Export already in progress...');
            return;
        }

        setIsExporting(true);

        const phoneContainer = receiptRef.current;
        if (phoneContainer) {
            const originalMaxHeight = phoneContainer.style.maxHeight;
            const originalAspectRatio = phoneContainer.style.aspectRatio;
            const originalOverflow = phoneContainer.style.overflowY;
            
            // Export tweaks were tuned for classic transfer template only.
            const shouldApplyClassicExportTweaks =
                selectedTemplate === TEMPLATES.TRANSFERIR ||
                selectedTemplate === TEMPLATES.INTERNATIONAL;
            const shouldApplyInternationalExportTweaks = selectedTemplate === TEMPLATES.INTERNATIONAL;
            const circleTextElement = shouldApplyClassicExportTweaks
                ? phoneContainer.querySelector(`.${styles.circleText}`)
                : null;
            const logoElement = shouldApplyClassicExportTweaks
                ? phoneContainer.querySelector(`.${styles.logo}`)
                : null;
            
            try {
                if (circleTextElement) {
                    circleTextElement.classList.add(styles.circleTextExport);
                }
                if (logoElement) {
                    logoElement.classList.add(styles.logoExport);
                }
                if (shouldApplyInternationalExportTweaks) {
                    phoneContainer.classList.add(styles.intlExportMode);
                }
                
                phoneContainer.style.maxHeight = 'none';
                phoneContainer.style.aspectRatio = 'unset';
                phoneContainer.style.overflowY = 'visible';
                phoneContainer.style.height = 'auto';
                
                // Wait for layout to settle and fonts to load
                await new Promise(resolve => setTimeout(resolve, 300));

                const canvas = await html2canvas(phoneContainer, {
                    useCORS: true,
                    backgroundColor: 'white',
                    scale: shouldApplyInternationalExportTweaks ? 3 : 2,
                    logging: false,
                    height: phoneContainer.scrollHeight,
                    width: phoneContainer.scrollWidth,
                    onclone: (clonedDoc) => {
                        // Ensure consistent font rendering in cloned document
                        const style = clonedDoc.createElement('style');
                        style.textContent = `
                            * { 
                                -webkit-font-smoothing: antialiased !important;
                                text-rendering: optimizeLegibility !important;
                                font-feature-settings: "kern" 1 !important;
                            }
                        `;
                        clonedDoc.head.appendChild(style);
                    }
                });

                // Generate descriptive filename with metadata
                const generateFilename = () => {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                    const amount = parseFloat(receiptData.amount).toLocaleString('es-MX', { 
                        style: 'currency', 
                        currency: 'MXN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).replace(/\s/g, '').replace('MXN', '').replace('$', '');
                    
                    const receiverName = receiptData.receiverName
                        .replace(/[^a-zA-Z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                        .toLowerCase()
                        .slice(0, 15);
                    
                    const reference = receiptData.reference.slice(0, 7);
                    
                    return `bancomeme-${amount}-${receiverName}-${reference}-${timestamp}.jpg`;
                };

                const filename = generateFilename();

                // Prepare comprehensive metadata for JPEG export
                const metadata = {
                    generator: 'Bancomeme Receipt Generator',
                    version: '2.0.0',
                    timestamp: new Date().toISOString(),
                    amount: receiptData.amount,
                    currency: 'MXN',
                    receiverName: receiptData.receiverName,
                    receiverBank: receiptData.receiverBank,
                    reference: receiptData.reference,
                    folio: receiptData.folio,
                    trackingKey: receiptData.trackingKey,
                    concept: receiptData.concept,
                    date: receiptData.date,
                    time: receiptData.time,
                    circleColor: receiptData.circleColor,
                    disclaimer: 'FICTIONAL RECEIPT - FOR ENTERTAINMENT PURPOSES ONLY',
                    website: 'https://bancomeme.com',
                    fileFormat: 'JPEG',
                    compressionQuality: 0.92
                };

                // Add EXIF metadata to JPEG using piexifjs
                const addExifMetadata = (canvas, metadata) => {
                    return new Promise((resolve) => {
                        canvas.toBlob((blob) => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                try {
                                    const jpeg = e.target.result;
                                    
                                    // Create EXIF data
                                    const zeroth = {};
                                    const exif = {};
                                    const gps = {};
                                    
                                    // Standard EXIF fields
                                    zeroth[piexif.ImageIFD.Make] = "Bancomeme";
                                    zeroth[piexif.ImageIFD.Model] = "Receipt Generator";
                                    zeroth[piexif.ImageIFD.Software] = `${metadata.generator} v${metadata.version}`;
                                    zeroth[piexif.ImageIFD.DateTime] = new Date().toISOString().replace('T', ' ').split('.')[0];
                                    zeroth[piexif.ImageIFD.Artist] = "Bancomeme Receipt Generator";
                                    zeroth[piexif.ImageIFD.Copyright] = metadata.disclaimer;
                                    zeroth[piexif.ImageIFD.ImageDescription] = `Receipt for ${metadata.receiverName} - Amount: ${metadata.currency} ${metadata.amount}`;
                                    
                                    // Custom metadata in UserComment (JSON format)
                                    const customData = JSON.stringify({
                                        amount: metadata.amount,
                                        currency: metadata.currency,
                                        receiverName: metadata.receiverName,
                                        receiverBank: metadata.receiverBank,
                                        reference: metadata.reference,
                                        folio: metadata.folio,
                                        trackingKey: metadata.trackingKey,
                                        concept: metadata.concept,
                                        date: metadata.date,
                                        time: metadata.time,
                                        circleColor: metadata.circleColor,
                                        website: metadata.website
                                    });
                                    
                                    // Encode as ASCII for UserComment
                                    exif[piexif.ExifIFD.UserComment] = "ASCII\x00\x00\x00" + customData;
                                    
                                    // Additional technical metadata
                                    exif[piexif.ExifIFD.DateTimeOriginal] = new Date().toISOString().replace('T', ' ').split('.')[0];
                                    exif[piexif.ExifIFD.DateTimeDigitized] = new Date().toISOString().replace('T', ' ').split('.')[0];
                                    
                                    // Create EXIF dict
                                    const exifDict = {"0th": zeroth, "Exif": exif, "GPS": gps};
                                    const exifBytes = piexif.dump(exifDict);
                                    
                                    // Insert EXIF into JPEG
                                    const newJpeg = piexif.insert(exifBytes, jpeg);
                                    
                                    // Convert back to blob
                                    const byteCharacters = atob(newJpeg.split(',')[1]);
                                    const byteNumbers = new Array(byteCharacters.length);
                                    for (let i = 0; i < byteCharacters.length; i++) {
                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                    }
                                    const byteArray = new Uint8Array(byteNumbers);
                                    const newBlob = new Blob([byteArray], { type: 'image/jpeg' });
                                    
                                    resolve(newBlob);
                                } catch (error) {
                                    console.error('Error adding EXIF metadata:', error);
                                    resolve(blob); // Fall back to original blob
                                }
                            };
                            reader.readAsDataURL(blob);
                        }, 'image/jpeg', 0.92);
                    });
                };
                
                const canvasToJpegBlob = (canvas) => {
                    return new Promise((resolve) => {
                        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
                    });
                };

                const finalCanvas = canvas; // Use original canvas for JPEG

                // International template is taller and can show artifacts with EXIF byte insertion
                // on some viewers/devices. Use direct JPEG blob for compatibility.
                const shouldEmbedExif = selectedTemplate !== TEMPLATES.INTERNATIONAL;
                const exportBlob = shouldEmbedExif
                    ? await addExifMetadata(finalCanvas, metadata)
                    : await canvasToJpegBlob(finalCanvas);

                // Mobile-optimized download handling
                const downloadFile = (blob, filename) => {
                    // Detect mobile browsers
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                    
                    if (isMobile) {
                        console.log('📱 Mobile device detected - Using mobile-optimized download');
                        
                        if (isIOS && isSafari) {
                            // iOS Safari special handling
                            try {
                                // Method 1: Try share API first (iOS 12.2+)
                                if (navigator.share && navigator.canShare) {
                                    const file = new File([blob], filename, { type: 'image/jpeg' });
                                    if (navigator.canShare({ files: [file] })) {
                                        navigator.share({
                                            title: 'Recibo BBVA - Bancomeme',
                                            text: 'Recibo generado con Bancomeme',
                                            files: [file]
                                        }).then(() => {
                                            console.log('✅ File shared successfully via iOS Share API');
                                        }).catch((error) => {
                                            console.log('⚠️ Share API failed, falling back to download:', error);
                                            fallbackDownload(blob, filename);
                                        });
                                        return;
                                    }
                                }
                                
                                // Method 2: Fallback for iOS
                                fallbackDownload(blob, filename);
                            } catch (error) {
                                console.log('⚠️ iOS download failed, using fallback:', error);
                                fallbackDownload(blob, filename);
                            }
                        } else if (navigator.share) {
                            // Android/modern mobile with Web Share API
                            try {
                                const file = new File([blob], filename, { type: 'image/jpeg' });
                                navigator.share({
                                    title: 'Recibo BBVA - Bancomeme',
                                    text: 'Recibo generado con Bancomeme',
                                    files: [file]
                                }).then(() => {
                                    console.log('✅ File shared successfully via Web Share API');
                                }).catch((error) => {
                                    console.log('⚠️ Web Share API failed, falling back to download:', error);
                                    fallbackDownload(blob, filename);
                                });
                            } catch (error) {
                                console.log('⚠️ Mobile share failed, using download:', error);
                                fallbackDownload(blob, filename);
                            }
                        } else {
                            // Mobile without share API
                            fallbackDownload(blob, filename);
                        }
                    } else {
                        // Desktop browser - use standard download
                        fallbackDownload(blob, filename);
                    }
                };
                
                const fallbackDownload = (blob, filename) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = url;
                    
                    // Add additional metadata via HTML5 download attribute
                    link.setAttribute('data-amount', receiptData.amount);
                    link.setAttribute('data-receiver', receiptData.receiverName);
                    link.setAttribute('data-reference', receiptData.reference);
                    link.setAttribute('data-format', 'JPEG');
                    link.setAttribute('data-exif', 'true');
                    
                    // Mobile-specific improvements
                    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                        // Add target="_blank" for better mobile compatibility
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        
                        // For iOS Safari, we need to handle the download differently
                        if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent)) {
                            // Create a temporary link that opens in new tab
                            link.target = '_blank';
                            // iOS users will need to long-press and "Save to Photos" or "Save to Files"
                            console.log('📱 iOS Safari: Image will open in new tab. Long-press to save.');
                        }
                    }
                    
                    // Ensure the link is added to DOM for Firefox and mobile compatibility
                    document.body.appendChild(link);
                    
                    // Add a small delay for mobile browsers
                    setTimeout(() => {
                        try {
                            link.click();
                        } catch (clickError) {
                            // If click fails on mobile, try opening in new window
                            console.log('⚠️ Click failed, trying window.open:', clickError);
                            window.open(url, '_blank');
                        }
                        document.body.removeChild(link);
                    }, 50);
                    
                    // Clean up the object URL after a longer delay for mobile
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 1000);
                };

                // Use the mobile-optimized download function
                if (exportBlob) {
                    downloadFile(exportBlob, filename);

                        // Log export details for analytics/debugging
                        console.log('Receipt exported successfully as JPEG with EXIF metadata:', {
                            filename,
                            fileSize: `${(exportBlob.size / 1024).toFixed(1)}KB`,
                            dimensions: `${finalCanvas.width}x${finalCanvas.height}`,
                            format: 'JPEG',
                            quality: '92%',
                            exifMetadata: shouldEmbedExif ? 'Embedded' : 'Disabled for compatibility',
                            metadata
                        });
                        
                        console.log('📄 Exported File:');
                        console.log(`${filename} - High-quality JPEG with embedded EXIF metadata`);
                        console.log('💡 JPEG Benefits: Smaller file size, native EXIF metadata, universal compatibility');
                        console.log('🏷️ EXIF Metadata: Complete transaction details embedded in image file');
                        
                        // Show user-friendly message for mobile
                        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                            const isMobileMessage = /iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent)
                                ? '📱 iOS: Si se abre en una nueva pestaña, mantén presionado y selecciona "Guardar en Fotos" o "Guardar en Archivos"'
                                : '📱 Archivo descargado. Revisa tu carpeta de descargas o notificaciones.';
                            
                            // Simple toast notification
                            const toast = document.createElement('div');
                            toast.style.cssText = `
                                position: fixed;
                                top: 20px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: #10b981;
                                color: white;
                                padding: 12px 20px;
                                border-radius: 8px;
                                font-size: 14px;
                                z-index: 10000;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                                max-width: 90vw;
                                text-align: center;
                                line-height: 1.4;
                            `;
                            toast.textContent = isMobileMessage;
                            document.body.appendChild(toast);
                            
                            setTimeout(() => {
                                if (document.body.contains(toast)) {
                                    document.body.removeChild(toast);
                                }
                            }, 5000);
                        }
                    }
            } catch (error) {
                console.error('Error generating JPEG:', error);
            } finally {
                // Always restore original styles and remove export classes
                phoneContainer.style.maxHeight = originalMaxHeight;
                phoneContainer.style.aspectRatio = originalAspectRatio;
                phoneContainer.style.overflowY = originalOverflow;
                phoneContainer.style.height = '';
                
                if (circleTextElement) {
                    circleTextElement.classList.remove(styles.circleTextExport);
                }
                if (logoElement) {
                    logoElement.classList.remove(styles.logoExport);
                }
                if (shouldApplyInternationalExportTweaks) {
                    phoneContainer.classList.remove(styles.intlExportMode);
                }
                
                setIsExporting(false);
            }
        } else {
            console.error('Receipt container ref not found.');
            setIsExporting(false);
        }
    };
    
    return (
        <>
            <div className="bg-gray-50 min-h-screen font-sans p-2 sm:p-4 lg:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="flex justify-center mb-4">
                            <img 
                                src="/logo.webp" 
                                alt="Bancomeme Logo" 
                                className="h-16 sm:h-20 lg:h-24 w-auto max-w-full"
                            />
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4 font-bold">Finanzas imaginarias para gente real.</p>
                        
                        {/* Humorous Disclaimer */}
                        {showDisclaimer && (
                            <div className="max-w-4xl mx-auto bg-white border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg shadow-sm">
                                <div className="flex flex-col sm:flex-row items-start">
                                    <div className="flex-shrink-0 mb-3 sm:mb-0">
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto sm:mx-0 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="sm:ml-4 text-left w-full">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 text-center sm:text-left">Advertencia Importante (ojalá que sepas leer)</h3>
                                        
                                        <p className="text-sm sm:text-base text-gray-800 mb-3 leading-relaxed">
                                            <span className="font-semibold text-orange-600">Los recibos generados en Bancomeme son más falsos que tus esperanzas de comprar una casa.</span> Son ficticios, inventados, irreales, inexistentes y totalmente inútiles.
                                        </p>
                                        
                                        <p className="text-sm sm:text-base text-gray-800 mb-3 leading-relaxed">
                                            Esta app es únicamente para propósitos de <span className="font-semibold text-blue-600">entretenimiento</span>, bromas entre amigos, memes de oficina o, con suerte, para recuperar a tu ex.
                                        </p>
                                        
                                        <p className="text-sm sm:text-base text-gray-800 mb-3 leading-relaxed">
                                            Cualquier otro uso (como intentar usarlos para trámites, engañar a alguien o presumirle a Hacienda) está <span className="font-semibold text-orange-600">totalmente prohibido</span>… y honestamente, nos daría pena ajena.
                                        </p>
                                        
                                        <p className="text-sm sm:text-base text-gray-800 mb-3 leading-relaxed">
                                            Bancomeme no se hace responsable si alguien se ilusiona o se emociona de más al ver uno de estos recibos. Si recibes un "depósito" de un millón de pesos… <span className="font-semibold italic">revísalo dos veces: probablemente aún eres pobre.</span>
                                        </p>
                                        
                                        <p className="text-xs sm:text-sm font-semibold text-blue-800 bg-blue-100 px-3 py-2 rounded-md inline-block mb-4">
                                            💚 Usa esta app con humor, responsabilidad y sentido común.
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-3 mt-4">
                                            <button
                                                onClick={() => setShowDisclaimer(false)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 
                                                         text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl 
                                                         transition-all duration-300 transform active:scale-[0.98] sm:hover:scale-[1.02] 
                                                         focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
                                                         flex items-center justify-center space-x-2 text-sm sm:text-base"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Sí acepto y soy pobre 😭</span>
                                            </button>
                                            
                                            <button
                                                onClick={() => window.open('https://www.empleo.gob.mx/assets/solicitud_empleo/SNE_SOLICITUD_DE_EMPLEO_PLANTILLA_PDF.pdf', '_blank')}
                                                className="w-full bg-orange-500 hover:bg-orange-600 
                                                         text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl 
                                                         transition-all duration-300 transform active:scale-[0.98] sm:hover:scale-[1.02] 
                                                         focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50
                                                         flex items-center justify-center space-x-2 text-sm sm:text-base"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                <span>No acepto 💼</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10">
                        <div className="lg:w-2/5 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200 order-2 lg:order-1">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Personaliza tu transferencia</h2>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Template Selector */}
                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center">
                                    <span className="mr-2 text-blue-600">🎨</span>
                                    Selecciona el Estilo del Recibo
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                    <button
                                        onClick={() => setSelectedTemplate(TEMPLATES.TRANSFERIR)}
                                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                            selectedTemplate === TEMPLATES.TRANSFERIR
                                                ? 'border-blue-500 bg-blue-100 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                        <span className={`text-xs sm:text-sm font-medium ${
                                            selectedTemplate === TEMPLATES.TRANSFERIR ? 'text-blue-700' : 'text-gray-600'
                                        }`}>Transferir</span>
                                        <span className="text-[10px] sm:text-xs text-gray-500">Clásico</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedTemplate(TEMPLATES.DIMO)}
                                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                            selectedTemplate === TEMPLATES.DIMO
                                                ? 'border-blue-500 bg-blue-100 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xs sm:text-sm font-bold">D</span>
                                        </div>
                                        <span className={`text-xs sm:text-sm font-medium ${
                                            selectedTemplate === TEMPLATES.DIMO ? 'text-blue-700' : 'text-gray-600'
                                        }`}>Dimo®</span>
                                        <span className="text-[10px] sm:text-xs text-gray-500">Moderno</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedTemplate(TEMPLATES.INTERNATIONAL)}
                                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                            selectedTemplate === TEMPLATES.INTERNATIONAL
                                                ? 'border-blue-500 bg-blue-100 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xs sm:text-sm font-bold">INT</span>
                                        </div>
                                        <span className={`text-xs sm:text-sm font-medium ${
                                            selectedTemplate === TEMPLATES.INTERNATIONAL ? 'text-blue-700' : 'text-gray-600'
                                        }`}>Internacional</span>
                                        <span className="text-[10px] sm:text-xs text-gray-500">Global</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedTemplate(TEMPLATES.BBVA_PROOF)}
                                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                                            selectedTemplate === TEMPLATES.BBVA_PROOF
                                                ? 'border-blue-500 bg-blue-100 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg border border-blue-200 flex items-center justify-center overflow-hidden">
                                            <img src={bbva2019Logo} alt="BBVA" className="w-7 sm:w-8 h-auto" />
                                        </div>
                                        <span className={`text-xs sm:text-sm font-medium ${
                                            selectedTemplate === TEMPLATES.BBVA_PROOF ? 'text-blue-700' : 'text-gray-600'
                                        }`}>Comprobante</span>
                                        <span className="text-[10px] sm:text-xs text-gray-500">BBVA</span>
                                    </button>
                                </div>
                            </div>

                            <FormSection 
                                title="Detalles de la transacción" 
                                icon="💰"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                    <FormField 
                                        label="Fecha" 
                                        name="date" 
                                        value={receiptData.date}
                                        onChange={handleChange}
                                        icon="📅"
                                    />
                                    <FormField 
                                        label="Hora" 
                                        name="time" 
                                        value={receiptData.time}
                                        onChange={handleChange}
                                        icon="🕐"
                                    />
                                    <FormField 
                                        label="Monto ($)" 
                                        name="amount" 
                                        type="number" 
                                        value={receiptData.amount} 
                                        onChange={handleChange}
                                        icon="💵"
                                    />
                                    <FormField 
                                        label="Concepto" 
                                        name="concept" 
                                        value={receiptData.concept} 
                                        onChange={handleChange}
                                        icon="📝"
                                    />
                                </div>
                            </FormSection>

                            <FormSection 
                                title="Cuenta y Referencias" 
                                icon="🏦"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                    <FormField 
                                        label="Cuenta Remitente" 
                                        name="senderAccount" 
                                        value={receiptData.senderAccount} 
                                        onChange={handleChange}
                                        icon="🏧"
                                    />
                                    <FormField 
                                        label="Cuenta Destinatario" 
                                        name="receiverAccount" 
                                        value={receiptData.receiverAccount} 
                                        onChange={handleChange}
                                        icon="🎯"
                                    />
                                    <FormField 
                                        label="Nombre del Destinatario" 
                                        name="receiverName" 
                                        value={receiptData.receiverName} 
                                        onChange={handleChange}
                                        icon="👤"
                                        placeholder="eduardo"
                                    />
                                    <FormField 
                                        label="Banco del Destinatario" 
                                        name="receiverBank" 
                                        value={receiptData.receiverBank} 
                                        onChange={handleChange}
                                        icon="🏦"
                                        placeholder="Cuenta BANCOMEME"
                                    />
                                    <div className="col-span-full sm:col-span-2 mb-3 sm:mb-4">
                                        <label className="block text-gray-800 text-xs sm:text-sm font-semibold mb-2">
                                            <span className="inline-block mr-2">🎨</span>
                                            Color del Círculo
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                name="circleColor"
                                                value={receiptData.circleColor}
                                                onChange={handleChange}
                                                className="w-12 h-12 sm:w-10 sm:h-8 rounded border-2 border-gray-200 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                name="circleColor"
                                                value={receiptData.circleColor}
                                                onChange={handleChange}
                                                className="flex-1 px-3 sm:px-4 py-3 sm:py-2 border-2 border-gray-200 rounded-lg text-gray-800 bg-white 
                                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                         hover:border-gray-300 transition-all duration-200 text-base min-h-[44px] sm:min-h-[auto]"
                                                placeholder="#2979ff"
                                            />
                                        </div>
                                    </div>
                                    <FormField 
                                        label="Referencia" 
                                        name="reference" 
                                        value={receiptData.reference} 
                                        onChange={handleChange}
                                        icon="📄"
                                    />
                                    <FormField 
                                        label="Folio" 
                                        name="folio" 
                                        value={receiptData.folio} 
                                        onChange={handleChange}
                                        icon="🎫"
                                    />
                                </div>
                                <FormField 
                                    label="Clave de Rastreo" 
                                    name="trackingKey" 
                                    value={receiptData.trackingKey} 
                                    onChange={handleChange}
                                    icon="🔑"
                                />
                                <FormField 
                                    label="Email" 
                                    name="email" 
                                    type="email" 
                                    value={receiptData.email} 
                                    onChange={handleChange}
                                    icon="📧"
                                />
                            </FormSection>

                            {selectedTemplate === TEMPLATES.INTERNATIONAL && (
                                <FormSection
                                    title="Datos internacionales"
                                    icon="🌍"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        <FormField
                                            label="Comisión transferencia"
                                            name="transferCommission"
                                            value={receiptData.transferCommission}
                                            onChange={handleChange}
                                            icon="💸"
                                        />
                                        <FormField
                                            label="IVA comisión"
                                            name="commissionVAT"
                                            value={receiptData.commissionVAT}
                                            onChange={handleChange}
                                            icon="🧾"
                                        />
                                        <FormField
                                            label="Importe a cargar"
                                            name="debitAmount"
                                            value={receiptData.debitAmount}
                                            onChange={handleChange}
                                            icon="💳"
                                        />
                                        <FormField
                                            label="Monto divisa destino"
                                            name="destinationAmount"
                                            value={receiptData.destinationAmount}
                                            onChange={handleChange}
                                            icon="💶"
                                        />
                                        <FormField
                                            label="Moneda destino"
                                            name="destinationCurrency"
                                            value={receiptData.destinationCurrency}
                                            onChange={handleChange}
                                            icon="🔤"
                                            placeholder="EUR"
                                        />
                                        <FormField
                                            label="Tipo de cambio"
                                            name="exchangeRate"
                                            value={receiptData.exchangeRate}
                                            onChange={handleChange}
                                            icon="📈"
                                            placeholder="1 EUR = 20.9447 MXN"
                                        />
                                        <FormField
                                            label="SWIFT/BIC"
                                            name="receiverSwift"
                                            value={receiptData.receiverSwift}
                                            onChange={handleChange}
                                            icon="🏛️"
                                            placeholder="BSCHESMMXXX"
                                        />
                                        <FormField
                                            label="Relación destinatario"
                                            name="relationship"
                                            value={receiptData.relationship}
                                            onChange={handleChange}
                                            icon="🤝"
                                        />
                                        <FormField
                                            label="Motivo transferencia"
                                            name="transferReason"
                                            value={receiptData.transferReason}
                                            onChange={handleChange}
                                            icon="📌"
                                        />
                                        <FormField
                                            label="Tipo de operación"
                                            name="internationalOperationType"
                                            value={receiptData.internationalOperationType}
                                            onChange={handleChange}
                                            icon="🌐"
                                        />
                                        <FormField
                                            label="Actividad económica"
                                            name="economicActivity"
                                            value={receiptData.economicActivity}
                                            onChange={handleChange}
                                            icon="📚"
                                        />
                                        <FormField
                                            label="Número de folio"
                                            name="internationalFolio"
                                            value={receiptData.internationalFolio}
                                            onChange={handleChange}
                                            icon="🧮"
                                        />
                                    </div>
                                </FormSection>
                            )}

                            {selectedTemplate === TEMPLATES.BBVA_PROOF && (
                                <FormSection
                                    title="Datos del comprobante"
                                    icon="📄"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        <FormField
                                            label="Tipo de operación"
                                            name="bbvaOperationType"
                                            value={receiptData.bbvaOperationType}
                                            onChange={handleChange}
                                            icon="🏛️"
                                        />
                                        <FormField
                                            label="URL CEP"
                                            name="bbvaCepUrl"
                                            value={receiptData.bbvaCepUrl}
                                            onChange={handleChange}
                                            icon="🔗"
                                        />
                                        <FormField
                                            label="URL aclaración"
                                            name="bbvaAclaracionUrl"
                                            value={receiptData.bbvaAclaracionUrl}
                                            onChange={handleChange}
                                            icon="🌐"
                                        />
                                    </div>
                                    <FormField
                                        label="Footer línea 1"
                                        name="bbvaFooterLine1"
                                        value={receiptData.bbvaFooterLine1}
                                        onChange={handleChange}
                                        icon="🧾"
                                    />
                                    <FormField
                                        label="Footer línea 2"
                                        name="bbvaFooterLine2"
                                        value={receiptData.bbvaFooterLine2}
                                        onChange={handleChange}
                                        icon="📍"
                                    />
                                </FormSection>
                            )}
                            
                            {/* Mobile-specific instructions */}
                            <div className="block sm:hidden mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-700 text-center">
                                    {/iPhone|iPad|iPod/i.test(navigator.userAgent) 
                                        ? '📱 iOS: El archivo se compartirá o abrirá en nueva pestaña. Mantén presionado para guardar.'
                                        : '📱 Android: El archivo se descargará a tu carpeta de descargas.'
                                    }
                                </p>
                            </div>
                            
                            <button
                                onClick={exportAsJPEG}
                                disabled={isExporting}
                                className={`w-full mt-4 ${
                                    isExporting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-bold py-4 sm:py-3 px-6 rounded-xl shadow-lg hover:shadow-xl 
                                         transition-all duration-300 transform ${isExporting ? '' : 'active:scale-[0.98] sm:hover:scale-[1.02]'}
                                         focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
                                         flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[48px]`}
                            >
                                {isExporting ? (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Exporting...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="hidden sm:inline">Exportar JPEG</span>
                                        <span className="sm:hidden">
                                            {/iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Compartir/Guardar' : 'Descargar JPEG'}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="lg:w-3/5 flex items-center justify-center bg-white rounded-2xl p-4 sm:p-6 lg:p-8 order-1 lg:order-2 border border-gray-200 shadow-xl">
                            <div className="text-center w-full">
                                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">
                                    Vista Previa - {selectedTemplate === TEMPLATES.DIMO ? 'Dimo®' : selectedTemplate === TEMPLATES.INTERNATIONAL ? 'Internacional' : selectedTemplate === TEMPLATES.BBVA_PROOF ? 'Comprobante BBVA' : 'Transferir'}
                                </h3>
                                <div className="flex justify-center max-sm:overflow-x-auto">
                                    {selectedTemplate === TEMPLATES.DIMO ? (
                                        <DimoReceiptPreview ref={receiptRef} data={receiptData} />
                                    ) : selectedTemplate === TEMPLATES.INTERNATIONAL ? (
                                        <InternationalReceiptPreview ref={receiptRef} data={receiptData} />
                                    ) : selectedTemplate === TEMPLATES.BBVA_PROOF ? (
                                        <BbvaProofReceiptPreview ref={receiptRef} data={receiptData} />
                                    ) : (
                                        <ReceiptPreview ref={receiptRef} data={receiptData} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
