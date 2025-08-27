import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import piexif from 'piexifjs';
import styles from './ReceiptComponent.module.css';

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

// The receipt preview component, now using CSS modules for complete isolation
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

// Main App Component
export default function App() {
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
    }));

    const [isExporting, setIsExporting] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(true);

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
            
            // Find circle text element and BBVA logo element, add export-specific classes
            const circleTextElement = phoneContainer.querySelector(`.${styles.circleText}`);
            const logoElement = phoneContainer.querySelector(`.${styles.logo}`);
            
            try {
                if (circleTextElement) {
                    circleTextElement.classList.add(styles.circleTextExport);
                }
                if (logoElement) {
                    logoElement.classList.add(styles.logoExport);
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
                    scale: 2,
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

                const finalCanvas = canvas; // Use original canvas for JPEG

                // Create JPEG blob with high quality
                const blobWithExif = await addExifMetadata(finalCanvas, metadata);
                
                if (blobWithExif) {
                        const url = URL.createObjectURL(blobWithExif);
                        const link = document.createElement('a');
                        link.download = filename;
                        link.href = url;
                        
                        // Add additional metadata via HTML5 download attribute
                        link.setAttribute('data-amount', receiptData.amount);
                        link.setAttribute('data-receiver', receiptData.receiverName);
                        link.setAttribute('data-reference', receiptData.reference);
                        link.setAttribute('data-format', 'JPEG');
                        
                        // Ensure the link is added to DOM for Firefox compatibility
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Clean up the object URL after a delay
                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                        }, 100);

                        // Log export details for analytics/debugging
                        console.log('Receipt exported successfully as JPEG with EXIF metadata:', {
                            filename,
                            fileSize: `${(blobWithExif.size / 1024).toFixed(1)}KB`,
                            dimensions: `${finalCanvas.width}x${finalCanvas.height}`,
                            format: 'JPEG',
                            quality: '92%',
                            exifMetadata: 'Embedded',
                            metadata
                        });
                        
                        console.log('📄 Exported File:');
                        console.log(`${filename} - High-quality JPEG with embedded EXIF metadata`);
                        console.log('💡 JPEG Benefits: Smaller file size, native EXIF metadata, universal compatibility');
                        console.log('🏷️ EXIF Metadata: Complete transaction details embedded in image file');
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
                                title="Account & References" 
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
                                        <span>Exportar JPEG</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="lg:w-3/5 flex items-center justify-center bg-white rounded-2xl p-4 sm:p-6 lg:p-8 order-1 lg:order-2 border border-gray-200 shadow-xl">
                            <div className="text-center w-full">
                                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">Vista Previa</h3>
                                <div className="flex justify-center">
                                    <ReceiptPreview ref={receiptRef} data={receiptData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}