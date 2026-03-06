document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        idNumber: document.getElementById('idNumber').value,
        password: document.getElementById('password').value,
        status: document.getElementById('status').value
    };

    axios.post('/user/add', userData)
        .then(function(response) {
            console.log(response);
            alert('User added successfully');
            // 在alert之后延迟0秒，然后刷新页面
            setTimeout(function() {
                window.location.reload();
            }, 0);
        })
        .catch(function(error) {
            console.error('Error adding user:', error);
            alert('Failed to add user');
        });
});
