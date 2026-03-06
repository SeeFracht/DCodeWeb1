document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    let currentPage = 1;
    let pageSize = 10;

    searchButton.addEventListener('click', function() {
        const username = searchInput.value;
        fetchUsers(username);
    });

    function fetchUsers(username) {
        axios.get('/user/page', {
            params: {
                current: currentPage, // 当前页码
                size: pageSize, // 每页大小
                username: username
            }
        })
            .then(function(response) {
                const users = response.data.records;
                const userList = document.getElementById('user-list');
                userList.innerHTML = ''; // 清空现有列表

                users.forEach(function(user) {
                    const userItem = document.createElement('li');
                    userItem.innerHTML = `
                    <div><strong>用户名:</strong> ${user.userName}<br></div>
                    <div><strong>邮箱:</strong> ${user.email}<br></div>
                    <div><strong>密码:</strong> ${user.password}<br></div>
                    <div><strong>身份证号:</strong> ${user.idNumber}<br></div>
                    <div>
                        <strong>状态:</strong> 
                        ${user.status === 0 ? '管理员级' : user.status === 1 ? '用户级' : user.status === 9 ? '锁定' : '未知状态'}
                        <br>
                    </div>
                    <div><strong>创建用户ID:</strong> ${user.createUser}<br></div>
                    <div><strong>创建时间:</strong> ${user.createTime}<br></div>
                    <div><strong>更新用户ID:</strong> ${user.updateUser}<br></div>
                    <div><strong>更新时间:</strong> ${user.updateTime}</div>
                `;
                    // 创建删除图标元素
                    const deleteIcon = document.createElement('img');
                    deleteIcon.src = "../../user/user_management/u_m_resource/garbage.png";
                    deleteIcon.alt = "Delete";
                    deleteIcon.className = "delete-icon";
                    deleteIcon.addEventListener('click', function() {
                        deleteUser(user.userId);
                    });

                    // 创建编辑图标元素
                    const editIcon = document.createElement('img');
                    editIcon.src = "../../user/user_management/u_m_resource/edit.png";
                    editIcon.alt = "Edit";
                    editIcon.className = "edit-icon";
                    editIcon.addEventListener('click', function() {
                        // 构造查询参数字符串
                        const queryParams = `?userid=${encodeURIComponent(user.userId)}&username=${encodeURIComponent(user.userName)}&email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}&status=${user.status}`;
                        // 跳转到编辑页面，并带上查询参数
                        window.location.href = '../../user/edit_user/edituser.html' + queryParams;
                    });

                    // 将图标添加到userItem中
                    userItem.appendChild(deleteIcon);
                    userItem.appendChild(editIcon);

                    userList.appendChild(userItem);
                });

                // 更新分页控件
                updatePagination(response.data);
            })
            .catch(function(error) {
                console.error('Error fetching users:', error);
            });
    }

    function updatePagination(pageInfo) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = ''; // 清空现有分页控件

        // 创建分页按钮
        for (let i = 1; i <= pageInfo.pages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.disabled = i === currentPage; // 当前页码的按钮置为禁用状态
            button.addEventListener('click', function() {
                currentPage = i; // 更新当前页码
                fetchUsers(); // 重新获取用户数据
            });
            paginationContainer.appendChild(button);
        }
    }

    function deleteUser(userId) {
        if (confirm('确定要删除这个用户吗？')) {
            axios.delete('/user/delete/' + userId)
                .then(function(response) {
                    console.log(response);
                    alert('User deleted successfully');
                    fetchUsers(); // 重新加载用户列表
                })
                .catch(function(error) {
                    console.error('Error deleting user:', error);
                    alert('Failed to delete user');
                });
        }
    }

    fetchUsers(); // 初始加载用户列表
});
