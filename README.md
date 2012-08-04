# Badge

### _A CommonJS module for Titanium mobile applications._

This module provides the ability to create application badges for use across iOS, Android, and MobileWeb. The default configuration visually mimics the iOS badge, but the styling can be configured further if desired.

- This [Screen Capture](http://www.screencast.com/t/w9thj67Ei) shows a sample app using the `Badge` module.

#### Application Usage

This module is a CommonJS file, so we load it with `require()`.
```javascript
// Load the module.
var Badge = require('Badge');
```

Create a new badge and attach it to the `View` for which it is associated.  
_(By default, it will visually resemble the standard red iOS tab-sized badge.)_
```javascript
// Create a badge and attach it to a fake Tab View.
var badge1 = new Badge.Badge();
badge1.attachToView(fakeTab1);
```

To interact with the badge, simply call `applyValue()` and `clear()`.
```javascript
// Give the badge a number to show. The width will automatically resize as needed for larger numbers.
badge1.applyValue(8);

// Clear the badge, thus hiding it.
badge1.clear();
```

#### Application Usage - _A more stylized example_
```javascript
// Create a larger rectangular badge that is green with no border or gradient.
// Place it at the upper right corner of the associated view.
var badge2 = new Badge.Badge({
	top : 5,
	right : 5,
	size : Badge.size.APP,
	shape : Badge.shape.SQUARE,
	color : Badge.color.GREEN,
	useBorder : false,
	userShading : false
});
badge2.attachToView(fakeTab2);

// Set a badge value.
badge2.applyValue(23); 
```

#### _Please NOTE:_
_Your application should be using Titanium 2.1.0 or newer to take advantage of gradient shading for Android applications._