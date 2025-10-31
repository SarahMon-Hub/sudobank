$(window).scroll(function () {
	if ($(window).scrollTop() > 70) {
		$(".hgapp_menu").addClass("hgapp_menu_bg").addClass("top");
	} else if ($(window).scrollTop() < 70) {
		$(".hgapp_menu").removeClass("hgapp_menu_bg").removeClass("top");
	}

	var win_h = $(window).height();
	var menu_h = Math.round(win_h / 2);

	if ($('.mb_menu').is(":visible")) {
		if ($(window).scrollTop() > menu_h) {
			$(".mb_menu").slideUp();
		}
	}
	if ($('.mb_menu').is(":hidden")) {
		$(".mb_menu_btn_open").click(
			function () {
				$(".mb_menu").slideDown();
			}
		);
	}
})
//menu
$(".mb_menu_btn_open").click(
	function () {
		$(".mb_menu").slideDown();
	}
);
$("#mb_menu_btn_close").click(
	function () {
		$(".mb_menu").slideUp();
	}
);