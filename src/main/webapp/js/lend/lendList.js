
layui.use(['form','jquery','table','laydate'],function () {
    var layer=layui.layer;
    var $=layui.jquery;
    var form=layui.form;
    var table=layui.table;
    var laydate=layui.laydate;  //时间选择控件
    var nowTime=new Date().valueOf();//valueOf() 方法返回 Date 对象的原始值 如：1576645321921
    var max=null;
    active ={  //定义一个数组 点击查询的时候会用到
        search:function () {  //实际上就是点击查询调用的函数
            //var book_id=$('#book_id');
            //var user_id=$('#user_id');

            var book_id=$('#book_id option:selected');
            var user_id=$('#user_id option:selected');

            /*
            var pub_date_s=$('#pub_date_s');
            var pub_date_e=$('#pub_date_e');
*/

            table.reload('lendList',{
                page:{curr:1},
                where:{
                    //name:name.val(),
                    //author:author.val(),
                    book_id:book_id.val(),
                    user_id:user_id.val()
                    //下面四个也是表格加载的时候的查询条件 在最底层的sql语句中做了 判断
                   // pub_date_s:pub_date_s.val(),
                //    pub_date_e:pub_date_e.val()
                }
            });
        }
    };
    $(".search_btn").click(function () {
        var type=$(this).data('type');//jsp 查询 按钮中  data-type="search" 所以这里var type=search
        active[type] ? active[type].call(this) : ''; //查看active中有没有 search数组 有的话就调用其函数
    });


//下面四个时间选择器 改的很简单就是 后面的不能比前面的小就行了
    var pub_date_s=laydate.render({
        elem:'#pub_date_s',//指定元素 选择后赋值
        type:'datetime',//可选择：年、月、日、时、分、秒
        max:  nowTime, //最大选择 当前时间
        done:function (value,date) {  //控件选择完毕后的回调
            // value 得到日期生成的值，如：2017-08-18
            //date 得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            //  endMax=createTimeE.config.max; //不知何用
            pub_date_e.config.min=date; //结束时间最小为 开始时间
            pub_date_e.config.min.month=date.month-1; //如果没有那么 createTimeE只能从下一个月开始选择
        }
    });
    var pub_date_e=laydate.render({
        elem:'#pub_date_e',
        type:'datetime',
        max:nowTime,
        done:function (value,date) {

            if ($.trim(value) == '') //trim是去掉value两端的空格 //如果我们 点击清空以后 创造当前时间 不然createTimeS无法选择
            {
                var curDate = new Date();
                date = {//如果为空 就是没有选择 就用当前时间 加一个月
                    'date': curDate.getDate(),
                    'month': curDate.getMonth() + 1,
                    'year': curDate.getFullYear()
                };

                pub_date_s.config.max = date; //如果先选定了结束时间 那么开始时间最大就是结束时间
                pub_date_s.config.max.month = date.month - 1;
            }
        }
    });


    table.render({
        id:'lendList',
        elem:'#lendList',
        url:ctx+ "/lend/getAllLendList",
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




    table.on('tool(lendList)',function (obj) {
        var data=obj.data;
        if(obj.event==='delete')
        {
            layer.confirm('确定要删除么？',function (index) {
                $.ajax({
                    url:ctx+"/lend/deleteLendById",
                    type:"POST",
                    data:{"ser_num":data.ser_num},
                    success:function (d) {
                        if(d.code==0)
                        {
                            layer.msg("删除成功",{icon:1});
                            obj.del();//下面没有重新加载table
                            // 这里删除了不会自动刷新 但页面中 这一项没有了
                        }
                        else
                        {
                            layer.msg("权限不足，删除失败",{icon:5});
                        }
                    },
                    error:function () {
                        layer.msg("删除失败，检查sql及输出",{icon:5});
                    }
                })
                layer.close(index);
            });
        }
        else if(obj.event=='edit')
        {
            var editIndex=top.layer.open({
                type:2,
                title:"修改借阅信息",
                area:['450px','600px'],
                content:ctx+"/lend/editLend/"+data.ser_num //controller中只是跳转jsp 所以这里不用success判断
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
