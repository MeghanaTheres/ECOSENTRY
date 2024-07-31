

document.addEventListener("DOMContentLoaded", function () {
    let userEmail = "georgepkurias@gmail.com"; // Replace with dynamic user email
    let userName = userEmail.split('@')[0]; // Extract the user's name from the email
    const profilePhotoElement = document.getElementById("profilePhoto");
    const userNameElement = document.getElementById("userName");
    const editProfileForm = document.getElementById('editProfileForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const messageContainer = document.getElementById('messageContainer');
   
    function updateUserInfo() {
         userNameElement.textContent = userName;
        profilePhotoElement.textContent = userName.charAt(0).toUpperCase();
    }

    updateUserInfo();

    function displayMessage(message, type) {
        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => {
          messageContainer.innerHTML = '';
        }, 3000); // Hide message after 3 seconds
      }
    
      editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate form submission and response
        setTimeout(() => {
          displayMessage('Profile updated successfully!', 'success');
          document.getElementById('closeEditProfileModal').click();
        }, 1000);
      });

      changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate form submission and response
        setTimeout(() => {
          displayMessage('Password changed successfully!', 'success');
          document.getElementById('closeChangePasswordModal').click();
        }, 1000);
      });

    // Function to get Gravatar URL
    function getGravatarURL(email) {
        const trimmedEmail = email.trim().toLowerCase();
        const hash = md5(trimmedEmail);
        return `https://www.gravatar.com/avatar/${hash}?d=404`;
    }

    // Function to check if Gravatar image exists
    function checkGravatar(email) {
        const url = getGravatarURL(email);
        const img = new Image();
        img.src = url;
        img.onload = function () {
            profilePhotoElement.innerHTML = `<img src="${url}" alt="Profile Photo">`;
        };
        img.onerror = function () {
            profilePhotoElement.textContent = userName.charAt(0).toUpperCase();
        };
    }

    // MD5 hashing function
    function md5(string) {
        return CryptoJS.MD5(string).toString();
    }

    checkGravatar(userEmail);

     // Event listeners for new profile actions
     document.getElementById("editProfile").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("editProfileModal").style.display = "block";
        document.getElementById("editName").value = userName;
        document.getElementById("editEmail").value = userEmail;
     });
        document.getElementById("closeEditProfileModal").addEventListener("click", function () {
            document.getElementById("editProfileModal").style.display = "none";
        });

        document.getElementById("editProfileForm").addEventListener("submit", function (event) {
            event.preventDefault();
            userName = document.getElementById("editName").value;
            userEmail = document.getElementById("editEmail").value;
            updateUserInfo();
            checkGravatar(userEmail);
            document.getElementById("editProfileModal").style.display = "none";
        });
    


       // Close the modal when clicking outside of it
    window.addEventListener("click", function (event) {
        const modal = document.getElementById("editProfileModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
    document.getElementById("changePassword").addEventListener("click", function () {
        // Display change password modal
        document.getElementById("changePasswordModal").style.display = "block";
    });

    document.getElementById("closeChangePasswordModal").addEventListener("click", function () {
        document.getElementById("changePasswordModal").style.display = "none";
    });

    document.getElementById("changePasswordForm").addEventListener("submit", function (event) {
        event.preventDefault();
        // Add your change password logic here
        alert("Password changed successfully!");
        document.getElementById("changePasswordModal").style.display = "none";
    });

    // Close the modal when clicking outside of it
    window.addEventListener("click", function (event) {
        const modal = document.getElementById("changePasswordModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
   
    document.getElementById('reportForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
    
        const formData = new FormData(this);
    
        fetch('submit_report.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Display the submission message
            document.getElementById('submissionMessage').innerText = 'Report submitted';
    
            // Optionally, you can clear the form fields after submission
            document.getElementById('reportForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Listen for new reports
rtdb.ref('reports').on('child_added', function(snapshot) {
    const report = snapshot.val();
    showNotificationPopup(report, snapshot.key);
  });
  
    

});
const sideMenu=document.querySelector('aside');
const menuBtn=document.querySelector('#menu_bar');
const closeBtn=document.querySelector('#close_btn');


const themeToggler = document.querySelector('.theme-toggler')

menuBtn.addEventListener('click',()=>{
    sideMenu.style.display="block"
})
closeBtn.addEventListener('click',()=>{
    sideMenu.style.display="none"
})

themeToggler.addEventListener('click',()=>{
    document.body.classList.toggle('dark-theme-variables')
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active')
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active')
})
