export default {
	init: function() {
		this.initArrayPrototypes();
		this.initElementPrototypes();
		this.initMouseEventPrototypes();
	},
	initArrayPrototypes: function() {
		let p = Array.prototype;
		p.getIndex = function(v) {
			let iv = ~~v, i;
			if (iv == v) {
				i = this.indexOf(iv);
				if (i > -1) return i;
				return this.indexOf(v + '');
			}
			return this.indexOf(v);
		}
		p.has = function(v) {
			return this.getIndex(v) > -1;
		};
		p.hasAny = function(a) {
			if (!(a instanceof Array)) a = arguments;
			for (let i = 0; i < a.length; i++) {
				if (this.has(a[i])) return a[i];
			}
		};
		p.hasExcept = function() {
			let args = Array.prototype.slice.call(arguments);
			for (let i = 0; i < this.length; i++) {
				if (!args.has(this[i])) return true;
			}
		};
		p.removeDuplicates = function() {
			this.filter(function(item, pos, self) {
			    return self.indexOf(item) == pos;
			});
			return this;
		};
		p.getIntersections = function(arr) {
			return this.filter(function(n) {
			    return arr.indexOf(n) != -1;
			});
		};
		p.hasIntersections = function(arr) {
			return typeof this.getIntersections(arr)[0] != 'undefined';
		};
		p.removeIndexes = function(indexes) {
			let deleted = 0;
			for (let i = 0; i < indexes.length; i++) {
				this.splice(indexes[i] - deleted, 1);
				deleted++;
			}
		};
		p.isEmpty = function() {
			return this.length == 0;
		};
		p.removeAt = function(idx) {
			idx = ~~idx;
			if (idx > -1) this.splice(idx, 1);
		};
		p.removeItems = function(items) {
			for (let i = 0; i < items.length; i++) this.removeItem(items[i]);
		};
		p.removeItem = function(item) {
			let idx = this.getIndex(item);
			this.removeAt(idx);
		};
		p.insertAt = function(item, index) {
			if (typeof index != 'number' || index >= this.length) this.push(item);
			else this.splice(index, 0, item);
		};
		p.shuffle = function() {
			let tmp;
			for (let i = this.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				tmp = this[i];
				this[i] = this[j];
				this[j] = tmp;
			}
		};
		p.merge = function() {
			let arrs = arguments;
			for (let j = 0; j < arrs.length; j++) {
				if (arrs[j] instanceof Array) {
					for (let i = 0; i < arrs[j].length; i++) {
						if (!this.has(arrs[j][i])) {
							this.push(arrs[j][i]);	
						}
					}
				}
			}
			return this;
		};
		p.addUnique = function(item) {
			if (!this.has(item)) this.push(item);
		};
		p.addRemove = function(item, add, addUnique) {
			if (add) {
				if (addUnique) {
					this.addUnique(item);
				} else {
					this.push(item);
				}
			} else {
				this.removeItem(item);
			}
		};
		p.toggle = function(item) {
			this.addRemove(item, !this.has(item));
		};
		p.each = function(cb, thisObj) {
			for (let i = 0; i < this.length; i++) {
				if (cb.call(thisObj, this[i], i)) return;
			}
		};
	},
	initElementPrototypes: function() {
		var __StyleNameCache = {};
		let p = Element.prototype;
		p.setClass = function(className) {
			this.className = className.trim();
		}
		p.toggleClass = function(className, isAdding) {
			if (isAdding) {
				this.addClass(className);
			} else {
				this.removeClass(className);
			}
		};
		p.switchClasses = function(className1, className2) {
			let classes = this.getClasses();
			if (classes.contains(className1)) { 
				this.removeClass(className1);
				this.addClass(className2);
			} else if (classes.contains(className2)) {
				this.removeClass(className2);
				this.addClass(className1);
			}
		};
		p.addClass = function(className) {
			if (typeof className == 'string') {
				let classNames = this.getClasses();
				let addedClasses = className.split(' ');
				for (let i = 0; i < addedClasses.length; i++) {
					if (classNames.indexOf(addedClasses[i]) == -1) {
						classNames.push(addedClasses[i]);
					}
				}
				this.className = classNames.join(' ');
			}
		};
		p.removeClass = function(className) {
			if (typeof className == 'string') {
				let classNames = this.getClasses();
				let removedClasses = className.split(' ');
				let newClasses = [];
				for (let i = 0; i < classNames.length; i++) {
					if (removedClasses.indexOf(classNames[i]) == -1) {
						newClasses.push(classNames[i]);
					}
				}
				this.className = newClasses.join(' ');
			}
		};
		p.hasClass = function(className) {
			return this.getClasses().indexOf(className) > -1;
		};
		p.getClasses = function() {
			let classNames = (this.className || '').trim().replace(/ {2,}/g, ' ');
			if (classNames) {
				return classNames.split(' ');
			}
			return [];
		};
		p.getAncestor = function(selector) {
			if (!selector || typeof selector != 'string') {
				return null;
			}
			if (p.closest instanceof Function) {
				return this.closest(selector);
			}
			let parts = selector.trim().split(' ');
			let properSelector = parts[parts.length - 1];
			let classes = properSelector.split('.');
			let selectorTag;
			let thisTag = this.tagName.toLowerCase();
			if (classes[0]) {
				selectorTag = classes[0].toLowerCase();
			}
			classes.removeAt(0);
			let element = this, isSameTag, foundClasses, elementClasses;
			while (element) {
				elementClasses = element.getClasses();
				isSameTag = typeof selectorTag == 'undefined' || selectorTag == thisTag;
				foundClasses = 0;
				for (let i = 0; i < elementClasses.length; i++) {
					if (classes.indexOf(elementClasses[i]) > -1) {
						foundClasses++;
					}
				}
				if (foundClasses == classes.length && isSameTag) {
					return element;
				}
				element = element.parentNode;
			}
			return null;
		};
		p.getData = function(name) {
			return this.getAttribute('data-' + name) || '';
		};
		p.setData = function(name, value) {
			this.setAttribute('data-' + name, value);
		};
		p.getRect = function() {
			return this.getBoundingClientRect();
		};
		p.setWidth = function(width) {
			this.style.width = typeof width == 'undefined' ? width + 'px' : width;
		};
		p.setHeight = function(height) {
			this.style.height = typeof height == 'undefined' ? height + 'px' : height;
		};
		p.getWidth = function() {
			return this.getRect().width;
		};
		p.getHeight = function() {
			return this.getRect().height;
		};
		p.getTop = function() {
			return this.getRect().top;
		};
		p.getLeft = function() {
			return this.getRect().left;
		};
		p.css = function(style) {
			let element = this;
			let set = function(value, style) {
				let propertyName = getVendorJsStyleName(style);	
				if (propertyName) {
					element.style[propertyName] = value;
				}
			};
			var getVendorJsStyleName = function(style) {
				let propertyName = __StyleNameCache[style];
				if (!propertyName) {
					propertyName = toCamelCase(style);
			    	__StyleNameCache[style] = propertyName;
			  	}	
				return propertyName;
			};
			if (typeof style == 'string') {
			    set(value, style);
			} else {
				for (let key in style) {
			  		set(style[key], key);
			   	}
			}
		};
		p.getChildAt = function(index) {
			return this.childNodes[index];
		};
		p.attr = function(attrName) {
			if (typeof arguments[1] != 'undefined') {
				if (attrName == 'class') {
					this.setClass(arguments[1]);
				} else if (attrName == 'value') {
					this.value = arguments[1];
				} else {
					this.setAttribute(attrName, arguments[1]);
				}
			} else {
				return this.getAttribute(attrName);
			}
		};
		p.show = function(isShown) {
			let display = typeof isShown == 'string' ? isShown : (typeof isShown == 'undefined' || isShown ? 'block' : 'none');
			this.style.display = display;
		};
		p.hide = function() {
			this.show(false);
		};
		p.find = function(selector) {
			return this.querySelector(selector);
		};
		p.finds = function(selector) {
			return this.querySelectorAll(selector);
		};
		p.getParent = function() {
			return this.parentNode;
		};
		p.scrollTo = function(pxy, duration) {
			if (pxy instanceof Element) {
				pxy = pxy.getRelativePosition(this).y - 80;
			}
			if (!duration || typeof duration != 'number') {
				this.scrollTop = pxy;
			} else {
				let px = pxy - this.scrollTop, ratio = 15,
				steps = duration / ratio, step = Math.round(px / steps),
				currentStep = 0, e = this, 
				cb = function() {
					currentStep++;
					e.scrollTop = e.scrollTop + step;
					if (currentStep < steps) setTimeout(cb, ratio);
					else e.scrollTop = pxy;
				};
				if (typeof px == 'number') cb();
			}
		};
		p.getRelativePosition = function(element) {
			let a = this.getRect();
			let b = element.getRect();
			return {x: Math.round(a.left - b.left), y:  Math.round(a.top - b.top)};
		};
		p.clear = function() {
			if (typeof this.value == 'string') this.value = '';
			else this.innerHTML = '';
		};
		p.prev = function() {
			return this.previousSibling;
		};
		p.next = function() {
			return this.nextSibling;
		};
	},
	initMouseEventPrototypes: function() {
		let p = MouseEvent.prototype;
		p.getTarget = function(selector) {
			return this.target.getAncestor(selector);
		};
		p.getTargetData = function(selector, dataAttr) {
			let target = this.getTarget(selector);
			return !!target ? target.getData(dataAttr) : '';
		};
		p.targetHasAncestor = function(element) {
			if (element instanceof Element) {
				let target = this.target;		
				while (target) {
					if (target == element) {
						return true;
					}
					target = target.parentNode;
				}
			}
			return false;
		};
		p.targetHasClass = function(className) {
			return this.target.hasClass(className) || (!!this.target.parentNode && this.target.parentNode.hasClass(className));
		};
		p.getTargetWithClass = function(className, strict) {
			if (this.target.hasClass(className)) return this.target;
			if (!strict || !this.target.className) {
				if (!!this.target.parentNode && this.target.parentNode.hasClass(className)) return this.target.parentNode;
			}
			return null;
		};
	
	}
}