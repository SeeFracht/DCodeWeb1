document.addEventListener('DOMContentLoaded', function() {
    // 解析URL查询参数
    const queryParams = new URLSearchParams(window.location.search);

    // 获取用户数据
    const userid = queryParams.get('userid');
    const username = queryParams.get('username');
    const email = queryParams.get('email');
    const idNumber = queryParams.get('idNumber');
    const password = queryParams.get('password');
    const status = queryParams.get('status');

    // 填充数据到输入框
    document.getElementById('userId').value = userid;
    document.getElementById('username').value = username;
    document.getElementById('email').value = email;
    document.getElementById('idNumber').value = idNumber;
    document.getElementById('password').value = password;
    document.getElementById('status').value = status;

    // 监听表单提交事件
    document.getElementById('editUserForm').addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为
        const userData = {
            userId: userid,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            idNumber: document.getElementById('idNumber').value,
            password: document.getElementById('password').value,
            status: document.getElementById('status').value
        };

        console.log(userData);

        axios.post('/user/update/' + userid, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
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
});
