// Example for appointment submission page
function submitAppointment() {
  const patientName = document.getElementById('patientName').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const status = 'pending';

  let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  appointments.push({ patientName, date, time, status });
  localStorage.setItem('appointments', JSON.stringify(appointments));
}