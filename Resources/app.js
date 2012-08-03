/**
 * Sample Titanium app demonstrating the usage of the Badge module.
 * 
 * NOTE: This app is rather complex for its purpose due to simulating custom tab navigation.
 *       For an easier understanding of Badge module usage, please refer to the documentation
 *       in the header comments of file Badge.js .
 */

var mainWin = Ti.UI.createWindow({
	backgroundColor : '#68a'
});
var label1 = Ti.UI.createLabel({
	top : 10, height : 25, left : 0, right : 0, color : '#fff', textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	text : 'DEMO', font:{fontSize:20, fontFamily:'Helvetica Neue', fontWeight:'bold'},
	shadowOffset : {x:-1, y:-1}, shadowColor : '#222'
});
var label2 = Ti.UI.createLabel({
	top : 38, height : 20, left : 0, right : 0, color : '#fff', textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	text : 'of the', font:{fontSize:15, fontFamily:'Helvetica Neue', fontWeight:'bold', fontStyle:'italic'},
	shadowOffset : {x:-1, y:-1}, shadowColor : '#222'
});
var label3 = Ti.UI.createLabel({
	top : 52, height : 46, left : 0, right : 0, color : '#fff', textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	text : 'Badge Module', font:{fontSize:32, fontFamily:'Helvetica Neue', fontWeight:'bold'},
	shadowOffset : {x:-1, y:-1}, shadowColor : '#222'
});
var label4 = Ti.UI.createLabel({
	top : 112, height : 40, left : 0, right : 0, color : '#fff', textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	text : 'Configure: Color, Size, and Shape\nToggle: Border and Shading',
	font:{fontSize:13, fontFamily:'Helvetica Neue', fontWeight:'bold', fontStyle:'italic'}
});
mainWin.add(label1);
mainWin.add(label2);
mainWin.add(label3);
mainWin.add(label4);

var clearValuesButton = Ti.UI.createButton({
	top : 205, height : 40, width : 250,
	title : 'Clear Badges'
});
clearValuesButton.addEventListener('click', function(e) {
	badge0.clear();
	badge1.clear();
	badge2.clear();
	badge3.clear();
	badge4.clear();
});
var changeValuesButton = Ti.UI.createButton({
	top : clearValuesButton.top + 80, height : 40, width : 250,
	title : 'Change Values'
});
var numClicks = 0;
var badge0Values = [1, null, 27, 300];
var badge1Values = [null, 4, 13];
var badge2Values = [1, 50, 2, 16, 8, 320, 7, 349876];
var badge3Values = [null, 2, 40, 3];
var badge4Values = [7, 212, null, 12, null];
changeValuesButton.addEventListener('click', function(e) {
	++numClicks;
	badge0.applyValue(badge0Values[numClicks % badge0Values.length]);
	badge1.applyValue(badge1Values[numClicks % badge1Values.length]);
	badge2.applyValue(badge2Values[numClicks % badge2Values.length]);
	badge3.applyValue(badge3Values[numClicks % badge3Values.length]);
	badge4.applyValue(badge4Values[numClicks % badge4Values.length]);
});
mainWin.add(clearValuesButton);
mainWin.add(changeValuesButton);

tabColor = '#111',
tabActiveColor = '#333',
tabTextColor = '#999';
tabActiveTextColor = '#fff';
// tabMiddleColor = '#383',
// tabMiddleActiveColor = '#4a4',
// tabMiddleTextColor = '#bdb';
// tabMiddleActiveTextColor = '#fff';
tabMiddleColor = tabColor,
tabMiddleActiveColor = tabActiveColor,
tabMiddleTextColor = tabTextColor;
tabMiddleActiveTextColor = tabActiveTextColor;

var midPointHorz = Ti.Platform.displayCaps.platformWidth / 2;
var tabMiddleWidth = 80;
var activeTabIndex = 0;

// Create some fake tabs.
var fakeTab0 = Ti.UI.createView({
	left : 1, width : (midPointHorz-tabMiddleWidth/2)-2, bottom : 1, height : 40,
	backgroundColor : tabColor
});
var tab0Label = Ti.UI.createLabel({
	left : 0, right : 0, top : 20, bottom : 0,
	font : {fontSize:12, fontWeight:'bold'},
	color : tabTextColor,	text : 'Tab', textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
});
fakeTab0.add(tab0Label);
var fakeTab1 = Ti.UI.createView({
	left : midPointHorz-tabMiddleWidth/2, right : midPointHorz-tabMiddleWidth/2, bottom : 1, height : 50,
	borderRadius : 4,
	backgroundColor : tabMiddleColor
});
var tab1Label = Ti.UI.createLabel({
	left : 0, right : 0, top : 0, bottom : 0,
	font : {fontSize:28, fontWeight:'bold'},
	color : tabMiddleTextColor,	text : '*', textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
});
fakeTab1.add(tab1Label);
var fakeTab2 = Ti.UI.createView({
	right : 1, width : (midPointHorz-tabMiddleWidth/2)-2, bottom : 1, height : 40,
	backgroundColor : tabColor
});
var tab2Label = Ti.UI.createLabel({
	left : 0, right : 0, top : 20, bottom : 0,
	font : {fontSize:12, fontWeight:'bold'},
	color : tabTextColor, text : 'Tab', textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
});
fakeTab2.add(tab2Label);

// Handle tab clicks.
fakeTab0.addEventListener('click', function(e) {
	(activeTabIndex !== 0) && activateTab(0);
});
fakeTab1.addEventListener('click', function(e) {
	(activeTabIndex !== 1) && activateTab(1);
});
fakeTab2.addEventListener('click', function(e) {
	(activeTabIndex !== 2) && activateTab(2);
});

// Set tab state.
var activateTab = function(index) {
	activeTabIndex = index;
	if (activeTabIndex === 0) {
		fakeTab0.backgroundColor = tabActiveColor;
		tab0Label.color = tabActiveTextColor;
		fakeTab1.backgroundColor = tabMiddleColor;
		tab1Label.color = tabMiddleTextColor;
		fakeTab2.backgroundColor = tabColor;
		tab2Label.color = tabTextColor;
	} else if (activeTabIndex === 1) {
		fakeTab0.backgroundColor = tabColor;
		tab0Label.color = tabTextColor;
		fakeTab1.backgroundColor = tabMiddleActiveColor;
		tab1Label.color = tabMiddleActiveTextColor;
		fakeTab2.backgroundColor = tabColor;
		tab2Label.color = tabTextColor;
	} else {
		fakeTab0.backgroundColor = tabColor;
		tab0Label.color = tabTextColor;
		fakeTab1.backgroundColor = tabMiddleColor;
		tab1Label.color = tabMiddleTextColor;
		fakeTab2.backgroundColor = tabActiveColor;
		tab2Label.color = tabActiveTextColor;
	}
};

var tabBg = Ti.UI.createView({
	left : 0, right : 0, bottom : 0, height : 42,
	backgroundColor : '#777'
});
mainWin.add(tabBg);
mainWin.add(fakeTab0);
mainWin.add(fakeTab2);
mainWin.add(fakeTab1);

// Create some badges.
var Badge = require('Badge');
var badge0 = new Badge.Badge({
	size : Badge.size.TAB,
	right : 2,
	top : 2
});
var badge1 = new Badge.Badge({
	value : 7,
	size : Badge.size.TAB,
	color : Badge.color.BLUE,
	shape : Badge.shape.SQUARE,
	useBorder : false,
	right : 2,
	bottom : 2
});
var badge2 = new Badge.Badge({
	value : 22,
	size : Badge.size.TAB,
	color : Badge.color.GREEN,
	useBorder : false,
	useShading : false,
	right : 2,
	top : 2
});
var badge3 = new Badge.Badge({
	size : Badge.size.BIG,
	color : Badge.color.GREEN,
	top : clearValuesButton.top + 5,
	left : midPointHorz - (clearValuesButton.width/2) - 10
});
var badge4 = new Badge.Badge({
	size : Badge.size.APP,
	color : Badge.color.YELLOW,
	shape : Badge.shape.SQUARE,
	useBorder : false,
	useShading : false,
	top : changeValuesButton.top - 10,
	left : midPointHorz + (changeValuesButton.width/2) - 10
});
badge0.attachToView(fakeTab0);
badge1.attachToView(fakeTab1);
badge2.attachToView(fakeTab2);
badge3.attachToView(mainWin);
badge4.attachToView(mainWin);
badge0.applyValue(6);
badge2.applyValue(8);
badge3.applyValue(7);

activateTab(0);
mainWin.open();
