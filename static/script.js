(function ($) {
	var $container = $('#container');
	var $button = $('#button');
	var $scoreboard = $('#scoreboard');
	var $levelboard = $('#levelboard');
	var $banner = $('div#banner');
	var score = 0, level = 1, speed = 'slow';

	// Disable right-click on document
	$(document).bind("contextmenu", function () {
		// return false;
	});

	// New speeds in $.fx.speeds
	$.fx.speeds.slow = 200;
	$.fx.speeds.medium = 100;
	$.fx.speeds.fast = 50;
	$.fx.speeds.insane = 10;

	// center container/banner text on beginning of game 
	$(window).on('resize', function() {
		centerBanner($banner);
		if (score === 0) centerContainer($container);

	});
	// trigger initial resize when page is opened
	$(window).trigger('resize');

	// initial banner animation
	animateBanner($banner);

	// on button click
	$button.on('mousedown', function() {
		score++;
		$scoreboard.text('Score: ' + score);
		var w = window.innerWidth - $container.outerWidth();
		var h = window.innerHeight - $container.outerHeight();
		$container.animate({
			'left': Math.floor( Math.random() * w ),
			'top': Math.floor( Math.random() * h )
		}, 50);

		animateScoreboard($scoreboard);

		// level change
		if ( (score === 10) || (score === 20) || (score === 30) ) {
			// update level everywhere
			level ++;
			$levelboard.text('Level: ' + level);
			$banner.find('div').text('Level ' + level);

			// animateBanner with every level
			animateBanner($banner, $container);


			if ( score === 10 ) {
				speed = 'medium';
				$levelboard.css({'background': '#FFC90E'});
			} else if ( score === 20 ) {
				speed = 'fast';
				$levelboard.css({'background': 'orange'});
			} else if ( score === 30 ) {
				speed = 'insane';
				$levelboard.css({'background': '#ED1C24'});
			}

			$levelboard.css({
				'-webkit-background-clip': 'content-box',
				'-moz-background-clip': 'content-box',
				'background-clip': 'content-box'
			});
		}
	});

	// trigger movement
	$container[0].addEventListener('mouseover', function (e) {
		if (e.target === $button[0] || e.fromElement === $button[0])
			return; // ignore movement into/from button from/into container

		var mouse = {
			x: e.pageX,
			y: e.pageY
		}
		var button = {
			x: $button.offset().left,
			y: $button.offset().top,
			width: $button.outerWidth(),
			height: $button.outerHeight()
		}
		var container = {
			x: $container.offset().left,
			y: $container.offset().top,
			width: $container.outerWidth(),
			height: $container.outerHeight()
		}

		var dir = getMovementDirection(mouse, container, button);

		// possible values of dir.x = -2 / -1 / 0 / 1 / 2
		var xSign = '+', ySign = '+';

		if (dir.x < 0) { xSign = '-'; dir.x *= -1; }
		if (dir.y < 0) { ySign = '-'; dir.y *= -1; }

		$container.animate({
			'left': xSign + '=' + (dir.x * 100),
			'top': ySign + '=' + (dir.y * 100)
		}, speed, function () {
			if ( isOffScreen($button) ) centerContainer($container);
		});

	}, false);


	function centerBanner (banner) {
		var div = banner.children('div');
		var h = ( banner.outerHeight() - div.height() ) / 2;
		div.css('margin-top', h + 'px');
	}

	function centerContainer(container) {
		container.css({
			'left': (window.innerWidth / 2 - container.outerWidth() / 2) + 'px',
			'top': (window.innerHeight / 2 - container.outerHeight() / 2) + 'px'
		});
	}

	function animateScoreboard ($scoreboard) {
		$scoreboard.animate({
			'box-shadow': '-2px 2px 100px rgba(0,0,0,.3)'
		}, 100).animate({
			'box-shadow': '-2px 2px 10px rgba(0,0,0,.3)'
		}, 500);
	}

	function animateBanner ($banner) {
		$banner.fadeIn(400).delay(1000).fadeOut(400);
	}

	function getMovementDirection (mouse, container, btn) {
		var x, y, dir, w = window.innerWidth, h = window.innerHeight;

		// x, y denote direction in which container needs to move
		if (mouse.x < btn.x) { x = 1; }
		else if (mouse.x < btn.x + btn.width) { x = 0; }
		else { x = -1; }
		if (mouse.y < btn.y)  { y = 1; }
		else if (mouse.y < btn.y + btn.height) { y = 0; }
		else { y = -1; }

		//  to move inside if button moves towards boundary
		if (container.x < 0.1 * w) {
			x = 2;
		} else if (container.x + container.width > 0.8 * w) {
			x = -2;
		}
		if (container.y < 0.1 * h) {
			y = 2;
		} else if (container.y + container.height > 0.8 * h )  {
			y = -2;
		} 

		// randomize movement along X or Y if there is no movement
		// x === 0 && y === 0 is never true
		if ( x === 0 || y == 0) {
			var sign, value;
			sign = Math.floor(Math.random() + 0.5);
			value = Math.floor(Math.random() + 0.5);

			sign === 1 ? sign = '+' : sign = '-';
			value === 1 ? value = '1' : value = '0';

			value = parseInt(sign + value, 10);

			x === 0 ? x = value : y = value;
		}

		return { x: x, y: y };
	}

	function isOffScreen ($button) {
		var btn = {
			x: $button.offset().left,
			y: $button.offset().top,
			w: $button.outerWidth(),
			h: $button.outerHeight()
		}
		var win = {
			w: window.innerWidth,
			h: window.innerHeight
		}

		if ((btn.x+btn.w < 0)||(btn.x > win.w)||(btn.y+btn.h < 0)||(btn.y > win.h))
			return true;
		else
			return false;
	}
})(jQuery);