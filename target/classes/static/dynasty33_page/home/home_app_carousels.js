let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-image');
    const totalSlides = slides.length;

    // 确保索引在有效范围内
    if (index >= totalSlides) {
        currentSlide = 0; // 如果超过最后一张，回到第一张
    } else if (index < 0) {
        currentSlide = totalSlides - 1; // 如果小于第一张，回到最后一张
    } else {
        currentSlide = index; // 更新当前索引
    }

    // 计算偏移量并应用到轮播图
    const offset = -currentSlide * 100; // 每张图片占满100%
    document.querySelector('.carousel-images').style.transform = `translateX(${offset}%)`;
}

function moveSlide(direction) {
    showSlide(currentSlide + direction); // 根据方向移动
}

// 自动播放功能
setInterval(() => {
    moveSlide(1); // 每隔3秒自动切换到下一张
    moveSlideText(1); // 每隔3秒自动切换到下一条
}, 3000);

// 初始化显示第一张幻灯片
showSlide(currentSlide);



// 寻找热门房源
fetchHotHouses();

function fetchHotHouses() {
    axios.get('/house/hot')
        .then(function(response) {
            const hotLocations = response.data;
            console.log("hotLocations: ", hotLocations);
            fetchHotHouseImages(hotLocations);
        })
        .catch(function(error) {
            console.error('Error fetching hot houses:', error);
        });
}

// 获取热门房源的图片
function fetchHotHouseImages(hotLocations) {
    const carouselImagesContainer = document.querySelector('.carousel-images');
    carouselImagesContainer.innerHTML = ''; // 清空现有图片

    // 默认图片的 URL
    const defaultImageUrl = '../../dynasty33_page/home/home_resource/not-find.png';

    hotLocations.forEach(location => {
        axios.get('/house_image/image', {
            params: {
                location: location
            },
            responseType: 'blob' // 指定响应类型为 blob
        }).then(response => {
            // 创建一个 URL 对象，用于图片 src
            const imageUrl = window.URL.createObjectURL(new Blob([response.data]));
            // 创建图片元素并设置 src 属性
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'House Image';
            img.className = 'carousel-image'; // 确保有这个类名以应用样式
            carouselImagesContainer.appendChild(img); // 添加图片到容器
        }).catch(error => {
            console.error('Error fetching image:', error);
            // 如果获取图片失败，使用默认图片
            const img = document.createElement('img');
            img.src = defaultImageUrl; // 设置为默认图片的 URL
            img.alt = 'Image Not Found';
            img.className = 'carousel-image'; // 确保有这个类名以应用样式
            carouselImagesContainer.appendChild(img); // 添加默认图片到容器
        });
    });
}
