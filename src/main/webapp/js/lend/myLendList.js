
layui.use(['form','jquery','table','laydate'],function () {
    var layer=layui.layer;
    var $=layui.jquery;
    var form=layui.form;
    var table=layui.table;
    var laydate=layui.laydate;  //时间选择控件
    var nowTime=new Date().valueOf();//valueOf() 方法返回 Date 对象的原始值 如：1576645321921
    var max=null;


    table.render({
        id:'myLendList',
        elem:'#myLendList',
        url:ctx+ "/lend/getMyLendList",
        limit:10,
        limits:[10,20,30,40],
        cols:[[
            {field:'ser_num',title:'借阅编号',align:'center',width:80},
            {field:'photo_path',title:'图书封面',align:'center',width:110,templet: "#imgtmp"},
            { field: 'name', title : '图书名称', width:120,templet: '<div>{{d.book.name}}</div>'},
            { field: 'realname', title : '借阅人', width:120,templet: '<div>{{d.user.realname}}</div>'},
            {field:'lend_date',title:'借阅时间',align:'center',width:160,
                templet:'<div>{{ formatTime(d.lend_date,"yyyy-MM-dd")}}</div>'},
            {field:'back_date',title:'归还时间',align:'center',width:160,
                templet:'<div>{{ formatTime(d.back_date,"yyyy-MM-dd")}}</div>'},
            {title:'操作',align:'center',width:180,toolbar:"#barDemo"}  //注意！！！！
            // 宽度设置大一点 否则 删除图标显示不出来 然后会出现下拉符号 显示
            // 删除符号 但此时点击就不会有效果了 所以windth设大一点 都显示出来
        ]],
        page:true,
        loading:true

    });




    table.on('tool(myLendList)',function (obj) {
        var data=obj.data;
        if(obj.event=='back')
        {
            layer.confirm('确定要归还么？',function (index) {
                $.ajax({
                    url:ctx+"/lend/backBookById",
                    type:"POST",
                    data:{"ser_num":data.ser_num},
                    success:function (d) {
                        if(d.code==0)
                        {
                            layer.msg("归还成功",{icon:1});
                           // obj.del();//下面没有重新加载table
                            // 这里删除了不会自动刷新 但页面中 这一项没有了
                            table.reload('myLendList');
                        }
                        else
                        {
                            layer.msg("此书已经归还，请不要重复操作",{icon:5});
                        }
                    },
                    error:function () {
                        layer.msg("归还失败，检查sql及输出",{icon:5});
                    }
                })
                layer.close(index);
            });
        }
    })
});

// 格式化时间
function formatTime(datetime, fmt) {
    if (datetime == null || datetime == 0) {
        return "";
    }
    if (parseInt(datetime) == datetime) {
        if (datetime.length == 10) {
            datetime = parseInt(datetime) * 1000;
        } else if (datetime.length == 13) {
            datetime = parseInt(datetime);
        }
    }
    datetime = new Date(datetime);
    var o = {
        "M+" : datetime.getMonth() + 1, // 月份
        "d+" : datetime.getDate(), // 日
        "h+" : datetime.getHours(), // 小时
        "m+" : datetime.getMinutes(), // 分
        "s+" : datetime.getSeconds(), // 秒
        "q+" : Math.floor((datetime.getMonth() + 3) / 3), // 季度
        "S" : datetime.getMilliseconds()
        // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for ( var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1,
                (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
                    .substr(("" + o[k]).length)));
    return fmt;
}
