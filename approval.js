document.addEventListener('DOMContentLoaded', function() {
    const approvalList = document.getElementById('approval-list');
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');
      const tableBody = document.querySelector('#approvalTable tbody');
  let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    // Function to fetch pending appointment requests
    function fetchPendingRequests() {
        // Simulated fetch request (replace with actual API call)
        const pendingRequests = [
            { id: 1, patientName: 'John Doe', appointmentDate: '2023-10-15', status: 'pending' },
            { id: 2, patientName: 'Jane Smith', appointmentDate: '2023-10-16', status: 'pending' }
        ];

        pendingRequests.forEach(request => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${request.patientName} - ${request.appointmentDate}</span>
                <button class="approve-btn" data-id="${request.id}">Approve</button>
                <button class="reject-btn" data-id="${request.id}">Reject</button>
            `;
            approvalList.appendChild(listItem);
        });
    }

    // Function to handle approval of a request
 function approveRequest(id) {
    // Simulated approval logic (replace with actual API call)
    console.log(`Approved request with ID: ${id}`);
    // Find the request details
    const listItem = document.querySelector(`.approve-btn[data-id="${id}"]`).parentElement;
    const patientInfo = listItem.querySelector('span').textContent;
    // Get existing approved appointments
    let approved = JSON.parse(localStorage.getItem('approvedAppointments') || '[]');
    // Add new approved appointment
    approved.push(patientInfo);
    localStorage.setItem('approvedAppointments', JSON.stringify(approved));
    // Remove the approved request from the list
    listItem.remove();
}

    // Function to handle rejection of a request
    function rejectRequest(id) {
        // Simulated rejection logic (replace with actual API call)
        console.log(`Rejected request with ID: ${id}`);
        // Remove the rejected request from the list
        document.querySelector(`.reject-btn[data-id="${id}"]`).parentElement.remove();
    }

    // Event listeners for approve and reject buttons
    approveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            approveRequest(id);
        });
    });

    rejectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            rejectRequest(id);
        });
    });

    // Initial fetch of pending requests
    fetchPendingRequests();
});