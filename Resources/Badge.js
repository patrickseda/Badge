/**
 * Provides application badges for use across iOS, Android, and MobileWeb.
 * This can be useful when applications are using custom tab views for navigation
 * or the target platform doesn't provide any native badges.
 * 
 * The default configuration visually mimics the red iOS badge, but the styling
 * can be configured further if desired.
 *
 * Sample usage:
 *     // Load the module.
 *     var Badge = require('Badge');
 * 
 *     // Create a badge, attach it to an existing view called "view1", and set the value to "8".
 *     var badge1 = new Badge.Badge();
 *     badge1.attachToView(view1);
 *     badge1.applyValue(8);
 * 
 *     // Create a stylized badge with the value "17" and attach it to an existing view called "view2".
 *     var badge2 = new Badge.Badge({
 * 	       value : 17,
 *         top : 5,
 *         right : 5,
 *         size : Badge.size.APP,
 *         shape : Badge.shape.SQUARE,
 *         color : Badge.color.GREEN
 *     });
 *     badge2.attachToView(view2);
 * 
 *     // Change a badge value.
 *     badge1.applyValue(5);
 * 
 *     // Clear the badge values.
 *     badge1.clear();
 *     badge2.clear();
 * 
 * 
 * Recognized constructor parameters:
 *     value      - integer  (default = null, thus hidden)
 *     top        - integer  (default = 0)
 *     left       - integer  (default = 0)
 *     bottom     - integer  (Not used if top is present and valid)
 *     right      - integer  (Not used if left is present and valid)
 *     shape      - one of: [Badge.shape.ROUND, Badge.shape.SQUARE]  (default = ROUND)
 *     size       - one of: [Badge.size.TAB, Badge.size.APP, Badge.size.BIG, Badge.size.MAX]  (default = TAB)
 *     color      - one of: [Badge.color.RED, Badge.color.BLUE, Badge.color.GREEN, Badge.color.YELLOW]  (default = RED)
 *     useBorder  - boolean  (default = true)
 *     useShading - boolean  (default = true)
 * 
 * WARNING: Your application should be using Titanium 2.1.0 or newer to take advantage of gradient shading in Android.
 *
 * @author Patrick Seda
 */

// Predefined constants exposed to module users.
exports.size = {
	TAB : 18, // Default - (Similar to the small iOS tab badge size)
	APP : 23, // (Similar to the iOS app icon badge size)
	BIG : 27,
	MAX : 30
};
exports.shape = {
	ROUND : 100, // Default
	SQUARE : 101
};
exports.color = {
	RED : 'RED', // Default
	BLUE : 'BLUE',
	GREEN : 'GREEN',
	YELLOW : 'YELLOW'
};

// Platform identification.
var osname = Ti.Platform.osname;
var isAndroid = (osname === 'android');
var isMobileWeb = (osname === 'mobileweb');
var isIPhone = (osname === 'iphone');
var isIPad = (osname === 'ipad');
var isIOS = exports.isIPhone || exports.isIPad;

// Map to determine the font size from the badge height.
var fontSizeFromHeight;
if (isAndroid) {
	fontSizeFromHeight = {15:10, 16:10, 17:11, 18:11, 19:12, 20:14, 21:14, 22:15, 23:16, 24:16, 25:17, 26:18, 27:19, 28:19, 29:20, 30:21};
} else if (isMobileWeb) {
	fontSizeFromHeight = {15:10, 16:10, 17:11, 18:11, 19:13, 20:14, 21:14, 22:15, 23:16, 24:16, 25:17, 26:18, 27:19, 28:20, 29:21, 30:22};
} else { // iOS
	fontSizeFromHeight = {15:10, 16:10, 17:11, 18:11, 19:12, 20:14, 21:15, 22:16, 23:17, 24:17, 25:17, 26:18, 27:19, 28:19, 29:20, 30:21};
}

// Internal helper functions.
var isInteger = function(val) {
	return !isNaN(parseInt(val)) && isFinite(val);
};
var isPositiveInteger = function(val) {
	return isInteger(val) && val>0;
};
var isValidBadgeValue = function(val) {
	return isInteger(val);
};
var normalizeBadgeHeight = function(height) {
	var result = height;
	if (isPositiveInteger(height)) {
		if (height < 15) {
			result = 15;
		} else if (height > 30) {
			result = 30;
		}
	} else {
		result = exports.TAB;
	}
	return result;
};
var determineWidth = function(value, height) {
	var multiplier = 1.0;
	if ((value < 10) || (value.length === 1)) {
		multiplier = 1.0;
	} else if (value < 100) {
		multiplier = isIOS ? 1.22 : 1.4;
	} else if (value < 1000) {
		multiplier = isIOS ? 1.6 : 1.7;
	} else if (value < 10000) {
		multiplier = isIOS ? 1.9 : 2.1;
	} else if (value < 100000) {
		multiplier = isIOS ? 2.5 : 2.6;
	} else if (value < 1000000) {
		multiplier = isIOS ? 2.8 : 2.9;
	} else if (value < 10000000) {
		multiplier = isIOS ? 3.3 : 3.4;
	} else {
		// Seriously, you need THAT big of a number?
		multiplier = 4.0;
	}
	return multiplier * height;
};

// A map of a color name to its gradient colors.
var colors = {};
colors[exports.color.RED] = ['#faa', '#b00'];
colors[exports.color.BLUE] = ['#aaf', '#11b'];
colors[exports.color.GREEN] = ['#7c7', '#080'];
colors[exports.color.YELLOW] = ['#ffc', '#dd0'];


// Constructor.
exports.Badge = function(params) {
	// The Views.
	var badgeLabel = null,
		badgeView = null,
		badgeHilite = null,
		badgeShadow = null,
		containerView = Ti.UI.createView();
	
	// The configuration.
	var value = 1,
		badgeHeight = exports.size.TAB,
		badgeShape = exports.shape.ROUND,
		useBorder = true,
		useShading = true,
		badgeColors = colors[exports.color.RED],
		top = null,
		left = null,
		bottom = null,
		right = null,
		fontFamily = !isAndroid ? 'Helvetica Neue' : 'Helvetica Neue',
		invertFontColor = false,
		isBadgeYellow = false;
		
	if (params) {
		value = (params.value >= 0) ? parseInt(params.value) : value;
		badgeHeight = params.size || badgeHeight;
		if (isInteger(params.top)) {
			top = params.top;
		} else if (isInteger(params.bottom)) {
			bottom = params.bottom;
		}
		if (isInteger(params.left)) {
			left = params.left;
		} else if (isInteger(params.right)) {
			right = params.right;
		}
		badgeShape = (exports.shape.SQUARE === params.shape) ? exports.shape.SQUARE : exports.shape.ROUND;
		useBorder = (params.useBorder === false) ? false : true;
		useShading = (params.useShading === false) ? false : true;
		var colorGiven = colors[params.color];
		badgeColors = colorGiven ? colorGiven : colors[exports.color.RED];
		badgeHeight = normalizeBadgeHeight(badgeHeight);
		isBadgeYellow = (params.color === exports.color.YELLOW);
		invertFontColor = isBadgeYellow;
	}
	!isInteger(top) && !isInteger(bottom) && (top = 0);
	!isInteger(left) && !isInteger(right) && (left = 0);
	
	var previousWidth = 0;
	var setDimensions = function(value) {
		var width = determineWidth(value, badgeHeight);
		width = useBorder ? width : width-2;
		if (width != previousWidth) {
			badgeView.width = width;
			badgeLabel.width = width;
			badgeHilite.width = width-9;
			badgeShadow.width = width;
			containerView.width = width;
			containerView.height = badgeView.height+3;
			previousWidth = width;
		}
	};
	
	var attachToView = function(view) {
		view && view.add && view.add(containerView);
	};
	var detachFromView = function(view) {
		view && view.remove && view.remove(containerView);
	};
	var fetchValue = function() {
		return badgeLabel.text;
	};
	var applyValue = function(value) {
		var intValue = parseInt(value);
		if (isValidBadgeValue(intValue) && (intValue >= 0)) {
			hide();
			badgeLabel.text = '';
			setDimensions(intValue);
			badgeLabel.text = intValue.toString();
			show();
		} else {
			hide();
			badgeLabel.text = null;
		}
	};
	var clear = function() {
		applyValue(null);
	}
	var show = function() {
		(badgeLabel.text !== null) && (containerView.visible = true);
	};
	var hide = function() {
		containerView.visible = false;
	};
	
	// Create the Views.
	badgeView = Ti.UI.createView({
		height : badgeHeight,
		width : badgeHeight,
		top : 0,
		left : 0,
		borderColor : '#fff',
		borderWidth : (useBorder ? 2 : 0),
		borderRadius : (badgeShape === exports.shape.SQUARE) ? badgeHeight/4 : badgeHeight/2,
		backgroundColor : badgeColors[1]
	});
	useShading && (badgeView.backgroundGradient = {
		type : 'linear',
		colors : badgeColors,
		startPoint : {x:0, y:0},
		endPoint : {x:0, y:badgeHeight*(0.8)},
		backFillStart : false
	});
	badgeLabel = Ti.UI.createLabel({
		text : (value >= 0) ? value.toString() : '',
		height : badgeHeight-1,
		width : badgeHeight,
		top : 0,
		left : 0,
		color : invertFontColor ? '#111' : '#fff',
		font : {fontSize:fontSizeFromHeight[badgeHeight], fontFamily:fontFamily, fontWeight:'bold'},
		textAlign : 'center'
	});
	badgeHilite = Ti.UI.createView({
		height : 2*badgeHeight/5,
		width : badgeHeight,
		top : 2,
		left : 5,
		backgroundColor : '#fff',
		opacity : (isAndroid || isBadgeYellow) ? 0.4 : 0.15,
		borderRadius : badgeHeight/5
	});
	badgeShadow = Ti.UI.createView({
		height : badgeHeight,
		width : badgeHeight,
		top : 3,
		left : 0,
		backgroundColor : '#000',
		opacity : 0.3,
		borderRadius : (badgeShape === exports.shape.SQUARE) ? badgeHeight/4 : badgeHeight/2,
	});
	
	// Assemble and configure the Views.
	setDimensions(value);
	(top !== null) && (containerView.top = top);
	(bottom !== null) && (containerView.bottom = bottom);
	(left !== null) && (containerView.left = left);
	(right !== null) && (containerView.right = right);
	containerView.add(badgeShadow);
	containerView.add(badgeView);
	useShading && containerView.add(badgeHilite);
	containerView.add(badgeLabel);
	params ? applyValue(params.value) : applyValue(null);
	
	// Public API.
	return {
		attachToView : attachToView,
		detachFromView : detachFromView,
		applyValue : applyValue,
		clear : clear,
		value : fetchValue,
		show : show,
		hide : hide
	};
};
