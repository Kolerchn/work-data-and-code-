new Vue({
    mixins: [commonMixin],
    data: {
        active: "Report",
        dataArray: [],
        easyArray: [],
        hardArray: [],
        isReport: false, //报表显示（false代表表格显示）
        activeMode: "Easy",
        activeType: "Table",
        chartObj: null
    },
    methods: {
        reportSwitch: function (isReport) {
            this.isReport = isReport;
        },
        getActiveClass: function (oldValue, newValue) {
            var className = "report-title-item";
            if (oldValue == newValue) {
                className = "report-title-item-active";
            }
            return className;
        },
        modeClick: function (value) {
            this.activeMode = value;
            if (this.activeType == "Chart") {
                this.repaintChart();
            }
        },
        typeClick: function (value) {
            this.activeType = value;
            if (this.activeType == "Chart") {
                this.repaintChart();
            }
        },
        dateHandler: function (unixTime) {
            var dateObj = new Date(unixTime);
            return dateObj.getFullYear() + "-" + ((dateObj.getMonth() + 1) >= 10 ? (dateObj.getMonth() + 1) : "0" + (dateObj.getMonth() + 1)) + "-" + (dateObj.getDate() >= 10 ? dateObj.getDate() : "0" + dateObj.getDate()) + " " + (dateObj.getHours() >= 10 ? dateObj.getHours() : "0" + dateObj.getHours()) + ":" + (dateObj.getMinutes() >= 10 ? dateObj.getMinutes() : "0" + dateObj.getMinutes()) + ":" + (dateObj.getSeconds() >= 10 ? dateObj.getSeconds() : "0" + dateObj.getSeconds());
        },
        repaintChart: function () {
            var nameArray = [];
            var scoreArray = [];
            var clickArray = [];
            if (this.activeMode == "Easy") {
                for (var i = 0; i < this.easyArray.length; i++) {
                    nameArray.push(this.easyArray[i].userName);
                    scoreArray.push(this.easyArray[i].score);
                    clickArray.push((this.easyArray[i].score > 0 ? (this.easyArray[i].remainTime / this.easyArray[i].score).toFixed(0) : 0) / 1000);
                }
            }
            else if (this.activeMode == "Hard") {
                for (var i = 0; i < this.hardArray.length; i++) {
                    nameArray.push(this.hardArray[i].userName);
                    scoreArray.push(this.hardArray[i].score);
                    clickArray.push((this.hardArray[i].score > 0 ? (this.hardArray[i].remainTime / this.hardArray[i].score).toFixed(0) : 0) / 1000);
                }
            }
            var option = {
                legend: {},
                xAxis: {
                    type: 'category',
                    data: nameArray
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: "score",
                        data: scoreArray,
                        type: 'bar'
                    },
                    {
                        name: "reaction(s)",
                        data: clickArray,
                        type: 'bar'
                    }
                ],                
                tooltip: {
                    show: true
                }
            }
            this.chartObj.setOption(option);
        }
    },
    created: function () {
        if (localStorage["dataArray"] && localStorage["dataArray"] != "null") {
            this.dataArray = JSON.parse(localStorage["dataArray"]);
        }
        //将原始数据分成Easy / Hard两个数组
        var easyArray = [];
        var hardArray = [];
        for (var i = 0; i < this.dataArray.length; i++) {
            if (this.dataArray[i].mode == "Easy") {
                easyArray.push(this.dataArray[i]);
            }
            else if (this.dataArray[i].mode == "Hard") {
                hardArray.push(this.dataArray[i]);
            }
        }
        //每个数组进行倒序
        for (var i = 0; i < easyArray.length - 1; i++) {
            for (var j = i + 1; j < easyArray.length; j++) {
                if (easyArray[i].score < easyArray[j].score) {
                    var tempObj = easyArray[i];
                    easyArray[i] = easyArray[j];
                    easyArray[j] = tempObj;
                }
            }
        }
        for (var i = 0; i < hardArray.length - 1; i++) {
            for (var j = i + 1; j < hardArray.length; j++) {
                if (hardArray[i].score < hardArray[j].score) {
                    var tempObj = hardArray[i];
                    hardArray[i] = hardArray[j];
                    hardArray[j] = tempObj;
                }
            }
        }
        //数据绑定
        this.easyArray = easyArray;
        this.hardArray = hardArray;
    },
    mounted: function() {
        this.chartObj = echarts.init(document.getElementById('report-chart'));
    }
}).$mount("#app");