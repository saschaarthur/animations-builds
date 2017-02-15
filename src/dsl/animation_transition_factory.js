import { buildAnimationKeyframes } from './animation_timeline_visitor';
import { createTransitionInstruction } from './animation_transition_instruction';
export class AnimationTransitionFactory {
    /**
     * @param {?} _triggerName
     * @param {?} ast
     * @param {?} matchFns
     * @param {?} _stateStyles
     */
    constructor(_triggerName, ast, matchFns, _stateStyles) {
        this._triggerName = _triggerName;
        this.matchFns = matchFns;
        this._stateStyles = _stateStyles;
        this._animationAst = ast.animation;
    }
    /**
     * @param {?} currentState
     * @param {?} nextState
     * @return {?}
     */
    match(currentState, nextState) {
        if (!oneOrMoreTransitionsMatch(this.matchFns, currentState, nextState))
            return;
        const /** @type {?} */ backupStateStyles = this._stateStyles['*'] || {};
        const /** @type {?} */ currentStateStyles = this._stateStyles[currentState] || backupStateStyles;
        const /** @type {?} */ nextStateStyles = this._stateStyles[nextState] || backupStateStyles;
        const /** @type {?} */ timelines = buildAnimationKeyframes(this._animationAst, currentStateStyles, nextStateStyles);
        return createTransitionInstruction(this._triggerName, nextState === 'void', currentStateStyles, nextStateStyles, timelines);
    }
}
function AnimationTransitionFactory_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationTransitionFactory.prototype._animationAst;
    /** @type {?} */
    AnimationTransitionFactory.prototype._triggerName;
    /** @type {?} */
    AnimationTransitionFactory.prototype.matchFns;
    /** @type {?} */
    AnimationTransitionFactory.prototype._stateStyles;
}
/**
 * @param {?} matchFns
 * @param {?} currentState
 * @param {?} nextState
 * @return {?}
 */
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState) {
    return matchFns.some(fn => fn(currentState, nextState));
}
//# sourceMappingURL=animation_transition_factory.js.map