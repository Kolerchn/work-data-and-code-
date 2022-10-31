var commonMixin = {
    data: {
        menuArray: [
            {
                id: 1,
                name: "Home",
                url: "./home.html"
            },
            {
                id: 2,
                name: "Rank",
                url: "./report.html"
            }
        ]
    },
    methods: {
        getMenuClass: function(menu) {
            var className = "menu-item";
            if (menu.name == this.active) {
                className += " " + "menu-item-active";
            }
            return className;
        },
        menuClick: function(url) {
            location.href = url;
        }
    }
}