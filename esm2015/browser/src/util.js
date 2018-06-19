/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { sequence } from '@angular/animations';
export const ONE_SECOND = 1000;
export const SUBSTITUTION_EXPR_START = '{{';
export const SUBSTITUTION_EXPR_END = '}}';
export const ENTER_CLASSNAME = 'ng-enter';
export const LEAVE_CLASSNAME = 'ng-leave';
export const ENTER_SELECTOR = '.ng-enter';
export const LEAVE_SELECTOR = '.ng-leave';
export const NG_TRIGGER_CLASSNAME = 'ng-trigger';
export const NG_TRIGGER_SELECTOR = '.ng-trigger';
export const NG_ANIMATING_CLASSNAME = 'ng-animating';
export const NG_ANIMATING_SELECTOR = '.ng-animating';
export function resolveTimingValue(value) {
    if (typeof value == 'number')
        return value;
    const matches = value.match(/^(-?[\.\d]+)(m?s)/);
    if (!matches || matches.length < 2)
        return 0;
    return _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
}
function _convertTimeValueToMS(value, unit) {
    switch (unit) {
        case 's':
            return value * ONE_SECOND;
        default: // ms or something else
            return value;
    }
}
export function resolveTiming(timings, errors, allowNegativeValues) {
    return timings.hasOwnProperty('duration') ?
        timings :
        parseTimeExpression(timings, errors, allowNegativeValues);
}
function parseTimeExpression(exp, errors, allowNegativeValues) {
    const regex = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
    let duration;
    let delay = 0;
    let easing = '';
    if (typeof exp === 'string') {
        const matches = exp.match(regex);
        if (matches === null) {
            errors.push(`The provided timing value "${exp}" is invalid.`);
            return { duration: 0, delay: 0, easing: '' };
        }
        duration = _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
        const delayMatch = matches[3];
        if (delayMatch != null) {
            delay = _convertTimeValueToMS(Math.floor(parseFloat(delayMatch)), matches[4]);
        }
        const easingVal = matches[5];
        if (easingVal) {
            easing = easingVal;
        }
    }
    else {
        duration = exp;
    }
    if (!allowNegativeValues) {
        let containsErrors = false;
        let startIndex = errors.length;
        if (duration < 0) {
            errors.push(`Duration values below 0 are not allowed for this animation step.`);
            containsErrors = true;
        }
        if (delay < 0) {
            errors.push(`Delay values below 0 are not allowed for this animation step.`);
            containsErrors = true;
        }
        if (containsErrors) {
            errors.splice(startIndex, 0, `The provided timing value "${exp}" is invalid.`);
        }
    }
    return { duration, delay, easing };
}
export function copyObj(obj, destination = {}) {
    Object.keys(obj).forEach(prop => { destination[prop] = obj[prop]; });
    return destination;
}
export function normalizeStyles(styles) {
    const normalizedStyles = {};
    if (Array.isArray(styles)) {
        styles.forEach(data => copyStyles(data, false, normalizedStyles));
    }
    else {
        copyStyles(styles, false, normalizedStyles);
    }
    return normalizedStyles;
}
export function copyStyles(styles, readPrototype, destination = {}) {
    if (readPrototype) {
        // we make use of a for-in loop so that the
        // prototypically inherited properties are
        // revealed from the backFill map
        for (let prop in styles) {
            destination[prop] = styles[prop];
        }
    }
    else {
        copyObj(styles, destination);
    }
    return destination;
}
export function setStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(prop => {
            const camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = styles[prop];
        });
    }
}
export function eraseStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(prop => {
            const camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = '';
        });
    }
}
export function normalizeAnimationEntry(steps) {
    if (Array.isArray(steps)) {
        if (steps.length == 1)
            return steps[0];
        return sequence(steps);
    }
    return steps;
}
export function validateStyleParams(value, options, errors) {
    const params = options.params || {};
    const matches = extractStyleParams(value);
    if (matches.length) {
        matches.forEach(varName => {
            if (!params.hasOwnProperty(varName)) {
                errors.push(`Unable to resolve the local animation param ${varName} in the given list of values`);
            }
        });
    }
}
const PARAM_REGEX = new RegExp(`${SUBSTITUTION_EXPR_START}\\s*(.+?)\\s*${SUBSTITUTION_EXPR_END}`, 'g');
export function extractStyleParams(value) {
    let params = [];
    if (typeof value === 'string') {
        const val = value.toString();
        let match;
        while (match = PARAM_REGEX.exec(val)) {
            params.push(match[1]);
        }
        PARAM_REGEX.lastIndex = 0;
    }
    return params;
}
export function interpolateParams(value, params, errors) {
    const original = value.toString();
    const str = original.replace(PARAM_REGEX, (_, varName) => {
        let localVal = params[varName];
        // this means that the value was never overridden by the data passed in by the user
        if (!params.hasOwnProperty(varName)) {
            errors.push(`Please provide a value for the animation param ${varName}`);
            localVal = '';
        }
        return localVal.toString();
    });
    // we do this to assert that numeric values stay as they are
    return str == original ? value : str;
}
export function iteratorToArray(iterator) {
    const arr = [];
    let item = iterator.next();
    while (!item.done) {
        arr.push(item.value);
        item = iterator.next();
    }
    return arr;
}
export function mergeAnimationOptions(source, destination) {
    if (source.params) {
        const p0 = source.params;
        if (!destination.params) {
            destination.params = {};
        }
        const p1 = destination.params;
        Object.keys(p0).forEach(param => {
            if (!p1.hasOwnProperty(param)) {
                p1[param] = p0[param];
            }
        });
    }
    return destination;
}
const DASH_CASE_REGEXP = /-+([a-z0-9])/g;
export function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
}
export function allowPreviousPlayerStylesMerge(duration, delay) {
    return duration === 0 || delay === 0;
}
export function balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles) {
    const previousStyleProps = Object.keys(previousStyles);
    if (previousStyleProps.length && keyframes.length) {
        let startingKeyframe = keyframes[0];
        let missingStyleProps = [];
        previousStyleProps.forEach(prop => {
            if (!startingKeyframe.hasOwnProperty(prop)) {
                missingStyleProps.push(prop);
            }
            startingKeyframe[prop] = previousStyles[prop];
        });
        if (missingStyleProps.length) {
            // tslint:disable-next-line
            for (var i = 1; i < keyframes.length; i++) {
                let kf = keyframes[i];
                missingStyleProps.forEach(function (prop) { kf[prop] = computeStyle(element, prop); });
            }
        }
    }
    return keyframes;
}
export function visitDslNode(visitor, node, context) {
    switch (node.type) {
        case 7 /* Trigger */:
            return visitor.visitTrigger(node, context);
        case 0 /* State */:
            return visitor.visitState(node, context);
        case 1 /* Transition */:
            return visitor.visitTransition(node, context);
        case 2 /* Sequence */:
            return visitor.visitSequence(node, context);
        case 3 /* Group */:
            return visitor.visitGroup(node, context);
        case 4 /* Animate */:
            return visitor.visitAnimate(node, context);
        case 5 /* Keyframes */:
            return visitor.visitKeyframes(node, context);
        case 6 /* Style */:
            return visitor.visitStyle(node, context);
        case 8 /* Reference */:
            return visitor.visitReference(node, context);
        case 9 /* AnimateChild */:
            return visitor.visitAnimateChild(node, context);
        case 10 /* AnimateRef */:
            return visitor.visitAnimateRef(node, context);
        case 11 /* Query */:
            return visitor.visitQuery(node, context);
        case 12 /* Stagger */:
            return visitor.visitStagger(node, context);
        default:
            throw new Error(`Unable to resolve animation metadata node #${node.type}`);
    }
}
export function computeStyle(element, prop) {
    return window.getComputedStyle(element)[prop];
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQTZFLFFBQVEsRUFBYSxNQUFNLHFCQUFxQixDQUFDO0FBSXJJLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFFL0IsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBQzVDLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQztBQUMxQyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDO0FBQzFDLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUM7QUFDMUMsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQztBQUMxQyxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDO0FBQzFDLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLFlBQVksQ0FBQztBQUNqRCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxhQUFhLENBQUM7QUFDakQsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDO0FBQ3JELE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLGVBQWUsQ0FBQztBQUVyRCxNQUFNLDZCQUE2QixLQUFzQjtJQUN2RCxJQUFJLE9BQU8sS0FBSyxJQUFJLFFBQVE7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUUzQyxNQUFNLE9BQU8sR0FBSSxLQUFnQixDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzdELElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFFN0MsT0FBTyxxQkFBcUIsQ0FBQyxVQUFVLENB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LEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0M7WUFDRSxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7S0FDOUU7QUFDSCxDQUFDO0FBRUQsTUFBTSx1QkFBdUIsT0FBWSxFQUFFLElBQVk7SUFDckQsT0FBYSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0ZVRpbWluZ3MsIEFuaW1hdGlvbk1ldGFkYXRhLCBBbmltYXRpb25NZXRhZGF0YVR5cGUsIEFuaW1hdGlvbk9wdGlvbnMsIHNlcXVlbmNlLCDJtVN0eWxlRGF0YX0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0FzdCBhcyBBbmltYXRpb25Bc3QsIEFzdFZpc2l0b3IgYXMgQW5pbWF0aW9uQXN0VmlzaXRvcn0gZnJvbSAnLi9kc2wvYW5pbWF0aW9uX2FzdCc7XG5pbXBvcnQge0FuaW1hdGlvbkRzbFZpc2l0b3J9IGZyb20gJy4vZHNsL2FuaW1hdGlvbl9kc2xfdmlzaXRvcic7XG5cbmV4cG9ydCBjb25zdCBPTkVfU0VDT05EID0gMTAwMDtcblxuZXhwb3J0IGNvbnN0IFNVQlNUSVRVVElPTl9FWFBSX1NUQVJUID0gJ3t7JztcbmV4cG9ydCBjb25zdCBTVUJTVElUVVRJT05fRVhQUl9FTkQgPSAnfX0nO1xuZXhwb3J0IGNvbnN0IEVOVEVSX0NMQVNTTkFNRSA9ICduZy1lbnRlcic7XG5leHBvcnQgY29uc3QgTEVBVkVfQ0xBU1NOQU1FID0gJ25nLWxlYXZlJztcbmV4cG9ydCBjb25zdCBFTlRFUl9TRUxFQ1RPUiA9ICcubmctZW50ZXInO1xuZXhwb3J0IGNvbnN0IExFQVZFX1NFTEVDVE9SID0gJy5uZy1sZWF2ZSc7XG5leHBvcnQgY29uc3QgTkdfVFJJR0dFUl9DTEFTU05BTUUgPSAnbmctdHJpZ2dlcic7XG5leHBvcnQgY29uc3QgTkdfVFJJR0dFUl9TRUxFQ1RPUiA9ICcubmctdHJpZ2dlcic7XG5leHBvcnQgY29uc3QgTkdfQU5JTUFUSU5HX0NMQVNTTkFNRSA9ICduZy1hbmltYXRpbmcnO1xuZXhwb3J0IGNvbnN0IE5HX0FOSU1BVElOR19TRUxFQ1RPUiA9ICcubmctYW5pbWF0aW5nJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVUaW1pbmdWYWx1ZSh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHJldHVybiB2YWx1ZTtcblxuICBjb25zdCBtYXRjaGVzID0gKHZhbHVlIGFzIHN0cmluZykubWF0Y2goL14oLT9bXFwuXFxkXSspKG0/cykvKTtcbiAgaWYgKCFtYXRjaGVzIHx8IG1hdGNoZXMubGVuZ3RoIDwgMikgcmV0dXJuIDA7XG5cbiAgcmV0dXJuIF9jb252ZXJ0VGltZVZhbHVlVG9NUyhwYXJzZUZsb2F0KG1hdGNoZXNbMV0pLCBtYXRjaGVzWzJdKTtcbn1cblxuZnVuY3Rpb24gX2NvbnZlcnRUaW1lVmFsdWVUb01TKHZhbHVlOiBudW1iZXIsIHVuaXQ6IHN0cmluZyk6IG51bWJlciB7XG4gIHN3aXRjaCAodW5pdCkge1xuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIHZhbHVlICogT05FX1NFQ09ORDtcbiAgICBkZWZhdWx0OiAgLy8gbXMgb3Igc29tZXRoaW5nIGVsc2VcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVRpbWluZyhcbiAgICB0aW1pbmdzOiBzdHJpbmcgfCBudW1iZXIgfCBBbmltYXRlVGltaW5ncywgZXJyb3JzOiBhbnlbXSwgYWxsb3dOZWdhdGl2ZVZhbHVlcz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIHRpbWluZ3MuaGFzT3duUHJvcGVydHkoJ2R1cmF0aW9uJykgP1xuICAgICAgPEFuaW1hdGVUaW1pbmdzPnRpbWluZ3MgOlxuICAgICAgcGFyc2VUaW1lRXhwcmVzc2lvbig8c3RyaW5nfG51bWJlcj50aW1pbmdzLCBlcnJvcnMsIGFsbG93TmVnYXRpdmVWYWx1ZXMpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRpbWVFeHByZXNzaW9uKFxuICAgIGV4cDogc3RyaW5nIHwgbnVtYmVyLCBlcnJvcnM6IHN0cmluZ1tdLCBhbGxvd05lZ2F0aXZlVmFsdWVzPzogYm9vbGVhbik6IEFuaW1hdGVUaW1pbmdzIHtcbiAgY29uc3QgcmVnZXggPSAvXigtP1tcXC5cXGRdKykobT9zKSg/OlxccysoLT9bXFwuXFxkXSspKG0/cykpPyg/OlxccysoWy1hLXpdKyg/OlxcKC4rP1xcKSk/KSk/JC9pO1xuICBsZXQgZHVyYXRpb246IG51bWJlcjtcbiAgbGV0IGRlbGF5OiBudW1iZXIgPSAwO1xuICBsZXQgZWFzaW5nOiBzdHJpbmcgPSAnJztcbiAgaWYgKHR5cGVvZiBleHAgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGV4cC5tYXRjaChyZWdleCk7XG4gICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBUaGUgcHJvdmlkZWQgdGltaW5nIHZhbHVlIFwiJHtleHB9XCIgaXMgaW52YWxpZC5gKTtcbiAgICAgIHJldHVybiB7ZHVyYXRpb246IDAsIGRlbGF5OiAwLCBlYXNpbmc6ICcnfTtcbiAgICB9XG5cbiAgICBkdXJhdGlvbiA9IF9jb252ZXJ0VGltZVZhbHVlVG9NUyhwYXJzZUZsb2F0KG1hdGNoZXNbMV0pLCBtYXRjaGVzWzJdKTtcblxuICAgIGNvbnN0IGRlbGF5TWF0Y2ggPSBtYXRjaGVzWzNdO1xuICAgIGlmIChkZWxheU1hdGNoICE9IG51bGwpIHtcbiAgICAgIGRlbGF5ID0gX2NvbnZlcnRUaW1lVmFsdWVUb01TKE1hdGguZmxvb3IocGFyc2VGbG9hdChkZWxheU1hdGNoKSksIG1hdGNoZXNbNF0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVhc2luZ1ZhbCA9IG1hdGNoZXNbNV07XG4gICAgaWYgKGVhc2luZ1ZhbCkge1xuICAgICAgZWFzaW5nID0gZWFzaW5nVmFsO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkdXJhdGlvbiA9IDxudW1iZXI+ZXhwO1xuICB9XG5cbiAgaWYgKCFhbGxvd05lZ2F0aXZlVmFsdWVzKSB7XG4gICAgbGV0IGNvbnRhaW5zRXJyb3JzID0gZmFsc2U7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSBlcnJvcnMubGVuZ3RoO1xuICAgIGlmIChkdXJhdGlvbiA8IDApIHtcbiAgICAgIGVycm9ycy5wdXNoKGBEdXJhdGlvbiB2YWx1ZXMgYmVsb3cgMCBhcmUgbm90IGFsbG93ZWQgZm9yIHRoaXMgYW5pbWF0aW9uIHN0ZXAuYCk7XG4gICAgICBjb250YWluc0Vycm9ycyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChkZWxheSA8IDApIHtcbiAgICAgIGVycm9ycy5wdXNoKGBEZWxheSB2YWx1ZXMgYmVsb3cgMCBhcmUgbm90IGFsbG93ZWQgZm9yIHRoaXMgYW5pbWF0aW9uIHN0ZXAuYCk7XG4gICAgICBjb250YWluc0Vycm9ycyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChjb250YWluc0Vycm9ycykge1xuICAgICAgZXJyb3JzLnNwbGljZShzdGFydEluZGV4LCAwLCBgVGhlIHByb3ZpZGVkIHRpbWluZyB2YWx1ZSBcIiR7ZXhwfVwiIGlzIGludmFsaWQuYCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtkdXJhdGlvbiwgZGVsYXksIGVhc2luZ307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5T2JqKFxuICAgIG9iajoge1trZXk6IHN0cmluZ106IGFueX0sIGRlc3RpbmF0aW9uOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9KToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2gocHJvcCA9PiB7IGRlc3RpbmF0aW9uW3Byb3BdID0gb2JqW3Byb3BdOyB9KTtcbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplU3R5bGVzKHN0eWxlczogybVTdHlsZURhdGEgfCDJtVN0eWxlRGF0YVtdKTogybVTdHlsZURhdGEge1xuICBjb25zdCBub3JtYWxpemVkU3R5bGVzOiDJtVN0eWxlRGF0YSA9IHt9O1xuICBpZiAoQXJyYXkuaXNBcnJheShzdHlsZXMpKSB7XG4gICAgc3R5bGVzLmZvckVhY2goZGF0YSA9PiBjb3B5U3R5bGVzKGRhdGEsIGZhbHNlLCBub3JtYWxpemVkU3R5bGVzKSk7XG4gIH0gZWxzZSB7XG4gICAgY29weVN0eWxlcyhzdHlsZXMsIGZhbHNlLCBub3JtYWxpemVkU3R5bGVzKTtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplZFN0eWxlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlTdHlsZXMoXG4gICAgc3R5bGVzOiDJtVN0eWxlRGF0YSwgcmVhZFByb3RvdHlwZTogYm9vbGVhbiwgZGVzdGluYXRpb246IMm1U3R5bGVEYXRhID0ge30pOiDJtVN0eWxlRGF0YSB7XG4gIGlmIChyZWFkUHJvdG90eXBlKSB7XG4gICAgLy8gd2UgbWFrZSB1c2Ugb2YgYSBmb3ItaW4gbG9vcCBzbyB0aGF0IHRoZVxuICAgIC8vIHByb3RvdHlwaWNhbGx5IGluaGVyaXRlZCBwcm9wZXJ0aWVzIGFyZVxuICAgIC8vIHJldmVhbGVkIGZyb20gdGhlIGJhY2tGaWxsIG1hcFxuICAgIGZvciAobGV0IHByb3AgaW4gc3R5bGVzKSB7XG4gICAgICBkZXN0aW5hdGlvbltwcm9wXSA9IHN0eWxlc1twcm9wXTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29weU9iaihzdHlsZXMsIGRlc3RpbmF0aW9uKTtcbiAgfVxuICByZXR1cm4gZGVzdGluYXRpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdHlsZXMoZWxlbWVudDogYW55LCBzdHlsZXM6IMm1U3R5bGVEYXRhKSB7XG4gIGlmIChlbGVtZW50WydzdHlsZSddKSB7XG4gICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgY29uc3QgY2FtZWxQcm9wID0gZGFzaENhc2VUb0NhbWVsQ2FzZShwcm9wKTtcbiAgICAgIGVsZW1lbnQuc3R5bGVbY2FtZWxQcm9wXSA9IHN0eWxlc1twcm9wXTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXJhc2VTdHlsZXMoZWxlbWVudDogYW55LCBzdHlsZXM6IMm1U3R5bGVEYXRhKSB7XG4gIGlmIChlbGVtZW50WydzdHlsZSddKSB7XG4gICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgY29uc3QgY2FtZWxQcm9wID0gZGFzaENhc2VUb0NhbWVsQ2FzZShwcm9wKTtcbiAgICAgIGVsZW1lbnQuc3R5bGVbY2FtZWxQcm9wXSA9ICcnO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBbmltYXRpb25FbnRyeShzdGVwczogQW5pbWF0aW9uTWV0YWRhdGEgfCBBbmltYXRpb25NZXRhZGF0YVtdKTpcbiAgICBBbmltYXRpb25NZXRhZGF0YSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHN0ZXBzKSkge1xuICAgIGlmIChzdGVwcy5sZW5ndGggPT0gMSkgcmV0dXJuIHN0ZXBzWzBdO1xuICAgIHJldHVybiBzZXF1ZW5jZShzdGVwcyk7XG4gIH1cbiAgcmV0dXJuIHN0ZXBzIGFzIEFuaW1hdGlvbk1ldGFkYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTdHlsZVBhcmFtcyhcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zLCBlcnJvcnM6IGFueVtdKSB7XG4gIGNvbnN0IHBhcmFtcyA9IG9wdGlvbnMucGFyYW1zIHx8IHt9O1xuICBjb25zdCBtYXRjaGVzID0gZXh0cmFjdFN0eWxlUGFyYW1zKHZhbHVlKTtcbiAgaWYgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgbWF0Y2hlcy5mb3JFYWNoKHZhck5hbWUgPT4ge1xuICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkodmFyTmFtZSkpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICBgVW5hYmxlIHRvIHJlc29sdmUgdGhlIGxvY2FsIGFuaW1hdGlvbiBwYXJhbSAke3Zhck5hbWV9IGluIHRoZSBnaXZlbiBsaXN0IG9mIHZhbHVlc2ApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IFBBUkFNX1JFR0VYID1cbiAgICBuZXcgUmVnRXhwKGAke1NVQlNUSVRVVElPTl9FWFBSX1NUQVJUfVxcXFxzKiguKz8pXFxcXHMqJHtTVUJTVElUVVRJT05fRVhQUl9FTkR9YCwgJ2cnKTtcbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0U3R5bGVQYXJhbXModmFsdWU6IHN0cmluZyB8IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgbGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCB2YWwgPSB2YWx1ZS50b1N0cmluZygpO1xuXG4gICAgbGV0IG1hdGNoOiBhbnk7XG4gICAgd2hpbGUgKG1hdGNoID0gUEFSQU1fUkVHRVguZXhlYyh2YWwpKSB7XG4gICAgICBwYXJhbXMucHVzaChtYXRjaFsxXSBhcyBzdHJpbmcpO1xuICAgIH1cbiAgICBQQVJBTV9SRUdFWC5sYXN0SW5kZXggPSAwO1xuICB9XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnBvbGF0ZVBhcmFtcyhcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBwYXJhbXM6IHtbbmFtZTogc3RyaW5nXTogYW55fSwgZXJyb3JzOiBhbnlbXSk6IHN0cmluZ3xudW1iZXIge1xuICBjb25zdCBvcmlnaW5hbCA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gIGNvbnN0IHN0ciA9IG9yaWdpbmFsLnJlcGxhY2UoUEFSQU1fUkVHRVgsIChfLCB2YXJOYW1lKSA9PiB7XG4gICAgbGV0IGxvY2FsVmFsID0gcGFyYW1zW3Zhck5hbWVdO1xuICAgIC8vIHRoaXMgbWVhbnMgdGhhdCB0aGUgdmFsdWUgd2FzIG5ldmVyIG92ZXJyaWRkZW4gYnkgdGhlIGRhdGEgcGFzc2VkIGluIGJ5IHRoZSB1c2VyXG4gICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkodmFyTmFtZSkpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBQbGVhc2UgcHJvdmlkZSBhIHZhbHVlIGZvciB0aGUgYW5pbWF0aW9uIHBhcmFtICR7dmFyTmFtZX1gKTtcbiAgICAgIGxvY2FsVmFsID0gJyc7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbFZhbC50b1N0cmluZygpO1xuICB9KTtcblxuICAvLyB3ZSBkbyB0aGlzIHRvIGFzc2VydCB0aGF0IG51bWVyaWMgdmFsdWVzIHN0YXkgYXMgdGhleSBhcmVcbiAgcmV0dXJuIHN0ciA9PSBvcmlnaW5hbCA/IHZhbHVlIDogc3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXRlcmF0b3JUb0FycmF5KGl0ZXJhdG9yOiBhbnkpOiBhbnlbXSB7XG4gIGNvbnN0IGFycjogYW55W10gPSBbXTtcbiAgbGV0IGl0ZW0gPSBpdGVyYXRvci5uZXh0KCk7XG4gIHdoaWxlICghaXRlbS5kb25lKSB7XG4gICAgYXJyLnB1c2goaXRlbS52YWx1ZSk7XG4gICAgaXRlbSA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VBbmltYXRpb25PcHRpb25zKFxuICAgIHNvdXJjZTogQW5pbWF0aW9uT3B0aW9ucywgZGVzdGluYXRpb246IEFuaW1hdGlvbk9wdGlvbnMpOiBBbmltYXRpb25PcHRpb25zIHtcbiAgaWYgKHNvdXJjZS5wYXJhbXMpIHtcbiAgICBjb25zdCBwMCA9IHNvdXJjZS5wYXJhbXM7XG4gICAgaWYgKCFkZXN0aW5hdGlvbi5wYXJhbXMpIHtcbiAgICAgIGRlc3RpbmF0aW9uLnBhcmFtcyA9IHt9O1xuICAgIH1cbiAgICBjb25zdCBwMSA9IGRlc3RpbmF0aW9uLnBhcmFtcztcbiAgICBPYmplY3Qua2V5cyhwMCkuZm9yRWFjaChwYXJhbSA9PiB7XG4gICAgICBpZiAoIXAxLmhhc093blByb3BlcnR5KHBhcmFtKSkge1xuICAgICAgICBwMVtwYXJhbV0gPSBwMFtwYXJhbV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG5jb25zdCBEQVNIX0NBU0VfUkVHRVhQID0gLy0rKFthLXowLTldKS9nO1xuZXhwb3J0IGZ1bmN0aW9uIGRhc2hDYXNlVG9DYW1lbENhc2UoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBpbnB1dC5yZXBsYWNlKERBU0hfQ0FTRV9SRUdFWFAsICguLi5tOiBhbnlbXSkgPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsbG93UHJldmlvdXNQbGF5ZXJTdHlsZXNNZXJnZShkdXJhdGlvbjogbnVtYmVyLCBkZWxheTogbnVtYmVyKSB7XG4gIHJldHVybiBkdXJhdGlvbiA9PT0gMCB8fCBkZWxheSA9PT0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhbGFuY2VQcmV2aW91c1N0eWxlc0ludG9LZXlmcmFtZXMoXG4gICAgZWxlbWVudDogYW55LCBrZXlmcmFtZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9W10sIHByZXZpb3VzU3R5bGVzOiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICBjb25zdCBwcmV2aW91c1N0eWxlUHJvcHMgPSBPYmplY3Qua2V5cyhwcmV2aW91c1N0eWxlcyk7XG4gIGlmIChwcmV2aW91c1N0eWxlUHJvcHMubGVuZ3RoICYmIGtleWZyYW1lcy5sZW5ndGgpIHtcbiAgICBsZXQgc3RhcnRpbmdLZXlmcmFtZSA9IGtleWZyYW1lc1swXTtcbiAgICBsZXQgbWlzc2luZ1N0eWxlUHJvcHM6IHN0cmluZ1tdID0gW107XG4gICAgcHJldmlvdXNTdHlsZVByb3BzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBpZiAoIXN0YXJ0aW5nS2V5ZnJhbWUuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgbWlzc2luZ1N0eWxlUHJvcHMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICAgIHN0YXJ0aW5nS2V5ZnJhbWVbcHJvcF0gPSBwcmV2aW91c1N0eWxlc1twcm9wXTtcbiAgICB9KTtcblxuICAgIGlmIChtaXNzaW5nU3R5bGVQcm9wcy5sZW5ndGgpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBrZXlmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGtmID0ga2V5ZnJhbWVzW2ldO1xuICAgICAgICBtaXNzaW5nU3R5bGVQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHsga2ZbcHJvcF0gPSBjb21wdXRlU3R5bGUoZWxlbWVudCwgcHJvcCk7IH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ga2V5ZnJhbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmlzaXREc2xOb2RlKFxuICAgIHZpc2l0b3I6IEFuaW1hdGlvbkRzbFZpc2l0b3IsIG5vZGU6IEFuaW1hdGlvbk1ldGFkYXRhLCBjb250ZXh0OiBhbnkpOiBhbnk7XG5leHBvcnQgZnVuY3Rpb24gdmlzaXREc2xOb2RlKFxuICAgIHZpc2l0b3I6IEFuaW1hdGlvbkFzdFZpc2l0b3IsIG5vZGU6IEFuaW1hdGlvbkFzdDxBbmltYXRpb25NZXRhZGF0YVR5cGU+LCBjb250ZXh0OiBhbnkpOiBhbnk7XG5leHBvcnQgZnVuY3Rpb24gdmlzaXREc2xOb2RlKHZpc2l0b3I6IGFueSwgbm9kZTogYW55LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgIGNhc2UgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlRyaWdnZXI6XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRyaWdnZXIobm9kZSwgY29udGV4dCk7XG4gICAgY2FzZSBBbmltYXRpb25NZXRhZGF0YVR5cGUuU3RhdGU6XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFN0YXRlKG5vZGUsIGNvbnRleHQpO1xuICAgIGNhc2UgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlRyYW5zaXRpb246XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRyYW5zaXRpb24obm9kZSwgY29udGV4dCk7XG4gICAgY2FzZSBBbmltYXRpb25NZXRhZGF0YVR5cGUuU2VxdWVuY2U6XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNlcXVlbmNlKG5vZGUsIGNvbnRleHQpO1xuICAgIGNhc2UgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLkdyb3VwOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHcm91cChub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5BbmltYXRlOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBbmltYXRlKG5vZGUsIGNvbnRleHQpO1xuICAgIGNhc2UgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLktleWZyYW1lczpcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0S2V5ZnJhbWVzKG5vZGUsIGNvbnRleHQpO1xuICAgIGNhc2UgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlN0eWxlOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTdHlsZShub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5SZWZlcmVuY2U6XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFJlZmVyZW5jZShub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5BbmltYXRlQ2hpbGQ6XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFuaW1hdGVDaGlsZChub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5BbmltYXRlUmVmOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBbmltYXRlUmVmKG5vZGUsIGNvbnRleHQpO1xuICAgIGNhc2UgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlF1ZXJ5OlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRRdWVyeShub2RlLCBjb250ZXh0KTtcbiAgICBjYXNlIEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5TdGFnZ2VyOlxuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTdGFnZ2VyKG5vZGUsIGNvbnRleHQpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZXNvbHZlIGFuaW1hdGlvbiBtZXRhZGF0YSBub2RlICMke25vZGUudHlwZX1gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZVN0eWxlKGVsZW1lbnQ6IGFueSwgcHJvcDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuICg8YW55PndpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpKVtwcm9wXTtcbn1cbiJdfQ==