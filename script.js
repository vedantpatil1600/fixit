// Navigation functions
function navigateTo(page) {
    window.location.href = page;
}

// Profile functions
function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear session/local storage if needed
        localStorage.removeItem('userToken');
        sessionStorage.clear();
        
        // Redirect to home page
        navigateTo('home.html');
    }
}

function editProfile() {
    // Enable editing of profile fields
    const inputs = document.querySelectorAll('.personal-info input[readonly]');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.style.borderColor = '#2563eb';
    });
    
    // Change button text to "Save"
    const editBtn = event.target;
    editBtn.textContent = 'Save';
    editBtn.onclick = saveProfile;
}

function saveProfile() {
    // Save profile data (in real app, this would send to server)
    const inputs = document.querySelectorAll('.personal-info input');
    const profileData = {};
    
    inputs.forEach(input => {
        profileData[input.name || input.id] = input.value;
        input.setAttribute('readonly', true);
        input.style.borderColor = '#e2e8f0';
    });
    
    // Store in localStorage for demo
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Change button back to "Edit Profile"
    const saveBtn = event.target;
    saveBtn.textContent = 'Edit Profile';
    saveBtn.onclick = editProfile;
    
    alert('Profile updated successfully!');
}

function changePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword && newPassword.length >= 6) {
        // In real app, this would send to server
        localStorage.setItem('userPassword', newPassword);
        alert('Password changed successfully!');
    } else if (newPassword) {
        alert('Password must be at least 6 characters long!');
    }
}

function linkGoogleAccount() {
    // In real app, this would integrate with Google OAuth
    alert('Google account linking feature would open Google OAuth popup');
    
    // For demo, just show success
    setTimeout(() => {
        alert('Google account linked successfully!');
    }, 1000);
}

// Address functions
function editAddress(type) {
    const addressCard = event.target.closest('.address-card');
    const addressText = addressCard.querySelector('.address-body p');
    const currentAddress = addressText.textContent.replace('\n', ', ');
    
    const newAddress = prompt('Edit address:', currentAddress);
    if (newAddress && newAddress !== currentAddress) {
        // Format address with line breaks
        const parts = newAddress.split(',');
        addressText.innerHTML = parts[0] + (parts[1] ? '<br>' + parts.slice(1).join(',') : '');
        
        // Save to localStorage
        const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '{}');
        addresses[type] = newAddress;
        localStorage.setItem('savedAddresses', JSON.stringify(addresses));
        
        alert('Address updated successfully!');
    }
}

function deleteAddress(type) {
    if (confirm('Are you sure you want to delete this address?')) {
        const addressCard = event.target.closest('.address-card');
        addressCard.style.opacity = '0.5';
        addressCard.style.pointerEvents = 'none';
        
        // Remove from localStorage
        const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '{}');
        delete addresses[type];
        localStorage.setItem('savedAddresses', JSON.stringify(addresses));
        
        // Remove card after animation
        setTimeout(() => {
            addressCard.remove();
        }, 300);
        
        alert('Address deleted successfully!');
    }
}

function addNewAddress() {
    const name = prompt('Enter address name (e.g., Office, Parents House):');
    if (!name) return;
    
    const address = prompt('Enter full address:');
    if (!address) return;
    
    // Create new address card
    const addressGrid = document.querySelector('.address-grid');
    const newCard = document.createElement('div');
    newCard.className = 'address-card';
    newCard.style.opacity = '0';
    
    const addressId = name.toLowerCase().replace(/\s+/g, '_');
    const addressParts = address.split(',');
    
    newCard.innerHTML = `
        <div class="address-header">
            <h4>${name}</h4>
        </div>
        <div class="address-body">
            <p>${addressParts[0]}${addressParts[1] ? '<br>' + addressParts.slice(1).join(',') : ''}</p>
        </div>
        <div class="address-actions">
            <button class="btn btn-sm btn-outline" onclick="editAddress('${addressId}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteAddress('${addressId}')">Delete</button>
        </div>
    `;
    
    addressGrid.appendChild(newCard);
    
    // Animate in
    setTimeout(() => {
        newCard.style.opacity = '1';
        newCard.style.transition = 'opacity 0.3s';
    }, 100);
    
    // Save to localStorage
    const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '{}');
    addresses[addressId] = address;
    localStorage.setItem('savedAddresses', JSON.stringify(addresses));
    
    alert('New address added successfully!');
}

// Service history functions
function contactProvider(serviceType) {
    if (typeof serviceType === 'string') {
        alert(`Contacting ${serviceType} provider... In real app, this would open a chat or call interface.`);
    } else {
        const serviceType = event.target.closest('.history-item').querySelector('h4').textContent;
        alert(`Contacting ${serviceType.replace(' Service', '')} provider... In real app, this would open a chat or call interface.`);
    }
}

function rescheduleService() {
    const serviceItem = event.target.closest('.history-item');
    const serviceType = serviceItem.querySelector('h4').textContent;
    const currentDate = serviceItem.querySelector('.history-details p').textContent;
    
    const newDate = prompt('Enter new date and time (e.g., 25 March 2023, 3:00 PM):', currentDate);
    if (newDate && newDate !== currentDate) {
        serviceItem.querySelector('.history-details p').textContent = newDate;
        alert(`${serviceType} rescheduled to ${newDate}`);
        
        // In real app, this would send to server
        const serviceHistory = JSON.parse(localStorage.getItem('serviceHistory') || '[]');
        const serviceIndex = Array.from(serviceItem.parentElement.children).indexOf(serviceItem);
        if (serviceHistory[serviceIndex]) {
            serviceHistory[serviceIndex].datetime = newDate;
            localStorage.setItem('serviceHistory', JSON.stringify(serviceHistory));
        }
    }
}

function cancelService() {
    const serviceItem = event.target.closest('.history-item');
    const serviceType = serviceItem.querySelector('h4').textContent;
    
    if (confirm(`Are you sure you want to cancel the ${serviceType}?`)) {
        serviceItem.style.opacity = '0.5';
        serviceItem.style.pointerEvents = 'none';
        
        // Update status to cancelled
        const statusBadge = serviceItem.querySelector('.status-badge');
        statusBadge.textContent = 'Cancelled';
        statusBadge.className = 'status-badge cancelled';
        statusBadge.style.background = '#fee2e2';
        statusBadge.style.color = '#991b1b';
        
        // Remove action buttons
        const actionsDiv = serviceItem.querySelector('.history-actions');
        actionsDiv.innerHTML = '<span style="color: #64748b;">Service cancelled</span>';
        
        alert(`${serviceType} has been cancelled.`);
        
        // In real app, this would send to server
        const serviceHistory = JSON.parse(localStorage.getItem('serviceHistory') || '[]');
        const serviceIndex = Array.from(serviceItem.parentElement.children).indexOf(serviceItem);
        if (serviceHistory[serviceIndex]) {
            serviceHistory[serviceIndex].status = 'cancelled';
            localStorage.setItem('serviceHistory', JSON.stringify(serviceHistory));
        }
    }
}

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '{}');
    
    // Populate profile fields if data exists
    Object.keys(profileData).forEach(key => {
        const input = document.querySelector(`input[name="${key}"], input#${key}`);
        if (input) {
            input.value = profileData[key];
        }
    });
    
    // Add some demo data if first time visiting
    if (!localStorage.getItem('visitedBefore')) {
        localStorage.setItem('visitedBefore', 'true');
        showNotification('Welcome to your FIXit Profile!', 'success');
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save profile
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const editBtn = document.querySelector('.profile-actions .btn-primary');
            if (editBtn && editBtn.textContent === 'Save') {
                saveProfile.call(editBtn);
            }
        }
        
        // Ctrl/Cmd + E to edit profile
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            const editBtn = document.querySelector('.profile-actions .btn-primary');
            if (editBtn && editBtn.textContent === 'Edit Profile') {
                editProfile.call(editBtn);
            }
        }
    });
});

// Home Page Functions
function selectService(serviceType) {
    localStorage.setItem('selectedService', serviceType);
    navigateTo('service.html');
}

function openChatBot() {
    alert('Chat bot feature would open here. In a real application, this would connect to a chat service.');
    showNotification('Chat bot coming soon!', 'info');
}

// Service Form Functions
function selectServiceType(serviceType) {
    // Remove previous selection
    document.querySelectorAll('.service-option input').forEach(input => {
        input.checked = false;
    });
    
    // Set new selection
    const selectedInput = document.getElementById(serviceType);
    if (selectedInput) {
        selectedInput.checked = true;
    }
}

function handlePhotoUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('photo-preview');
    
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cursor = 'pointer';
                img.onclick = function() {
                    if (confirm('Remove this photo?')) {
                        img.remove();
                    }
                };
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }
}

function submitServiceRequest() {
    // Get form data
    const serviceType = document.querySelector('input[name="service"]:checked')?.value;
    const problemTitle = document.getElementById('problem-title')?.value;
    const problemDescription = document.getElementById('problem-description')?.value;
    const urgency = document.getElementById('urgency')?.value;
    const serviceDate = document.getElementById('service-date')?.value;
    const serviceTime = document.getElementById('service-time')?.value;
    const address = document.querySelector('input[name="address"]:checked')?.value;
    
    // Validation
    if (!serviceType) {
        showNotification('Please select a service type', 'error');
        return;
    }
    
    if (!problemTitle || !problemDescription) {
        showNotification('Please describe your problem', 'error');
        return;
    }
    
    if (!serviceDate) {
        showNotification('Please select a service date', 'error');
        return;
    }
    
    // Create service request object
    const serviceRequest = {
        id: 'service_' + Date.now(),
        serviceType,
        problemTitle,
        problemDescription,
        urgency,
        serviceDate,
        serviceTime,
        address,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    existingRequests.push(serviceRequest);
    localStorage.setItem('serviceRequests', JSON.stringify(existingRequests));
    
    // Show success message
    showNotification('Service request submitted successfully!', 'success');
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
        navigateTo('dashboard.html');
    }, 2000);
}

// Dashboard Functions
function viewServiceDetails(serviceId) {
    const requests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    const service = requests.find(r => r.id === serviceId);
    
    if (service) {
        alert(`Service Details:\n\nType: ${service.serviceType}\nTitle: ${service.problemTitle}\nDescription: ${service.problemDescription}\nDate: ${service.serviceDate}\nStatus: ${service.status}`);
    }
}

function trackService(serviceId) {
    showNotification('Tracking feature would show real-time location of service professional', 'info');
}

function contactProfessional(serviceId) {
    const requests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    const service = requests.find(r => r.id === serviceId);
    
    if (service) {
        alert(`Contacting ${service.serviceType} professional... In real app, this would open a chat or call interface.`);
    }
}

function viewAllServices() {
    const requests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    
    if (requests.length === 0) {
        alert('No service requests found.');
        return;
    }
    
    let serviceList = 'All Service Requests:\n\n';
    requests.forEach((service, index) => {
        serviceList += `${index + 1}. ${service.serviceType} - ${service.problemTitle}\n   Status: ${service.status}\n   Date: ${service.serviceDate}\n\n`;
    });
    
    alert(serviceList);
}

function contactSupport() {
    alert('Contact Support:\n\nPhone: +91 9876543210\nEmail: support@fixit.com\n\nAvailable 24/7 for your assistance!');
    showNotification('Support contact information displayed', 'success');
}

// Additional utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    const timeMap = {
        'morning': '9:00 AM - 12:00 PM',
        'afternoon': '12:00 PM - 4:00 PM',
        'evening': '4:00 PM - 7:00 PM'
    };
    return timeMap[timeString] || timeString;
}

// Initialize date input with minimum date as today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('service-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Load saved service type if coming from home page
    const savedService = localStorage.getItem('selectedService');
    if (savedService) {
        const serviceInput = document.getElementById(savedService);
        if (serviceInput) {
            serviceInput.checked = true;
        }
        localStorage.removeItem('selectedService');
    }
});

// Add CSS for cancelled status
const style = document.createElement('style');
style.textContent = `
    .status-badge.cancelled {
        background: #fee2e2;
        color: #991b1b;
    }
`;
document.head.appendChild(style);
