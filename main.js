const { Validation } = require("./validation");

function validate(payload) {
    const msg = Validation.validateForm(payload, [
        {
            field: 'title',
            message: 'Tiêu đề',
        },
        {
            field: 'description',
            message: 'Mô tả',
        },
        {
            field: 'images',
            message: 'Hình ảnh',
        },
        {
            field: 'email',
            message: 'Hình ảnh',
            require: false, // mặc định là true, nếu false thì: nếu có dữ liệu thì thực hiện validate, không có dữ liệu thì bỏ qua
            validate: "email", // phone, email, url, username, youtube, map
        },
        {
            field: 'subEmail',
            message: 'Hình ảnh',
            validate: "email", // phone, email, url, username, youtube, map
        },
    ]);

    return msg;
}

function test() {
    const payload = {
        title: "   ",
        description: "description",
        images: ["image.jpg", "image1.png"],
        email: "email@gmail.com",
        subEmail: "emaicom",
        phone: "0998987767",
    }
    const err = validate(payload)
    if (err) {
        console.log("Lỗi: ", err)
    } else {
        console.log("Không có lỗi")
    }
}

test()

// Example Cancellation axios
// Cancellation.cancelLastRequest('ListUsers')
// let response = await axios({
//     method: 'GET',
//     url: api.ListUsers,
//     params: options,
//     cancelToken: Cancellation.getToken('ListUsers'),
// })