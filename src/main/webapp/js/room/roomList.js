
layui.use(['form','layer','jquery','laypage','table'],function () {
    var form=layui.form,table=layui.table,
        layer=parent.layer===undefined?layui.layer:parent.layer,
        laypage=layui.laypage;
    $=layui.jquery;
    //数据表格
    table.render({
        id:'roomList',
        elem:'#roomList',
        url:ctx+"/room/getAllRoomList", //数据接口
        cellMinWidth:80,
        limit:10,//每页条数
        limits:[10,20,30,40],
        cols:[[ //表头
            {field:'roomId',title:'ID',sort:true,align:'center',width:120},
            {field:'roomPhoto',width:120,title:'房间图片',align:'center',templet: "#imgtmp"},
            {field:'roomNum',title:'房间编号',width:120,align:'center'},
            {title:'操作',width:220,toolbar:'#barEdit',align:'center'}
        ]],
        page:true
    });
    //监听工具条
    table.on('tool(roomList)',function (obj) {
        var data=obj.data;
        if(obj.event=='del')
        {

            layer.confirm('真的删除吗？',function (index) {
                $.ajax({
                    url:ctx+"/room/delRoom/"+data.roomId,
                    type:"get",
                    success:function (d) {
                        if(d.code==0)
                        {
                            table.reload('roomList',{});//重新发送请求 表格重载
                        }
                        else
                        {
                            layer.msg("此房间有业主，不能删除",{icon:5});
                        }
                    },
                    error:function (jqXHR, textStatus, errorThrown) {
                        layer.alert("获取数据失败! 先检查sql 及 Tomcat Localhost Log 的输出");
                    }
                })
                layer.close(index); //删除上面的确认窗口index是function的参数
            });
        }
        else if(obj.event=='detail')
        {
            layer.open({
                type:2,
                title:"宿舍详情",
                area:['800px','600px'],
                content:ctx+"/room/detailRoom/"+data.roomId
            })
        }
    });
    //添加角色
    $(".roomAdd_btn").click(function () {
        var index=layer.open({
            title:"添加宿舍",
            type:2,
            content:ctx+"/room/addRoom",
            area:['560px','530px']
        });
        //改变窗口大小时 重置窗口的高度 防止超出可视区域 如F12调出debig操作
        $(window).resize(function () {
            layui.layer.full(index);
        })
    });

});