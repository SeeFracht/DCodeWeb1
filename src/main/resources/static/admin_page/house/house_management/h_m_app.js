document.addEventListener('DOMContentLoaded', function() {
    const currentPage = 1;
    const pageSize = 10;
    let location = ''; // 获取用户输入的位置

    // 获取“新增”按钮元素
    const addHouseButton = document.getElementById('add-house-button');

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // 为“新增”按钮添加点击事件监听器
    addHouseButton.addEventListener('click', function() {
        // 跳转到新增房源页面
        window.location.href = '../add_house/addhouse.html'; // 路径
    });

    // 为搜索按钮添加点击事件监听器
    searchButton.addEventListener('click', function() {
        location = searchInput.value; // 获取搜索框的值
        fetchHouses(currentPage, pageSize, location); // 根据地点搜索房屋
    });

    fetchHouses(currentPage, pageSize, location); // 初始加载房屋列表

    function fetchHouses(current, size, loc) {
        axios.get('/house/page', {
            params: {
                current: current,
                size: size,
                location: loc
            }
        })
            .then(function(response) {
                console.log(response.data.records);
                const houses = response.data.records;
                displayHouses(houses);
                setupPagination(response.data, current, size);
            })
            .catch(function(error) {
                console.error('Error fetching houses:', error);
                alert('Failed to load houses');
            });
    }

    function displayHouses(houses) {
        const container = document.getElementById('house-list-container');
        container.innerHTML = ''; // 清空现有列表

        houses.forEach(house => {
            // 创建房屋信息元素
            const houseElement = document.createElement('div');
            houseElement.className = 'house-item';

            // 创建图片元素并设置 src 属性
            const houseImage = document.createElement('img');
            houseImage.alt = 'House Image';
            houseImage.className = 'house-image';

            // 获取图片
            axios.get('/house_image/image', {
                params: {
                    location: house.location
                },
                responseType: 'blob' // 重要：指定响应类型为blob
            }).then(response => {
                // 创建一个URL对象，用于图片src
                const imageUrl = window.URL.createObjectURL(new Blob([response.data]));
                houseImage.src = imageUrl;

                // 填充房屋信息
                houseElement.innerHTML = `
                <h3>${house.location}</h3>
                <p>户型: ${house.houseType}</p>
                <p>楼层: ${house.floor}</p>
                <p>面积: ${house.square}平方米</p>
                <p>价格: ${house.price}万元</p>
                <p>建造时间: ${house.yearBuilt}</p>
                <p>热门状态：${house.hotPoint === 0 ? '普通' : house.hotPoint === 1 ? '热门' : '状态码出错'}</p>
                <p>状态: ${house.status === 0 ? '正在出售' : house.status === 1 ? '已售' : house.status === 2 ? '待审核' : house.status === 9 ? '锁定' : '未知状态'}</p>
                <p>房东: ${house.propertyOwner}</p>
                <p>房东电话: ${house.pownerPhone}</p>
                `;

                // 将图片元素添加到房屋信息元素中
                const imageContainer = document.createElement('div');
                imageContainer.className = 'house-image-container';
                imageContainer.appendChild(houseImage);
                houseElement.appendChild(imageContainer);

                // 创建编辑图标元素
                const editIcon = document.createElement('img');
                editIcon.src = "../../../admin_page/house/house_management/h_m_resource/edit.png";
                editIcon.alt = "Edit";
                editIcon.className = "edit-icon";
                editIcon.addEventListener('click', function () {
                    // 构造查询参数字符串
                    const queryParams = `?houseId=${encodeURIComponent(house.houseId)}&location=${encodeURIComponent(house.location)}&houseType=${encodeURIComponent(house.houseType)}&floor=${house.floor}&square=${house.square}&price=${house.price}&yearBuilt=${house.yearBuilt}&status=${house.status}&propertyOwner=${encodeURIComponent(house.propertyOwner)}&pOwnerPhone=${encodeURIComponent(house.pOwnerPhone)}`;
                    // 跳转到编辑页面，并带上查询参数
                    window.location.href = `../../house/edit_house/edithouse.html${queryParams}`;
                });

                // 创建删除图标元素
                const deleteIcon = document.createElement('img');
                deleteIcon.src = "../../../admin_page/house/house_management/h_m_resource/garbage.png";
                deleteIcon.alt = "Delete";
                deleteIcon.className = "delete-icon";
                deleteIcon.addEventListener('click', function () {
                    deleteHouse(house.houseId); // 传递当前房源ID
                });

                // 创建设为热门图标
                const hotIcon = document.createElement('img');
                hotIcon.src = "../../../admin_page/house/house_management/h_m_resource/hot.png"
                hotIcon.alt = "Hot";
                hotIcon.className = "hot-icon";
                hotIcon.addEventListener('click', function () {
                    setHotHouse(house.houseId);
                });

                container.appendChild(editIcon);
                container.appendChild(deleteIcon);
                container.appendChild(hotIcon);
                container.appendChild(houseElement);
            }).catch(error => {
                console.error('Error fetching image:', error);
                // 如果获取图片失败，仍然显示房源信息，但不显示图片
                houseElement.innerHTML = `
                <h3>${house.location}</h3>
                <p>户型: ${house.houseType}</p>
                <p>楼层: ${house.floor}</p>
                <p>面积: ${house.square}平方米</p>
                <p>价格: ${house.price}万元</p>
                <p>建造时间: ${house.yearBuilt}</p>
                <p>热门状态：${house.hotPoint === 0 ? '普通' : house.hotPoint === 1 ? '热门' : '状态码出错'}</p>
                <p>状态: ${house.status === 0 ? '正在出售' : house.status === 1 ? '已售' : house.status === 2 ? '待审核' : house.status === 9 ? '锁定' : '未知状态'}</p>
                <p>房东: ${house.propertyOwner}</p>
                <p>房东电话: ${house.pownerPhone}</p>
            `;

                // 创建编辑图标元素
                const editIcon = document.createElement('img');
                editIcon.src = "../../../admin_page/house/house_management/h_m_resource/edit.png";
                editIcon.alt = "Edit";
                editIcon.className = "edit-icon";
                editIcon.addEventListener('click', function () {
                    // 构造查询参数字符串
                    const queryParams = `?houseId=${encodeURIComponent(house.houseId)}&location=${encodeURIComponent(house.location)}&houseType=${encodeURIComponent(house.houseType)}&floor=${house.floor}&square=${house.square}&price=${house.price}&yearBuilt=${house.yearBuilt}&status=${house.status}&propertyOwner=${encodeURIComponent(house.propertyOwner)}&pOwnerPhone=${encodeURIComponent(house.pOwnerPhone)}`;
                    // 跳转到编辑页面，并带上查询参数
                    window.location.href = `../../house/edit_house/edithouse.html${queryParams}`;
                });

                // 创建删除图标元素
                const deleteIcon = document.createElement('img');
                deleteIcon.src = "../../../admin_page/house/house_management/h_m_resource/garbage.png";
                deleteIcon.alt = "Delete";
                deleteIcon.className = "delete-icon";
                deleteIcon.addEventListener('click', function () {
                    deleteHouse(house.houseId); // 传递当前房源ID
                });

                // 创建设为热门图标
                const hotIcon = document.createElement('img');
                hotIcon.src = "../../../admin_page/house/house_management/h_m_resource/hot.png"
                hotIcon.alt = "Hot";
                hotIcon.className = "hot-icon";
                hotIcon.addEventListener('click', function () {
                    setHotHouse(house.houseId);
                });

                container.appendChild(editIcon);
                container.appendChild(deleteIcon);
                container.appendChild(hotIcon);
                container.appendChild(houseElement);
            });
        });
    }

    function setupPagination(pageInfo, current, size) {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = ''; // 清空现有分页控件

        const totalPages = pageInfo.pages;
        const currentPage = pageInfo.current;

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = i === currentPage ? 'pagination-button active' : 'pagination-button';
            button.addEventListener('click', function() {
                fetchHouses(i, size, location);
            });
            paginationContainer.appendChild(button);
        }
    }

    // 删除房屋信息的函数
    function deleteHouse(houseId) {
        if (confirm('确定要删除这个房源吗？')) {
            axios.delete('/house/delete/' + houseId)
                .then(function(response) {
                    console.log(response);
                    alert('House deleted successfully');
                    fetchHouses(currentPage, pageSize, location); // 重新加载房源列表
                })
                .catch(function(error) {
                    console.error('Error deleting house:', error);
                    alert('Failed to delete house');
                });
        }
    }

    // 设置热门房源
    function setHotHouse(houseId) {
        axios.post('/house/hot/' + houseId)
            .then(function(response) {
                console.log(response);
                alert('房源热门状态已设置');
                // 可能需要刷新房源列表或更新页面
            })
            .catch(function(error) {
                console.error('Error setting hot house:', error);
                alert('设置热门房源失败');
            });
    }
});
