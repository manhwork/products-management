module.exports = (req) => {
    let statusFilter = [
        {
            name: 'Tất cả',
            status: "",
            class: ""
        },
        {
            name: 'Hoạt động',
            status: 'active',
            class: ""
        },
        {
            name: 'Dừng hoạt động',
            status: 'inactive',
            class: ""
        }
    ];

    if (req.query.status) {
        for (let i = 0; i < statusFilter.length; i++) {
            if (statusFilter[i].status === req.query.status) {
                statusFilter[i].class = 'active';
                break;
            }
        }
    }
    else {
        statusFilter[0].class = 'active';
    }

    return statusFilter;
}