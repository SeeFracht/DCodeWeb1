document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1; // 当前页码
    const pageSize = 10; // 每页大小

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const houseListContainer = document.getElementById('house-list-container');

    searchButton.addEventListener('click', function() {
        const location = searchInput.value;
        fetchHouses(location);
    });

    fetchHouses();

    function fetchHouses(location) {
        axios.get('/house/page_sell', {
            params: {
                current: currentPage, // 页码
                size: pageSize, // 每页大小
                location: location ? location : "" // 搜索参数，如果没有则为空字符串
            }
        })
            .then(function(response) {
                const houses = response.data.records;
                displayHouses(houses);
                setupPagination(response.data, response.data.pages, location);
            })
            .catch(function(error) {
                console.error('Error fetching houses:', error);
            });
    }

    function displayHouses(houses) {
        houseListContainer.innerHTML = ''; // 清空现有列表

        houses.forEach(house => {
            // 仅当status等于0时显示房源信息
            const houseCard = document.createElement('div');
            houseCard.className = 'house-card';

            // 创建图片元素并设置 src 属性
            const houseImage = document.createElement('img');
            houseImage.alt = 'House Image';
            houseImage.className = 'house-image';

            axios.get('/house_image/image', {
                params: {
                    location: house.location
                },
                responseType: 'blob' // 重要：指定响应类型为blob
            }).then(response => {
                // 创建一个URL对象，用于图片src
                const imageUrl = window.URL.createObjectURL(new Blob([response.data]));
                houseImage.src = imageUrl;

                houseCard.innerHTML = `
                        <h3>${house.location}</h3>
                        <p>户型: ${house.houseType}</p>
                        <p>楼层: ${house.floor}</p>
                        <p>面积: ${house.square}平方米</p>
                        <p>价格: ${house.price}万元</p>
                        <p>建造时间: ${house.yearBuilt}</p>
                        <p>房东: ${house.propertyOwner}</p>
                        <p>房东电话: ${house.pOwnerPhone}</p>
                    `;

                // 将图片元素添加到房屋信息元素中
                const imageContainer = document.createElement('div');
                imageContainer.className = 'house-image-container';
                imageContainer.appendChild(houseImage);
                houseCard.appendChild(imageContainer);

                // 创建购买按钮
                const buyButton = document.createElement('button');
                buyButton.textContent = '购买';
                buyButton.className = 'buy-button';
                buyButton.addEventListener('click', function() {
                    updateHouseStatus(house.houseId, 1);
                });
                // 将购买按钮添加到房屋信息元素中
                houseCard.appendChild(buyButton);

                houseListContainer.appendChild(houseCard);
            }).catch(error => {
                houseCard.innerHTML = `
                        <h3>${house.location}</h3>
                        <p>户型: ${house.houseType}</p>
                        <p>楼层: ${house.floor}</p>
                        <p>面积: ${house.square}平方米</p>
                        <p>价格: ${house.price}万元</p>
                        <p>建造时间: ${house.yearBuilt}</p>
                        <p>房东: ${house.propertyOwner}</p>
                        <p>房东电话: ${house.pOwnerPhone}</p>
                    `;

                // 创建购买按钮
                const buyButton = document.createElement('button');
                buyButton.textContent = '购买';
                buyButton.className = 'buy-button';
                buyButton.addEventListener('click', function() {
                    updateHouseStatus(house.houseId);
                });
                // 将购买按钮添加到房屋信息元素中
                houseCard.appendChild(buyButton);

                houseListContainer.appendChild(houseCard);
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

    function updateHouseStatus(houseId) {
        axios.post('/house/update-status/' + houseId)
            .then(function(response) {
                console.log(response);
                alert('House status updated successfully');
                // 可能需要重新加载页面或更新状态
            })
            .catch(function(error) {
                console.error('Error updating house status:', error);
                alert('Failed to update house status');
            });
    }
});
