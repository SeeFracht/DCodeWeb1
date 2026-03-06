document.addEventListener('DOMContentLoaded', function() {
    // 解析URL查询参数
    const queryParams = new URLSearchParams(window.location.search);

    // 获取用户数据
    const houseId = queryParams.get('houseId');
    const location = queryParams.get('location');
    const houseType = queryParams.get('houseType');
    const floor = parseInt(queryParams.get('floor'), 10);
    const square = parseFloat(queryParams.get('square'));
    const price = parseFloat(queryParams.get('price'));
    const yearBuilt = parseInt(queryParams.get('yearBuilt'), 10);
    const status = parseInt(queryParams.get('status'), 10);
    const propertyOwner = queryParams.get('propertyOwner');
    const pOwnerPhone = queryParams.get('pOwnerPhone');

    console.log("houseId: " + houseId);

    // 填充数据到输入框
    document.getElementById('location').value = location;
    document.getElementById('houseType').value = houseType;
    document.getElementById('floor').value = floor;
    document.getElementById('square').value = square;
    document.getElementById('price').value = price;
    document.getElementById('yearBuilt').value = yearBuilt;
    document.getElementById('status').value = status;
    document.getElementById('propertyOwner').value = propertyOwner;
    document.getElementById('pOwnerPhone').value = pOwnerPhone;

    document.getElementById('editHouseForm').addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为

        const houseData = {
            houseId: houseId,
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
        console.log(houseData);

        axios.post('/house/update', houseData)
            .then(function(response) {
                console.log(response);
                alert('House updated successfully');
                // 可能需要重定向到房源列表或其他页面
            })
            .catch(function(error) {
                console.error('Error updating house:', error);
                alert('Failed to update house');
            });
    });
});
