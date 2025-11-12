document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const patientName = document.getElementById('patientName').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;

        if (validateForm(patientName, appointmentDate, appointmentTime)) {
            // Simulate booking request submission
            setTimeout(() => {
                confirmationMessage.textContent = `Appointment booked for ${patientName} on ${appointmentDate} at ${appointmentTime}.`;
                bookingForm.reset();
            }, 500);
        } else {
            confirmationMessage.textContent = 'Please fill in all fields correctly.';
        }
    }); 
    function validateForm(name, date, time) {
        return name && date && time;
    }
    
});