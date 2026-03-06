document.addEventListener('DOMContentLoaded', function() {
    const collapsibleButton = document.querySelector('.collapsible-button');
    const collapsibleContent = document.querySelector('.collapsible-content');

    // 在 DOMContentLoaded 后获取热门房源
    fetchHotHouses();

    function fetchHotHouses() {
        axios.get('/house/hot')
            .then(function(response) {
                const hotLocations = response.data;
                console.log("hotLocations: ", hotLocations);
                updateCollapsibleContent(hotLocations);
            })
            .catch(function(error) {
                console.error('Error fetching hot houses:', error);
            });
    }

    function updateCollapsibleContent(hotLocations) {
        collapsibleContent.innerHTML = ''; // 清空现有内容

        // 使用 forEach 循环遍历 hotLocations 数组
        hotLocations.forEach((location, index) => {
            const p = document.createElement('p');
            // 检查是否是数组的最后一个元素
            if (index === hotLocations.length - 1) {
                p.textContent = location; // 最后一个元素后面不加分号
            } else {
                p.textContent = location + '；'; // 其他元素后面加分号
            }
            collapsibleContent.appendChild(p);
        });
    }

    // 鼠标悬停时展开
    collapsibleButton.addEventListener('mouseover', function() {
        collapsibleContent.classList.add('expanded');
    });

    // 鼠标离开时折叠
    collapsibleButton.addEventListener('mouseout', function() {
        collapsibleContent.classList.remove('expanded');
    });
});
