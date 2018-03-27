bootstrapDataExchange

HTML基础配置参数

    必须在需要获取插件的div上添加自定义参数：
    [DataExchange] 基础属性
    [data-in="id"] 设置初始数据ID
    [data-name="name"] 设置初始数据名称
    如：
    <div id="DataExchange" DataExchange data-in="239,4,217" data-name="便签[必选],内部邮件,图片新闻"></div>
JavaScript基础配置参数

    type  设置插件类型（page/dialog），page 是页面展示效果，dialog 是模态框展示，默认page
    url   获取数据的URL
    title 插件标题
    style 插件样式。选用Bootstrap，最高可用Bootstrap4。默认Bootstrap4
    height 设置插件高度，默认200px

    如:
    $.fn.bootstrapDataExchange({
        type:"page",
        title:"自定义桌面",
        url:`${url}?pos=l`,
        style:"Bootstrap3",
        height:300px
    });
