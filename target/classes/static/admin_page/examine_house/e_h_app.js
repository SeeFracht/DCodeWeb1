document.addEventListener('DOMContentLoaded', function() {
    const currentPage = 1;
    const pageSize = 10;
    let location = ''; // 获取用户输入的位置

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // 为搜索按钮添加点击事件监听器
    searchButton.addEventListener('click', function() {
        location = searchInput.value; // 获取搜索框的值
        fetchHouses(currentPage, pageSize, location, 2); // 根据地点和状态搜索房屋
    });

    fetchHouses(currentPage, pageSize, location, 2); // 初始加载房屋列表

    function fetchHouses(current, size, loc, stat) {
        axios.get('/house/page_for_exam', {
            params: {
                current: current,
                size: size,
                location: loc,
                status: stat // 传递状态参数
            }
        })
            .then(function(response) {
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
            // 只有当house.status等于2时，才处理和显示这个房源
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

                houseElement.innerHTML = `
                    <h3>${house.location}</h3>
                    <p>户型: ${house.houseType}</p>
                    <p>楼层: ${house.floor}</p>
                    <p>面积: ${house.square}平方米</p>
                    <p>价格: ${house.price}万元</p>
                    <p>建造时间: ${house.yearBuilt}</p>
                    <p>状态: 待审核</p>
                    <p>房东: ${house.propertyOwner}</p>
                    <p>房东电话: ${house.pownerPhone}</p>
                    <button class="update-status">修改状态为“出售”</button>
                `;

                // 将图片元素添加到房屋信息元素中
                const imageContainer = document.createElement('div');
                imageContainer.className = 'house-image-container';
                imageContainer.appendChild(houseImage);
                houseElement.appendChild(imageContainer);

                container.appendChild(houseElement);

                // 为每个房源的按钮添加点击事件监听器
                const updateStatusButton = houseElement.querySelector('.update-status');
                updateStatusButton.addEventListener('click', function() {
                    const houseData = {
                        houseId: house.houseId,
                        location: house.location,
                        houseType: house.houseType,
                        floor: house.floor,
                        square: house.square,
                        price: house.price,
                        yearBuilt: house.yearBuilt,
                        status: 0,
                        propertyOwner: house.propertyOwner,
                        pOwnerPhone: house.pownerPhone
                    };
                    console.log(houseData);

                    updateHouseStatus(houseData); // 0代表“出售”状态
                });
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
                    <p>状态: 待审核</p>
                    <p>房东: ${house.propertyOwner}</p>
                    <p>房东电话: ${house.pownerPhone}</p>
                    <button class="update-status">修改状态为“出售”</button>
                `;

                container.appendChild(houseElement);

                // 为每个房源的按钮添加点击事件监听器
                const updateStatusButton = houseElement.querySelector('.update-status');
                updateStatusButton.addEventListener('click', function() {
                    const houseData = {
                        houseId: house.houseId,
                        location: house.location,
                        houseType: house.houseType,
                        floor: house.floor,
                        square: house.square,
                        price: house.price,
                        yearBuilt: house.yearBuilt,
                        status: 0,
                        propertyOwner: house.propertyOwner,
                        pOwnerPhone: house.pownerPhone
                    };
                    console.log(houseData);

                    updateHouseStatus(houseData); // 0代表“出售”状态
                });
            })
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

    function updateHouseStatus(houseData) {
        axios.post(`/house/update`, houseData)
            .then(function(response) {
                console.log(response);
                alert('状态更新成功');
                fetchHouses(currentPage, pageSize, location, 2); // 重新加载房源列表
            })
            .catch(function(error) {
                console.error('Error updating house status:', error);
                alert('状态更新失败');
            });
    }
});
