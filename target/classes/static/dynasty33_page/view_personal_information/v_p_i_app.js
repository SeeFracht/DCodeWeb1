document.addEventListener('DOMContentLoaded', function() {
    const updateUserForm = document.getElementById('view-and-update-UserForm'); // 注意表单 ID 应与 HTML 中的 ID 匹配

    function fetchUser() {
        axios.get('/user/v_p_i')
            .then(function(response) {
                console.log(response.data);
                const user = response.data; // 假设后端返回的数据是一个对象
                if (user) {
                    document.getElementById('userId').value = user.userId;
                    document.getElementById('userName').value = user.userName;
                    document.getElementById('email').value = user.email;
                    document.getElementById('idNumber').value = user.idNumber;
                    document.getElementById('password').value = user.password;
                } else {
                    alert('User not found');
                }
            })
            .catch(function(error) {
                console.error('Error fetching user:', error);
                alert('Failed to load user');
            });
    }

    updateUserForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为

        const userData = {
            userId: document.getElementById('userId').value,
            userName: document.getElementById('userName').value,
            email: document.getElementById('email').value,
            idNumber: document.getElementById('idNumber').value,
            password: document.getElementById('password').value
        };

        axios.post('/user/user_update', userData)
            .then(function(response) {
                console.log(response);
                alert('User updated successfully');
                // 可能需要重定向到用户列表或其他页面
            })
            .catch(function(error) {
                console.error('Error updating user:', error);
                alert('Failed to update user');
            });
    });

    // 调用 fetchUser 函数来获取用户数据并填充到输入框中
    fetchUser();
});
