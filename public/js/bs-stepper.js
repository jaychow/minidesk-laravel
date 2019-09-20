webpackJsonp([6],{

/***/ "./node_modules/bs-stepper/dist/js/bs-stepper.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/*!\n * bsStepper v1.7.0 (https://github.com/Johann-S/bs-stepper)\n * Copyright 2018 - 2019 Johann-S <johann.servoire@gmail.com>\n * Licensed under MIT (https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)\n */\n(function (global, factory) {\n   true ? module.exports = factory() :\n  typeof define === 'function' && define.amd ? define(factory) :\n  (global = global || self, global.Stepper = factory());\n}(this, function () { 'use strict';\n\n  function _extends() {\n    _extends = Object.assign || function (target) {\n      for (var i = 1; i < arguments.length; i++) {\n        var source = arguments[i];\n\n        for (var key in source) {\n          if (Object.prototype.hasOwnProperty.call(source, key)) {\n            target[key] = source[key];\n          }\n        }\n      }\n\n      return target;\n    };\n\n    return _extends.apply(this, arguments);\n  }\n\n  var matches = window.Element.prototype.matches;\n\n  var closest = function closest(element, selector) {\n    return element.closest(selector);\n  };\n\n  var WinEvent = function WinEvent(inType, params) {\n    return new window.Event(inType, params);\n  };\n\n  var createCustomEvent = function createCustomEvent(eventName, params) {\n    var cEvent = new window.CustomEvent(eventName, params);\n    return cEvent;\n  };\n  /* istanbul ignore next */\n\n\n  function polyfill() {\n    if (!window.Element.prototype.matches) {\n      matches = window.Element.prototype.msMatchesSelector || window.Element.prototype.webkitMatchesSelector;\n    }\n\n    if (!window.Element.prototype.closest) {\n      closest = function closest(element, selector) {\n        if (!document.documentElement.contains(element)) {\n          return null;\n        }\n\n        do {\n          if (matches.call(element, selector)) {\n            return element;\n          }\n\n          element = element.parentElement || element.parentNode;\n        } while (element !== null && element.nodeType === 1);\n\n        return null;\n      };\n    }\n\n    if (!window.Event || typeof window.Event !== 'function') {\n      WinEvent = function WinEvent(inType, params) {\n        params = params || {};\n        var e = document.createEvent('Event');\n        e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));\n        return e;\n      };\n    }\n\n    if (typeof window.CustomEvent !== 'function') {\n      var originPreventDefault = window.Event.prototype.preventDefault;\n\n      createCustomEvent = function createCustomEvent(eventName, params) {\n        var evt = document.createEvent('CustomEvent');\n        params = params || {\n          bubbles: false,\n          cancelable: false,\n          detail: null\n        };\n        evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);\n\n        evt.preventDefault = function () {\n          if (!this.cancelable) {\n            return;\n          }\n\n          originPreventDefault.call(this);\n          Object.defineProperty(this, 'defaultPrevented', {\n            get: function get() {\n              return true;\n            }\n          });\n        };\n\n        return evt;\n      };\n    }\n  }\n\n  polyfill();\n\n  var MILLISECONDS_MULTIPLIER = 1000;\n  var ClassName = {\n    ACTIVE: 'active',\n    LINEAR: 'linear',\n    BLOCK: 'dstepper-block',\n    NONE: 'dstepper-none',\n    FADE: 'fade',\n    VERTICAL: 'vertical'\n  };\n  var transitionEndEvent = 'transitionend';\n  var customProperty = 'bsStepper';\n\n  var show = function show(stepperNode, indexStep, options, done) {\n    var stepper = stepperNode[customProperty];\n\n    if (stepper._steps[indexStep].classList.contains(ClassName.ACTIVE) || stepper._stepsContents[indexStep].classList.contains(ClassName.ACTIVE)) {\n      return;\n    }\n\n    var showEvent = createCustomEvent('show.bs-stepper', {\n      cancelable: true,\n      detail: {\n        from: stepper._currentIndex,\n        to: indexStep,\n        indexStep: indexStep\n      }\n    });\n    stepperNode.dispatchEvent(showEvent);\n\n    var activeStep = stepper._steps.filter(function (step) {\n      return step.classList.contains(ClassName.ACTIVE);\n    });\n\n    var activeContent = stepper._stepsContents.filter(function (content) {\n      return content.classList.contains(ClassName.ACTIVE);\n    });\n\n    if (showEvent.defaultPrevented) {\n      return;\n    }\n\n    if (activeStep.length) {\n      activeStep[0].classList.remove(ClassName.ACTIVE);\n    }\n\n    if (activeContent.length) {\n      activeContent[0].classList.remove(ClassName.ACTIVE);\n\n      if (!stepperNode.classList.contains(ClassName.VERTICAL) && !stepper.options.animation) {\n        activeContent[0].classList.remove(ClassName.BLOCK);\n      }\n    }\n\n    showStep(stepperNode, stepper._steps[indexStep], stepper._steps, options);\n    showContent(stepperNode, stepper._stepsContents[indexStep], stepper._stepsContents, activeContent, done);\n  };\n\n  var showStep = function showStep(stepperNode, step, stepList, options) {\n    stepList.forEach(function (step) {\n      var trigger = step.querySelector(options.selectors.trigger);\n      trigger.setAttribute('aria-selected', 'false'); // if stepper is in linear mode, set disabled attribute on the trigger\n\n      if (stepperNode.classList.contains(ClassName.LINEAR)) {\n        trigger.setAttribute('disabled', 'disabled');\n      }\n    });\n    step.classList.add(ClassName.ACTIVE);\n    var currentTrigger = step.querySelector(options.selectors.trigger);\n    currentTrigger.setAttribute('aria-selected', 'true'); // if stepper is in linear mode, remove disabled attribute on current\n\n    if (stepperNode.classList.contains(ClassName.LINEAR)) {\n      currentTrigger.removeAttribute('disabled');\n    }\n  };\n\n  var showContent = function showContent(stepperNode, content, contentList, activeContent, done) {\n    var stepper = stepperNode[customProperty];\n    var toIndex = contentList.indexOf(content);\n    var shownEvent = createCustomEvent('shown.bs-stepper', {\n      cancelable: true,\n      detail: {\n        from: stepper._currentIndex,\n        to: toIndex,\n        indexStep: toIndex\n      }\n    });\n\n    function complete() {\n      content.classList.add(ClassName.BLOCK);\n      content.removeEventListener(transitionEndEvent, complete);\n      stepperNode.dispatchEvent(shownEvent);\n      done();\n    }\n\n    if (content.classList.contains(ClassName.FADE)) {\n      content.classList.remove(ClassName.NONE);\n      var duration = getTransitionDurationFromElement(content);\n      content.addEventListener(transitionEndEvent, complete);\n\n      if (activeContent.length) {\n        activeContent[0].classList.add(ClassName.NONE);\n      }\n\n      content.classList.add(ClassName.ACTIVE);\n      emulateTransitionEnd(content, duration);\n    } else {\n      content.classList.add(ClassName.ACTIVE);\n      content.classList.add(ClassName.BLOCK);\n      stepperNode.dispatchEvent(shownEvent);\n      done();\n    }\n  };\n\n  var getTransitionDurationFromElement = function getTransitionDurationFromElement(element) {\n    if (!element) {\n      return 0;\n    } // Get transition-duration of the element\n\n\n    var transitionDuration = window.getComputedStyle(element).transitionDuration;\n    var floatTransitionDuration = parseFloat(transitionDuration); // Return 0 if element or transition duration is not found\n\n    if (!floatTransitionDuration) {\n      return 0;\n    } // If multiple durations are defined, take the first\n\n\n    transitionDuration = transitionDuration.split(',')[0];\n    return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER;\n  };\n\n  var emulateTransitionEnd = function emulateTransitionEnd(element, duration) {\n    var called = false;\n    var durationPadding = 5;\n    var emulatedDuration = duration + durationPadding;\n\n    function listener() {\n      called = true;\n      element.removeEventListener(transitionEndEvent, listener);\n    }\n\n    element.addEventListener(transitionEndEvent, listener);\n    window.setTimeout(function () {\n      if (!called) {\n        element.dispatchEvent(WinEvent(transitionEndEvent));\n      }\n\n      element.removeEventListener(transitionEndEvent, listener);\n    }, emulatedDuration);\n  };\n\n  var detectAnimation = function detectAnimation(contentList, options) {\n    if (options.animation) {\n      contentList.forEach(function (content) {\n        content.classList.add(ClassName.FADE);\n        content.classList.add(ClassName.NONE);\n      });\n    }\n  };\n\n  var buildClickStepLinearListener = function buildClickStepLinearListener() {\n    return function clickStepLinearListener(event) {\n      event.preventDefault();\n    };\n  };\n\n  var buildClickStepNonLinearListener = function buildClickStepNonLinearListener(options) {\n    return function clickStepNonLinearListener(event) {\n      event.preventDefault();\n      var step = closest(event.target, options.selectors.steps);\n      var stepperNode = closest(step, options.selectors.stepper);\n      var stepper = stepperNode[customProperty];\n\n      var stepIndex = stepper._steps.indexOf(step);\n\n      show(stepperNode, stepIndex, options, function () {\n        stepper._currentIndex = stepIndex;\n      });\n    };\n  };\n\n  var DEFAULT_OPTIONS = {\n    linear: true,\n    animation: false,\n    selectors: {\n      steps: '.step',\n      trigger: '.step-trigger',\n      stepper: '.bs-stepper'\n    }\n  };\n\n  var Stepper =\n  /*#__PURE__*/\n  function () {\n    function Stepper(element, _options) {\n      var _this = this;\n\n      if (_options === void 0) {\n        _options = {};\n      }\n\n      this._element = element;\n      this._currentIndex = 0;\n      this._stepsContents = [];\n      this.options = _extends({}, DEFAULT_OPTIONS, {}, _options);\n      this.options.selectors = _extends({}, DEFAULT_OPTIONS.selectors, {}, this.options.selectors);\n\n      if (this.options.linear) {\n        this._element.classList.add(ClassName.LINEAR);\n      }\n\n      this._steps = [].slice.call(this._element.querySelectorAll(this.options.selectors.steps));\n\n      this._steps.filter(function (step) {\n        return step.hasAttribute('data-target');\n      }).forEach(function (step) {\n        _this._stepsContents.push(_this._element.querySelector(step.getAttribute('data-target')));\n      });\n\n      detectAnimation(this._stepsContents, this.options);\n\n      this._setLinkListeners();\n\n      Object.defineProperty(this._element, customProperty, {\n        value: this,\n        writable: true\n      });\n\n      if (this._steps.length) {\n        show(this._element, this._currentIndex, this.options, function () {});\n      }\n    } // Private\n\n\n    var _proto = Stepper.prototype;\n\n    _proto._setLinkListeners = function _setLinkListeners() {\n      var _this2 = this;\n\n      this._steps.forEach(function (step) {\n        var trigger = step.querySelector(_this2.options.selectors.trigger);\n\n        if (_this2.options.linear) {\n          _this2._clickStepLinearListener = buildClickStepLinearListener(_this2.options);\n          trigger.addEventListener('click', _this2._clickStepLinearListener);\n        } else {\n          _this2._clickStepNonLinearListener = buildClickStepNonLinearListener(_this2.options);\n          trigger.addEventListener('click', _this2._clickStepNonLinearListener);\n        }\n      });\n    } // Public\n    ;\n\n    _proto.next = function next() {\n      var _this3 = this;\n\n      var nextStep = this._currentIndex + 1 <= this._steps.length - 1 ? this._currentIndex + 1 : this._steps.length - 1;\n      show(this._element, nextStep, this.options, function () {\n        _this3._currentIndex = nextStep;\n      });\n    };\n\n    _proto.previous = function previous() {\n      var _this4 = this;\n\n      var previousStep = this._currentIndex - 1 >= 0 ? this._currentIndex - 1 : 0;\n      show(this._element, previousStep, this.options, function () {\n        _this4._currentIndex = previousStep;\n      });\n    };\n\n    _proto.to = function to(stepNumber) {\n      var _this5 = this;\n\n      var tempIndex = stepNumber - 1;\n      var nextStep = tempIndex >= 0 && tempIndex < this._steps.length ? tempIndex : 0;\n      show(this._element, nextStep, this.options, function () {\n        _this5._currentIndex = nextStep;\n      });\n    };\n\n    _proto.reset = function reset() {\n      var _this6 = this;\n\n      show(this._element, 0, this.options, function () {\n        _this6._currentIndex = 0;\n      });\n    };\n\n    _proto.destroy = function destroy() {\n      var _this7 = this;\n\n      this._steps.forEach(function (step) {\n        var trigger = step.querySelector(_this7.options.selectors.trigger);\n\n        if (_this7.options.linear) {\n          trigger.removeEventListener('click', _this7._clickStepLinearListener);\n        } else {\n          trigger.removeEventListener('click', _this7._clickStepNonLinearListener);\n        }\n      });\n\n      this._element[customProperty] = undefined;\n      this._element = undefined;\n      this._currentIndex = undefined;\n      this._steps = undefined;\n      this._stepsContents = undefined;\n      this._clickStepLinearListener = undefined;\n      this._clickStepNonLinearListener = undefined;\n    };\n\n    return Stepper;\n  }();\n\n  return Stepper;\n\n}));\n//# sourceMappingURL=bs-stepper.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnMtc3RlcHBlci9kaXN0L2pzL2JzLXN0ZXBwZXIuanM/Y2EzMCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLG9CQUFvQjs7QUFFckI7QUFDQTtBQUNBLHFCQUFxQixzQkFBc0I7QUFDM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EseURBQXlEOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBLGlFQUFpRTs7QUFFakU7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxxQkFBcUI7QUFDckQsMENBQTBDLCtCQUErQjs7QUFFekU7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPOztBQUVQOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSw0RUFBNEU7QUFDNUU7QUFDQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUEsQ0FBQztBQUNEIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2JzLXN0ZXBwZXIvZGlzdC9qcy9icy1zdGVwcGVyLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBic1N0ZXBwZXIgdjEuNy4wIChodHRwczovL2dpdGh1Yi5jb20vSm9oYW5uLVMvYnMtc3RlcHBlcilcbiAqIENvcHlyaWdodCAyMDE4IC0gMjAxOSBKb2hhbm4tUyA8am9oYW5uLnNlcnZvaXJlQGdtYWlsLmNvbT5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL0pvaGFubi1TL2JzLXN0ZXBwZXIvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIGdsb2JhbC5TdGVwcGVyID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gICAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG5cbiAgICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHZhciBtYXRjaGVzID0gd2luZG93LkVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXM7XG5cbiAgdmFyIGNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0KGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuY2xvc2VzdChzZWxlY3Rvcik7XG4gIH07XG5cbiAgdmFyIFdpbkV2ZW50ID0gZnVuY3Rpb24gV2luRXZlbnQoaW5UeXBlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IHdpbmRvdy5FdmVudChpblR5cGUsIHBhcmFtcyk7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gZnVuY3Rpb24gY3JlYXRlQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCBwYXJhbXMpIHtcbiAgICB2YXIgY0V2ZW50ID0gbmV3IHdpbmRvdy5DdXN0b21FdmVudChldmVudE5hbWUsIHBhcmFtcyk7XG4gICAgcmV0dXJuIGNFdmVudDtcbiAgfTtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAgIGlmICghd2luZG93LkVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcbiAgICAgIG1hdGNoZXMgPSB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgd2luZG93LkVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvcjtcbiAgICB9XG5cbiAgICBpZiAoIXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0KSB7XG4gICAgICBjbG9zZXN0ID0gZnVuY3Rpb24gY2xvc2VzdChlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyhlbGVtZW50KSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgIGlmIChtYXRjaGVzLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50IHx8IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfSB3aGlsZSAoZWxlbWVudCAhPT0gbnVsbCAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSAxKTtcblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCF3aW5kb3cuRXZlbnQgfHwgdHlwZW9mIHdpbmRvdy5FdmVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgV2luRXZlbnQgPSBmdW5jdGlvbiBXaW5FdmVudChpblR5cGUsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgIGUuaW5pdEV2ZW50KGluVHlwZSwgQm9vbGVhbihwYXJhbXMuYnViYmxlcyksIEJvb2xlYW4ocGFyYW1zLmNhbmNlbGFibGUpKTtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgb3JpZ2luUHJldmVudERlZmF1bHQgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlLnByZXZlbnREZWZhdWx0O1xuXG4gICAgICBjcmVhdGVDdXN0b21FdmVudCA9IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtcbiAgICAgICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcbiAgICAgICAgICBkZXRhaWw6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudE5hbWUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG5cbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghdGhpcy5jYW5jZWxhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb3JpZ2luUHJldmVudERlZmF1bHQuY2FsbCh0aGlzKTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RlZmF1bHRQcmV2ZW50ZWQnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGV2dDtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcG9seWZpbGwoKTtcblxuICB2YXIgTUlMTElTRUNPTkRTX01VTFRJUExJRVIgPSAxMDAwO1xuICB2YXIgQ2xhc3NOYW1lID0ge1xuICAgIEFDVElWRTogJ2FjdGl2ZScsXG4gICAgTElORUFSOiAnbGluZWFyJyxcbiAgICBCTE9DSzogJ2RzdGVwcGVyLWJsb2NrJyxcbiAgICBOT05FOiAnZHN0ZXBwZXItbm9uZScsXG4gICAgRkFERTogJ2ZhZGUnLFxuICAgIFZFUlRJQ0FMOiAndmVydGljYWwnXG4gIH07XG4gIHZhciB0cmFuc2l0aW9uRW5kRXZlbnQgPSAndHJhbnNpdGlvbmVuZCc7XG4gIHZhciBjdXN0b21Qcm9wZXJ0eSA9ICdic1N0ZXBwZXInO1xuXG4gIHZhciBzaG93ID0gZnVuY3Rpb24gc2hvdyhzdGVwcGVyTm9kZSwgaW5kZXhTdGVwLCBvcHRpb25zLCBkb25lKSB7XG4gICAgdmFyIHN0ZXBwZXIgPSBzdGVwcGVyTm9kZVtjdXN0b21Qcm9wZXJ0eV07XG5cbiAgICBpZiAoc3RlcHBlci5fc3RlcHNbaW5kZXhTdGVwXS5jbGFzc0xpc3QuY29udGFpbnMoQ2xhc3NOYW1lLkFDVElWRSkgfHwgc3RlcHBlci5fc3RlcHNDb250ZW50c1tpbmRleFN0ZXBdLmNsYXNzTGlzdC5jb250YWlucyhDbGFzc05hbWUuQUNUSVZFKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBzaG93RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudCgnc2hvdy5icy1zdGVwcGVyJywge1xuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBmcm9tOiBzdGVwcGVyLl9jdXJyZW50SW5kZXgsXG4gICAgICAgIHRvOiBpbmRleFN0ZXAsXG4gICAgICAgIGluZGV4U3RlcDogaW5kZXhTdGVwXG4gICAgICB9XG4gICAgfSk7XG4gICAgc3RlcHBlck5vZGUuZGlzcGF0Y2hFdmVudChzaG93RXZlbnQpO1xuXG4gICAgdmFyIGFjdGl2ZVN0ZXAgPSBzdGVwcGVyLl9zdGVwcy5maWx0ZXIoZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgIHJldHVybiBzdGVwLmNsYXNzTGlzdC5jb250YWlucyhDbGFzc05hbWUuQUNUSVZFKTtcbiAgICB9KTtcblxuICAgIHZhciBhY3RpdmVDb250ZW50ID0gc3RlcHBlci5fc3RlcHNDb250ZW50cy5maWx0ZXIoZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBjb250ZW50LmNsYXNzTGlzdC5jb250YWlucyhDbGFzc05hbWUuQUNUSVZFKTtcbiAgICB9KTtcblxuICAgIGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChhY3RpdmVTdGVwLmxlbmd0aCkge1xuICAgICAgYWN0aXZlU3RlcFswXS5jbGFzc0xpc3QucmVtb3ZlKENsYXNzTmFtZS5BQ1RJVkUpO1xuICAgIH1cblxuICAgIGlmIChhY3RpdmVDb250ZW50Lmxlbmd0aCkge1xuICAgICAgYWN0aXZlQ29udGVudFswXS5jbGFzc0xpc3QucmVtb3ZlKENsYXNzTmFtZS5BQ1RJVkUpO1xuXG4gICAgICBpZiAoIXN0ZXBwZXJOb2RlLmNsYXNzTGlzdC5jb250YWlucyhDbGFzc05hbWUuVkVSVElDQUwpICYmICFzdGVwcGVyLm9wdGlvbnMuYW5pbWF0aW9uKSB7XG4gICAgICAgIGFjdGl2ZUNvbnRlbnRbMF0uY2xhc3NMaXN0LnJlbW92ZShDbGFzc05hbWUuQkxPQ0spO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNob3dTdGVwKHN0ZXBwZXJOb2RlLCBzdGVwcGVyLl9zdGVwc1tpbmRleFN0ZXBdLCBzdGVwcGVyLl9zdGVwcywgb3B0aW9ucyk7XG4gICAgc2hvd0NvbnRlbnQoc3RlcHBlck5vZGUsIHN0ZXBwZXIuX3N0ZXBzQ29udGVudHNbaW5kZXhTdGVwXSwgc3RlcHBlci5fc3RlcHNDb250ZW50cywgYWN0aXZlQ29udGVudCwgZG9uZSk7XG4gIH07XG5cbiAgdmFyIHNob3dTdGVwID0gZnVuY3Rpb24gc2hvd1N0ZXAoc3RlcHBlck5vZGUsIHN0ZXAsIHN0ZXBMaXN0LCBvcHRpb25zKSB7XG4gICAgc3RlcExpc3QuZm9yRWFjaChmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgdmFyIHRyaWdnZXIgPSBzdGVwLnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5zZWxlY3RvcnMudHJpZ2dlcik7XG4gICAgICB0cmlnZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpOyAvLyBpZiBzdGVwcGVyIGlzIGluIGxpbmVhciBtb2RlLCBzZXQgZGlzYWJsZWQgYXR0cmlidXRlIG9uIHRoZSB0cmlnZ2VyXG5cbiAgICAgIGlmIChzdGVwcGVyTm9kZS5jbGFzc0xpc3QuY29udGFpbnMoQ2xhc3NOYW1lLkxJTkVBUikpIHtcbiAgICAgICAgdHJpZ2dlci5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc3RlcC5jbGFzc0xpc3QuYWRkKENsYXNzTmFtZS5BQ1RJVkUpO1xuICAgIHZhciBjdXJyZW50VHJpZ2dlciA9IHN0ZXAucXVlcnlTZWxlY3RvcihvcHRpb25zLnNlbGVjdG9ycy50cmlnZ2VyKTtcbiAgICBjdXJyZW50VHJpZ2dlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpOyAvLyBpZiBzdGVwcGVyIGlzIGluIGxpbmVhciBtb2RlLCByZW1vdmUgZGlzYWJsZWQgYXR0cmlidXRlIG9uIGN1cnJlbnRcblxuICAgIGlmIChzdGVwcGVyTm9kZS5jbGFzc0xpc3QuY29udGFpbnMoQ2xhc3NOYW1lLkxJTkVBUikpIHtcbiAgICAgIGN1cnJlbnRUcmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHNob3dDb250ZW50ID0gZnVuY3Rpb24gc2hvd0NvbnRlbnQoc3RlcHBlck5vZGUsIGNvbnRlbnQsIGNvbnRlbnRMaXN0LCBhY3RpdmVDb250ZW50LCBkb25lKSB7XG4gICAgdmFyIHN0ZXBwZXIgPSBzdGVwcGVyTm9kZVtjdXN0b21Qcm9wZXJ0eV07XG4gICAgdmFyIHRvSW5kZXggPSBjb250ZW50TGlzdC5pbmRleE9mKGNvbnRlbnQpO1xuICAgIHZhciBzaG93bkV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQoJ3Nob3duLmJzLXN0ZXBwZXInLCB7XG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIGZyb206IHN0ZXBwZXIuX2N1cnJlbnRJbmRleCxcbiAgICAgICAgdG86IHRvSW5kZXgsXG4gICAgICAgIGluZGV4U3RlcDogdG9JbmRleFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3NOYW1lLkJMT0NLKTtcbiAgICAgIGNvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kRXZlbnQsIGNvbXBsZXRlKTtcbiAgICAgIHN0ZXBwZXJOb2RlLmRpc3BhdGNoRXZlbnQoc2hvd25FdmVudCk7XG4gICAgICBkb25lKCk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENsYXNzTmFtZS5GQURFKSkge1xuICAgICAgY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKENsYXNzTmFtZS5OT05FKTtcbiAgICAgIHZhciBkdXJhdGlvbiA9IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KGNvbnRlbnQpO1xuICAgICAgY29udGVudC5hZGRFdmVudExpc3RlbmVyKHRyYW5zaXRpb25FbmRFdmVudCwgY29tcGxldGUpO1xuXG4gICAgICBpZiAoYWN0aXZlQ29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgYWN0aXZlQ29udGVudFswXS5jbGFzc0xpc3QuYWRkKENsYXNzTmFtZS5OT05FKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudC5jbGFzc0xpc3QuYWRkKENsYXNzTmFtZS5BQ1RJVkUpO1xuICAgICAgZW11bGF0ZVRyYW5zaXRpb25FbmQoY29udGVudCwgZHVyYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3NOYW1lLkFDVElWRSk7XG4gICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3NOYW1lLkJMT0NLKTtcbiAgICAgIHN0ZXBwZXJOb2RlLmRpc3BhdGNoRXZlbnQoc2hvd25FdmVudCk7XG4gICAgICBkb25lKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCA9IGZ1bmN0aW9uIGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gLy8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcblxuXG4gICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICB2YXIgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSBwYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbik7IC8vIFJldHVybiAwIGlmIGVsZW1lbnQgb3IgdHJhbnNpdGlvbiBkdXJhdGlvbiBpcyBub3QgZm91bmRcblxuICAgIGlmICghZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24pIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gLy8gSWYgbXVsdGlwbGUgZHVyYXRpb25zIGFyZSBkZWZpbmVkLCB0YWtlIHRoZSBmaXJzdFxuXG5cbiAgICB0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXTtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pICogTUlMTElTRUNPTkRTX01VTFRJUExJRVI7XG4gIH07XG5cbiAgdmFyIGVtdWxhdGVUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gZW11bGF0ZVRyYW5zaXRpb25FbmQoZWxlbWVudCwgZHVyYXRpb24pIHtcbiAgICB2YXIgY2FsbGVkID0gZmFsc2U7XG4gICAgdmFyIGR1cmF0aW9uUGFkZGluZyA9IDU7XG4gICAgdmFyIGVtdWxhdGVkRHVyYXRpb24gPSBkdXJhdGlvbiArIGR1cmF0aW9uUGFkZGluZztcblxuICAgIGZ1bmN0aW9uIGxpc3RlbmVyKCkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0cmFuc2l0aW9uRW5kRXZlbnQsIGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZEV2ZW50LCBsaXN0ZW5lcik7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KFdpbkV2ZW50KHRyYW5zaXRpb25FbmRFdmVudCkpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZEV2ZW50LCBsaXN0ZW5lcik7XG4gICAgfSwgZW11bGF0ZWREdXJhdGlvbik7XG4gIH07XG5cbiAgdmFyIGRldGVjdEFuaW1hdGlvbiA9IGZ1bmN0aW9uIGRldGVjdEFuaW1hdGlvbihjb250ZW50TGlzdCwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgY29udGVudExpc3QuZm9yRWFjaChmdW5jdGlvbiAoY29udGVudCkge1xuICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3NOYW1lLkZBREUpO1xuICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3NOYW1lLk5PTkUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBidWlsZENsaWNrU3RlcExpbmVhckxpc3RlbmVyID0gZnVuY3Rpb24gYnVpbGRDbGlja1N0ZXBMaW5lYXJMaXN0ZW5lcigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gY2xpY2tTdGVwTGluZWFyTGlzdGVuZXIoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgYnVpbGRDbGlja1N0ZXBOb25MaW5lYXJMaXN0ZW5lciA9IGZ1bmN0aW9uIGJ1aWxkQ2xpY2tTdGVwTm9uTGluZWFyTGlzdGVuZXIob3B0aW9ucykge1xuICAgIHJldHVybiBmdW5jdGlvbiBjbGlja1N0ZXBOb25MaW5lYXJMaXN0ZW5lcihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBzdGVwID0gY2xvc2VzdChldmVudC50YXJnZXQsIG9wdGlvbnMuc2VsZWN0b3JzLnN0ZXBzKTtcbiAgICAgIHZhciBzdGVwcGVyTm9kZSA9IGNsb3Nlc3Qoc3RlcCwgb3B0aW9ucy5zZWxlY3RvcnMuc3RlcHBlcik7XG4gICAgICB2YXIgc3RlcHBlciA9IHN0ZXBwZXJOb2RlW2N1c3RvbVByb3BlcnR5XTtcblxuICAgICAgdmFyIHN0ZXBJbmRleCA9IHN0ZXBwZXIuX3N0ZXBzLmluZGV4T2Yoc3RlcCk7XG5cbiAgICAgIHNob3coc3RlcHBlck5vZGUsIHN0ZXBJbmRleCwgb3B0aW9ucywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzdGVwcGVyLl9jdXJyZW50SW5kZXggPSBzdGVwSW5kZXg7XG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xuXG4gIHZhciBERUZBVUxUX09QVElPTlMgPSB7XG4gICAgbGluZWFyOiB0cnVlLFxuICAgIGFuaW1hdGlvbjogZmFsc2UsXG4gICAgc2VsZWN0b3JzOiB7XG4gICAgICBzdGVwczogJy5zdGVwJyxcbiAgICAgIHRyaWdnZXI6ICcuc3RlcC10cmlnZ2VyJyxcbiAgICAgIHN0ZXBwZXI6ICcuYnMtc3RlcHBlcidcbiAgICB9XG4gIH07XG5cbiAgdmFyIFN0ZXBwZXIgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdGVwcGVyKGVsZW1lbnQsIF9vcHRpb25zKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAoX29wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgICBfb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IDA7XG4gICAgICB0aGlzLl9zdGVwc0NvbnRlbnRzID0gW107XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgREVGQVVMVF9PUFRJT05TLCB7fSwgX29wdGlvbnMpO1xuICAgICAgdGhpcy5vcHRpb25zLnNlbGVjdG9ycyA9IF9leHRlbmRzKHt9LCBERUZBVUxUX09QVElPTlMuc2VsZWN0b3JzLCB7fSwgdGhpcy5vcHRpb25zLnNlbGVjdG9ycyk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubGluZWFyKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDbGFzc05hbWUuTElORUFSKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3RlcHMgPSBbXS5zbGljZS5jYWxsKHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLnN0ZXBzKSk7XG5cbiAgICAgIHRoaXMuX3N0ZXBzLmZpbHRlcihmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICByZXR1cm4gc3RlcC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgIF90aGlzLl9zdGVwc0NvbnRlbnRzLnB1c2goX3RoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvcihzdGVwLmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkpO1xuICAgICAgfSk7XG5cbiAgICAgIGRldGVjdEFuaW1hdGlvbih0aGlzLl9zdGVwc0NvbnRlbnRzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICB0aGlzLl9zZXRMaW5rTGlzdGVuZXJzKCk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLl9lbGVtZW50LCBjdXN0b21Qcm9wZXJ0eSwge1xuICAgICAgICB2YWx1ZTogdGhpcyxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5fc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgIHNob3codGhpcy5fZWxlbWVudCwgdGhpcy5fY3VycmVudEluZGV4LCB0aGlzLm9wdGlvbnMsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgIH1cbiAgICB9IC8vIFByaXZhdGVcblxuXG4gICAgdmFyIF9wcm90byA9IFN0ZXBwZXIucHJvdG90eXBlO1xuXG4gICAgX3Byb3RvLl9zZXRMaW5rTGlzdGVuZXJzID0gZnVuY3Rpb24gX3NldExpbmtMaXN0ZW5lcnMoKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdGhpcy5fc3RlcHMuZm9yRWFjaChmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICB2YXIgdHJpZ2dlciA9IHN0ZXAucXVlcnlTZWxlY3RvcihfdGhpczIub3B0aW9ucy5zZWxlY3RvcnMudHJpZ2dlcik7XG5cbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLmxpbmVhcikge1xuICAgICAgICAgIF90aGlzMi5fY2xpY2tTdGVwTGluZWFyTGlzdGVuZXIgPSBidWlsZENsaWNrU3RlcExpbmVhckxpc3RlbmVyKF90aGlzMi5vcHRpb25zKTtcbiAgICAgICAgICB0cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RoaXMyLl9jbGlja1N0ZXBMaW5lYXJMaXN0ZW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMyLl9jbGlja1N0ZXBOb25MaW5lYXJMaXN0ZW5lciA9IGJ1aWxkQ2xpY2tTdGVwTm9uTGluZWFyTGlzdGVuZXIoX3RoaXMyLm9wdGlvbnMpO1xuICAgICAgICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdGhpczIuX2NsaWNrU3RlcE5vbkxpbmVhckxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSAvLyBQdWJsaWNcbiAgICA7XG5cbiAgICBfcHJvdG8ubmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIG5leHRTdGVwID0gdGhpcy5fY3VycmVudEluZGV4ICsgMSA8PSB0aGlzLl9zdGVwcy5sZW5ndGggLSAxID8gdGhpcy5fY3VycmVudEluZGV4ICsgMSA6IHRoaXMuX3N0ZXBzLmxlbmd0aCAtIDE7XG4gICAgICBzaG93KHRoaXMuX2VsZW1lbnQsIG5leHRTdGVwLCB0aGlzLm9wdGlvbnMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMzLl9jdXJyZW50SW5kZXggPSBuZXh0U3RlcDtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucHJldmlvdXMgPSBmdW5jdGlvbiBwcmV2aW91cygpIHtcbiAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICB2YXIgcHJldmlvdXNTdGVwID0gdGhpcy5fY3VycmVudEluZGV4IC0gMSA+PSAwID8gdGhpcy5fY3VycmVudEluZGV4IC0gMSA6IDA7XG4gICAgICBzaG93KHRoaXMuX2VsZW1lbnQsIHByZXZpb3VzU3RlcCwgdGhpcy5vcHRpb25zLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzNC5fY3VycmVudEluZGV4ID0gcHJldmlvdXNTdGVwO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9wcm90by50byA9IGZ1bmN0aW9uIHRvKHN0ZXBOdW1iZXIpIHtcbiAgICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgICB2YXIgdGVtcEluZGV4ID0gc3RlcE51bWJlciAtIDE7XG4gICAgICB2YXIgbmV4dFN0ZXAgPSB0ZW1wSW5kZXggPj0gMCAmJiB0ZW1wSW5kZXggPCB0aGlzLl9zdGVwcy5sZW5ndGggPyB0ZW1wSW5kZXggOiAwO1xuICAgICAgc2hvdyh0aGlzLl9lbGVtZW50LCBuZXh0U3RlcCwgdGhpcy5vcHRpb25zLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzNS5fY3VycmVudEluZGV4ID0gbmV4dFN0ZXA7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgc2hvdyh0aGlzLl9lbGVtZW50LCAwLCB0aGlzLm9wdGlvbnMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXM2Ll9jdXJyZW50SW5kZXggPSAwO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9wcm90by5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgICB0aGlzLl9zdGVwcy5mb3JFYWNoKGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgIHZhciB0cmlnZ2VyID0gc3RlcC5xdWVyeVNlbGVjdG9yKF90aGlzNy5vcHRpb25zLnNlbGVjdG9ycy50cmlnZ2VyKTtcblxuICAgICAgICBpZiAoX3RoaXM3Lm9wdGlvbnMubGluZWFyKSB7XG4gICAgICAgICAgdHJpZ2dlci5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF90aGlzNy5fY2xpY2tTdGVwTGluZWFyTGlzdGVuZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyaWdnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdGhpczcuX2NsaWNrU3RlcE5vbkxpbmVhckxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX2VsZW1lbnRbY3VzdG9tUHJvcGVydHldID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fZWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3N0ZXBzID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fc3RlcHNDb250ZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2NsaWNrU3RlcExpbmVhckxpc3RlbmVyID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fY2xpY2tTdGVwTm9uTGluZWFyTGlzdGVuZXIgPSB1bmRlZmluZWQ7XG4gICAgfTtcblxuICAgIHJldHVybiBTdGVwcGVyO1xuICB9KCk7XG5cbiAgcmV0dXJuIFN0ZXBwZXI7XG5cbn0pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJzLXN0ZXBwZXIuanMubWFwXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9icy1zdGVwcGVyL2Rpc3QvanMvYnMtc3RlcHBlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvYnMtc3RlcHBlci9kaXN0L2pzL2JzLXN0ZXBwZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDYiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/bs-stepper/dist/js/bs-stepper.js\n");

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/bs-stepper/dist/js/bs-stepper.js");


/***/ })

},[5]);