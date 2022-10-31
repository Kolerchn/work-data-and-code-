$(".start-icon").click(function() {
    $(this).css("transform", "rotate(360deg)");
    setTimeout(() => {
        location.href = "./home.html";
    }, 1000);
});