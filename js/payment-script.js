// Payment Script for Saraswati Gyan Mandir Inter College

document.addEventListener('DOMContentLoaded', function() {
    // Class options based on section
    const classOptions = {
        primary: [
            { value: 'pg', label: 'Play Group (PG)' },
            { value: 'nursery', label: 'Nursery' },
            { value: 'kg', label: 'Kindergarten (KG)' },
            { value: 'class1', label: 'Class 1' },
            { value: 'class2', label: 'Class 2' },
            { value: 'class3', label: 'Class 3' },
            { value: 'class4', label: 'Class 4' },
            { value: 'class5', label: 'Class 5' }
        ],
        secondary: [
            { value: 'class6', label: 'Class 6' },
            { value: 'class7', label: 'Class 7' },
            { value: 'class8', label: 'Class 8' }
        ],
        other: [
            { value: 'pg', label: 'Play Group (PG)' },
            { value: 'nursery', label: 'Nursery' },
            { value: 'kg', label: 'Kindergarten (KG)' },
            { value: 'class1', label: 'Class 1' },
            { value: 'class2', label: 'Class 2' },
            { value: 'class3', label: 'Class 3' },
            { value: 'class4', label: 'Class 4' },
            { value: 'class5', label: 'Class 5' },
            { value: 'class6', label: 'Class 6' },
            { value: 'class7', label: 'Class 7' },
            { value: 'class8', label: 'Class 8' }
        ]
    };

    // Fee amounts based on class and fee type
    const feeAmounts = {
        // Monthly Fee
        monthly: {
            pg: 1100,
            nursery: 1150,
            kg: 1150,
            class1: 1200,
            class2: 1200,
            class3: 1250,
            class4: 1300,
            class5: 1350,
            class6: 1400,
            class7: 1450,
            class8: 1500
        },
        // Term Fee
        term: {
            pg: 350,
            nursery: 350,
            kg: 350,
            class1: 450,
            class2: 450,
            class3: 450,
            class4: 550,
            class5: 550,
            class6: 650,
            class7: 650,
            class8: 650
        },
        // Admission Fee
        admission: {
            pg: 2500,
            nursery: 2800,
            kg: 3100,
            class1: 3500,
            class2: 3800,
            class3: 4000,
            class4: 4200,
            class5: 4500,
            class6: 5000,
            class7: 5500,
            class8: 6000
        },
        // Examination Fee
        exam: {
            pg: 500,
            nursery: 500,
            kg: 500,
            class1: 600,
            class2: 600,
            class3: 600,
            class4: 700,
            class5: 700,
            class6: 800,
            class7: 800,
            class8: 800
        }
    };

    // Get modal element
    const modal = document.getElementById('paymentFormModal');
    
    // Get close button
    const closeBtn = document.querySelector('.close-modal');
    
    // Close the modal when the X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Add event listener to fee type dropdown to show/hide relevant fields
    const feeTypeDropdown = document.getElementById('feeType');
    if (feeTypeDropdown) {
        feeTypeDropdown.addEventListener('change', function() {
            updateFormFields();
        });
    }

    // Additional event listeners for the file input
    const receiptFileInput = document.getElementById('receiptFile');
    if (receiptFileInput) {
        receiptFileInput.addEventListener('change', handleFileSelect);
    }

    // Initialize the file preview area
    const filePreview = document.getElementById('filePreview');
    if (filePreview) {
        filePreview.classList.add('empty');
        filePreview.textContent = 'No file selected';
    }
});

// Open the payment form modal based on section
function openPaymentForm(section) {
    // Set the payment section in the hidden field
    document.getElementById('paymentSection').value = section;
    
    // Update the form title based on section
    let formTitle;
    switch(section) {
        case 'primary':
            formTitle = 'Primary Section Payment';
            break;
        case 'secondary':
            formTitle = 'Secondary Section Payment';
            break;
        case 'other':
            formTitle = 'Other Payment';
            break;
        default:
            formTitle = 'Student Information';
    }
    
    document.getElementById('paymentFormTitle').textContent = formTitle;
    
    // Populate class dropdown based on section
    populateClassDropdown(section);
    
    // Reset forms
    document.getElementById('studentInfoForm').reset();
    document.getElementById('paymentDetailsForm').reset();
    
    // Show the first step
    showStep(1);
    
    // Show the modal
    document.getElementById('paymentFormModal').style.display = 'block';
}

// Close the modal
function closeModal() {
    document.getElementById('paymentFormModal').style.display = 'none';
}

// Populate class dropdown based on section
function populateClassDropdown(section) {
    const classDropdown = document.getElementById('studentClass');
    classDropdown.innerHTML = '<option value="">Select Class</option>';
    
    const options = {
        primary: [
            { value: 'pg', label: 'Play Group (PG)' },
            { value: 'nursery', label: 'Nursery' },
            { value: 'kg', label: 'Kindergarten (KG)' },
            { value: 'class1', label: 'Class 1' },
            { value: 'class2', label: 'Class 2' },
            { value: 'class3', label: 'Class 3' },
            { value: 'class4', label: 'Class 4' },
            { value: 'class5', label: 'Class 5' }
        ],
        secondary: [
            { value: 'class6', label: 'Class 6' },
            { value: 'class7', label: 'Class 7' },
            { value: 'class8', label: 'Class 8' }
        ],
        other: [
            { value: 'pg', label: 'Play Group (PG)' },
            { value: 'nursery', label: 'Nursery' },
            { value: 'kg', label: 'Kindergarten (KG)' },
            { value: 'class1', label: 'Class 1' },
            { value: 'class2', label: 'Class 2' },
            { value: 'class3', label: 'Class 3' },
            { value: 'class4', label: 'Class 4' },
            { value: 'class5', label: 'Class 5' },
            { value: 'class6', label: 'Class 6' },
            { value: 'class7', label: 'Class 7' },
            { value: 'class8', label: 'Class 8' }
        ]
    };
    
    options[section].forEach(function(option) {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        classDropdown.appendChild(optionElement);
    });
}

// Show a specific step
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step-form').forEach(function(step) {
        step.classList.remove('active-form');
    });
    
    // Show the requested step
    document.getElementById('step' + stepNumber + 'Form').classList.add('active-form');
    
    // Update step indicator
    updateStepIndicator(stepNumber);
}

// Update the step indicator
function updateStepIndicator(currentStep) {
    const steps = document.querySelectorAll('#payment-step-indicator .step');
    
    steps.forEach(function(step, index) {
        // +1 because index is 0-based
        const stepNum = index + 1;
        
        if (stepNum < currentStep) {
            // Completed steps
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            // Current step
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            // Future steps
            step.classList.remove('active');
            step.classList.remove('completed');
        }
    });
}

// Proceed to step 2
function goToStep2() {
    // Validate the form in step 1
    const form = document.getElementById('studentInfoForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Update the summary in step 2
    document.getElementById('summaryStudentName').textContent = document.getElementById('studentName').value;
    
    const classSelect = document.getElementById('studentClass');
    document.getElementById('summaryClass').textContent = classSelect.options[classSelect.selectedIndex].text;
    
    // Show step 2
    showStep(2);
}

// Go back to step 1
function backToStep1() {
    showStep(1);
}

// Proceed to step 3
function goToStep3() {
    // Validate the form in step 2
    const form = document.getElementById('paymentDetailsForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Update the fee type summary
    const feeTypeSelect = document.getElementById('feeType');
    let feeTypeText = feeTypeSelect.options[feeTypeSelect.selectedIndex].text;
    
    if (feeTypeSelect.value === 'monthly') {
        const monthSelect = document.getElementById('monthSelection');
        feeTypeText += ' - ' + monthSelect.options[monthSelect.selectedIndex].text;
    } else if (feeTypeSelect.value === 'other') {
        feeTypeText += ' - ' + document.getElementById('otherFeeDesc').value;
    }
    
    document.getElementById('summaryFeeType').textContent = feeTypeText;
    
    // Update the amount summary
    const amount = document.getElementById('amount').value;
    document.getElementById('summaryAmount').textContent = '₹' + amount;
    
    // Update the final amount
    document.getElementById('finalAmount').textContent = '₹' + amount;
    
    // Get student name, class and amount for reference
    const studentName = document.getElementById('studentName').value;
    const studentClass = document.getElementById('studentClass');
    const classText = studentClass.options[studentClass.selectedIndex].text;
    const admissionNumber = document.getElementById('admissionNumber').value;
    
    // Create reference text
    const referenceText = `${studentName}-${classText}-${admissionNumber}`;
    
    // Set amount and reference in UPI payment section
    document.getElementById('qrAmountText').textContent = `₹${amount}`;
    document.getElementById('qrReferenceText').textContent = referenceText;
    
    // Set amount and reference in bank transfer section
    document.getElementById('bankAmountText').textContent = `₹${amount}`;
    document.getElementById('bankReferenceText').textContent = referenceText;
    
    // Set amount in receipt upload section
    document.getElementById('receiptAmountText').textContent = `₹${amount}`;
    
    // Show step 3
    showStep(3);
}

// Go back to step 2
function backToStep2() {
    showStep(2);
}

// Update form fields based on fee type
function updateFormFields() {
    const feeType = document.getElementById('feeType').value;
    const monthSelectionGroup = document.getElementById('monthSelectionGroup');
    const otherFeeDescGroup = document.getElementById('otherFeeDescGroup');
    
    // Hide all conditional fields
    monthSelectionGroup.style.display = 'none';
    otherFeeDescGroup.style.display = 'none';
    
    // Show relevant fields based on fee type
    if (feeType === 'monthly') {
        monthSelectionGroup.style.display = 'block';
    } else if (feeType === 'other') {
        otherFeeDescGroup.style.display = 'block';
    }
    
    // Update amount field
    updateAmountField();
}

// Update the amount field based on selected class and fee type
function updateAmountField() {
    const feeType = document.getElementById('feeType').value;
    if (!feeType) return;
    
    const studentClass = document.getElementById('studentClass').value;
    if (!studentClass) return;
    
    const amountField = document.getElementById('amount');
    
    // Get the amount from the fee structure
    if (feeType !== 'other') {
        const feeAmounts = {
            // Monthly Fee
            monthly: {
                pg: 1100,
                nursery: 1150,
                kg: 1150,
                class1: 1200,
                class2: 1200,
                class3: 1250,
                class4: 1300,
                class5: 1350,
                class6: 1400,
                class7: 1450,
                class8: 1500
            },
            // Term Fee
            term: {
                pg: 350,
                nursery: 350,
                kg: 350,
                class1: 450,
                class2: 450,
                class3: 450,
                class4: 550,
                class5: 550,
                class6: 650,
                class7: 650,
                class8: 650
            },
            // Admission Fee
            admission: {
                pg: 2500,
                nursery: 2800,
                kg: 3100,
                class1: 3500,
                class2: 3800,
                class3: 4000,
                class4: 4200,
                class5: 4500,
                class6: 5000,
                class7: 5500,
                class8: 6000
            },
            // Examination Fee
            exam: {
                pg: 500,
                nursery: 500,
                kg: 500,
                class1: 600,
                class2: 600,
                class3: 600,
                class4: 700,
                class5: 700,
                class6: 800,
                class7: 800,
                class8: 800
            }
        };
        
        if (feeAmounts[feeType] && feeAmounts[feeType][studentClass]) {
            amountField.value = feeAmounts[feeType][studentClass];
        } else {
            amountField.value = '';
        }
    } else {
        // For 'Other' fee type, clear the amount field for manual entry
        amountField.value = '';
    }
}

// Select payment method
function selectPaymentMethod(element, method) {
    // Remove active class from all methods
    document.querySelectorAll('.payment-method').forEach(function(el) {
        el.classList.remove('active');
    });
    
    // Add active class to selected method
    element.classList.add('active');
    
    // Hide all payment method forms
    document.querySelectorAll('.payment-method-form').forEach(function(form) {
        form.classList.remove('active-payment-form');
    });
    
    // Show the selected payment method form
    document.getElementById(method + 'Payment').classList.add('active-payment-form');
}

// Process payment - update to handle verification flow instead of direct payment
function processPayment() {
    // Get the active payment method
    const activePaymentMethod = document.querySelector('.payment-method.active');
    let paymentType = activePaymentMethod.querySelector('span').textContent;
    
    // Validate the form fields based on payment method
    let isValid = true;
    let referenceId = '';
    
    if (paymentType === 'UPI QR Code') {
        const utrNumber = document.getElementById('utrNumber');
        if (!utrNumber.value) {
            utrNumber.setCustomValidity('Please enter the transaction reference number');
            utrNumber.reportValidity();
            isValid = false;
        } else {
            referenceId = utrNumber.value;
            
            // For UPI payments, automatically generate and send receipt
            const paymentData = {
                studentName: document.getElementById('studentName').value,
                admissionNumber: document.getElementById('admissionNumber').value,
                className: document.getElementById('summaryClass').textContent,
                feeType: document.getElementById('summaryFeeType').textContent,
                amount: document.getElementById('finalAmount').textContent,
                transactionId: referenceId,
                email: document.getElementById('emailAddress').value,
                mobile: document.getElementById('mobileNumber').value,
                paymentDate: new Date().toISOString()
            };

            // Send payment data to server for receipt generation
            fetch('/api/generate-receipt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Download receipt to mobile
                    const receiptUrl = data.receiptUrl;
                    const link = document.createElement('a');
                    link.href = receiptUrl;
                    link.download = `Payment_Receipt_${referenceId}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            })
            .catch(error => {
                console.error('Error generating receipt:', error);
            });
        }
    } else if (paymentType === 'Bank Transfer') {
        const bankUtrNumber = document.getElementById('bankUtrNumber');
        if (!bankUtrNumber.value) {
            bankUtrNumber.setCustomValidity('Please enter the transaction reference number');
            bankUtrNumber.reportValidity();
            isValid = false;
        } else {
            referenceId = bankUtrNumber.value;
        }
    } else if (paymentType === 'Upload Receipt') {
        const receiptFile = document.getElementById('receiptFile');
        const receiptUtrNumber = document.getElementById('receiptUtrNumber');
        
        if (!receiptFile.files || receiptFile.files.length === 0) {
            receiptFile.setCustomValidity('Please upload a payment receipt');
            receiptFile.reportValidity();
            isValid = false;
        } else if (!receiptUtrNumber.value) {
            receiptUtrNumber.setCustomValidity('Please enter the transaction reference number');
            receiptUtrNumber.reportValidity();
            isValid = false;
        } else {
            referenceId = receiptUtrNumber.value;
        }
    }
    
    if (!isValid) {
        return;
    }
    
    // Set payment details in the success screen
    document.getElementById('transactionId').textContent = referenceId;
    document.getElementById('amountPaid').textContent = document.getElementById('finalAmount').textContent;
    
    // Set submission date
    const now = new Date();
    const formattedDate = now.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('paymentDate').textContent = formattedDate;
    
    // Hide all steps
    document.querySelectorAll('.step-form').forEach(function(step) {
        step.classList.remove('active-form');
    });
    
    // Show success message
    document.getElementById('paymentSuccess').classList.add('active-form');
}

// Handle file selection for receipt upload
function handleFileSelect(event) {
    const fileInput = event.target;
    const filePreview = document.getElementById('filePreview');
    
    // Clear previous preview
    filePreview.innerHTML = '';
    filePreview.classList.remove('empty');
    
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            filePreview.appendChild(img);
        };
        
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        filePreview.classList.add('empty');
        filePreview.textContent = 'No file selected';
    }
}

// Copy UPI ID to clipboard
function copyUpiId() {
    const upiId = 'sgmic@sbi';
    copyToClipboard(upiId, 'UPI ID copied to clipboard!');
}

// Copy bank account number to clipboard
function copyBankAccount() {
    const accountNumber = '1234567890123456';
    copyToClipboard(accountNumber, 'Account number copied to clipboard!');
}

// Copy IFSC code to clipboard
function copyIfscCode() {
    const ifscCode = 'SBIN0012345';
    copyToClipboard(ifscCode, 'IFSC code copied to clipboard!');
}

// Generic function to copy text to clipboard
function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text)
        .then(function() {
            // Show success message
            alert(successMessage);
        })
        .catch(function(err) {
            console.error('Failed to copy text: ', err);
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert(successMessage);
        });
}

// Download receipt
function downloadReceipt() {
    // Get payment details
    const studentName = document.getElementById('studentName').value;
    const className = document.getElementById('summaryClass').textContent;
    const admissionNumber = document.getElementById('admissionNumber').value;
    const paymentType = document.getElementById('summaryFeeType').textContent;
    const amount = document.getElementById('amountPaid').textContent;
    const transactionId = document.getElementById('transactionId').textContent;
    const paymentDate = document.getElementById('paymentDate').textContent;
    
    // Create receipt content
    const receiptContent = 
`--------------------------------------------------
SARASWATI GYAN MANDIR INTER COLLEGE
PAYMENT CONFIRMATION
--------------------------------------------------
Reference ID: ${transactionId}
Date: ${paymentDate}
Status: Pending Verification

STUDENT DETAILS:
Name: ${studentName}
Class: ${className}
Admission No: ${admissionNumber}

PAYMENT DETAILS:
Type: ${paymentType}
Amount: ${amount}

Note: This is not a confirmed receipt. Your payment
will be verified within 24-48 hours. Please retain
this for your reference.

For queries: +91 9839148124
--------------------------------------------------`;

    // Create a text file and trigger download
    const element = document.createElement('a');
    const file = new Blob([receiptContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Payment_Confirmation_${transactionId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Create folder structure for payment images
function createImageFolders() {
    // This function would not be needed in the front-end JavaScript
    // It's here as a reminder that you need to create these folders on the server
    // and add the payment method logo images
    
    // Folder structure:
    // SGMIC Website/
    //   ├── image/
    //   │   └── payment/
    //   │       ├── gpay.png
    //   │       ├── phonepe.png
    //   │       ├── paytm.png
    //   │       └── bhim.png
} 