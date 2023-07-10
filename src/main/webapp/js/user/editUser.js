
layui.use([ 'form','layer','upload','jquery','table','laydate'], function() {
    var layer = layui.layer, $ = layui.jquery, form = layui.form, table = layui.table, laydate = layui.laydate;
    var upload=layui.upload;
    /*
    laydate.render({
        elem: '#birthday'
    });

    laydate.render({
        elem:'#createTime',
        type:'datetime',//可选择：年、月、日、时、分、秒
    });
*/

    //普通图片上传
    var uploadInst = upload.render({
        elem: '#test1'
        ,url:ctx+ "/user/image"
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            //如果上传失败
            if(res.code >0)
            {
                return layer.msg('上传失败');
            }
            //上传成功
            else
            {
                $("#photo_path").val(res.data.src); //提交时注册的时候用 写入数据库
                // layer.msg('上传成功'+photo_path);
                layer.msg('上传成功');
            }
        }
        ,error: function(){
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
    });




    form.on("submit(updateUser)",function (data) {
        var index=top.layer.msg("数据提交中，请稍候",{icon:16,time:false,shade:0.2});
        // var index1=parent.layer.getFrameIndex(window.name); //这是获得的 学生列表 这个窗口？
        var msg;
        // var flag=false;
        $.ajax({
            type:"post",
            async:false,
            url:ctx+"/user/updateUser",
            data:data.field,  //
            // Student.java 中 birthday属性前必须有
            // @DateTimeFormat(pattern = "yyyy-MM-dd") 很重要 必须加上 不然jsp中
            // 数据类型和这里绑定不了 ajax请求进入不了controller
            //createTime前也要有@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
            dataType:"json",
            success:function (d) {
                if(d.code==0)
                {
                    msg="用户更新成功";
                    // flag=true;
                }
                else
                {
                    msg=d.msg;
                }
            } ,
            error:function () {
                layer.msg("错误，请检查sql及输出",{icon:2});
                // layer.closeAll();
            }
        });
        setTimeout(function () {
            top.layer.close(index);
            top.layer.msg(msg);
            layer.closeAll("iframe");
            setTimeout(function () {  //添加一个 延时 否则接着刷新 看不到提示的信息
                //刷新父页面
                parent.location.reload();
            },1000);
        },2000);
        return false;

    });


});



/*
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
*/




