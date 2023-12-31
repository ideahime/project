
var $;
var $form;
var form;
layui.config({
    base:"/js/"
}).use(['form','layer','jquery','upload','laydate'],function () {
    var layer=parent.layer===undefined?layui.layer:parent.layer;
    var laydate=layui.laydate;
    var upload=layui.upload;
    $=layui.jquery;
    form=layui.form;

    laydate.render({
        elem:'#pub_date',
        trigger: 'focus',
        theme: '#23b7e5'
    });
    var photo_path; //上传的文件名
    //普通图片上传
    var uploadInst = upload.render({
        elem: '#test2'
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








    form.on("submit(addNewBook)",function (data) {
        var index=top.layer.msg('数据提交中，请稍候。',{icon:16,time:false,shade:0.8});
        var msg;


        $.ajax({
            type: "post",
            url:ctx+"/book/addNewBook",
            data:data.field,
            dataType:"json",
            success:function (d) {
                if(d.code==0)
                {
                    msg="添加成功!";
                }
                else
                {
                    msg=d.msg;
                }
            },
            error:function (jqXHR, textStatus, errorThrown) {
                layer.alert("获取数据失败! 先检查sql 及 Tomcat Localhost Log 的输出");
            }


        });

        setTimeout(function () {
            top.layer.msg(msg);
            top.layer.close(index);
            layer.closeAll("iframe");
            setTimeout(function () {  //添加一个 延时 否则接着刷新 看不到提示的信息
                //刷新父页面
                top.location.reload();
            },1000);
        },2000);  //在点击提交后2秒执行 setTimeout中的function函数

        return false;
    })
});


