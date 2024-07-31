document.addEventListener('DOMContentLoaded', function () {
    const reportList = document.getElementById('reportList');
    const notificationList = document.getElementById('notificationList');
  
    // Function to fetch reports from Firestore
    function fetchReports() {
      db.collection('reports').where('status', '==', 'new').onSnapshot(snapshot => {
        reportList.innerHTML = '';
        snapshot.forEach(doc => {
          const report = doc.data();
          const li = document.createElement('li');
          li.textContent = `Report ID: ${doc.id}, Description: ${report.description}`;
          const acceptButton = document.createElement('button');
          acceptButton.textContent = 'Accept';
          acceptButton.onclick = () => acceptReport(doc.id);
          li.appendChild(acceptButton);
          reportList.appendChild(li);
        });
      });
    }
  
    // Function to accept a report
    function acceptReport(reportId) {
      const organizationId = auth.currentUser.uid; // Assuming the organization is logged in
      db.collection('reports').doc(reportId).update({
        status: 'accepted',
        acceptedBy: organizationId
      }).then(() => {
        sendNotificationToUser(reportId, organizationId);
        removeReportFromOtherOrganizations(reportId);
      });
    }
  
    // Function to send notification to the user
    function sendNotificationToUser(reportId, organizationId) {
      // Fetch user ID from the report
      db.collection('reports').doc(reportId).get().then(doc => {
        const userId = doc.data().userId;
        db.collection('notifications').add({
          userId: userId,
          message: `Your report (ID: ${reportId}) has been accepted by an organization.`,
          organizationId: organizationId,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    }
  
    // Function to remove report from other organizations
    function removeReportFromOtherOrganizations(reportId) {
      // Logic to remove the report from other organizations' views
      // This is handled by Firestore's real-time updates
    }
  
    // Fetch reports on page load
    fetchReports();
  
    // Fetch notifications for the organization
    db.collection('notifications').where('organizationId', '==', auth.currentUser.uid).onSnapshot(snapshot => {
      notificationList.innerHTML = '';
      snapshot.forEach(doc => {
        const notification = doc.data();
        const li = document.createElement('li');
        li.textContent = notification.message;
        notificationList.appendChild(li);
      });
    });
  });
  

  const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotificationOnReportAccepted = functions.firestore
  .document('reports/{reportId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.status === 'accepted' && previousValue.status !== 'accepted') {
      const reportId = context.params.reportId;
      const userId = newValue.userId;
      const organizationId = newValue.acceptedBy;

      return admin.firestore().collection('notifications').add({
        userId: userId,
        message: `Your report (ID: ${reportId}) has been accepted by an organization.`,
        organizationId: organizationId,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    return null;
  });
