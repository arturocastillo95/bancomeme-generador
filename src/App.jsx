import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import styles from './ReceiptComponent.module.css';

// NOTE: For this to work in your local Vite project, you must add the html2canvas script
// to your public/index.html file:
// <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

// Helpers to format current date/time in Spanish style used by the receipt
const ES_MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const pad2 = (n) => String(n).padStart(2, '0');
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
    <div className="mb-4">
        <label className="block text-gray-800 text-sm font-semibold mb-2">
            {icon && <span className="inline-block mr-2">{icon}</span>}
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-gray-800 bg-gray-50 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                     hover:border-gray-300 transition-all duration-200 placeholder-gray-400"
        />
    </div>
);

// Enhanced section component for grouping form fields
const FormSection = ({ title, children, icon }) => (
    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
            {icon && <span className="mr-2 text-green-600">{icon}</span>}
            {title}
        </h3>
        {children}
    </div>
);

// The receipt preview component, now using CSS modules for complete isolation
const ReceiptPreview = React.forwardRef(({ data }, ref) => {
    const formatAccount = (account) => `•${account.slice(-5)}`;
    const formatAmount = (amount) => {
        const number = parseFloat(amount);
        return isNaN(number) ? '0.00' : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className={styles.receiptWrapper}>
            <div ref={ref} className={styles.phoneContainer}>
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
                                <span className={styles.logo}>BBVA</span>
                                <div className={styles.lines}>
                                    <div className={styles.line}></div>
                                    <div className={styles.line}></div>
                                </div>
                            </div>
                            {/* The only inline style needed is for the dynamic background color */}
                            <div className={styles.edCircle} style={{ backgroundColor: data.circleColor }}>
                                {(data.receiverName || '').trim().slice(0, 2).toUpperCase()}
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

// Main App Component
export default function App() {
    const [receiptData, setReceiptData] = useState(() => ({
        date: getNowDateEs(),
        time: getNowTime24(),
        amount: getRandomAmount(),
        senderAccount: getRandomAccount(),
        receiverAccount: getRandomAccount(),
        receiverName: 'EL SAT',
        receiverBank: 'Cuenta BANORTE',
        concept: 'rancheritos y coca de 600',
        reference: getRandomReference(),
        folio: getRandomFolio(),
        trackingKey: getRandomTrackingKey(),
        email: 'ay@gmail.com',
        circleColor: '#2979ff',
    }));

    const receiptRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'senderAccount' || name === 'receiverAccount') {
            const numericValue = value.replace(/\D/g, '');
            setReceiptData(prev => ({ ...prev, [name]: numericValue.slice(0, 5) }));
        } else {
            setReceiptData(prev => ({ ...prev, [name]: value }));
        }
    };

    const exportAsPNG = () => {
        const phoneContainer = receiptRef.current;
        if (phoneContainer) {
            // Add a small delay to ensure fonts are loaded
            setTimeout(() => {
                html2canvas(phoneContainer, {
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    scale: 2,
                    logging: false,
                    allowTaint: false,
                    removeContainer: false,
                    async: true,
                    imageTimeout: 0
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'comprobante-bbva.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }).catch(error => {
                    console.error('Error generating PNG:', error);
                });
            }, 100);
        } else {
            console.error('Receipt container not found.');
        }
    };

    return (
        <>
            <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Receipt Customizer</h1>
                        <p className="text-gray-600">Modify the fields below to see the receipt update in real-time.</p>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-10">
                        <div className="xl:w-2/5 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Customize Receipt</h2>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>

                            <FormSection 
                                title="Transaction Details" 
                                icon="💰"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField 
                                        label="Date" 
                                        name="date" 
                                        value={receiptData.date}
                                        onChange={handleChange}
                                        icon="📅"
                                    />
                                    <FormField 
                                        label="Time" 
                                        name="time" 
                                        value={receiptData.time}
                                        onChange={handleChange}
                                        icon="🕐"
                                    />
                                    <FormField 
                                        label="Amount ($)" 
                                        name="amount" 
                                        type="number" 
                                        value={receiptData.amount} 
                                        onChange={handleChange}
                                        icon="💵"
                                    />
                                    <FormField 
                                        label="Concept" 
                                        name="concept" 
                                        value={receiptData.concept} 
                                        onChange={handleChange}
                                        icon="📝"
                                    />
                                </div>
                            </FormSection>

                            <FormSection 
                                title="Account & References" 
                                icon="🏦"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField 
                                        label="Sender Account" 
                                        name="senderAccount" 
                                        value={receiptData.senderAccount} 
                                        onChange={handleChange}
                                        icon="🏧"
                                    />
                                    <FormField 
                                        label="Receiver Account" 
                                        name="receiverAccount" 
                                        value={receiptData.receiverAccount} 
                                        onChange={handleChange}
                                        icon="🎯"
                                    />
                                    <FormField 
                                        label="Receiver Name" 
                                        name="receiverName" 
                                        value={receiptData.receiverName} 
                                        onChange={handleChange}
                                        icon="👤"
                                        placeholder="eduardo"
                                    />
                                    <FormField 
                                        label="Receiver Bank" 
                                        name="receiverBank" 
                                        value={receiptData.receiverBank} 
                                        onChange={handleChange}
                                        icon="🏦"
                                        placeholder="Cuenta BANORTE"
                                    />
                                    <div className="col-span-2 mb-4">
                                        <label className="block text-gray-800 text-sm font-semibold mb-2">
                                            <span className="inline-block mr-2">🎨</span>
                                            Circle Color
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                name="circleColor"
                                                value={receiptData.circleColor}
                                                onChange={handleChange}
                                                className="w-10 h-8 rounded border-2 border-gray-200 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                name="circleColor"
                                                value={receiptData.circleColor}
                                                onChange={handleChange}
                                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-gray-800 bg-gray-50 
                                                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                                         hover:border-gray-300 transition-all duration-200"
                                                placeholder="#2979ff"
                                            />
                                        </div>
                                    </div>
                                    <FormField 
                                        label="Reference" 
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
                                    label="Tracking Key" 
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
                            
                            <button 
                                onClick={exportAsPNG}
                                className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                                         text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl 
                                         transition-all duration-300 transform hover:scale-[1.02] 
                                         focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50
                                         flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Export as PNG</span>
                            </button>
                        </div>

                        <div className="xl:w-3/5 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Live Preview</h3>
                                <ReceiptPreview ref={receiptRef} data={receiptData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
