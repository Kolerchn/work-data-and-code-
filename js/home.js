var vueModel = new Vue({
    mixins: [commonMixin],
    data: {
        ratio: 1,
        active: "Home",
        play: false, //游戏是否开始
        result: false, //游戏是否有结果
        activeMode: {},
        validateTime: 100, //验证游戏状态（默认300毫秒）
        modeArray: [
            {
                name: "Easy",
                speed: 3, //速度为3秒
            },
            {
                name: "Hard",
                speed: 2 //速度为2秒
            }
        ],
        playForm: { //记录游戏结果
            userName: "",
            mode: "",
            score: 0, //得分
            clickNum: 0, //点击次数
            startTime: 0, //游戏开始时间
            endTime: 0, //游戏结束时间
            remainTime: 0 //反应时间总和
        },
        ballStartTime: 0,
        resultArray: [],
        ballSize: 40, //小球的尺寸（像素）
        screenLeft: 0,
        screenTop: 0,
        screenWidth: 0, //屏幕的宽度（像素）
        screenHeight: 0 //屏幕的高度（像素）
    },
    methods: {
        initial: function() {
            this.play = false;
            this.result = false;
            this.activeMode = {};
            this.playForm.userName = "";
            this.playForm.mode = "";
            this.playForm.score = 0;
            this.playForm.clickNum = 0;
            this.playForm.correctNum = 0;
            this.playForm.startTime = 0;
            this.playForm.endTime = 0;
            this.playForm.remainTime = 0;
            $(".score-notify").remove();
            $(".ball").remove();
        },
        modeSelect: function(modeItem) {
            this.activeMode = modeItem;
            this.playForm.mode = modeItem.name;
            $("#" + modeItem.name).animate({
                fontSize: "240px",
                opacity: 0.1
            }, 1000);
            setTimeout(() => {
                this.play = true;
                this.playForm.startTime = (new Date()).getTime();
                this.ballStart();
            }, 1000);
        },
        ballStart: function() { //发射小球
            if (this.play == true && this.result == false) {
                this.ballStartTime = (new Date()).getTime();
                var isLeft = Math.random() < 0.5 ? true : false; //判断是从左出现，还是从上出现
                var domID = (new Date()).getTime();
                if (isLeft) { //从左出现
                    var startTop = parseInt(Math.random() * (this.screenHeight - this.ballSize));
                    if (startTop < 6) {
                        startTop = 6;
                    }
                    //var endTop = parseInt(this.ballSize + Math.random() * (this.screenHeight - this.ballSize * 2));
                    var endTop = startTop;
                    //创建小球
                    $("#app").after("<div id='" + domID + "' class='ball' data-type='ball' style='top: " + (this.screenTop * 2 + startTop) + "px; left: " + (this.screenLeft - 0) + "px; width: " + this.ballSize + "px; height: " + this.ballSize + "px; line-height: " + this.ballSize + "px;'></div>");
                    //$(".section-play").html("<div id='" + domID + "' class='ball' data-type='ball' style='top: " + startTop + "px; left: " + (0 - this.ballSize) + "px; width: " + this.ballSize + "px; height: " + this.ballSize + "px; line-height: " + this.ballSize + "px;'></div>");
                    //定时移除
                    setTimeout(() => {
                        $("#" + domID).remove();
                    }, this.activeMode.speed * 1000);
                    //小球移动
                    $("#" + domID).animate({ left: (this.screenWidth + this.screenLeft) + "px", top: (this.screenTop * 2 + endTop) + "px"}, this.activeMode.speed * 1000, "linear");
                }
                else { //从上出现
                    var startLeft = parseInt(Math.random() * (this.screenWidth - this.ballSize) - 6);
                    if (startLeft < 6) {
                        startLeft = 6;
                    }
                    //var endLeft = parseInt(this.ballSize + Math.random() * (this.screenWidth - this.ballSize * 2));
                    var endLeft = startLeft;
                    //创建小球
                    $("#app").after("<div id='" + domID + "' class='ball' data-type='ball' style='left: " + (startLeft + this.screenLeft) + "px; top: " + (this.screenTop * 2 - 0) + "px; width: " + this.ballSize + "px; height: " + this.ballSize + "px; line-height: " + this.ballSize + "px;'></div>");
                    //$(".section-play").html("<div id='" + domID + "' class='ball' data-type='ball' style='left: " + startLeft + "px; top: " + (0 - this.ballSize) + "px; width: " + this.ballSize + "px; height: " + this.ballSize + "px; line-height: " + this.ballSize + "px;'></div>");
                    //定时移除
                    setTimeout(() => {
                        $("#" + domID).remove();
                    }, this.activeMode.speed * 1000);
                    //小球移动
                    $("#" + domID).animate({ left: (endLeft + this.screenLeft) + "px", top: (this.screenHeight + this.screenTop * 2) + "px"}, parseInt(this.activeMode.speed * 1000 / this.ratio), "linear");
                }
            }
        },
        dataSave: function() {
            var dataArray = [];
            if (localStorage["dataArray"] && localStorage["dataArray"] != "null") {
                dataArray = JSON.parse(localStorage["dataArray"]);
            }
            dataArray.push(this.playForm);
            localStorage["dataArray"] = JSON.stringify(dataArray);
            this.initial();
        }
    },
    created: function() {
        this.screenLeft = document.documentElement.clientWidth * 0.05;
        this.screenTop = document.documentElement.clientHeight * 0.1;
        this.screenWidth = document.documentElement.clientWidth * 0.9;
        this.screenHeight = document.documentElement.clientHeight * 0.7;
        this.ratio = this.screenWidth / this.screenHeight;
        setInterval(() => { //判定游戏结束 / 清除提示
            if (this.play && !this.result) {
                var currentTime = (new Date()).getTime();
                if (currentTime - this.ballStartTime > this.activeMode.speed * 1000) { //判定间隔大于speed，则证明此次失败，游戏结束
                    this.playForm.endTime = (new Date()).getTime();
                    this.play = false;
                    this.result  = true;
                    $(".score-notify").remove();
                    $(".ball").remove();
                }
            }
            var currentTime = (new Date()).getTime();
            var notifys = $(".score-notify");
            for (var i = 0; i < notifys.length; i++) {
                var startTime = $(notifys[i]).data("time");
                if (currentTime - startTime > 1000) {
                    $(notifys[i]).remove();
                }
            }
        }, this.validateTime);
    }
}).$mount("#app");

$(document).on("mouseover", e => {
    // 游戏开启
    if (vueModel.play && !vueModel.result) {
        vueModel.playForm.clickNum++;
        //击中小球
        if ($(e.target).data("type") == "ball") {
            //记录反应时间
            vueModel.playForm.remainTime += ((new Date()).getTime() - vueModel.ballStartTime);
            //清空之前的得分提示
            $(".score-notify").remove();
            //当前得分+1
            vueModel.playForm.score++;
            //清除当前小球
            $(e.target).remove();
            //在当前位置显示得分提示
            $(document.body).append("<div class='score-notify' style='top: " + e.pageY + "px; left: " + e.pageX + "px;' data-time='" + (new Date()).getTime() + "'>+1</div>"); 
            //继续发射小球
            vueModel.ballStart();
        }
    }
});