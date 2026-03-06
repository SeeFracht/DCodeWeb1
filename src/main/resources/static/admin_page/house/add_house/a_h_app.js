document.addEventListener('DOMContentLoaded', function() {
    const addHouseForm = document.getElementById('addHouseForm');

    addHouseForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为

        const houseData = {
            location: document.getElementById('location').value,
            houseType: document.getElementById('houseType').value,
            floor: parseInt(document.getElementById('floor').value, 10),
            square: parseFloat(document.getElementById('square').value),
            price: parseFloat(document.getElementById('price').value),
            yearBuilt: parseInt(document.getElementById('yearBuilt').value, 10),
            status: parseInt(document.getElementById('status').value, 10),
            propertyOwner: document.getElementById('propertyOwner').value,
            pOwnerPhone: document.getElementById('pOwnerPhone').value
        };

        axios.post('/house/add', houseData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function(response) {
                console.log(houseData);
                console.log(response);
                alert('House data added successfully');
                // 可能需要重定向到房源列表或其他页面
            })
            .catch(function(error) {
                console.error('Error adding house:', error);
                alert('Failed to add house data');
            });

        // 获取用户选择的图片文件
        const houseImageFile = document.getElementById('houseImage').files[0];
        // 创建一个 FormData 对象来处理图片文件上传
        const imageFormData = new FormData();
        imageFormData.append('houseImage', houseImageFile);
        // 添加 location 参数
        imageFormData.append('location', document.getElementById('location').value);

        axios.post('/house_image/add', imageFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log(response);
                alert('House image added successfully');
                // 可能需要重定向到房源列表或其他页面，选一个
            })
            .catch(function (error) {
                console.error('Error adding house:', error);
                alert('Failed to add house image');
            })
    });
});
